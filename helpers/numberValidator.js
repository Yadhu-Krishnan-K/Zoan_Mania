const categoryOffer = (val) => {
    if(val<0 && val>100 ){
        return{
            status:false,
            message:"need to be in between 0-100"
        }
    }else if(val == '' || val == NaN){
        return({
            status :false,
            message:'please enter valid data'
        })
    }
    else if(val >= 0 && val <=100){
        return {status:true}
    }
}

const numberCheck = (number) => {
    if(number < 0){
        return {status:false, message: 'Should be positive'}
    }
}






module.exports = {
    categoryOffer
}