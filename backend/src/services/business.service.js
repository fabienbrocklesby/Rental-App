import * as businessModel from '../models/business.model.js';
import * as userModel from '../models/user.model.js';

import emailHelper from '../commons/email.common.js';

import { validateWebsite, validateEmail } from '../validators/business.validator.js';

export const indexBusinesses = async () => (businessModel.indexBusinesses());

/*
  * Get a business
  * @param {string} email - Business / user email
  * @returns {object} - Business object
*/
export const getBusiness = async (email) => {
  await validateEmail({ email }, ['email']);

  const user = await userModel.selectUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  } else if (!user.business) {
    throw new Error('User does not have a business');
  }

  const business = await businessModel.getBusinessByUserId(user.id);

  if (!business) {
    throw new Error('Business not found');
  }

  return business;
};

/*
  * Create a business
  * @param {object} data - Business data
  * @param {string} data.website - Business website
  * @param {string} data.email - Business / user email
  * @returns {object} - Business object
*/
export const createBusiness = async ({ website }, email) => {
  await validateWebsite({ website }, ['website']);
  await validateEmail({ email }, ['email']);

  const user = await userModel.selectUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  } else if (user.business) {
    throw new Error('User already has a business');
  }

  if (await businessModel.getBusinessByWebsite(website)) {
    throw new Error('Business website already exists');
  } else if (await businessModel.getBusinessByUserId(user.id)) {
    throw new Error('User already has a business');
  }

  const business = businessModel.createBusiness(website, user.id);

  if (!business) {
    throw new Error('Something went wrong');
  }

  await userModel.setBusiness(user.id);

  await emailHelper({
    email: 'businessverification@ezgear.app',
    message: `<u>Verify Business:</u>
    <br /> Business ID: ${business.id} 
    <br /> Business Website: ${business.website} 
    <br /> User ID: ${business.user_id}`,
  });

  return business;
};

/*
  * Update a business
  * @param {object} data - Business data
  * @param {string} data.website - Business website
  * @param {string} data.email - Business / user email
  * @returns {object} - Business object
*/
export const updateBusiness = async ({ website }, email) => {
  await validateWebsite({ website }, ['website']);
  await validateEmail({ email }, ['email']);

  const user = await userModel.selectUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  } else if (!user.business) {
    throw new Error('User does not have a business');
  }

  const business = await businessModel.getBusinessByUserId(user.id);

  if (!business) {
    throw new Error('Business not found');
  } else if (business.website === website || business.updated_website === website) {
    throw new Error('Business website already exists');
  }

  const updatedBusiness = await businessModel.updateBusiness(website, user.id);

  if (!updatedBusiness) {
    throw new Error('Something went wrong');
  }

  await emailHelper({
    email: 'businessverification@ezgear.app',
    message: `<u>Verify Business Update:</u>
    <br /> Business ID: ${business.id} 
    <br /> Business Website: ${business.website} 
    <br /> New Business Website: ${updatedBusiness.updated_website}
    <br /> User ID: ${business.user_id}`,
  });

  return updatedBusiness;
};

/*
  * Delete a business
  * @param {string} email - Business / user email
  * @returns {object} - Business object
  * @returns {object} - User object
  * @returns {object} - Business object
*/
export const deleteBusiness = async (email) => {
  await validateEmail({ email }, ['email']);

  const user = await userModel.selectUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  } else if (!user.business) {
    throw new Error('User does not have a business');
  }

  const business = await businessModel.getBusinessByUserId(user.id);

  if (!business) {
    throw new Error('Business not found');
  }

  const deletedBusiness = await businessModel.deleteBusiness(user.id);

  if (!deletedBusiness) {
    throw new Error('Something went wrong');
  }

  await userModel.removeBusiness(user.id);

  return { user, business };
};
