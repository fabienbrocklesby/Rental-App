import { v4 as uuidv4 } from 'uuid';
import Jimp from 'jimp';

import * as itemModel from '../models/item.model.js';
import * as userModel from '../models/user.model.js';
import * as businessModel from '../models/business.model.js';

import emailHelper from '../commons/email.common.js';
import * as paymentCommon from '../commons/payment.common.js';
import { scheduleCronJob, deleteCronJob } from '../commons/cron.common.js';
import getCurrentTimeInAuckland from '../commons/time.common.js';

import {
  validateId,
  validateName,
  validateDescription,
  validatePrice,
  validateLocation,
  validateExternalUrl,
  validateIpAddress,
} from '../validators/item.validator.js';
import { validateEmail } from '../validators/user.validator.js';

const currentTimeInAuckland = await getCurrentTimeInAuckland();

export const indexItems = async () => (itemModel.indexItems());

export const getItem = async (itemId) => (itemModel.selectItemById(itemId));

export const getCart = async (email) => {
  const userId = (await userModel.selectUserByEmail(email)).id;

  if (!userId) {
    throw new Error('User does not exist');
  }

  const cartItems = await itemModel.selectCartByUserId(userId);

  const itemDetailsPromises = cartItems.map(async (cartItem) => {
    const itemDetails = await itemModel.selectItemById(cartItem.item_id);
    return {
      id: cartItem.item_id,
      name: itemDetails.name,
      cartId: cartItem.id,
    };
  });

  const itemDetails = await Promise.all(itemDetailsPromises);

  return itemDetails;
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
  const { cartId } = data;

  if (!cartId) {
    throw new Error('Invalid request');
  }

  const cart = await itemModel.selectCartByCartId(cartId);

  await deleteCronJob(cart.cron_id);

  return itemModel.deleteCart(cartId);
};

