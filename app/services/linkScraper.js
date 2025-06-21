import fetch from 'node-fetch';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cheerio = require('cheerio');

const siteURL = process.argv[2];

const extractFromURL = async (url) => {
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
        }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    $('script, nav, footer, header, aside, style, noscript, svg, link').remove();
    const content = $('article, main, section, p, h1, h2, h3, li').map((i, el) => $(el).text().trim())
                    .get().filter(text => text.length > 0).join('\n\n');
    console.log('\n\n')

    return content.trim();
};

export default extractFromURL;
