'use client';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Button,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Stack,
} from '@mui/material';

import JSZip from 'jszip';
import { NavBar } from '@/components/NavBar';

function toKebabCase(str: string): string {
  const split = str.split('.');
  const extention = split.pop();
  const filneName = split.join('.');

  return (
    filneName
      ?.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => '-' + chr)
      .trim() +
    '.' +
    extention
  );
}

export function ConverterForm() {
  const [resize, setResize] = useState<number | null>(1200); // [width, height
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    setFiles(selectedFiles);
  };

  const handleSubmit = async () => {
    console.log('Submitting files:', files);
    if (files.length === 0) return;

    const formData = new FormData();

    formData.append('resize', resize?.toString() || '');

    files.forEach((file) => {
      const encodedName = toKebabCase(file.name);
      formData.append('images', file, encodedName);
    });

    setLoading(true);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const zipFilename = 'converted-images.zip';

        const zipBlob = await response.blob();

        const zip = await JSZip.loadAsync(zipBlob);

        zip.generateAsync({ type: 'blob' }).then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = zipFilename;
          a.click();
        });
      } else {
        console.error('Error converting files');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container>
      <Stack spacing={4}>
        <Typography variant='h4'>Image to WebP Converter</Typography>
        <TextField
          id='outlined-controlled'
          label='Resize (optional)'
          value={resize}
          type='number'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setResize(event.target.value ? Number(event.target.value) : null);
          }}
        />
        <Box mt={2}>
          <input
            type='file'
            multiple
            accept='.png,.jpg,.jpeg,.tiff,.tif,.webp'
            onChange={handleFileChange}
          />
          <Button
            variant='contained'
            color='primary'
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Convert and Download'}
          </Button>
        </Box>

        <Box mt={4}>
          <Grid container spacing={2}>
            {files.map((file, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      component='p'
                    >
                      {file.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}
