const customError = require('../error/');
const User = require('../model/auth')
const { createJwt } = require('../healper');

exports.getregister = async(req, res) => {
    res.render('auth/register', {alertMsg: false})
}

exports.getlogin= async(req, res) => {
    res.render('auth/login', {alertMsg: false})
}

exports.register = async(req, res) => { 
    const { name, email, password } = req.body || '';
    if (!name || !email || !password) { 
        return res.send('frill')
    }

    const checkEmail = await User.findOne({ email });
    if (checkEmail) { 
        return res.render('auth/register', {
            alertMsg: true,
            location: '/admin/register/',
            icon: 'error',
            title: 'Register an account',
            msgAlert: 'Email Already exist'
        })
    }
    const firstAcc = (await User.countDocuments({})) === 0;
    const role = firstAcc ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });
    const payload = { userId: user._id, name: user.name, role: user.role };

    const token = createJwt({ payload });

    res.cookie('auth', token, {
    httpOnly: true,        
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'Strict',   
    maxAge: 24 * 60 * 60 * 1000 
    });

    res.status(201).render('auth/register', {
        alertMsg: true,
        location: '/admin/login/',
        icon: 'success',
        title: 'Register an account',
        msgAlert: 'Successful create an account'
    })
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.render('auth/login', {
            alertMsg: true,
            location: '/admin/login/',
            icon: 'error',
            title: 'Login account',
            msgAlert: 'Invalid email or password'
        })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
     return res.render('auth/login', {
            alertMsg: true,
            location: '/admin/login/',
            icon: 'error',
            title: 'login account',
            msgAlert: 'Invalid Email or password'
        })
    }


    const payload = {
      id: user._id,
      email: user.email,
      username: user.name
    };


    const { token } = createJwt({ payload });

    // Set cookie
    res.cookie('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000 
    });


    return res.render('auth/login', {
            alertMsg: true,
            location: '/flight/dashboard',
            icon: 'success',
            title: 'Login an account',
            msgAlert: 'you are successful login'
        })
};


