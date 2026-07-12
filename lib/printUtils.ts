export function generatePrintDocument(htmlContent: string, customStyles: string = '', title: string = 'Document') {
  // Open a new blank window
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Please allow pop-ups to print or export to PDF.");
    return;
  }

  // Inject the HTML and CSS into the new isolated window
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        
        <!-- Paged.js Polyfill for professional book typesetting -->
        <script>
          window.PagedConfig = {
            auto: true,
            after: (flow) => {
              // Wait a tiny bit for render to settle before opening print dialog
              setTimeout(() => {
                window.print();
              }, 500);
            }
          };
        </script>
        <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>

        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: white;
            color: black;
          }
          /* Ensure page breaks work flawlessly */
          .page-break-before { break-before: page; page-break-before: always; }
          .page-break-after { break-after: page; page-break-after: always; }
          
          /* Custom injected styles */
          ${customStyles}
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `);
  printWindow.document.close();
}
