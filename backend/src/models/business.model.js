import { v4 as uuid } from 'uuid';

import db from '../commons/database.common.js';

// Get
export const indexBusinesses = async () => (await db.query('SELECT * FROM businesses')).rows;
export const getBusinessByWebsite = async (website) => (await db.query('SELECT * FROM businesses WHERE website = $1', [website])).rows[0];
export const getBusinessByUserId = async (userId) => (await db.query('SELECT * FROM businesses WHERE user_id = $1', [userId])).rows[0];

// Create
export const createBusiness = async (website, userId) => (await db.query('INSERT INTO businesses (id, website, user_id) VALUES ($1, $2, $3) RETURNING *', [uuid(), website, userId])).rows[0];

// Update
export const updateBusiness = async (website, userId) => (await db.query('UPDATE businesses SET updated_website = $1, verified = $2 WHERE user_id = $3 RETURNING *', [website, false, userId])).rows[0];

// Delete
export const deleteBusiness = async (userId) => (await db.query('DELETE FROM businesses WHERE user_id = $1 RETURNING *', [userId])).rows[0];
