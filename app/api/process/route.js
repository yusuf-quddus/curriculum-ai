import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

import extractFromURL from '@/app/services/linkScraper';
import transcribeAudioYT from '@/app/services/transcribeYT';
import parsePDF from '@/app/services/pdfParser';
import runOCR from '@/app/services/imageParser';
import transcribeAudio from '@/app/services/transcribeAudio';
import { generateCurriculum } from '@/app/services/generateCurriculum';


const isYouTubeUrl = (input) => {
    try {
      const url = new URL(input);
      const host = url.hostname.toLowerCase();
      return (
        host === 'youtube.com' ||
        host === 'www.youtube.com' ||
        host === 'youtu.be' ||
        host === 'm.youtube.com'
      );
    } catch (err) {
      return false;
    }
}

export async function POST(req) {
    console.log(req);
    const form = await req.formData();
    const topic = form.get('topic') || '';
    const grade = form.get('grade') || '';
    const linkValues = form.getAll('links') || [];
    const fileFields = form.getAll('files') || [];

    // 1. Process links
    const linkTexts = await Promise.all(
        linkValues.map(async (link) => {
            if (isYouTubeUrl(link)) {
                return transcribeAudioYT(link);
            } else {
                return extractFromURL(link);
            }
        })
    );

    // 2. Process files
    const fileTexts = await Promise.all(
        fileFields.map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            let tmpPath = path.join('/tmp', file.name);
            await fs.writeFile(tmpPath, buffer);

            // dispatch by extension
            const ext = path.extname(file.name).toLowerCase();
            let text = '';
            if (ext === '.pdf') text = await parsePDF(tmpPath);
            else if (['.jpg','.png','.jpeg'].includes(ext)) text = await transcribeAudio(tmpPath);
            else if (['.mp3','.wav','.webm'].includes(ext)) text = await runOCR(tmpPath);

            await fs.unlink(tmpPath);
            return text;
        })
    );

    // 3. Combine all source texts
    const allTexts = [...linkTexts, ...fileTexts];
   // console.log(allTexts);

    // 4. Generate curriculum
    const output = await generateCurriculum({
        texts: allTexts,
        topic,
        grade,
    });

    return NextResponse.json({ output });
}