export const createItem = async (email, {
  name,
  description,
  price,
  location,
  externalUrl,
}, image) => {
  // validate data
  await validateName({ name }, ['name']);
  await validateDescription({ description }, ['description']);
  await validatePrice({ price }, ['price']);
  await validateLocation({ location }, ['location']);
  await validateEmail({ email }, ['email']);
  const user = await userModel.selectUserByEmail(email);

  if (user.seller_verified === false || !user.stripe_account) {
    throw new Error('You are not a verified seller');
  }

  if (!image || Object.keys(image).length === 0) {
    throw new Error('No images were uploaded.');
  }

  console.log(image.name);
  console.log(image);

  const imageName = `${uuidv4()}-${image.name}.webp`;
  const imageDir = `./uploads/${imageName}`;

  const jimpImage = await Jimp.read(image.data);
  await jimpImage
    .resize(800, Jimp.AUTO)
    .quality(75)
    .write(`${imageDir}`);

  const sellerId = (await userModel.selectUserByEmail(email)).id;

  if (externalUrl) {
    await validateExternalUrl({ externalUrl }, ['externalUrl']);
    const business = await businessModel.getBusinessByUserId(sellerId);

    if (!business || !business.verified) {
      throw new Error('You do not have a business associated with your account');
    }

    const externalUrlHostname = new URL(externalUrl).hostname;
    const businessWebsiteHostname = new URL(business.website).hostname;

    if (externalUrlHostname !== businessWebsiteHostname) {
      throw new Error('The external URL is not from the same domain as your business website');
    }
  }

  return itemModel.createItem({
    name, description, imageName, price, location, sellerId, externalUrl,
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
    imageName = `${uuidv4()}-${image.name}.webp`;
    imageDir = `./uploads/${imageName}`;

    const jimpImage = await Jimp.read(image.data);
    await jimpImage
      .resize(800, Jimp.AUTO)
      .quality(75)
      .write(`${imageDir}`);
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

export const addItemToCart = async (email, { itemId, startDate, endDate }) => {
  const userId = (await userModel.selectUserByEmail(email)).id;
  const item = await itemModel.selectItemById(itemId);

  const cartId = uuidv4().toLowerCase();

  const futureTime = new Date(currentTimeInAuckland);
  futureTime.setMinutes(futureTime.getMinutes() + 10);

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (!item) {
    throw new Error('Item does not exist');
  } else if (!userId) {
    throw new Error('User does not exist');
  } else if (userId === item.seller_id) {
    throw new Error('You cannot add your own item to cart');
  } else if (start > end) {
    throw new Error('Start date must be before end date');
  } else {
    const overlappingCart = await itemModel.selectCartByDate({ start, end }, itemId);
    const overlappingPurchase = await itemModel.selectPurchaseByDate({ start, end }, itemId);
    if (overlappingCart || overlappingPurchase) {
      throw new Error('Item unavailable on selected dates');
    } else if ((end - start) / (1000 * 60 * 60 * 24) > 7) {
      throw new Error('Booking cannot be longer than 7 days');
    }
  }

  const dates = { start: startDate, end: endDate };
  const cronId = await scheduleCronJob(`/api/items/reset/cart/${cartId}`, futureTime);

  return (await itemModel.addItemToCart(cartId, itemId, dates, userId, cronId)).id;
};

export const getUnavailableDates = async (itemId) => {
  const carts = await itemModel.selectCartsByItemId(itemId);
  const purchases = await itemModel.selectPurchasesByItemId(itemId);

  const unavailableDates = [];

  carts.forEach((cart) => {
    if (cart.date && cart.date.start && cart.date.end) {
      const start = new Date(cart.date.start);
      const end = new Date(cart.date.end);

      while (start <= end) {
        unavailableDates.push({ date: start.toISOString().split('T')[0] });
        start.setDate(start.getDate() + 1);
      }
    }
  });

  purchases.forEach((purchase) => {
    if (purchase.date && purchase.date.start && purchase.date.end) {
      const start = new Date(purchase.date.start);
      const end = new Date(purchase.date.end);

      while (start <= end) {
        unavailableDates.push({ date: start.toISOString().split('T')[0] });
        start.setDate(start.getDate() + 1);
      }
    }
  });

  return unavailableDates;
};

export const purchaseItem = async (email, { itemId, cartId }) => {
  const userId = (await userModel.selectUserByEmail(email)).id;
  const item = await itemModel.selectItemById(itemId);
  const cart = await itemModel.selectCartByCartId(cartId);

  const transactionId = uuidv4().toLowerCase();

  const futureTime = new Date(currentTimeInAuckland);
  futureTime.setMinutes(futureTime.getMinutes() + 30);

  if (!item) {
    throw new Error('Item does not exist');
  } else if (!userId) {
    throw new Error('User does not exist');
  } else if (!cart) {
    throw new Error('No cart exists with this ID');
  } else if (cart.user_id !== userId) {
    throw new Error('You are not the owner of this cart');
  } else if (cart.item_id !== item.id) {
    throw new Error('Item in cart is not item provided');
  }

  const sellerStripeAccount = (await userModel.selectUserById(item.seller_id)).stripe_account;

  const start = new Date(cart.date.start);
  const end = new Date(cart.date.end);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const payment = await paymentCommon.createPaymentSession(
    item.price * days,
    item.name,
    transactionId,
    sellerStripeAccount,
  );

  await deleteCronJob(cart.cron_id);
  const cronId = await scheduleCronJob(`/api/items/reset/cart/${cart.id}`, futureTime);

  await itemModel.reqPurchaseItem(cartId, transactionId, payment.id, cronId);

  return payment.url;
};

export const verifyPurchase = async (email, transactionId) => {
  try {
    const userId = (await userModel.selectUserByEmail(email)).id;
    const cart = await itemModel.selectCartByTransactionId(transactionId);

    if (!cart) {
      throw new Error('Cart does not exist for this transaction ID');
    } else if (cart.user_id !== userId) {
      throw new Error('You are not the owner of this cart');
    }

    const item = await itemModel.selectItemById(cart.item_id);

    if (!item) {
      throw new Error('Item does not exist');
    }

    const sellerEmail = (await userModel.selectUserById(item.seller_id)).email;

    if (!sellerEmail) {
      throw new Error('Seller does not exist');
    }

    const payment = await paymentCommon.verifyPaymentSession(cart.stripe_id);

    if (!payment) {
      throw new Error('Payment failed');
    }

    await emailHelper({
      email: sellerEmail,
      message: `Somebody has rented your EZGear listing: ${item.name} (https://ezgear.app/items/${item.id}). <br /> Here is the buyer's email, contact them to arrange the collection: ${email}`,
    });

    const activePayment = await itemModel.purchaseItem(userId, item.id, cart.date);

    const futureTime = new Date();
    futureTime.setMinutes(futureTime.getMinutes() + 1);

    const cartDate = new Date(cart.date);

    if (
      cartDate.getDate() === futureTime.getDate()
      && cartDate.getMonth() === futureTime.getMonth()
      && cartDate.getFullYear() === futureTime.getFullYear()
    ) {
      await scheduleCronJob(`/api/activepayment/${activePayment.id}`, futureTime);
    } else {
      const cartDateMidnight = new Date(cart.date);
      cartDateMidnight.setHours(0, 0, 0, 0);
      await scheduleCronJob(`/api/activepayment/${activePayment.id}`, cartDateMidnight);
    }

    return {
      message: 'Payment successful',
      sellerEmail,
    };
  } catch (error) {
    return error;
  }
};

export const cancelPurchase = async (email, transactionId) => {
  const userId = (await userModel.selectUserByEmail(email)).id;
  const cart = await itemModel.selectCartByTransactionId(transactionId);

  if (!cart) {
    throw new Error('Cart does not exist with this ID');
  } else if (!userId) {
    throw new Error('User does not exist');
  } else if (userId !== cart.user_id) {
    throw new Error('You are not the owner of this cart');
  }

  await itemModel.deleteCart(cart.id);

  return 'Payment cancelled';
};

export const returnStatus = async (email, { itemId }) => {
  const userId = (await userModel.selectUserByEmail(email)).id;
  const item = await itemModel.selectItemById(itemId);

  if (!item) {
    throw new Error('Item does not exist');
  } else if (!userId) {
    throw new Error('User does not exist');
  }

  const purchase = await itemModel.selectPurchaseById(item.purchase_id);

  if (!purchase) {
    throw new Error('No purchase exists with this ID');
  } else if (userId !== item.holder_id || userId !== purchase.user_id) {
    throw new Error('You are not the owner of this item');
  } else if (purchase.return_status === 'pending') {
    throw new Error('Return request already pending');
  } else if (item.receipt_status === 'pending') {
    await itemModel.deletePurchase(purchase.id);
    await itemModel.resetItemHolder(item.id);

    return 'Item Returned';
  }

  await itemModel.updateReturnStatus(purchase.id);

  return 'Return request sent';
};

export const receiptStatus = async (email, { itemId }) => {
  const userId = (await userModel.selectUserByEmail(email)).id;
  const item = await itemModel.selectItemById(itemId);

  if (!item) {
    throw new Error('Item does not exist');
  } else if (!userId) {
    throw new Error('User does not exist');
  }

  const purchase = await itemModel.selectPurchaseById(item.purchase_id);

  if (!purchase) {
    throw new Error('No purchase exists with this ID');
  }

  if (userId !== item.seller_id) {
    throw new Error('You are not the seller of this item');
  }

  if (purchase.receipt_status === 'pending') {
    throw new Error('Receipt request already pending');
  }

  if (purchase.return_status === 'pending') {
    console.log(item.id);
    await itemModel.resetItemHolder(item.id);
    await itemModel.deletePurchase(purchase.id);

    return 'Receipt Sent';
  }

  await itemModel.updateReceiptStatus(purchase.id);

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

export const activatePayment = async (paymentId) => {
  const purchase = await itemModel.selectPurchaseById(paymentId);

  if (!purchase) {
    throw new Error('No purchase exists with this ID');
  } else if (purchase.date.getDate() !== new Date(currentTimeInAuckland).getDate()) {
    throw new Error('Invalid date provided');
  }

  return itemModel.activatePayment(purchase.item_id, purchase.user_id, purchase.id);
};

export const countClick = async (itemId, ipAddress) => {
  await validateId({ id: itemId }, ['id']);
  await validateIpAddress({ ipAddress }, ['ipAddress']);

  const item = await itemModel.selectItemById(itemId);

  if (!item) {
    throw new Error('Item does not exist');
  } if (!item.external_url) {
    throw new Error('Item does not have an external URL');
  }

  const business = await businessModel.getBusinessByUserId(item.seller_id);

  if (!business) {
    throw new Error('Business does not exist');
  }

  return itemModel.countClick(business.id, ipAddress, itemId);
};
