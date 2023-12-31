import bcrypt from 'bcrypt';

import * as userModel from '../models/user.model.js';
import * as itemModel from '../models/item.model.js';

import * as paymentCommon from '../commons/payment.common.js';

import emailHelper from '../commons/email.common.js';
import otpGenerator from '../commons/otp.common.js';

import { validateUsername, validateEmail } from '../validators/user.validator.js';
import otpValidator from '../validators/otp.validator.js';

import tokenMiddleware from '../middleware/token.middleware.js';

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

export const indexUsers = async () => (userModel.indexUsers());

export const getUser = async (id) => (userModel.selectUserById(id));

export const getUserByEmail = async (email) => (userModel.selectUserByEmail(email));

export const createStripeAccount = async (email) => {
  const user = await userModel.selectUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  const account = await paymentCommon.createAccountLink();

  if (!account) {
    throw new Error('Something went wrong');
  }

  await userModel.setStripeAccount({
    accountId: account.accountId,
    userId: user.id,
  });

  return account.accountLink;
};

export const verifyStripeAccount = async (email) => {
  const user = await userModel.selectUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.seller_verified) {
    throw new Error('User already verified');
  }

  const account = await paymentCommon.verifyStripeAccount(user.stripe_account);

  if (account === true) {
    await userModel.setSellerVerified(user.id);
  } else {
    throw new Error('Something went wrong');
  }

  return 'Account verified successfully';
};

export const registerUser = async ({
  username,
  email: originalEmail,
}) => {
  const email = originalEmail.toLowerCase();
  await validateEmail({ email }, ['email']);
  await validateUsername({ username }, ['username']);

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
    otp: await bcrypt.hash(otp, saltRounds),
  });

  await emailHelper({
    email: user.email,
    message: `Your one time password is: ${otp}`,
  });

  return `OTP has been sent to ${user.email}`;
};

export const loginUser = async ({ email: originalEmail }) => {
  const email = originalEmail.toLowerCase();
  await validateEmail({ email }, ['email']);

  const user = await userModel.selectUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  const otp = await otpGenerator();

  await userModel.updateOTP({ otp: await bcrypt.hash(otp, saltRounds), email });

  await emailHelper({
    email: user.email,
    message: `Your one time password is: ${otp}`,
  });

  return 'OTP sent successfully';
};

export const verifyOtp = async ({
  email,
  otp,
}) => {
  await otpValidator({ email, otp }, ['email', 'otp']);

  const userData = await userModel.selectUserByEmail(email);

  if (!userData || !userData.otp) {
    throw new Error('User not found');
  }

  if (await bcrypt.compare(otp, userData.otp)) {
    await userModel.updateOTP({ otp: null, email });
    return ({
      id: userData.id,
      token: await tokenMiddleware(userData),
    });
  }

  throw new Error('Wrong OTP');
};

export const reqUpdateUser = async (username, newData) => {
  const user = await userModel.selectUserByUsername(username);

  if (!user) {
    throw new Error('User not found');
  }

  const { email: newEmail, newUsername } = newData;
  const updatedFields = {};

  if (newUsername && newUsername !== user.username) {
    await validateUsername({ username: newUsername }, ['username']);
    await validateEmail({ email: user.email }, ['email']);

    if (await userModel.selectUserByUsername(newUsername)) {
      throw new Error('Username already exists');
    }

    updatedFields.username = newUsername;
  }

  if (newEmail && newEmail.toLowerCase() !== user.email) {
    const email = newEmail.toLowerCase();
    await validateUsername({ username: newUsername || user.username }, ['username']);
    await validateEmail({ email }, ['email']);

    if (await userModel.selectUserByEmail(email)) {
      throw new Error('Email already exists');
    }

    const otp = await otpGenerator();
    updatedFields.temp_email = email;

    await userModel.updateOTP({
      otp: await bcrypt.hash(otp, saltRounds),
      email: user.email,
    });

    await emailHelper({ email, message: `Your one time password is: ${otp}` });
  }

  if (Object.keys(updatedFields).length > 0) {
    await userModel.updateUser({
      ...user,
      ...updatedFields,
    });
  }

  return {
    message: 'User updated successfully',
    token: await tokenMiddleware({
      username: updatedFields.username || user.username,
      email: user.email,
    }),
  };
};

export const verifyUpdateOTP = async (username, { otp }) => {
  await otpValidator({ username, otp }, ['username', 'otp']);

  const userData = await userModel.selectUserByUsername(username);

  if (!userData || !userData.otp) {
    throw new Error('User not found');
  }

  if (await bcrypt.compare(otp, userData.otp)) {
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

export const reqDeleteUser = async (username) => {
  const user = await userModel.selectUserByUsername(username);

  if (!user) {
    throw new Error('User not found');
  }

  const otp = await otpGenerator();

  await userModel.updateOTP({
    otp: await bcrypt.hash(otp, saltRounds),
    email: user.email,
  });

  await emailHelper({
    email: user.email,
    message: `Your one time password is: ${otp}`,
  });

  return `OTP has been sent to ${user.email}`;
};

export const verifyDeleteOTP = async (username, { otp }) => {
  await otpValidator({ username, otp }, ['username', 'otp']);

  const userData = await userModel.selectUserByUsername(username);

  if (!userData || !userData.otp) {
    throw new Error('User not found');
  }

  if (await bcrypt.compare(otp, userData.otp)) {
    await itemModel.deleteItemsByUserId(userData.id);
    await userModel.deleteUser(username);

    return 'User deleted successfully';
  }

  throw new Error('Wrong OTP');
};
