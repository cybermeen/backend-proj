# Backend Project Learning Guide

This project is a small Node.js + Express backend that handles user registration and login, stores data in PostgreSQL, hashes passwords, validates API keys, and returns JSON responses.

## 1. What this project is doing

At a high level, the app receives HTTP requests, routes them to the right handler, talks to a database, and returns a response.

Example flow for login:

1. A client sends a POST request to `/auth/login`.
2. Express receives the request.
3. Middleware checks whether the API key is valid.
4. The controller validates the incoming username/password.
5. The service uses the model layer to query the database.
6. The app returns a JSON response such as `Login successful` or an error message.

---

## 2. The big picture: how the project is organized

The project uses a common backend structure:

- `server.js` — entry point; starts the app
- `src/routes/` — maps URLs to controller functions
- `src/controllers/` — handles request/response logic
- `src/services/` — contains business logic
- `src/models/` — talks to the database
- `src/utils/` — reusable helper logic
- `src/config/` — configuration such as database connection

This separation is important because it keeps the code cleaner and easier to maintain.

---

## 3. Node.js and Express basics

### What is Node.js?

Node.js lets JavaScript run outside the browser, usually on the server.

That means you can use JavaScript to:

- create web servers
- handle API requests
- connect to databases
- build backend logic

### What is Express?

Express is a framework for Node.js that makes it easier to build HTTP servers and APIs.

In this project, Express is used to:

- define routes
- read request data from the body
- send JSON responses
- run middleware before requests reach controllers

---

## 4. How the app starts

The file `server.js` is the startup file.

It does the following:

1. imports Express
2. imports CORS
3. imports the API key middleware
4. imports the auth routes
5. creates the app
6. enables JSON parsing
7. attaches middleware
8. mounts the auth routes under `/auth`
9. starts listening on port `3000`

### Important syntax

```js
const express = require('express');
```

This means:

- `const` creates a constant variable
- `express` is the imported module
- `require()` loads a package or local file

### Why `module.exports` matters

At the end of files like the controller and models, you see:

```js
module.exports = { register, login };
```

That exposes the functions so other files can import them.

Example:

```js
const controller = require('../controllers/authController');
```

This is how one file can use code from another file.

---

## 5. Routing and request flow

Routes are defined in `src/routes/authRoutes.js`.

```js
router.post('/register', controller.register);
router.post('/login', controller.login);
```

That means:

- when the client sends a POST request to `/auth/register`, the `register` controller runs
- when the client sends a POST request to `/auth/login`, the `login` controller runs

### Request lifecycle

A request generally follows this path:

1. browser/client sends HTTP request
2. Express receives it
3. middleware runs
4. route matches the URL
5. controller handles the request
6. service performs business logic
7. model talks to PostgreSQL
8. response is returned to the client

---

## 6. Controllers, services, and models

This project uses a layered pattern.

### Controller

The controller is responsible for:

- receiving the request
- validating input
- calling the service
- sending the response

It should not contain heavy database logic.

### Service

The service contains business logic.

Example: when the user tries to log in, the service decides:

- does the user exist?
- is the password correct?
- is the account active?

### Model

The model handles database queries.

Example: `findByUsername()` queries the `users` table.

This separation is very important because it keeps code organized.

---

## 7. The database connection

The file `src/config/db.js` creates the PostgreSQL connection pool.

```js
const { Pool } = require('pg');
```

A pool is a group of reusable database connections. Instead of creating a brand-new connection for every query, the app reuses connections efficiently.

The database settings come from environment variables:

- `DB_USER`
- `DB_HOST`
- `DB_NAME`
- `DB_PASSWORD`
- `DB_PORT`

This is good practice because sensitive values are not hardcoded into the source code.

---

## 8. How the registration flow works

The registration flow is in the controller and service.

### Controller step

The controller receives the request body:

```js
const { username, email, password, status, user_role_id, created_by } = req.body;
```

This is called destructuring. It pulls specific values from the request body into variables.

### Validation

The code checks whether the required fields exist.

```js
if (!username || !email || !password || !user_role_id) {
```

If something is missing, the server returns a 400 response.

### Service step

The controller calls:

```js
await authService.registerUser({...})
```

The service then checks whether the username or email already exists.

```js
const existingUser = await userModel.findByUsernameOrEmail(username, email);
```

If a user already exists, it throws an error with a custom code.

### Password hashing

The password is hashed before storing it.

```js
const hashedPassword = await hashPassword(password);
```

Hashing is important because you never want to store raw passwords.

### Database insert

The model inserts the new user into the `users` table.

---

## 9. How the login flow works

The login flow is slightly more complex because it checks credentials and account state.

### Step 1: Validate required fields

```js
if (!username || !password) {
```

If username or password is missing, the request is rejected.

### Step 2: Validate API key

The controller checks if an API key was provided and whether it is valid.

This is done by querying the `api_key` table.

### Step 3: Call the service

```js
const user = await authService.loginUser({ username, password });
```

### Step 4: Service checks the user

The service tries to find the user by username.

If no user is found, it throws an error.

If the password does not match, it also throws an error.

If the account is inactive, it throws another error.

### Step 5: Return a safe user object

The service removes the password from the object before returning it.

```js
const { password: _removed, ...safeUser } = user;
```

This is important because the password should never be returned to the client.

---

## 10. The meaning of `async` and `await`

This project uses asynchronous programming heavily because database queries take time.

### Why asynchronous?

A database query does not finish instantly. If the code waited for the database synchronously, the whole server would block.

### `async`

```js
async function login(req, res) {
```

