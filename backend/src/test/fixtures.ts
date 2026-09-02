import JSZip from 'jszip';

/**
 * Generates a minimal valid PDF buffer containing specified text.
 */
export function createSamplePdfBuffer(textContent = 'Alex Rivera - Software Engineer'): Buffer {
  const streamContent = `BT\n/F1 12 Tf\n100 700 Td\n(${textContent}) Tj\nET`;
  const streamLength = Buffer.byteLength(streamContent);

  const pdfString = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${streamContent}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000350 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
426
%%EOF`;

  return Buffer.from(pdfString, 'binary');
}

/**
 * Generates a minimal valid DOCX buffer containing specified text.
 */
export async function createSampleDocxBuffer(textContent = 'Alex Rivera - Backend Engineer'): Promise<Buffer> {
  const zip = new JSZip();

  // [Content_Types].xml
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
  );

  // _rels/.rels
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );

  // word/document.xml
  zip.file(
    'word/document.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:t>${textContent}</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>`
  );

  const arrayBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  return arrayBuffer;
}

export function createMalformedPdfBuffer(): Buffer {
  return Buffer.from('%PDF-1.4\nBROKEN_CORRUPTED_STREAM_DATA_HERE\n%%EOF');
}

export function createMalformedDocxBuffer(): Buffer {
  return Buffer.from('NOT_A_VALID_ZIP_OR_DOCX_FILE_HEADER_GARBAGE');
}
