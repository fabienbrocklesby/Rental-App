# Rental App

## Client in Developement Mode
URL: http://localhost:3000
The client is a React app... 

To run in development mode: 
```npm start```

To build for production: 
```npm run build```

(This will output the build in the backend public folder) ready to be served by the backend which is ExpressJS)

## Backend & Production Build of Client
URL: http://localhost:3001
The backend is an ExpressJS app...

To run in development mode: 
```npm start```

(This ejects the the .env file and runs the app in development mode also running the client in via the static public folder).

## Setup Postgres DB
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(255),
  seller_rating INT,
  buyer_rating INT,
  temp_email VARCHAR(255),
  seller_verified BOOLEAN DEFAULT FALSE,
  stripe_account VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL,
  business BOOLEAN NOT NULL DEFAULT FALSE,
);

CREATE TABLE items (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  img_dir VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  rating INT,
  seller_id VARCHAR(255) NOT NULL,
  cart_id VARCHAR(255),
  cart_expires_at TIMESTAMP,
  holder_id VARCHAR(255) DEFAULT NULL,
  available BOOLEAN DEFAULT TRUE,
  transaction_id VARCHAR(255) DEFAULT NULL,
  stripe_id VARCHAR(255) DEFAULT NULL,
  return_status VARCHAR(12) DEFAULT NULL,
  receipt_status VARCHAR(12) DEFAULT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE active_purchases (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  item_id VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  return_statuts VARCHAR(12),
  receipt_status VARCHAR(12)
);

CREATE TABLE active_carts (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  item_id VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  transaction_id VARCHAR(255),
  stripe_id VARCHAR(255),
  cron_id VARCHAR(255)
);

CREATE TABLE businesses (
  id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  website VARCHAR(255) NOT NULL,
  updated_website VARCHAR(255) NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false
);


CREATE TABLE click_statistics (
  id VARCHAR(255) NOT NULL,
  business_id VARCHAR(255) NOT NULL,
  ip_address INET NOT NULL,
  item_id VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);