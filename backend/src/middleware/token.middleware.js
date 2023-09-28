import jwt from 'jsonwebtoken';

export default (async ({
  username,
  email,
}) => (
  jwt.sign({ username, email }, process.env.JWT_SECRET, { expiresIn: '7d' })));
