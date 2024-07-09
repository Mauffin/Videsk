import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();

// Convert import.meta.url to __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set the root directory for static files

app.use(express.static(join(__dirname, 'public'))); // Correct path resolution
app.set('trust proxy', true);
app.use('/', (req, res) => {
  res.sendFile(join(__dirname, 'src'));
});
app.listen(8438, () => {
  console.log('Live server http://localhost:8438');
});


