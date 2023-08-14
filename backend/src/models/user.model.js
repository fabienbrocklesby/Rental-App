import { v4 as uuidv4 } from 'uuid';
import db from '../commons/database.common.js';

// eslint-disable-next-line import/prefer-default-export
export const createUser = async (user) => (
  await db.query('INSERT INTO users (id, username, email, otp, seller_rating, buyer_rating, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [
    uuidv4(),
    user.username,
    user.email,
    user.otp,
    null,
    null,
    new Date(),
  ])).rows[0];

export const indexUsers = async () => (
  db.query('SELECT * FROM users').rows);

export const selectUserById = async (id) => (
  await db.query('SELECT * FROM users WHERE id = $1', [id])).rows[0];

export const selectUserByEmail = async (email) => (
  await db.query('SELECT * FROM users WHERE email = $1', [email])).rows[0];

export const selectUserByUsername = async (username) => (
  await db.query('SELECT * FROM users WHERE username = $1', [username])).rows[0];

export const setStripeAccount = async (user) => (
  await db.query('UPDATE users SET stripe_account = $1, seller_verified = false WHERE id = $2 RETURNING *', [user.accountId, user.userId])).rows[0];

export const setSellerVerified = async (id) => (
  await db.query('UPDATE users SET seller_verified = true WHERE id = $1 RETURNING *', [id])).rows[0];

export const updateOTP = async (user) => (
  await db.query('UPDATE users SET otp = $1 WHERE email = $2 RETURNING *', [user.otp, user.email])).rows[0];

export const updateUser = async (user) => (
  await db.query('UPDATE users SET username = $1, email = $2, temp_email = $3 WHERE id = $4 RETURNING *', [user.username, user.email, user.temp_email, user.id])).rows[0];

export const deleteUser = async (user) => (
  await db.query('DELETE FROM users WHERE username = $1 RETURNING *', [user])).rows[0];
