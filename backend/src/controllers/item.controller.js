import jwt from 'jsonwebtoken';

import * as itemService from '../services/item.service.js';

export const indexItems = async (request, response, next) => {
  try {
    response.status(200).json(await itemService.indexItems());
  } catch (error) {
    next(error);
  }
};

export const getItem = async (request, response, next) => {
  try {
    response.status(200).json(await itemService.getItem(request.params.itemId));
  } catch (error) {
    next(error);
  }
};

export const getCart = async (request, response, next) => {
  try {
    const email = await jwt.verify(request.cookies.access_token, process.env.JWT_SECRET).email;
    response.status(200).json(await itemService.getCart(email));
  } catch (error) {
    next(error);
  }
};

export const resetCart = async (request, response, next) => {
  try {
    response.status(200).json(await itemService.resetCart(request.params));
  } catch (error) {
    next(error);
  }
};

export const getItemByEmail = async (request, response, next) => {
  try {
    const email = await jwt.verify(request.cookies.access_token, process.env.JWT_SECRET).email;
    console.log('email', email);
    response.status(200).json(await itemService.getItemByEmail(email));
  } catch (error) {
    next(error);
  }
};

export const getItemByHolder = async (request, response, next) => {
  try {
    const email = await jwt.verify(request.cookies.access_token, process.env.JWT_SECRET).email;
    response.status(200).json(await itemService.getItemByHolder(email));
  } catch (error) {
    next(error);
  }
};

export const createItem = async (request, response, next) => {
  try {
    const email = await jwt.verify(request.cookies.access_token, process.env.JWT_SECRET).email;
    response
      .status(201)
      .json(await itemService.createItem(email, request.body, request.files.image));
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (request, response, next) => {
  try {
    const email = await jwt.verify(request.cookies.access_token, process.env.JWT_SECRET).email;
    const image = request.files ? request.files.image : null;

    response
      .status(200)
      .json(await itemService.updateItem(email, request.body, image));
  } catch (error) {
    next(error);
  }
};

export const addItemToCart = async (request, response, next) => {
  try {
    const email = await jwt.verify(request.cookies.access_token, process.env.JWT_SECRET).email;

    response
      .status(200)
      .json(await itemService.addItemToCart(email, request.body));
  } catch (error) {
    next(error);
  }
};

export const purchaseItem = async (request, response, next) => {
  try {
    const email = await jwt.verify(request.cookies.access_token, process.env.JWT_SECRET).email;

    response
      .status(200)
      .json(await itemService.purchaseItem(email, request.body));
  } catch (error) {
    next(error);
  }
};

export const verifyPurchase = async (request, response, next) => {
  try {
    const email = await jwt.verify(request.cookies.access_token, process.env.JWT_SECRET).email;

    response
      .status(200)
      .json(await itemService.verifyPurchase(email, request.params.transactionId));
  } catch (error) {
    next(error);
  }
};

export const cancelPurchase = async (request, response, next) => {
  try {
    const email = await jwt.verify(request.cookies.access_token, process.env.JWT_SECRET).email;

    response
      .status(200)
      .json(await itemService.cancelPurchase(email, request.params.transactionId));
  } catch (error) {
    next(error);
  }
};

export const returnStatus = async (request, response, next) => {
  try {
    const email = await jwt.verify(request.cookies.access_token, process.env.JWT_SECRET).email;

    response
      .status(200)
      .json(await itemService.returnStatus(email, request.body));
  } catch (error) {
    next(error);
  }
};

export const receiptStatus = async (request, response, next) => {
  try {
    const email = await jwt.verify(request.cookies.access_token, process.env.JWT_SECRET).email;

    response
      .status(200)
      .json(await itemService.receiptStatus(email, request.body));
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (request, response, next) => {
  try {
    const email = await jwt.verify(request.cookies.access_token, process.env.JWT_SECRET).email;

    response
      .status(200)
      .json(await itemService.deleteItem(email, request.body));
  } catch (error) {
    next(error);
  }
};

export const activatePayment = async (request, response, next) => {
  try {
    response
      .status(200)
      .json(await itemService.activatePayment(request.params.paymentId));
  } catch (error) {
    next(error);
  }
};

export const countClick = async (request, response, next) => {
  try {
    response
      .status(200)
      .json(await itemService.countClick(request.params.itemId, request.socket.remoteAddress));
  } catch (error) {
    next(error);
  }
};
