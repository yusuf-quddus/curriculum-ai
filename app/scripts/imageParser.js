import Tesseract from 'tesseract.js';

const imagePath = '';

const runOCR = async () => {
    try {
        console.log(`Reading ${imagePath} ...`);
        const result = await Tesseract.recognize(imagePath, 'eng');
        console.log('\n Extracted Text: \n');
        console.log(result.data.text);
    } catch (err) {
        console.error("Failed to process image: ", err);
    }
}

runOCR();