const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Multer konfigürasyonu
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Statik dosyalar için middleware
app.use(express.static(path.join(__dirname)));

// Dosya yükleme isteği
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'Dosya başarıyla yüklendi!' });
});

// Yüklenen dosyaların listesini alma
app.get('/images', (req, res) => {
    fs.readdir('images', (err, files) => {
        if (err) {
            res.status(500).json({ error: 'Dosyalar yüklenemedi!' });
        } else {
            res.json(files);
        }
    });
});

// Dosya silme isteği
app.delete('/delete/:filename', (req, res) => {
    const filepath = path.join(__dirname, 'images', req.params.filename);
    fs.unlink(filepath, err => {
        if (err) {
            res.status(500).json({ error: 'Dosya silinemedi!' });
        } else {
            res.json({ message: 'Dosya başarıyla silindi!' });
        }
    });
});

// Sunucuyu başlatma
app.listen(2435, () => {
    console.log('Sunucu 2435 portunda çalışıyor...');
});