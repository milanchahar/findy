import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'findyy-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};
