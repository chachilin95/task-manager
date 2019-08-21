const multer = require('multer');

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {

        const imgRegEx = /\.(jpg|jpeg|png)$/;
        if (!file.originalname.match(imgRegEx)) {
            return cb(new Error('File must be an image'));
        }

        cb(undefined, true);
    }
});

module.exports = upload;