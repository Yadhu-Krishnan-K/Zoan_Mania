const userLogin = (req, res) => {
    let txt = req.session.txt;
    if (req.session.err) {
        res.render('user/userLogin', { title: 'login', txt });
        req.session.err = false; 
    } else {
        res.render('user/userLogin', { title: 'login' });
    }
}


const userSignup = (req,res)=>{
    const exist = req.session.exist
    res.render('user/userSignUp',{title:"SignuUp",exist})  
}