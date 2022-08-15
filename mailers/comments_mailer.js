const nodemailer = require('../config/nodemailer');




exports.newComment = (comment)=>{
    let htmlString = nodemailer.renderTemplate({comment:comment}, '/comments/new_comment.ejs');

    nodemailer.transporter.sendMail({
       from:'niki829c@gmail.com',
       to:comment.user.email,
       subject: 'New Comment Published!!!',
       html: htmlString
    }, (err, info)=>{
        if(err){
            console.log('error in sending mail',err);
            return;
        }

        console.log('mail sent',info);
        return;
    });
}