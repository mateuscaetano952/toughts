module.exports.register = (req, res) => {
    console.log("Debug++ register");
    res.render('auth/register')
};

module.exports.login = (req, res) => {
    console.log("Debug++ login");
    res.render('auth/login')
};

module.exports.registerPost = (req, res) => {
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

    // If validation passes, proceed with registration logic
    // ...

    req.flash('message', 'Registration successful');
   res.redirect('/login');
};
