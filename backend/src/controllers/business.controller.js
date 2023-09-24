import jwt from 'jsonwebtoken';

import * as businessService from '../services/business.service.js';

export const indexBusinesses = async (request, response, next) => {
  try {
    response.status(200).json(await businessService.indexBusinesses());
  } catch (error) {
    next(error);
  }
};

export const createBusiness = async (request, response, next) => {
  try {
    const email = await jwt.verify(
      request.cookies.access_token,
      process.env.JWT_SECRET,
    ).email;
    response.status(200).json(await businessService.createBusiness(request.body, email));
  } catch (error) {
    next(error);
  }
};

export const updateBusiness = async (request, response, next) => {
  try {
    const email = await jwt.verify(
      request.cookies.access_token,
      process.env.JWT_SECRET,
    ).email;
    response.status(200).json(await businessService.updateBusiness(request.body, email));
  } catch (error) {
    next(error);
  }
};

export const deleteBusiness = async (request, response, next) => {
  try {
    const email = await jwt.verify(
      request.cookies.access_token,
      process.env.JWT_SECRET,
    ).email;
    response.status(200).json(await businessService.deleteBusiness(email));
  } catch (error) {
    next(error);
  }
};
