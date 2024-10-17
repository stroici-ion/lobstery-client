export function convertToWebP(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Ensure that the file is an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('The selected file is not an image.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event: ProgressEvent<FileReader>) {
      const img = new Image();

      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        // Calculate the new dimensions based on the max width/height
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > height) {
            width = maxWidth;
            height = Math.round(maxWidth / aspectRatio);
          } else {
            height = maxHeight;
            width = Math.round(maxHeight * aspectRatio);
          }
        }

        // Set canvas dimensions to the calculated size
        canvas.width = width;
        canvas.height = height;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas content to WebP format
        canvas.toBlob(
          (blob: Blob | null) => {
            if (blob) {
              resolve(blob); // Return the WebP Blob
            } else {
              reject(new Error('Conversion to WebP failed.'));
            }
          },
          'image/webp',
          quality
        ); // WebP format with specified quality
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('File reading failed.'));
    reader.readAsDataURL(file); // Read the uploaded image as a Data URL
  });
}
