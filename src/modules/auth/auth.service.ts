import { authRepository } from './auth.repository';
import { LoginDto, AuthResponse } from './auth.types';
import { AUTH_MESSAGES } from './auth.constant';
import { ApiError } from '../../shared/errors/ApiError';
import { comparePassword, hashPassword } from '../../core/auth/bcrypt';
import { signToken } from '../../core/auth/jwt';
import { IUserDocument } from './auth.interface';

class AuthService {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await authRepository.findByEmail(dto.email);
    if (!user) throw ApiError.unauthorized(AUTH_MESSAGES.INVALID_CREDENTIALS);

    const isMatch = await comparePassword(dto.password, user.password);
    if (!isMatch) throw ApiError.unauthorized(AUTH_MESSAGES.INVALID_CREDENTIALS);

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });

    return {
      user: { id: user._id.toString(), email: user.email, role: user.role },
      token,
    };
  }

  async createAdmin(email: string, password: string): Promise<IUserDocument> {
    const exists = await authRepository.adminExists();
    if (exists) throw ApiError.conflict(AUTH_MESSAGES.SINGLE_ADMIN);

    const hashed = await hashPassword(password);
    return authRepository.create({ email, password: hashed, role: 'admin' });
  }

  async getProfile(userId: string): Promise<IUserDocument> {
    const user = await authRepository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }
}

export const authService = new AuthService();
