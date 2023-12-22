const banner = require('../../models/banner')


const addBanner = async(req,res)=>{
    try {
        const images = req.files;
        const exist = await banner.findOne();
        if(exist){
            await banner.deleteOne()
        }
    const imageUrls = images.map((file) => file.filename);
    let arr = [];
        console.log('imageUrls==',imageUrls)
    for (i = 0; i < imageUrls.length; i++) {
      let ar = imageUrls[i].split(".");
      arr.push(ar[1]);
    }
    console.log('arr==',arr)


    for (i = 0; i < arr.length; i++) {
      if (!["jpg", "jpeg", "png"].includes(arr[i])) {
        // res.render("supAdmin/422error");
        return res.json({
            status:false
        })
      }
    }

    const newBanner = await banner.create({
        mainImage: imageUrls[0],
        images: imageUrls
    });
    
    console.log('newBanner===',newBanner)
        res.json({
            status: true
        })
    } catch (error) {
        console.log('500 error');
    }

}

module.exports = {
    addBanner
}