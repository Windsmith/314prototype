const express = require('express')
const fs = require('fs')
const path = require('path')

const router = express.Router()

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'pages/index.html'));
})

router.get('/getServices', (req, res) => {
    let data = fs.readFileSync('services.json')
    let jsonData = JSON.parse(data)
    res.setHeader("Content-Type", "application/json");
    res.status(200);
    res.json(jsonData);
})

router.get('/serviceInstall', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/serviceInstall.html'));
})

module.exports = router;