This tells JavaScript that the function contains asynchronous work.

### `await`

```js
const user = await authService.loginUser({ username, password });
```

`await` pauses the function until the promise resolves, while allowing other work to continue.

### Promise

A promise is a placeholder for a value that will exist later.

Think of it like this:

- “I am asking for data from the database.”
- “I will continue when the database responds.”

This is the heart of modern Node.js code.

---

## 11. Common JS syntax you need to understand

### `const`

Used for variables whose value should not be reassigned.

```js
const express = require('express');
```

### `require()`

Loads another module.

```js
const authService = require('../services/authService');
```

### `module.exports`

Makes functions or objects available to other files.

```js
module.exports = { register, login };
```

### object destructuring

```js
const { username, password } = req.body;
```

This extracts values from an object.

### function declarations

```js
async function login(req, res) {
```

### try/catch

Used to catch errors gracefully.

```js
try {
  // code that might fail
} catch (err) {
  // handle the error
}
```

---

## 12. HTTP status codes used in this project

These are important because they tell the client what happened.

- `200` — success
- `201` — created successfully
- `400` — bad request / missing input
- `401` — unauthorized / missing API key or invalid credentials
- `403` — forbidden / inactive API key or inactive account
- `409` — conflict / duplicate user
- `500` — server error

### Why status codes matter

They make APIs predictable and easier for frontend apps to use.

---

## 13. Middleware explained

Middleware is code that runs before your main route handler.

In this project, `apiKeyMiddleware` is registered in `server.js`:

```js
app.use(apiKeyMiddleware);
```

That means every request passes through it first.

Middleware can:

- validate input
- check authentication
- log requests
- modify the request or response

### Why middleware is useful

It keeps repeated logic in one place instead of copying it into every controller.

---

## 14. The API key validation concept

The project includes an `api_key` table in PostgreSQL.

The model checks whether the provided key exists and is active.

```js
SELECT * FROM api_key WHERE authkey = $1 AND active = true
```

This is a very common pattern in APIs.

### Why use API keys?

API keys help:

- identify trusted clients
- restrict access to certain users or services
- protect endpoints from unauthorized use

---

## 15. Password hashing explained

Passwords should never be stored as plain text.

This project uses `bcrypt`.

### Why hash passwords?

If a database is leaked, attackers should not immediately get the real passwords.

Hashing is one-way encryption. You can verify a password later, but you cannot easily recover the original password.

The project uses:

- `hashPassword()` to create a salted hash
- `comparePassword()` to compare the user input with the stored hash

---

## 16. Error handling pattern in this project

The app uses custom error codes and messages.

Example:

```js
const error = new Error('Invalid username or password');
error.code = 'INVALID_CREDENTIALS';
throw error;
```

This is a very useful pattern because the controller can react differently depending on the error.

### Example

```js
if (err.code === 'INVALID_CREDENTIALS') {
  return res.status(401).json({ error: err.message });
}
```

This makes the response clear and specific.

---

## 17. What changed in the refactor

You asked to move error messages out of the controller and into a reusable utility file.

That is now handled in `src/utils/errorMessages.js`.

The controller now imports shared message functions instead of writing the strings directly inside the controller.

### Why this is better

- less duplication
- easier to maintain
- consistent error messages across the app
- cleaner controller logic

Example:

```js
const { getRegistrationValidationMessage } = require('../utils/errorMessages');
```

Then the controller uses:

```js
return res.status(400).json({ error: getRegistrationValidationMessage() });
```

---

## 18. How the login API key validation was added

You also wanted the API key validation to happen inside the login function.

The controller now checks for an API key value before proceeding to the service layer.

It first validates that the key exists, then queries the `api_key` table to ensure it matches an active entry.

### Why this is useful

It makes the auth/login path self-contained and easier to reason about.

---

## 19. How to think about this project as a beginner

A good mental model is:

- `routes` decide which endpoint was called
- `controllers` decide what to do with the request
- `services` contain the business logic
- `models` communicate with the database
- `utils` hold helper logic

This structure is very common in professional Node.js projects.

---

## 20. How to rebuild this from scratch

If you want to recreate this project yourself, follow this order:

1. Create a Node.js project with `npm init`
2. Install dependencies: Express, CORS, pg, dotenv, bcrypt, nodemon
3. Create the Express server
4. Create routes
5. Create controllers
6. Create services
7. Create models
8. Create the database connection file
9. Create utility files
10. Connect everything together and test endpoints

---

## 21. A beginner-friendly summary

If you remember only a few things, remember these:

- Express handles web requests.
- Routes connect URLs to code.
- Controllers receive requests and send responses.
- Services contain business rules.
- Models talk to the database.
- Middleware runs before route handlers.
- `async/await` is used for database and other slow operations.
- Passwords must be hashed.
- API keys can protect your endpoints.

---

## 22. Next steps for learning

To grow beyond this project, practice these next:

- add a real authentication token system
- add validation libraries such as Joi or express-validator
- add logging
- add unit tests
- split routes into feature modules
- add role-based access control
- add environment-based configuration for development and production

---

## 23. Key files in this project

- [server.js](../server.js)
- [src/routes/authRoutes.js](../src/routes/authRoutes.js)
- [src/controllers/authController.js](../src/controllers/authController.js)
- [src/services/authService.js](../src/services/authService.js)
- [src/models/userModel.js](../src/models/userModel.js)
- [src/models/apiKeyModel.js](../src/models/apiKeyModel.js)
- [src/utils/errorMessages.js](../src/utils/errorMessages.js)
- [src/config/db.js](../src/config/db.js)
