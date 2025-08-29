const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports.register = (req, res) => {
    console.log("Debug++ register");
    res.render('auth/register')
};

module.exports.login = (req, res) => {
    console.log("Debug++ login");
    res.render('auth/login')
};

module.exports.registerPost =  async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    //console.log("Debug++" + name, email, password, confirmPassword);

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        req.flash('message', 'All fields are required');
        return res.redirect('/register');
    }

    if (password !== confirmPassword) {
        req.flash('message', 'Passwords do not match');
       return res.redirect('/register');
    }


    if(password.length < 6) {
        req.flash('message', 'Password must be at least 6 characters');
        return res.redirect('/register');
    }

    if(await User.findOne({ where: { email: email } })) {
        req.flash('message', 'Email already registered');
        return res.redirect('/register');
    }

    //create password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
        name,
        email,
        password: hashedPassword
    };

   try {
     await User.create(user);
   } catch (err) {
       console.error('Failed to create user:', err);
       req.flash('message', 'Internal server error');
       return res.redirect('/register');
   }

    req.flash('message', 'Registration successful');

    //Session start
    req.session.userid = user.id;

    req.session.save(() => {
        return res.redirect('/');
    })
};
