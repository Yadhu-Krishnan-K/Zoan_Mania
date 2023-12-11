const noCache = (req,res,next) => {
    try {
    
        res.set("Cache-Control","no-store")
        next()
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
}