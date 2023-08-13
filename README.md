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
  id VARCHAR(10) PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(255),
  seller_rating INT,
  buyer_rating INT,
  temp_email VARCHAR(255),
  seller_verified BOOLEAN DEFAULT FALSE,
  stripe_account VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE items (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  img_dir VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  rating INT,
  seller_id VARCHAR(10) NOT NULL,
  cart_id VARCHAR(10),
  cart_expires_at TIMESTAMP,
  holder_id VARCHAR(10) DEFAULT NULL,
  available BOOLEAN DEFAULT TRUE,
  transaction_id VARCHAR(12) DEFAULT NULL,
  stripe_id VARCHAR(255) DEFAULT NULL,
  return_status VARCHAR(12) DEFAULT NULL,
  receipt_status VARCHAR(12) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (seller_id) REFERENCES users(id)
);
