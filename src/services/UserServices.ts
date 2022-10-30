import { UserModel } from '../models';
import { CustomError } from '../helpers';

class UserServices {
    updateAvatar = async (_id: string, avatarUrl: string) => {
        const user = await UserModel.findOneAndUpdate({ _id }, { avatar: avatarUrl }, { new: true });
        if (!user) {
            throw new CustomError('Unable to update avatar');
        }
        return true;
    };
}

export default new UserServices();
