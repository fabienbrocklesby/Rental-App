# EZGear - Peer-to-Peer Rental Marketplace (Rental App)

## Overview

EZGear is a peer-to-peer rental marketplace designed to help users save money by renting items rather than purchasing and or make extra income by renting out items they don't use regularly. Whether you're looking to borrow or lend, EZGear has got you covered.

For more information, visit [ezgear.app](http://ezgear.app).

## Client in Developement Mode
URL: http://localhost:3000
The client is a React app... 

To run in development mode: 
```npm start```

To build for production: 
```npm run build```

Custom command to watch for changes and build for production
```npm run watch-build```

(This will be built in the public folder in the backend folder, this is ready to be served by the backend app)

## Backend & Production Build of Client
URL: http://localhost:3000
The backend is an ExpressJS app

To run in development mode: 
```npm run start```

(This requires the .env file)  

(This will run the backend application as well as the built client)

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
  external_url VARCHAR(255),
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
  updated_website VARCHAR(255),
  verified BOOLEAN NOT NULL DEFAULT false
);


CREATE TABLE click_statistics (
  id VARCHAR(255) NOT NULL,
  business_id VARCHAR(255) NOT NULL,
  ip_address INET NOT NULL,
  item_id VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

CALCULATE COST FOR BUSINESS AT END OF MONTH:
WITH ClicksWithCost AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY ip_address ORDER BY timestamp) AS click_number
  FROM click_statistics
  WHERE business_id = '$$business_id'
    AND timestamp >= NOW() - INTERVAL '1 month'
    AND timestamp <= NOW()
)
SELECT c.*,
       (click_number * 5) || 'c' AS total_cost,
       i.name AS item_name
FROM ClicksWithCost c
JOIN items i ON c.item_id = i.id
ORDER BY c.timestamp DESC;
