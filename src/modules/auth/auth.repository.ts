import { UserModel } from './auth.model';
import { IUserDocument } from './auth.interface';
import { BaseRepository } from '../../shared/helpers/baseRepository';

export class AuthRepository extends BaseRepository<IUserDocument> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).select('+password');
  }

  async adminExists(): Promise<boolean> {
    const count = await UserModel.countDocuments({ role: 'admin' });
    return count > 0;
  }
}

export const authRepository = new AuthRepository();
