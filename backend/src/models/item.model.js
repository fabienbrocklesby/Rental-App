import ShortUniqueId from 'short-unique-id';
import db from '../commons/database.common.js';

const uid = new ShortUniqueId({
  dictionary: 'alpha_lower',
  length: 6,
});

export const indexItems = async () => (await db.query('SELECT * FROM items')).rows;

export const selectItemById = async (id) => (await db.query('SELECT * FROM items WHERE id = $1', [id])).rows[0];

export const selectItemByTransactionId = async (transactionId) => (await db.query('SELECT * FROM items WHERE transaction_id = $1', [transactionId])).rows[0];

export const createItem = async (item) => (
  await db.query('INSERT INTO items (id, name, description, img_dir, price, rating, seller_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [
    uid(),
    item.name,
    item.description,
    item.imageName,
    item.price,
    null,
    item.sellerId,
    new Date(),
  ])).rows[0];

export const updateItem = async (item) => (
  await db.query('UPDATE items SET name = $1, description = $2, img_dir = $3, price = $4 WHERE id = $5 RETURNING *', [
    item.name,
    item.description,
    item.imgdir,
    item.price,
    item.id,
  ])).rows[0];

export const addItemToCart = async (itemId, userId, cartExpiry) => (
  await db.query('UPDATE items SET cart_id = $1, cart_expires_at = $2 WHERE id = $3 RETURNING *', [
    userId,
    cartExpiry,
    itemId,
  ])).rows[0];

export const resetCartItem = async (itemId) => (
  await db.query('UPDATE items SET cart_id = $1, cart_expires_at = $2 WHERE id = $3 RETURNING *', [
    null,
    null,
    itemId,
  ])).rows[0];

export const reqPurchaseItem = async (itemId, transactionId, cartExpiry, stripeId) => (
  await db.query('UPDATE items SET transaction_id = $1, cart_expires_at = $2, stripe_id = $3 WHERE id = $4 RETURNING *', [
    transactionId,
    cartExpiry,
    stripeId,
    itemId,
  ])).rows[0];

export const purchaseItem = async (userId, itemId) => (
  await db.query('UPDATE items SET holder_id = $1, transaction_id = $2, available = $3, stripe_id = $4 WHERE id = $5 RETURNING *', [
    userId,
    null,
    false,
    null,
    itemId,
  ])).rows[0];

export const resetPurchaseItem = async (itemId) => (
  await db.query('UPDATE items SET holder_id = $1, transaction_id = $2, available = $3, cart_id = $4, cart_expires_at = $5, stripe_id = $6, return_status = $7, receipt_status = $8 WHERE id = $9 RETURNING *', [
    null,
    null,
    true,
    null,
    null,
    null,
    null,
    null,
    itemId,
  ])).rows[0];

export const updateReturnStatus = async (itemId) => (
  await db.query('UPDATE items SET return_status = $1 WHERE id = $2 RETURNING *', [
    'pending',
    itemId,
  ])).rows[0];

export const updateReceiptStatus = async (itemId) => (
  await db.query('UPDATE items SET receipt_status = $1 WHERE id = $2 RETURNING *', [
    'pending',
    itemId,
  ])).rows[0];

export const deleteItem = async (itemId) => (
  await db.query('DELETE FROM items WHERE id = $1 RETURNING *', [itemId])).rows[0];

export const deleteItemsByUserId = async (userId) => (
  await db.query('DELETE FROM items WHERE seller_id = $1', [userId])).rows[0];
