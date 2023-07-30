import jwt from 'jsonwebtoken';
import * as sharedModel from '../models/user.model.js';

export default (async (request, response, next) => {
  try {
    const token = request.cookies.access_token;

    if (!token) {
      throw new Error('No token provided');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await sharedModel.selectUserByEmail(decoded.email);

    if (!user) {
      throw new Error('User not found');
    }
    next();
  } catch (error) {
    next(error);
  }
});
