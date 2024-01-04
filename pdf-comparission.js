const { PDFDocument } = require('pdf-lib');
const axios = require('axios');
const fs = require('fs');
const { promisify } = require('util');


const writeFileAsync = promisify(fs.writeFile);

const compare = async function comparePDFs(file1Url, file2Url) {
    try {

        const file1Path = 'file1.pdf';
        const file2Path = 'file2.pdf';

        //////////////////////////////////
        const [file1Buffer, file2Buffer] = await Promise.all([
            downloadFileFromDrive(file1Url).then(data => Buffer.from(data)),
            downloadFileFromDrive(file2Url).then(data => Buffer.from(data)),
        ]);

        // Load the PDF documents
        const pdfDoc1 = await PDFDocument.load(file1Buffer);
        const pdfDoc2 = await PDFDocument.load(file2Buffer);

        /////////////////////////////////

        // const areIdentical = Buffer.compare(pdfDoc1.save(), pdfDoc2.save()) === 0;
         let areIdentical = Buffer.compare(file1Buffer, file2Buffer) === 0;

        if (areIdentical) {
	       return  'Files are identical';
        } else {
		
            // Output the difference in lines (optional)
            const diffLines = await findDifferenceLines(file1Buffer.toString(), file2Buffer.toString());
    	   return {
    		message: 'Files are different',
    		diffrenceLines: diffLines
    		}
	    }
        
    } catch (error) {
        console.log('Error:', error.message);
	return error
    }
}


async function downloadFileFromDrive(link) {
    try {
        const fileId = extractFileId(link);
        const directDownloadLink = `https://drive.google.com/uc?id=${fileId}`;
        const response = await axios.get(directDownloadLink, { responseType: 'arraybuffer' });
        // console.log('File read==>',response.data)
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

function extractFileId(driveLink) {
    const match = driveLink.match(/\/(?:file\/d\/|open\?id=)(.*?)(?:\/|$)/);
    return match ? match[1] : null;
}

async function findDifferenceLines(file1Content, file2Content) {
    const lines1 = file1Content.split('\n');
    const lines2 = file2Content.split('\n');

    const diffLines = [];
    for (let i = 0; i < lines1.length || i < lines2.length; i++) {
        if (lines1[i] !== lines2[i]) {
            diffLines.push({
                lineNumber: i + 1,
                file1Line: lines1[i],
                file2Line: lines2[i],
            });
        }
    }

    return diffLines;

}

module.exports= { 
compare
}