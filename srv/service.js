const cds = require('@sap/cds');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// CDS Service Implementation
module.exports = cds.service.impl(async function () {
    const { Images } = this.entities;

    // Define an action to handle image retrieval
    this.on('uploadImages', async req => {
        const imageDir = path.join(__dirname, '..', 'images');
        const files = fs.readdirSync(imageDir);

        // Map files to an array of binary data
        const imageData = files.map(file => {
            const filePath = path.join(imageDir, file);
            const binaryData = fs.readFileSync(filePath);
            return binaryData;
        });

        return imageData;
    });
});

// Express Middleware Setup
cds.on('bootstrap', app => {
    app.use(express.json());
    app.use(express.static('public'));

    // Endpoint for file upload
    app.post('/upload', upload.array('files'), (req, res) => {
        req.files.forEach(file => {
            const filePath = path.join(__dirname, '..', 'images', file.originalname);
            fs.renameSync(file.path, filePath);
        });

        res.send({ message: 'Upload successful' });
    });
});
