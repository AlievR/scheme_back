const multer = require('multer');
const moment = require('moment');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        date = moment().format('DDMMYYYY-HHmmss')
        cb(null, `${date}--${file.originalname}`);
    }
})


const fileFilter = (req, file, cb) => {
    const ext = file.originalname
    const allowed = ['.odt', '.odg', '.pdf', '.doc', '.docx', 'zip', 'rar']

    for (let i = 0; i < allowed.length - 1; i++) {
        if (ext.includes(allowed[i])) {
            cb(null, true);
        } else {
            cb( null, false)

        }
    }
}


module.exports = multer({ storage, fileFilter })