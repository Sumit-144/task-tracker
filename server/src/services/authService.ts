import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/userRepository';
import { generateToken } from '../utils/jwt';
import { RegisterUser, LoginUser } from '../types';
import { logger } from '../utils/logger';

export const authService = {
  async register(userData: RegisterUser) {
    try {
      const existingUser = await userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await userRepository.create({
        ...userData,
        password: hashedPassword
      });

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return { user, token };
    } catch (error) {
      logger.error('Registration service error', error);
      throw error;
    }
  },

  async login(credentials: LoginUser) {
    try {
      const user = await userRepository.findByEmail(credentials.email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(credentials.password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      };
    } catch (error) {
      logger.error('Login service error', error);
      throw error;
    }
  }
};