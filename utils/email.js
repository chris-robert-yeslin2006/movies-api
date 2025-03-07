import nodeMailer from "nodemailer";

const sendEmail = async (option) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: "Cineflex Support <support@cineflex.com>",
        to: option.to,
        subject: option.subject,
        text: option.message,
    };

    await transporter.sendMail(mailOptions);
    next();
};

export default sendEmail;









