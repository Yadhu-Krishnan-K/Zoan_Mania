const categoryOffer = (val) => {
    try {
    
        if( val < 0 ){
            return{
                status:false,
                message:"need to be greater than 0"
            }
        }else if(val == NaN){
            return{
                status :false,
                message:'please enter valid data'
            }
        }
        else if(val >= 0){
            return {status:true}
        }
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
}

const numberCheck = (number) => {
    try {
    
        if(number < 0){
            return {status:false, message: 'Should be positive'}
        }
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
}

module.exports = {
    categoryOffer,
    numberCheck
}