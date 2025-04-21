import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse'); 
const fileName = '#';

const parsePDF = async () => {
    try {
        console.log(`Parsing ${fileName} ...`);
        const dataBuffer = fs.readFileSync(fileName);
        const data = await pdf(dataBuffer);
        console.log(data.text); 
    } catch(err) {
        console.error("Failed to parse PDF file: ", err.message);
    }
};

parsePDF();