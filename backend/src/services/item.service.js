import ShortUniqueId from 'short-unique-id';
import cron from 'cron';

import * as itemModel from '../models/item.model.js';
import * as userModel from '../models/user.model.js';

import * as paymentCommon from '../commons/payment.common.js';

const uid = new ShortUniqueId({ length: 12 });

export const indexItems = async () => (itemModel.indexItems());

export const getItem = async (itemId) => (itemModel.selectItemById(itemId));

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

export const getItemInCart = async (email, itemId) => {
  const userId = (await userModel.selectUserByEmail(email)).id;

  if (!userId || !itemId) {
    throw new Error('User or item does not exist');
  }

  return itemModel.selectItemsByCartId(userId, itemId);
};

export const createItem = async (email, {
  name,
  description,
  price,
}, image) => {
  if (!image || Object.keys(image).length === 0) {
    throw new Error('No images were uploaded.');
  }

  const imageName = `${uid()}-${image.name}`;
  const imageDir = `./uploads/${imageName}`;

  image.mv(imageDir, (error) => {
    if (error) {
      throw new Error('Error occurred while uploading image');
    }
  });

  const sellerId = (await userModel.selectUserByEmail(email)).id;

  return itemModel.createItem({
    name, description, imageName, price, sellerId,
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
    imageName = `${uid()}-${image.name}`;
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

export const addItemToCart = async (email, { itemId }) => {
  const userId = (await userModel.selectUserByEmail(email)).id;
  const item = await itemModel.selectItemById(itemId);

  const cartExpiry = new Date(Date.now() + 10 * 60 * 1000);

  if (!item || !userId) {
    throw new Error('Item or user does not exist');
  }

  if (userId === item.seller_id) {
    throw new Error('You cannot add your own item to cart');
  }

  if (item.cart_id || item.holder_id || item.available === false) {
    throw new Error('Item already in cart or purchased');
  }

  const job = new cron.CronJob(cartExpiry, async () => {
    await itemModel.resetCartItem(itemId);

    job.stop();
  });

  job.start();

  return itemModel.addItemToCart(itemId, userId, cartExpiry);
};

export const purchaseItem = async (email, { itemId }) => {
  const userId = (await userModel.selectUserByEmail(email)).id;
  const item = await itemModel.selectItemById(itemId);

  const transactionId = uid().toLowerCase();

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
  );

  const job = new cron.CronJob(cartExpiry, async () => {
    await itemModel.resetPurchaseItem(itemId);

    job.stop();
  });

  job.start();

  await itemModel.reqPurchaseItem(itemId, transactionId, cartExpiry, payment.id);

  return payment.url;
};

export const verifyPurchase = async (email, transactionId) => {
  const userId = (await userModel.selectUserByEmail(email)).id;
  const item = await itemModel.selectItemByTransactionId(transactionId);

  if (!item || !userId) {
    throw new Error('Item or user does not exist');
  }

  if (userId !== item.cart_id) {
    throw new Error('You are not the owner of this cart');
  }

  const payment = await paymentCommon.verifyPaymentSession(item.stripe_id);

  if (!payment) {
    throw new Error('Payment failed');
  }

  await itemModel.purchaseItem(userId, item.id);

  return 'Payment successful';
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
