
export const generateQRCode = (text: string): string => {
  // Using a simple QR code API service
  const encodedText = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedText}`;
};

export const generateContentUrl = (content: string): string => {
  // Create a data URL that contains the content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Generated Content</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px; 
          line-height: 1.6;
        }
        h1, h2, h3 { color: #333; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="content">
        ${content}
      </div>
    </body>
    </html>
  `;
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  return URL.createObjectURL(blob);
};
