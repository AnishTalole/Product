const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "profileImage") {
            cb(null, 'public/uploads/profiles/');
        } else {
            cb(null, 'public/uploads/logos/');
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });
module.exports = upload;