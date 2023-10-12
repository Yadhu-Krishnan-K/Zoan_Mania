const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        // return cb(null,'./public/uploads');
        return cb(null, './public/uploads')
    },
    filename: (req,file,cb) => {
     
        // return cb(null, file.fieldname + '-' + uniqueSuffix)
        return cb(null, Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

module.exports = upload