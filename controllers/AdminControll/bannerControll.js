const banner = require('../../models/banner');
const sharp = require('sharp');


const getBanner = async (req, res) => {
    try {
        res.render('supAdmin/banner',{title:"Admin Banner",Page:"Banner"})
    } catch (error) {
      console.error("Error :",error.message);
    }
}
const getSlides = async(req,res) => {
    try {
        const banners = await banner.find()
        console.log('banners = ',banners)
        res.status(200).json({banners})
    } catch (error) {
        console.log('Error = ',error)
    }

}

const addBanner = async (req, res) => {
    try {
        console.log('addin banner....')
        const file = req.file; // single uploaded image
        console.log('adding banner =',file)
        if (!file) {
            return res.status(400).json({
                status: false,
                message: "No image uploaded"
            });
        }

        // Save only the filename from multer
        const newBanner = await banner.create({
            image: file.filename
        });

        res.json({
            status: true,
            banner: newBanner
        });

    } catch (error) {
        console.error("500 error:", error);
        res.status(500).json({
            status: false,
            error: "Internal Server Error"
        });
    }
};

const deleteBanner = async(req,res) => {
    try {
        let _id = req.params.id
        await banner.findByIdAndDelete(_id)
        console.log(_id)
        res.status(200).json({success:'true'})
    } catch (error) {
        console.log('Error = ',error)
    }
}


module.exports = {
    getBanner,
    getSlides,
    addBanner,
    deleteBanner
};
