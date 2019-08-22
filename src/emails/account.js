const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'chachilin95@me.com',
        subject: 'Thanks for joining us!',
        text: `Hey, ${name}! Welcome to the Task Manager!`
    });
};

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'chachilin95@me.com',
        subject: 'Sorry to see you go...',
        text: `We will miss you always, ${name}.`
    });
};

module.exports = {
    sendGoodbyeEmail,
    sendWelcomeEmail
};