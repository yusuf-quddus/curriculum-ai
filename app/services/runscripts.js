import extractFromURL from './linkScraper.js'
import dotenv from 'dotenv';
import OpenAI from "openai";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });
const input_text = await extractFromURL('https://www.cbsnews.com/news/medicaid-bill-work-requirement-funding-cuts-what-to-know/');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [
        { role: "user", content: `Explain this like im five: ${input_text}` }
    ]
});

console.log(input_text + '\n\n\n');
console.log(response.choices[0].message.content);