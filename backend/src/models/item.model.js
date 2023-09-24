import { v4 as uuidv4 } from 'uuid';
import db from '../commons/database.common.js';

export const indexItems = async () => (await db.query('SELECT * FROM items')).rows;

export const selectItemById = async (id) => (await db.query('SELECT * FROM items WHERE id = $1', [id])).rows[0];

export const selectItemsByUserId = async (userId) => (await db.query('SELECT * FROM items WHERE seller_id = $1', [userId])).rows;

export const selectCartByUserId = async (userId) => (await db.query('SELECT * FROM active_carts WHERE user_id = $1', [userId])).rows;

export const selectCartByTransactionId = async (transactionId) => (await db.query('SELECT * FROM active_carts WHERE transaction_id = $1', [transactionId])).rows[0];

export const selectItemsByHolderId = async (holderId) => (await db.query('SELECT * FROM items WHERE holder_id = $1', [holderId])).rows;

export const selectCartByDate = async (date, itemId) => (await db.query('SELECT * FROM active_carts WHERE date = $1 AND item_id = $2', [date, itemId])).rows[0];

export const selectCartByCartId = async (cartId) => (await db.query('SELECT * FROM active_carts WHERE id = $1', [cartId])).rows[0];

export const selectPurchaseById = async (purchaseId) => (await db.query('SELECT * FROM active_purchases WHERE id = $1', [purchaseId])).rows[0];

export const selectPurchaseByDate = async (date, itemId) => (await db.query('SELECT * FROM active_purchases WHERE date = $1 AND item_id = $2', [date, itemId])).rows[0];

export const createItem = async (item) => (
  await db.query('INSERT INTO items (id, name, description, img_dir, price, rating, location,  seller_id, external_url, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', [
    uuidv4(),
    item.name,
    item.description,
    item.imageName,
    item.price,
    null,
    item.location,
    item.sellerId,
    item.externalUrl,
    new Date(),
  ])).rows[0];

export const updateItem = async (item) => (
  await db.query('UPDATE items SET name = $1, description = $2, img_dir = $3, price = $4 WHERE id = $5 RETURNING *', [
    item.name,
    item.description,
    item.img_dir,
    item.price,
    item.id,
  ])).rows[0];

export const addItemToCart = async (cartId, itemId, date, userId, cronId) => (
  await db.query('INSERT INTO active_carts (id, item_id, date, user_id, cron_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [
    cartId,
    itemId,
    date,
    userId,
    cronId,
  ])).rows[0];

export const reqPurchaseItem = async (cartId, transactionId, stripeId, cronId) => (
  await db.query('UPDATE active_carts SET transaction_id = $1, stripe_id = $2, cron_id = $3 WHERE id = $4 RETURNING *', [
    transactionId,
    stripeId,
    cronId,
    cartId,
  ])).rows[0];

export const purchaseItem = async (userId, itemId, date) => (
  await db.query('INSERT INTO active_purchases (id, user_id, item_id, date) VALUES ($1, $2, $3, $4) RETURNING *', [
    uuidv4(),
    userId,
    itemId,
    date,
  ])).rows[0];

export const activatePayment = async (itemId, userId, purchaseId) => (
  await db.query('UPDATE items SET holder_id = $1, purchase_id = $2 WHERE id = $3 RETURNING *', [
    userId,
    purchaseId,
    itemId,
  ])).rows[0];

export const deleteCart = async (cartId) => (
  await db.query('DELETE FROM active_carts WHERE id = $1 RETURNING *', [
    cartId,
  ])).rows[0];

export const deletePurchase = async (purchaseID) => (
  await db.query('DELETE FROM active_purchases WHERE id = $1 RETURNING *', [
    purchaseID,
  ])).rows[0];

export const updateReturnStatus = async (purchaseId) => (
  await db.query('UPDATE active_purchases SET return_status = $1 WHERE id = $2 RETURNING *', [
    'pending',
    purchaseId,
  ])).rows[0];

export const updateReceiptStatus = async (purchaseId) => (
  await db.query('UPDATE active_purchases SET receipt_status = $1 WHERE id = $2 RETURNING *', [
    'pending',
    purchaseId,
  ])).rows[0];

export const resetItemHolder = async (itemId) => (
  await db.query('UPDATE items SET holder_id = $1 WHERE id = $2 RETURNING *', [
    null,
    itemId,
  ])).rows[0];

export const deleteItem = async (itemId) => (
  await db.query('DELETE FROM items WHERE id = $1 RETURNING *', [itemId])).rows[0];

export const deleteItemsByUserId = async (userId) => (
  await db.query('DELETE FROM items WHERE seller_id = $1', [userId])).rows[0];

export const countClick = async (businessId, ipAddress, itemId) => (
  await db.query('INSERT INTO click_statistics (id, business_id, ip_address, item_id) VALUES ($1, $2, $3, $4) RETURNING *', [
    uuidv4(),
    businessId,
    ipAddress,
    itemId,
  ])).rows[0];
