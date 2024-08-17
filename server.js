const express = require('express');
const multer = require('multer');
const path = require('path');

// 配置 multer 保存文件时使用原始文件名
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // 设置上传文件的保存路径
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);  // 使用原始文件名保存
    }
});

const upload = multer({ storage: storage });

const app = express();

app.use(express.static('public'));

// 文件上传接口
app.post('/upload', upload.single('file'), (req, res) => {
    res.send('文件上传成功');
});

// 获取文件列表
app.get('/files', (req, res) => {
    const fs = require('fs');
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            return res.status(500).send('读取文件失败');
        }
        res.json(files);
    });
});

// 下载文件
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath);
});

// 删除文件
app.delete('/delete/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    const fs = require('fs');
    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).send('删除文件失败');
        }
        res.send('文件删除成功');
    });
});

app.listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000');
});