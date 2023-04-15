const { findOneAndUpdate } = require('../models/user');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');


module.exports.profile = function (req, res) {
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user:user
    });
    
    });
}

module.exports.update = async function(req, res){
//     if(req.user.id == req.params.id){
//         User.findByIdAndUpdate(req.params.id,req.body, function(err, user){
//             return res.redirect('back');

//         });
//     }else{
//         return res.status(401).send('Unauthorized');
//     }
if(req.user.id == req.params.id){
    try{
        let user = await User.findById(req.params.id);
        User.uploadedAvatar(req, res, function(err){
            if (err) {console.log('*****Multer Error: ', err)}
         
            if(req.file){

                if (user.avatar){
                    fs.unlinkSync(path.join(__dirname, '..', user.avatar))
                }
              // this is saving thw patth of the uploaded fileinto the avatar filed in the user  
                user.avatar = User.avatarPath + '/' + req.file.filename;
            }
            user.save();
            return res.redirect('back');
            });

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}else{
    req.flash('error', 'Unauthorized!');
    return res.statis(401).send(Unauthorized);

}
}

//render the sign up page
module.exports.signUp = function (req, res) {
    if(req. isAuthenticated()){
      return res.redirect('/users/profile');
}
       return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}

// render the sign in page
module.exports.signIn = function (req, res) {

    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = async function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');

    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        await User.create(req.body);
        return res.redirect('/users/sign-in');

    } else {
        return res.redirect('back');

    }
}




// sign in and create session in
module.exports.createSession = async function (req, res) {
    // handle password which doesn't match
    
    
 let user = await User.findOne({email: req.body.email}); 
       if (user){

          await res.cookie('user_id', user.id);
            return res.redirect('/users/profile');

        }else{
            // handle user not found

            return res.redirect('back');
        }

}


//sign in and create a session for the user
module.exports.createSession = async function(req, res){
    req.flash('success','Logged in Successfully');

    return res.redirect('/');

}

module.exports.destroySession = function(req, res){
    req.logout(function(err) {
        req.flash('success','You have logged out');

        if (err) { return next(err); }

    return res.redirect('/');
    }
    )}

