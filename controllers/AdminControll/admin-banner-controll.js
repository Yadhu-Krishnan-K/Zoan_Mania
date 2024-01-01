const banner = require('../../models/banner');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const addBanner = async (req, res) => {
    try {
        const images = req.files;
        const exist = await banner.findOne();
        if (exist) {
            await banner.deleteOne();
        }

        const imageUrls = images.map((file) => file.filename);
        const croppedImageUrls = [];

        for (let i = 0; i < Math.min(imageUrls.length, 3); i++) {
            const imagePath = path.join(__dirname, '../../public/Banners', imageUrls[i]); // Update the path here
            console.log('imagePath=',imagePath)
            // Specify the desired dimensions for cropping
            const width = 400;
            const height = 400;

            // Use sharp to crop and resize the image
            const outputBuffer = await sharp(imagePath)
                .resize({ width, height, fit: sharp.fit.cover })
                .toBuffer();

            // Generate a new filename for the cropped image
            const croppedFilename = `cropped_${imageUrls[i]}`;

            // Save the cropped image to the croppedBanner directory
            fs.writeFileSync(path.join(__dirname, '../../public/croppedBanner', croppedFilename), outputBuffer);

            // Store the cropped image URL in the array
            croppedImageUrls.push(croppedFilename);
        }

        const newBanner = await banner.create({
            mainImage: croppedImageUrls[0],
            images: croppedImageUrls,
        });

        console.log('newBanner===', newBanner);
        res.json({
            status: true,
        });
    } catch (error) {
        console.error('500 error:', error);
        res.status(500).json({
            status: false,
            error: 'Internal Server Error',
        });
    }
};

module.exports = {
    addBanner,
};
