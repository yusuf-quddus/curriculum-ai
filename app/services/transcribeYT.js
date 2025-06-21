import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env') });

const OPENAI_KEY = process.env.OPENAI_API_KEY;
console.log("Loaded OPENAI_KEY:", process.env.OPENAI_API_KEY);

// get youtube url and strip query params

const transcribeAudioYT = async (url) => {

  const ytUrl = url.argv[2].split('?')[0].replace(/\\/g, '');

  if (!ytUrl) {
    console.error("No url given");
    process.exit(1)
  }

  try {
      console.log(`Downloading audio from ${ytUrl}`);
      execSync(`yt-dlp -f bestaudio -o 'temp-audio.%(ext)s' ${ytUrl}`, { stdio: 'inherit' });
  } catch (err) {
      console.error('Audio download failed:', err.message);
      process.exit(1);
  }
  
  const files = glob.sync('temp-audio.*');
  const audioFile = files[0];

  const form = new FormData();
  form.append('file', fs.createReadStream(path.resolve(audioFile)));
  form.append('model', 'whisper-1');

  try {
    console.log('Transcribing with Whisper API...');
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
    return response.data.text;
  } catch (err) {
    console.error('Transcription failed:', err.response?.data || err.message);
  } finally {
    fs.unlinkSync(audioFile);
  }
};

export default transcribeAudioYT;