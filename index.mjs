import analyze from './cli/analyze.mjs';
import dotenv from 'dotenv';

dotenv.config();

/* Command lines */
const app = process.argv.slice(-1)[0];
if (app === 'analyze') {
    analyze();
}
