const express = require('express')
const AdmZip = require('adm-zip')
const fs = require('fs')
var multer = require('multer');

var app = express();

const routes = require('./routes')

app.use(express.static(__dirname + '/static'))

app.use(express.urlencoded({
    extended: true
}))

app.use('/', routes)

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/services')      //you tell where to upload the files,
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({
    storage: storage,
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
});

app.post('/install', upload.single('dropzone_file'), (req, res) => {
    let filename = req.file.originalname;
    const zip = new AdmZip(__dirname + "/services/" + filename);
    zip.extractAllTo(__dirname + '/services/' + filename.substring(0, filename.length - 4))
    fs.unlinkSync(__dirname + "/services/" + filename);

    let data = fs.readFileSync('services.json')
    let serviceData = fs.readFileSync(__dirname + '/services/' + filename.substring(0, filename.length - 4) + '/' + filename.substring(0, filename.length - 4) + '/serviceConfig.json')

    let jsonData = JSON.parse(data)
    let jsonServiceData = JSON.parse(serviceData)

    jsonData.push(jsonServiceData)

    fs.writeFileSync('services.json', JSON.stringify(jsonData))

    import(__dirname + '/services/' + filename.substring(0, filename.length - 4) + '/' + filename.substring(0, filename.length - 4) + '/src/routes.js').then((obj) => {
        console.log(jsonServiceData.name)
        app.use(`/${jsonServiceData.name}`, obj.default)
    })
});

app.listen(5500, () =>
    console.log('Example app listening on port 5500!'),
);