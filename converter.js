
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import path from 'path';
import fs from 'fs';




process.on('message', ({buffer,filename}) => {
  console.log('buffer',buffer);
    imagemin.buffer(buffer, {
        plugins: [
          imageminWebp({
            //   quality: 90
            //   ,
            //   resize: {
            //     width: 1000,
            //     height: 0
            //   }
          }),
        ],
      }).then((result) => {
        console.log('results',result);
        const uploadDir = path.resolve(__dirname, '../public/uploads');
        console.log('uploadDir',uploadDir);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const outputPath = path.resolve(uploadDir, filename);
        fs.writeFileSync(outputPath, result);

        process.send?.({ result: `/uploads/${filename}` });
          
        process.exit(0);

      })
      .catch((error) => {
        process.send?.({ error: error.message });
        process.exit(1);
      });
});