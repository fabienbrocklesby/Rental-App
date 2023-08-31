import { v4 as uuidv4 } from 'uuid';

import * as itemModel from '../models/item.model.js';
import * as userModel from '../models/user.model.js';

import emailHelper from '../commons/email.common.js';
import * as paymentCommon from '../commons/payment.common.js';
import scheduleCronJob from '../commons/cron.common.js';

export const indexItems = async () => (itemModel.indexItems());

export const getItem = async (itemId) => (itemModel.selectItemById(itemId));

export const getCart = async (email) => {
  const userId = (await userModel.selectUserByEmail(email)).id;

  if (!userId) {
    throw new Error('User does not exist');
  }

  return itemModel.selectCartByUserId(userId);
};

export const getItemByEmail = async (email) => {
  const userId = (await userModel.selectUserByEmail(email)).id;

  if (!userId) {
    throw new Error('User does not exist');
  }

  return itemModel.selectItemsByUserId(userId);
};

export const getItemByHolder = async (email) => {
  const userId = (await userModel.selectUserByEmail(email)).id;

  if (!userId) {
    throw new Error('User does not exist');
  }

  return itemModel.selectItemsByHolderId(userId);
};

export const resetCart = async (data) => {
  const { itemId } = data;

  if (!itemId) {
    throw new Error('Invalid request');
  }

  return itemModel.resetCartItem(itemId);
};

export const createItem = async (email, {
  name,
  description,
  price,
  location,
}, image) => {
  const user = await userModel.selectUserByEmail(email);

  if (user.seller_verified === false || !user.stripe_account) {
    throw new Error('You are not a verified seller');
  }

  if (!image || Object.keys(image).length === 0) {
    throw new Error('No images were uploaded.');
  }

  const imageName = `${uuidv4()}-${image.name}`;
  const imageDir = `./uploads/${imageName}`;

  image.mv(imageDir, (error) => {
    if (error) {
      throw new Error('Error occurred while uploading image');
    }
  });

  const sellerId = (await userModel.selectUserByEmail(email)).id;

  return itemModel.createItem({
    name, description, imageName, price, location, sellerId,
  });
};

export const updateItem = async (
  email,
  newItem,
  image,
) => {
  let imageName;
  let imageDir;

  const item = await itemModel.selectItemById(newItem.id);

  if (!item) {
    throw new Error('Item does not exist');
  } else if (item.seller_id !== (await userModel.selectUserByEmail(email)).id) {
    throw new Error('You are not the owner of this item');
  }

  if (image) {
    imageName = `${uuidv4()}-${image.name}`;
    imageDir = `./uploads/${imageName}`;

    image.mv(imageDir, (error) => {
      if (error) {
        throw new Error('Error occurred while uploading image');
      }
    });
  }

  const updatedItem = {
    ...item,
    ...{
      name: newItem.name || item.name,
      description: newItem.description || item.description,
      price: newItem.price || item.price,
      img_dir: imageName || item.img_dir,
    },
  };

  return itemModel.updateItem(updatedItem);
};

export const addItemToCart = async (email, { itemId, bookingDate }) => {
  const userId = (await userModel.selectUserByEmail(email)).id;
  const item = await itemModel.selectItemById(itemId);

  const cartExpiry = new Date(Date.now() + 10 * 60 * 1000);

  if (!item || !userId) {
    throw new Error('Item, booking date, or user does not exist');
  }

  if (!bookingDate) {
    throw new Error('Missing booking date');
  }

  const parsedBookingDate = new Date(bookingDate);

  parsedBookingDate.setHours(0, 0, 0, 0);

  const bookingTimestamp = parsedBookingDate.getTime();

  if (item && Array.isArray(item.unavailable_dates)) {
    if (item.unavailable_dates.some((date) => new Date(date).getTime() === bookingTimestamp)) {
      throw new Error('Item is unavailable on the selected booking date');
    }
  }

  if (userId === item.seller_id) {
    throw new Error('You cannot add your own item to cart');
  }

  if (item.cart_id || item.holder_id || item.available === false) {
    throw new Error('Item already in cart or purchased');
  }

  await scheduleCronJob(`/api/items/reset/cart/${item.id}`);

  return itemModel.addItemToCart(itemId, parsedBookingDate, userId, cartExpiry);
};

