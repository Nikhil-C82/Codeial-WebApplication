const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const Friendship = require('../models/friendship');


module.exports.profile = async function(req, res){
    // User.findById(req.params.id, function(err, user){
    //     return res.render('user_profile', {
    //         title: 'User Profile',
    //         profile_user: user
    //     });
    // });

    let userTo = await User.findById(req.params.id);
    if(userTo){
        let friendship = await Friendship.findOne({
            user_from:req.user.id,
            user_to:userTo
        });

        if(friendship){
            return res.render('user_profile', {
                title : 'profile',
                profile_user: userTo,
                friend: 'Unfollow'
            });
        }else{
            return res.render('user_profile', {
                title : 'profile',
                profile_user: userTo,
                friend: 'Follow'
            });
        }
    }

    return res.render('user_profile', {
        title : 'profile',
        profile_user: userTo,
        friend: 'Error Fetching User Details'
    });

}

module.exports.addFriend = async function(req, res){
    try{
        let friendship = await Friendship.findOne({
            user_from: req.user.id,
            user_to: req.params.id
        });
        let user = await User.findById(req.user.id);
        if(friendship){
            friendship.remove();
            user.friends.pull(req.params.id);
            if(req.xhr){
                return res.status(200).json({
                    button_text: "Follow",
                });
            }
        }else{
            await Friendship.create({
                user_from: req.user.id,
                user_to: req.params.id
            });
            user.friends.push(req.params.id);
            user.save();
            if(req.xhr){
                return res.status(200).json({
                    button_text: "Unfollow",
                });
            }
        }
        return res.redirect('back');
    }catch(err){
        console.log("error", err);
        return res.redirect('back');
    }
    
}


module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         return res.redirect('back');
    //     });
    // }else{
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id){
        
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('****Multer Error****',err);
                }

                user.name = req.body.name;
                user.email = req.body.email;

                if(user.avatar){
                    fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                }

                if(req.file){
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();
                return res.redirect('back');
            })
        } catch (err) {
            req.flash('error',err);
            return res.redirect('back');
        }
    
    }
    else{
        req.flash('error','Unauthorised!!!');
        return res.status(401).send('Unauthorized');
    }

}


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success','Logged in successfully...');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout(function(){});

    req.flash('success','Logged out successfully...');

    return res.redirect('/');
}