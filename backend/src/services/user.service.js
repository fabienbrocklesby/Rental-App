import argon2 from 'argon2';

import * as userModel from '../models/user.model.js';

import emailHelper from '../commons/email.common.js';
import otpGenerator from '../commons/otp.common.js';

import userValidator from '../validators/user.validator.js';
import otpValidator from '../validators/otp.validator.js';

import tokenMiddleware from '../middleware/token.middleware.js';

const saltRounds = Number(process.env.ARGON_SALT_ROUNDS || 12);

export const indexUsers = async () => (userModel.indexUsers());

// hash
export const registerUser = async ({
  username,
  email: originalEmail,
}) => {
  const email = originalEmail.toLowerCase();
  await userValidator({ username, email }, ['username', 'email']);

  if (
    await userModel.selectUserByEmail(email)
    || await userModel.selectUserByUsername(username)
  ) {
    throw new Error('User already exists ..');
  }

  const otp = await otpGenerator();

  const user = await userModel.createUser({
    username,
    email,
    otp: await argon2.hash(otp, { saltLength: saltRounds }),
  });

  await emailHelper(
    user.email,
    'One Time Password:',
    `Your Code Is ${otp}`,
  );

  return `OTP has been sent to ${user.email}`;
};

// hash
export const loginUser = async ({ email: originalEmail }) => {
  const email = originalEmail.toLowerCase();
  await userValidator({ email }, ['email']);

  const user = await userModel.selectUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  const otp = await otpGenerator();

  await userModel.updateOTP({ otp: await argon2.hash(otp, { saltLength: saltRounds }), email });

  await emailHelper(
    user.email,
    'One Time Password:',
    `Your Code Is ${otp}`,
  );

  return 'OTP sent successfully';
};

// unhash
export const verifyOtp = async ({
  email,
  otp,
}) => {
  await otpValidator({ email, otp }, ['email', 'otp']);

  const userData = await userModel.selectUserByEmail(email);

  if (!userData) {
    throw new Error('User not found');
  }

  if (await argon2.verify(userData.otp, otp)) {
    await userModel.updateOTP({ otp: null, email });
    return tokenMiddleware(userData);
  }

  throw new Error('Wrong OTP');
};

// hash
export const reqUpdateUser = async (username, newData) => {
  let updatedUsername = null;

  const user = await userModel.selectUserByUsername(username);

  if (!user) {
    throw new Error('User not found');
  }

  const { email: newEmail, newUsername } = newData;

  if (newUsername && newUsername !== user.username) {
    await userValidator({ username: newUsername, email: user.email }, ['username']);

    if (await userModel.selectUserByUsername(newUsername)) {
      throw new Error('Username already exists');
    }

    await userModel.updateUser({
      ...user,
      username: newUsername,
    });

    updatedUsername = newUsername;
  }

  if (newEmail && newEmail.toLowerCase() !== user.email) {
    const email = newEmail.toLowerCase();
    await userValidator({ username: newUsername || user.username, email }, ['username', 'email']);

    if (await userModel.selectUserByEmail(email)) {
      throw new Error('Email already exists');
    }

    const otp = await otpGenerator();
    await userModel.updateUser({
      ...user,
      username: newUsername || user.username,
      temp_email: email,
    });

    await userModel.updateOTP({
      otp: await argon2.hash(otp, { saltLength: saltRounds }),
      username,
    });

    await emailHelper(email, 'One Time Password:', `Your Code Is ${otp}`);

    return {
      message: `OTP has been sent to ${email}`,
      token: await tokenMiddleware({
        username: updatedUsername || user.username,
        email: user.email,
      }),
    };
  }

  return {
    message: 'User updated successfully',
    token: await tokenMiddleware({
      username: updatedUsername || user.username,
      email: user.email,
    }),
  };
};

// unhash
export const verifyUpdateOTP = async (username, { otp }) => {
  await otpValidator({ username, otp }, ['username', 'otp']);

  const userData = await userModel.selectUserByUsername(username);

  if (!userData) {
    throw new Error('User not found');
  }

  if (await argon2.verify(userData.otp, otp)) {
    const updatedUser = {
      id: userData.id,
      username,
      email: userData.temp_email || userData.email,
      temp_email: null,
    };

    await userModel.updateUser(updatedUser);
    await userModel.updateOTP({ otp: null, username });

    return {
      message: 'User updated successfully',
      token: await tokenMiddleware({ username, email: updatedUser.email }),
    };
  }

  throw new Error('Wrong OTP');
};

// hash
export const reqDeleteUser = async (username) => {
  const user = await userModel.selectUserByUsername(username);

  if (!user) {
    throw new Error('User not found');
  }

  const otp = await otpGenerator();

  await userModel.updateOTP({ otp: await argon2.hash(otp, { saltLength: saltRounds }), username });

  await emailHelper(
    user.email,
    'One Time Password:',
    `Your Code Is ${otp}`,
  );

  return `OTP has been sent to ${user.email}`;
};

// unhash
export const verifyDeleteOTP = async (username, { otp }) => {
  await otpValidator({ username, otp }, ['username', 'otp']);

  const userData = await userModel.selectUserByUsername(username);

  if (!userData) {
    throw new Error('User not found');
  }

  if (await argon2.verify(userData.otp, otp)) {
    await userModel.deleteUser(username);

    return 'User deleted successfully';
  }

  await userModel.deleteItemsByUserId(userData.id);

  throw new Error('Wrong OTP');
};
