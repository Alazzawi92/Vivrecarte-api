# vivreCard

# Creation du user en sql 
```sql

 
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  verification_token VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  last_seen DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
 ```

```sh


 backend/
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │
│   ├── repositories/
│   │   ├── user.repository.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── geo.service.js
│   │   ├── mail.service.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── validate.middleware.js
│   │
│   ├── validations/
│   │   ├── auth.schema.js
│   │
│   └── app.js
│
├── server.js
├── .env
└── package.json

```


https://wazabi64000.github.io/vivreCard/