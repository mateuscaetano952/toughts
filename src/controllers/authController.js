const User = require('../models/User');

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
    console.log("Debug++" + name, email, password, confirmPassword);

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        req.flash('message', 'All fields are required');
        return res.render('/register');
    }

    if (password !== confirmPassword) {
        req.flash('message', 'Passwords do not match');
        return res.render('auth/register', { message: req.flash('message') });
    }


    if(password.length < 6) {
        req.flash('message', 'Password must be at least 6 characters');
        return res.render('auth/register', { message: req.flash('message') });
    }

    if(await User.findOne({ where: { email: email } })) {
        req.flash('message', 'Email already registered');
        return res.render('auth/register', { message: req.flash('message') });
    }

    const user = {
        name,
        email,
        password
    };

   try {
     await User.create(user);
   } catch (err) {
       console.error('Failed to create user:', err);
       req.flash('message', 'Internal server error');
       return res.render('auth/register', { message: req.flash('message') });
   }

    req.flash('message', 'Registration successful');
   res.redirect('/login');
};
