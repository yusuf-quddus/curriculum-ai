import fetch from 'node-fetch';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cheerio = require('cheerio');

const extractFromURL = async (url) => {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    $('script, nav, footer, header, aside, style, noscript, svg, link').remove();
    const content = $('article, main, section, p, h1, h2, h3, li').map((i, el) => $(el).text().trim()).get()
        .filter(text => text.length > 0)
        .join('\n\n');
    console.log('\n\n')
    console.log('Extracted text:\n', content.trim().slice(0, 1000));
}

extractFromURL('https://en.wikipedia.org/wiki/Rope');