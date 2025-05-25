import Tesseract from 'tesseract.js';

const imagePath = process.argv[2];

const runOCR = async (image) => {
    try {
        console.log(`Reading ${image} ...`);
        const result = await Tesseract.recognize(image, 'eng');
        console.log('\n Extracted Text: \n');
        console.log(result.data.text);
        return result.data.text;
    } catch (err) {
        console.error("Failed to process image: ", err);
    }
}

export default runOCR;