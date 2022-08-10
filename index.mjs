import analyze from './cli/analyze.mjs';
import { dirname } from 'dirfilename';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const __dirname = dirname(import.meta.url);
const dataPath = path.resolve(__dirname, 'data');

/* Command lines */
const app = process.argv.slice(-1)[0];
if (app === 'analyze') {
    analyze({ dataPath });
}
