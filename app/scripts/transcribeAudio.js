import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

const OPENAI_KEY = process.env.OPENAI_API_KEY;

const audioInput = process.argv[2];
if (!audioInput) {
  console.error("Usage: node transcribeAudioFile.js path/to/audio.mp3");
  process.exit(1);
}

const audioPath = path.resolve(audioInput);

const transcribeAudio = async (audioFile) => {
  const form = new FormData();
  form.append('file', fs.createReadStream(audioFile));
  form.append('model', 'whisper-1');

  try {
    console.log(`Transcribing ${audioFile} with Whisper API...`);
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions', form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
      }
    );

    console.log('\n Transcription:\n');
    console.log(response.data.text);
  } catch (err) {
    console.error('Transcription failed:', err.response?.data || err.message);
  }
};

transcribeAudio(audioPath);
