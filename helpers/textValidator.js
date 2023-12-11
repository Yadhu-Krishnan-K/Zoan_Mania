
const textValidatot = (text) =>{

}
const categoryValidator = (text) => {
    try {
        
        //checking two adjecent spaces
        let spacePattern = /\s{2,}/;
    
        //checking any special charactors
        var regex = /^[a-zA-Z0-9_]+$/;
    
        if(text == ''){
            return{
                status:false,
                message:"Category name can not be empty"
            }
        }
        else if(spacePattern.test(text)){
            return{
                status:false,
                message:'should not contain more than two spaces adjecent'
            }
        }
        else if(!(regex.test(text))){
            return{
                status:false,
                message:`should not contain any special charactors other than "-"`
            }
        }
        else{
            return {status:true}
        }
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
}



module.exports = {
    textValidatot,
    categoryValidator
}