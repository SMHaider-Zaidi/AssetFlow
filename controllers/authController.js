import bcrypt from 'bcryptjs'
import * as db from '../models/dbQueries.js'

// Show the home page
export const showHomePage = (req, res) => {
    res.render('index');
};

//Show the login page
export const showLoginPage = (req, res, next)=>{
    return res.render('login', {error: null})
};

// Handle user login
export const login = async (req, res, next) =>{

    const {email, password} = req.body;
    try{
        if (email === process.env.SUPER_ADMIN_EMAIL && password === process.env.SUPER_ADMIN_PASSWORD){
            req.session.user = {
                orgId: null,
                uId: null,
                role: "Super Admin",
                userName: "Super Admin"
            };
            return res.redirect('/superadmin/dashboard');
        }
        const user = await db.findUserByEmail(email);
        if (user){
            const passwordMatch = await bcrypt.compare(password, user.Password);
            //const passwordMatch = (password === user.Password); // For testing only
            if (passwordMatch){
                const roleName = await db.findRoleName(user.Role_id);
                req.session.user= {
                    orgId: user.Org_id,
                    orgName: user.Org_Name,
                    uId: user.U_id,
                    role: roleName,
                    userName: user.Name
                }

                if (roleName === "Admin"){return res.redirect('/admin/dashboard')}
                else{return res.redirect('/employee/dashboard')}
        
            }else{
                return res.render('login', {error: 'Invalid email or password'})
            }
        }else{
            return res.render('login', {error: 'No account found with that email'})
        }
    }catch (error) {
        // System error: Database down or code bug
        next(error); 
    }

}

// Logout the user
export const logOut = (req, res, next) =>{
    req.session.destroy((err)=>{
        if (err){
        return next(err);
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        return res.redirect('/login')
    })
};

// Show the registration page
export const showregistrationPage = (req, res, next) =>{
    return res.render('register', {error: null})
};

// Handle Org & First User(admin) registration
export const registerOrgAndAdmin = async(req, res, next)=>{
    const {orgName, adminName, adminEmail, adminPassword} = req.body;
    try{

        const existingUser = await db.findUserByEmail(adminEmail);
        if (existingUser) {
            return res.render('register', { error: 'This email is already registered to a user.' });
        }

        const existingOrg = await db.findOrgByName(orgName);
        if(existingOrg){
            return res.render ('login', {error:'Organization with this name already exists. Please choose a different name or log in.'})

        }else{
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const newOrg = await db.registerNewOrg({orgName:orgName, adminName:adminName, adminEmail:adminEmail, adminPassword:hashedPassword});
            return res.redirect('/login?success=Account created! Please log in.');
        }
    }catch (error) {
        // System error: Pass to global handler
        next(error);
    }
};

