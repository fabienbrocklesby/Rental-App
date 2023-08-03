import jwt from 'jsonwebtoken';
import * as userService from '../services/user.service.js';

export const indexUsers = async (request, response, next) => {
  try {
    response.status(200).json(await userService.indexUsers());
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (request, response, next) => {
  try {
    response.status(201).json(await userService.registerUser(request.body));
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (request, response, next) => {
  try {
    const token = await userService.verifyOtp(request.body);
    if (token) {
      return response
        .cookie('access_token', token, {
          secure: process.env.NODE_ENV === 'production',
        })
        .status(200)
        .json({ message: 'Logged in successfully 😊👌' });
    }

    throw new Error('Failed to generate token');
  } catch (error) {
    next(error);
  }

  return null;
};

export const loginUser = async (request, response, next) => {
  try {
    response.status(201).json(await userService.loginUser(request.body));
  } catch (error) {
    next(error);
  }
};

export const reqUpdateUser = async (request, response, next) => {
  try {
    const username = await jwt.verify(
      request.cookies.access_token,
      process.env.JWT_SECRET,
    ).username;
    const updatedRes = await userService.reqUpdateUser(username, request.body);

    if (updatedRes.token) {
      response
        .cookie('access_token', updatedRes.token, {
          secure: process.env.NODE_ENV === 'production',
        })
        .status(200)
        .json({ message: updatedRes.message });
      return;
    }

    response.status(200).json(updatedRes);
  } catch (error) {
    next(error);
  }
};

export const verifyUpdateOTP = async (request, response, next) => {
  try {
    const username = await jwt.verify(
      request.cookies.access_token,
      process.env.JWT_SECRET,
    ).username;
    const updatedRes = await userService.verifyUpdateOTP(username, request.body);

    if (updatedRes.token) {
      response
        .cookie('access_token', updatedRes.token, {
          secure: process.env.NODE_ENV === 'production',
        })
        .status(200)
        .json({ message: updatedRes.message });
      return;
    }

    response.status(200).json(updatedRes);
  } catch (error) {
    next(error);
  }
};

export const reqDeleteUser = async (request, response, next) => {
  try {
    const username = await jwt.verify(
      request.cookies.access_token,
      process.env.JWT_SECRET,
    ).username;

    response.status(200).json(await userService.reqDeleteUser(username));
  } catch (error) {
    next(error);
  }
};

export const verifyDeleteOTP = async (request, response, next) => {
  try {
    const username = await jwt.verify(
      request.cookies.access_token,
      process.env.JWT_SECRET,
    ).username;

    response.status(200).json(await userService.verifyDeleteOTP(username, request.body));
  } catch (error) {
    next(error);
  }
};
