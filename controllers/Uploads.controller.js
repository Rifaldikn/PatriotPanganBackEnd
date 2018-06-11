var fs = require('fs');
var multer = require('multer');

class Upload {
    SetStorage(destination) {
        return multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, __dirname + destination);
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
            }
        });
    }

    SetUpload(storage) {
        return multer({
            storage: storage,
            limits: { fileSize: 2*1024*1024 }
        }).single('foto');
    }

    DeleteFile(destination) {
        fs.unlink(__dirname + destination);
    }
}

module.exports = new Upload;