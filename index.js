// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

import  express  from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors'

// Khởi tạo ứng dụng Express
const app = express();
app.use(bodyParser.json());
const port = 3000;
app.use= cors();
// Kết nối tới MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Type', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Kết nối đến MongoDB thất bại!'));
db.once('open', function() {
  console.log('Kết nối đến MongoDB thành công!');
});

// Định nghĩa mô hình sản phẩm
const Product = mongoose.model('datas', {
    name: String,
    desc: String,
    img: String,
});

// Định nghĩa tuyến API để tạo sản phẩm mới
app.post('/api/products', (req, res) => {
    const { name, desc, img } = req.body;

    // Tạo một sản phẩm mới
    const product = new Product({ name, desc, img });

    // Lưu sản phẩm vào cơ sở dữ liệu
    product.save()
        .then(result => {
            res.send('Sản phẩm đã được tạo thành công');
            // Xử lý sau khi lưu thành công
        })
        .catch(error => {
            // Xử lý khi xảy ra lỗi
            console.error(err);
            res.status(500).send('Lỗi server');
        });
});

app.get('/api/products', (req, res) => {
    Product.find()
        .then(products => {
            res.json(products);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve products' });
        });
});

// app.get('/api/products/:id', (req, res) => {
//     Product.findById(req.params.id)
//         .then(products => {
//             res.json(products);
//         })
//         .catch(error => {
//             console.log(error);
//             res.status(500).json({ error: 'khong thay' })
//         })
// })

app.put('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    Product.updateOne({ _id: productId },{name: req.body.name , desc: req.body.desc , img : req.body.img} )
        .then(UpdatedProduct => {
            if (UpdatedProduct) {
                res.send("Update thanh cong")
                // res.json(UpdatedProduct);
            } else {
                res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
            }
        })
        .catch(error => { 
            res.status(500).json({ error: 'khong the update' })
        })
})

app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    Product.deleteOne({ _id: productId })
        .then(result => {
            if (result.deletedCount === 1) {
                res.json({ success: true });
            } else {
                res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
        });
});

// Khởi động máy chủ
app.listen(port, () => {
    console.log(`API đang lắng nghe tại http://localhost:${port}`);
});