const Admin = require('../../models/admin')

const adminLogin =  async (req, res) => {
    try {
        let { email, password } = req.body;
        console.log('email,password = ', email, password)

        // Hash the password and then query the database
        let adminL = await Admin.findOne({ adminGmail: email, adminPassword: password });

        if (!adminL) {
            res.json({
                success: false
            });
        } else {
            console.log("Success");
            req.session.adminAuth = true;
            res.json({
                success: true
            });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}

module.exports = {
    adminLogin
}