export const purchaseItem = async (email, { itemId }) => {
  const userId = (await userModel.selectUserByEmail(email)).id;
  const item = await itemModel.selectItemById(itemId);

  const sellerStripeAccount = (await userModel.selectUserById(item.seller_id)).stripe_account;

  const transactionId = uuidv4().toLowerCase();

  const cartExpiry = new Date(Date.now() + 10 * 60 * 1000);

  if (!item || !userId) {
    throw new Error('Item or user does not exist');
  }

  if (!item.cart_id) {
    throw new Error('Item not in cart');
  }

  if (userId !== item.cart_id) {
    throw new Error('You are not the owner of this cart');
  }

  const payment = await paymentCommon.createPaymentSession(
    item.price,
    item.name,
    transactionId,
    sellerStripeAccount,
  );

  await scheduleCronJob(`/api/items/reset/cart/${item.id}`);

  await itemModel.reqPurchaseItem(itemId, transactionId, cartExpiry, payment.id);

  return payment.url;
};

export const verifyPurchase = async (email, transactionId) => {
  const userId = (await userModel.selectUserByEmail(email)).id;
  const item = await itemModel.selectItemByTransactionId(transactionId);

  const sellerEmail = (await userModel.selectUserById(item.seller_id)).email;

  if (!item || !userId) {
    throw new Error('Item or user does not exist');
  }

  if (userId !== item.cart_id) {
    throw new Error('You are not the owner of this cart');
  }

  if (!sellerEmail) {
    throw new Error('Seller does not exist');
  }

  await emailHelper({
    email: sellerEmail,
    message: `Somebody has rented your EZGear listing: ${item.name} (https://ezgear.app/items/${item.id}). <br /> Here is the buyer's email, contact them to arrange the collection: ${email}`,
  });

  const payment = await paymentCommon.verifyPaymentSession(item.stripe_id);

  if (!payment) {
    throw new Error('Payment failed');
  }

  await itemModel.purchaseItem(userId, item.id);

  return {
    message: 'Payment successful',
    sellerEmail,
  };
};

export const cancelPurchase = async (email, transactionId) => {
  const userId = (await userModel.selectUserByEmail(email)).id;
  const item = await itemModel.selectItemByTransactionId(transactionId);

  if (!item || !userId) {
    throw new Error('Item or user does not exist');
  }

  if (userId !== item.cart_id) {
    throw new Error('You are not the owner of this cart');
  }

  await itemModel.resetPurchaseItem(item.id);

  return 'Payment cancelled';
};

export const returnStatus = async (email, { itemId }) => {
  const userId = (await userModel.selectUserByEmail(email)).id;
  const item = await itemModel.selectItemById(itemId);

  if (!item || !userId) {
    throw new Error('Item or user does not exist');
  }

  if (userId !== item.holder_id) {
    throw new Error('You are not the owner of this item');
  }

  if (item.return_status === 'pending') {
    throw new Error('Return request already pending');
  }

  if (item.receipt_status === 'pending') {
    await itemModel.resetPurchaseItem(item.id);

    return 'Item Returned';
  }

  await itemModel.updateReturnStatus(item.id);

  return 'Return request sent';
};

export const receiptStatus = async (email, { itemId }) => {
  const userId = (await userModel.selectUserByEmail(email)).id;
  const item = await itemModel.selectItemById(itemId);

  if (!item || !userId) {
    throw new Error('Item or user does not exist');
  }

  if (userId !== item.seller_id) {
    throw new Error('You are not the seller of this item');
  }

  if (item.receipt_status === 'pending') {
    throw new Error('Receipt request already pending');
  }

  if (item.return_status === 'pending') {
    await itemModel.resetPurchaseItem(item.id);

    return 'Receipt Sent';
  }

  await itemModel.updateReceiptStatus(item.id);

  return 'Receipt request sent';
};

export const deleteItem = async (email, { itemId }) => {
  const userId = (await userModel.selectUserByEmail(email)).id;
  const item = await itemModel.selectItemById(itemId);

  if (!item || !userId) {
    throw new Error('Item or user does not exist');
  }

  if (userId !== item.seller_id) {
    throw new Error('You are not the seller of this item');
  }

  if (item.cart_id || item.holder_id || item.available === false) {
    throw new Error('Item in cart or purchased');
  }

  await itemModel.deleteItem(item.id);

  return 'Item deleted';
};
