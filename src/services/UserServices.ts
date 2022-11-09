import nodemailer from 'nodemailer';
import { UserModel } from '../models';
import { CustomError } from '../helpers';
import { config } from '../config';
import { IFormData } from '../interfaces';
import Logging from '../library/Logging';

class UserServices {
    updateAvatar = async (_id: string, avatarUrl: string) => {
        const user = await UserModel.findOneAndUpdate({ _id }, { avatar: avatarUrl }, { new: true });
        if (!user) {
            throw new CustomError('Unable to update avatar');
        }
        return true;
    };

    sendMsg = async ({ userName, userEmail, userText }: IFormData) => {
        try {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport(config.nodemailer.transporterOptions);

            const letter = `
            You have email from: ${userName}. 
            Contact email: ${userEmail}.
            Message: ${userText}.
            `;

            const sendMailOptions = {
                from: 'yerimjunior@meta.ua', // sender address
                to: process.env.TO_EMAIL, // list of receivers
                subject: 'Hello from backend', // Subject line
                text: userText, // plain text body
                html: letter // html body
            };

            // send mail with defined transport object
            let info = await transporter.sendMail(sendMailOptions);
            Logging.log(info.messageId);

            return true;
        } catch (error: any) {
            Logging.log(error.message);
        }
    };
}

export default new UserServices();
