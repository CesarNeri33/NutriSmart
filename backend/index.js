const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Servir imágenes desde /upload
app.use('/upload', express.static(path.join(__dirname, 'upload')));

const sanitizeFilename = (filename) => {
  return filename
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.-]/g, '')
    .replace(/-+/g, '-');
};

// Configuración de multer
const storage = multer.diskStorage({
  destination: 'upload/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);

    const safeName = sanitizeFilename(baseName);
    const finalName = `${Date.now()}-${safeName}${ext}`;

    cb(null, finalName);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  },
});

// Endpoint de subida
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    filePath: `/upload/${req.file.filename}`,
  });
});

app.listen(4000, () => {
  console.log('Servidor activo en http://191.96.31.39:4000');
});