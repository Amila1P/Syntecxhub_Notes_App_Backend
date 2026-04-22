# Syntecxhub Notes App Backend

A robust and secure Backend API for a Notes Management System, developed as part of the Syntecxhub Backend Development Internship (Week 3 tasks). This application provides comprehensive user authentication, note ownership management, and advanced data population using MongoDB and Express.js.

## 🚀 Features

- **User Authentication:** Secure registration and login functionality using JWT (JSON Web Tokens) with bcryptjs password hashing.
- **Notes Management:** Full CRUD (Create, Read, Update) operations for personal notes.
- **Mongoose Populate:** Automatically retrieves user details (name and email) whenever a note is fetched, using the Mongoose `.populate()` method.
- **Authorization & Security:** Strict checks to ensure users can only view, edit, or archive their own notes.
- **Soft-delete (Archive):** Notes are marked as `isArchived` instead of being permanently deleted to maintain data integrity.
- **Token-based Authentication:** JWT tokens with 1-hour expiration for secure API access.
- **CORS Support:** Cross-Origin Resource Sharing enabled for frontend integration.
- **Timestamps:** Automatic tracking of `createdAt` and `updatedAt` for all records.

## 🛠️ Tech Stack

- **Node.js & Express.js:** Server-side environment and framework.
- **MongoDB & Mongoose:** NoSQL database and Object Data Modeling (ODM) library.
- **Bcryptjs:** Password hashing for secure storage.
- **JSON Web Tokens (JWT):** Secure cross-origin authentication.
- **Dotenv:** Environment variable management.
- **CORS:** Cross-Origin Resource Sharing middleware.
- **Nodemon:** Development automation (watches file changes).

## 📁 Project Structure

```
Syntecxhub_Notes_App_Backend/
├── controllers/
│   └── noteController.js         # Business logic for note operations
├── middleware/
│   └── authMiddleware.js         # JWT authentication middleware
├── models/
│   ├── note.js                   # Note schema and model
│   └── user.js                   # User schema and model
├── routes/
│   ├── auth.js                   # Authentication routes (register, login)
│   └── notes.js                  # Notes routes (CRUD operations)
├── server.js                     # Express server configuration
├── package.json                  # Project dependencies and scripts
└── README.md                     # Project documentation
```

## 📊 Database Schemas

### User Schema

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  timestamps: true
}
```

### Note Schema

```javascript
{
  title: String (required),
  content: String (required),
  user: ObjectId (ref: 'User', required),
  isArchived: Boolean (default: false),
  timestamps: true
}
```

## ⚙️ Setup Instructions

Follow these steps to get the project running locally:

### 1. Clone the repository

```bash
git clone https://github.com/Amila1P/Syntecxhub_Notes_App_Backend.git
cd Syntecxhub_Notes_App_Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/notes_app
JWT_SECRET=your_very_secure_secret_key_here
```

**Environment Variables Explanation:**

- `PORT`: The port on which the server will run (default: 5000)
- `MONGO_URI`: MongoDB connection string (local or cloud-based)
- `JWT_SECRET`: Secret key for signing and verifying JWT tokens

### 4. Run the application

**Development mode** (with auto-reload using nodemon):

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint             | Description             | Body                        |
| ------ | -------------------- | ----------------------- | --------------------------- |
| POST   | `/api/auth/register` | Register a new user     | `{ name, email, password }` |
| POST   | `/api/auth/login`    | Login and get JWT token | `{ email, password }`       |

**Register Response:**

```json
{ "msg": "User registered successfully" }
```

**Login Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

### Notes Endpoints (All require authentication)

| Method | Endpoint                 | Description                            | Access  |
| ------ | ------------------------ | -------------------------------------- | ------- |
| POST   | `/api/notes`             | Create a new note                      | Private |
| GET    | `/api/notes`             | Get all active notes with user details | Private |
| PUT    | `/api/notes/:id`         | Update an existing note                | Private |
| PUT    | `/api/notes/archive/:id` | Archive/Soft-delete a note             | Private |

**Create Note Request:**

```json
{
  "title": "My Note Title",
  "content": "Note content goes here"
}
```

**Create Note Response:**

```json
{
  "_id": "note_id",
  "title": "My Note Title",
  "content": "Note content goes here",
  "user": "user_id",
  "isArchived": false,
  "createdAt": "2024-04-22T10:30:00.000Z",
  "updatedAt": "2024-04-22T10:30:00.000Z"
}
```

**Get All Notes Response:**

```json
[
  {
    "_id": "note_id",
    "title": "My Note Title",
    "content": "Note content",
    "user": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    },
    "isArchived": false,
    "createdAt": "2024-04-22T10:30:00.000Z",
    "updatedAt": "2024-04-22T10:30:00.000Z"
  }
]
```

**Update Note Request:**

```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Archive Note Response:**

```json
{ "msg": "Note archived successfully" }
```

## 🔒 Authentication

- Users must register with a name, email, and password
- Login returns a JWT token valid for 1 hour
- Include the token in request headers as: `x-auth-token: <your_token>`
- All `/api/notes` endpoints require valid authentication

## 🛡️ Security Features

- Passwords are hashed using bcryptjs (salt rounds: 10)
- JWT tokens expire after 1 hour
- User authorization checks prevent access to other users' notes
- CORS is configured to accept requests from authorized sources
- Request body parsing with express.json()

## 📝 Development Scripts

Available scripts in `package.json`:

```bash
npm start   # Run the server in production mode
npm run dev # Run the server with nodemon (auto-reload on file changes)
npm test    # Run tests (currently not configured)
```

## 🚨 Error Handling

The API returns appropriate HTTP status codes:

- `200 OK`: Successful GET request
- `201 Created`: Successful POST request
- `400 Bad Request`: Invalid input or user already exists
- `401 Unauthorized`: Missing or invalid token / Not authorized for resource
- `404 Not Found`: Resource not found
- `500 Server Error`: Internal server error

## 🔄 How It Works

1. **User Registration:** User registers with name, email, and password. The password is hashed using bcryptjs before storing in MongoDB.
2. **User Login:** User logs in with email and password. If credentials match, a JWT token is generated and returned.
3. **Create Note:** Authenticated user sends a POST request with note title and content. The note is created and linked to the user.
4. **Get Notes:** Returns all active (non-archived) notes for the authenticated user with populated user details.
5. **Update Note:** User can update their own note's title and content.
6. **Archive Note:** Instead of deleting, notes are marked as archived (`isArchived: true`).

## 📋 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT implementation
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment variable management
- **nodemon**: Development tool (devDependency)

## 🤝 Contributing

This is an educational project. Feel free to fork it and submit pull requests for improvements.

## 📄 License

ISC

## 👨‍💻 Author

Developed as part of Syntecxhub Backend Development Internship - Week 3 Project
