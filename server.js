const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const upload = multer({ dest: 'public/uploads/' });
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Optimizely demo block running: http://localhost:${PORT}`);
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const URL_IMAGES_JSON = path.join(__dirname, 'public', 'uploaded_urls.json');

// Utility to load/store additional URLs (besides file uploads)
function readUrlList() {
  try {
    if (fs.existsSync(URL_IMAGES_JSON)) {
      return JSON.parse(fs.readFileSync(URL_IMAGES_JSON, 'utf8'));
    } else {
      return [];
    }
  } catch {
    return [];
  }
}
function writeUrlList(list) {
  fs.writeFileSync(URL_IMAGES_JSON, JSON.stringify(list, null, 2));
}

// 1. Handle file upload
app.post('/upload-image-demo', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  // Rename file to original name + timestamp to avoid overwriting
  const ext = path.extname(req.file.originalname);
  const destName = req.file.filename + '-' + Date.now() + ext;
  const oldPath = req.file.path;
  const newRelPath = '/uploads/' + destName;
  const newAbsPath = path.join(__dirname, 'public', 'uploads', destName);

  fs.rename(oldPath, newAbsPath, err => {
    if (err) return res.status(500).json({ error: 'File move error' });
    res.json({ url: newRelPath });
  });
});

// 2. Handle public image URL "uploads"
app.post('/add-image-url-demo', (req, res) => {
  const url = (req.body.imageUrl || '').trim();
  if (!url || !/^https?:\/\/[^ "]+$/.test(url)) return res.status(400).json({ error: 'Invalid image URL' });

  const list = readUrlList();
  if (!list.includes(url)) {
    list.push(url);
    writeUrlList(list);
  }
  res.json({ url });
});

// 3. API to fetch ALL images (uploads + URLs)
app.get('/api/images', (req, res) => {
  // 1. Get all files in public/uploads by URL path
  const uploadDir = path.join(__dirname, 'public', 'uploads');
  let fileImages = [];
  if (fs.existsSync(uploadDir)) {
    fileImages = fs.readdirSync(uploadDir)
      .filter(f => /\.(png|jpe?g|gif|svg|webp)$/i.test(f))
      .map(f => '/uploads/' + f);
  }
  // 2. Get all URLs from uploaded_urls.json
  let urlImages = [];
  try { urlImages = readUrlList(); } catch { urlImages = []; }
  res.json([...fileImages, ...urlImages]);
});

// (keep app.listen and other routes as already present!)
