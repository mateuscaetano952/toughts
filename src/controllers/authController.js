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
     const createdUser = await User.create(user);
      req.flash('message', 'Registration successful');

    //Session start
    req.session.userid = createdUser.id;

    req.session.save(() => {
        return res.redirect('/');
    });

   } catch (err) {
       console.error('Failed to create user:', err);
       req.flash('message', 'Internal server error');
       return res.redirect('/register');
   }

  
};

module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email }});
    if (!user) {
        req.flash('message', 'Invalid email or password');
        return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        req.flash('message', 'Invalid email or password');
        return res.redirect('/login');
    }

    req.session.userid = user.id;
    req.session.save(() => {
        res.redirect('/');
    });
}

module.exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    }); 
}
