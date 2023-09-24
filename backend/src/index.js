import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileupload from 'express-fileupload';

// Routes
import * as userController from './controllers/user.controller.js';
import * as itemController from './controllers/item.controller.js';
import * as businessController from './controllers/business.controller.js';

// Middleware
import authMiddleware from './middleware/auth.middleware.js';
import * as errorMiddleware from './middleware/error.middleware.js';

const app = express();
const port = 3000;

app.disable('x-powered-by');
app.use(cors());
app.use(fileupload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('./src/public', { maxAge: 0 }));

// Routes

// User Routes
app.get('/api/users', userController.indexUsers);
app.get('/api/users/:id', userController.getUser);
app.get('/api/users/get/email', authMiddleware, userController.getUserByEmail);
app.get('/api/create/stripeaccount', authMiddleware, userController.createStripeAccount);
app.get('/api/users/verify/stripe', userController.verifyStripeAccount);
app.post('/api/users/register', userController.registerUser);
app.post('/api/users/login', userController.loginUser);
app.post('/api/users/verifyotp', userController.verifyOtp);
app.post('/api/users/requpdate', authMiddleware, userController.reqUpdateUser);
app.post('/api/users/verifyupdate', authMiddleware, userController.verifyUpdateOTP);
app.delete('/api/users/delete', authMiddleware, userController.reqDeleteUser);
app.delete('/api/users/verifydelete', authMiddleware, userController.verifyDeleteOTP);

// Item Routes
app.get('/api/items', itemController.indexItems);
app.get('/api/items/cart', authMiddleware, itemController.getCart);
app.get('/api/items/reset/cart/:cartId', itemController.resetCart);
app.get('/api/items/:itemId', itemController.getItem);
app.get('/api/items/get/byholder', authMiddleware, itemController.getItemByHolder);
app.get('/api/items/user/email', authMiddleware, itemController.getItemByEmail);
app.post('/api/items/create', authMiddleware, itemController.createItem);
app.post('/api/items/update', authMiddleware, itemController.updateItem);
app.post('/api/items/addtocart', authMiddleware, itemController.addItemToCart);
app.post('/api/items/purchase', authMiddleware, itemController.purchaseItem);
app.post('/api/payment/success/:transactionId', authMiddleware, itemController.verifyPurchase);
app.post('/api/payment/cancel/:transactionId', authMiddleware, itemController.cancelPurchase);
app.post('/api/items/return', authMiddleware, itemController.returnStatus);
app.post('/api/items/receipt', authMiddleware, itemController.receiptStatus);
app.delete('/api/items/delete', authMiddleware, itemController.deleteItem);
app.get('/api/activepayment/:paymentId', itemController.activatePayment);

// Business Routes
app.get('/api/businesses', businessController.indexBusinesses);
app.post('/api/businesses/create', authMiddleware, businessController.createBusiness);
app.put('/api/businesses/update', authMiddleware, businessController.updateBusiness);
app.delete('/api/businesses/delete', authMiddleware, businessController.deleteBusiness);

// Image Routes
app.use('/uploads', express.static('uploads'));

// Sitemap
app.get('/sitemap.xml', (req, res) => {
  res.sendFile('sitemap.xml', { root: './src/' });
});

// Adsense
app.get('/Ads.txt', (req, res) => {
  res.sendFile('ads.txt', { root: './src/' });
});

app.get('*', (req, res) => res.status(200).sendFile('/index.html', { root: './src/public' }));

// // Error Routes
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

app.listen(port, '0.0.0.0', () => console.log(`Server running on ports ${port} 🌏🚀`));
