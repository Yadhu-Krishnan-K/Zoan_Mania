const categoryOffer = (val) => {
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
}

const numberCheck = (number) => {
    if(number < 0){
        return {status:false, message: 'Should be positive'}
    }
}

module.exports = {
    categoryOffer,
    numberCheck
}