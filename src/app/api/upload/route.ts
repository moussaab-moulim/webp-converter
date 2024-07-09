// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { exec } from 'child_process';

import sharp from 'sharp';
import JSZip from 'jszip';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export const POST = withApiAuthRequired(async (req: NextRequest) => {
  const formData = await req.formData();
  const files = formData.getAll('images') as File[];
  const resizeValue = formData.get('resize')
    ? parseInt(formData.get('resize') as string, 10)
    : null;

  if (!files.length) {
    return NextResponse.json({ message: 'No files uploaded', status: 400 });
  }

  const zip = new JSZip();

  for (const file of files) {
    console.log(`Saving file to 1: ${file.name}`);

    const inputFileBuffer = Buffer.from(await file.arrayBuffer());

    const originalFilename = file.name;
    const originalFilePath = path.join('/tmp', originalFilename);

    let resizedImageBuffer = inputFileBuffer;

    const originalExtension = originalFilename.split('.').pop();

    const webpFilename = originalFilename.replace(
      /\.[^/.]+$/,
      `${originalExtension === 'webp' ? '-1' : ''}.webp`
    );
    //const webpFilePath = path.resolve('./public/uploads', webpFilename);

    const webpFilePath = path.join('/tmp', webpFilename);

    try {
      if (resizeValue) {
        const sharpImage = sharp(resizedImageBuffer);
        const { height, width } = await sharpImage.metadata();

        if (
          (height !== undefined && height > resizeValue) ||
          (width !== undefined && width > resizeValue)
        ) {
          resizedImageBuffer = await sharpImage
            .resize(resizeValue, resizeValue, { fit: 'inside' })
            .toBuffer();
        }
      }

      await fs.writeFile(originalFilePath, resizedImageBuffer);

      await new Promise((resolve, reject) => {
        exec(
          `cwebp ${originalFilePath} -o ${webpFilePath}`,
          (error, stdout, stderr) => {
            if (error) {
              reject(error);
            } else {
              resolve(null);
            }
          }
        );
      });

      const webpBuffer = await fs.readFile(webpFilePath);

      zip.file(webpFilename, webpBuffer);
    } catch (error) {
      console.error('Error converting file:', error);
    } finally {
      await fs.unlink(originalFilePath);
      await fs.unlink(webpFilePath);
    }
  }

  console.log('Returning response with', zip.files.length, 'files');

  const zipBlob = await zip.generateAsync({ type: 'nodebuffer' });

  return new NextResponse(zipBlob, {
    status: 200,
    headers: {
      contentType: 'application/zip',
    },
  });
});
