# Syntecxhub Notes App Backend

A robust and secure Backend API for a Notes Management System, developed as part of the Syntecxhub Backend Development Internship (Week 3 Project). This application provides comprehensive user authentication, note ownership management, soft-delete functionality, and advanced data population using MongoDB, Mongoose, and Express.js.

## 🚀 Features

- **🔐 User Authentication:** Secure registration and login with JWT tokens and bcryptjs password hashing
- **📝 Notes Management:** Full CRUD (Create, Read, Update, Delete) operations for personal notes
- **👤 User Authorization:** Strict ownership checks ensuring users can only access their own notes
- **🗃️ Mongoose Populate:** Automatically retrieves related user data (name, email) when fetching notes
- **🗑️ Soft-Delete (Archive):** Notes marked as archived instead of permanent deletion for data integrity
- **⏰ Timestamps:** Automatic `createdAt` and `updatedAt` tracking for all records
- **🔄 Unarchive Notes:** Restore archived notes to active status
- **🛡️ CORS Support:** Cross-Origin Resource Sharing enabled for frontend integration
- **🚀 Token Expiration:** JWT tokens with 1-hour expiration for enhanced security

## 🛠️ Tech Stack

| Technology     | Purpose                                   |
| -------------- | ----------------------------------------- |
| **Node.js**    | JavaScript runtime environment            |
| **Express.js** | Web framework for routing and middleware  |
| **MongoDB**    | NoSQL database for data storage           |
| **Mongoose**   | ODM library for MongoDB schema validation |
| **Bcryptjs**   | Password hashing and encryption           |
| **JWT**        | Secure token-based authentication         |
| **Dotenv**     | Environment variable management           |
| **CORS**       | Cross-Origin Resource Sharing             |
| **Nodemon**    | Development server auto-reload            |

## 📁 Project Structure

```
Syntecxhub_Notes_App_Backend/
├── controllers/
│   └── noteController.js         # Business logic for note operations
│                                 # • createNote, getNotes, updateNote
│                                 # • archiveNote, unarchiveNote, deleteNote
├── middleware/
│   └── authMiddleware.js         # JWT token verification and authentication
├── models/
│   ├── note.js                   # Note schema (title, content, user, isArchived)
│   └── user.js                   # User schema (name, email, hashedPassword)
├── routes/
│   ├── auth.js                   # Auth endpoints (POST /register, /login)
│   └── notes.js                  # Note endpoints (CRUD + archive operations)
├── server.js                     # Express server setup and MongoDB connection
├── package.json                  # Dependencies and scripts
├── .env                          # Environment variables (not in repo)
└── README.md                     # This file
```

## 📊 Database Schemas

### User Schema

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed with bcryptjs),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Note Schema

```javascript
{
  _id: ObjectId,
  title: String (required),
  content: String (required),
  user: ObjectId (reference to User),
  isArchived: Boolean (default: false),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## ⚙️ Setup Instructions

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

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/notes_app?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

**Environment Variables:**

| Variable     | Description                | Example                  |
| ------------ | -------------------------- | ------------------------ |
| `PORT`       | Server port                | `5000`                   |
| `MONGO_URI`  | MongoDB connection string  | `mongodb+srv://...`      |
| `JWT_SECRET` | Secret key for JWT signing | Any secure random string |

### 4. Troubleshooting MongoDB Connection

If you see `MongooseServerSelectionError: Could not connect to any servers...`:

**For MongoDB Atlas:**

1. Go to [MongoDB Atlas Dashboard](https://www.mongodb.com/cloud/atlas)
2. Navigate to **Network Access** → **IP Whitelist**
3. Add your current IP address or use `0.0.0.0/0` for development
4. Verify `MONGO_URI` has correct credentials

**For Local MongoDB:**

```bash
# Make sure MongoDB service is running
# Windows:
mongod

# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

## 🚀 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication Endpoints (`/api/auth`)

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**

```json
{
  "msg": "User registered successfully"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Notes Endpoints (`/api/notes`)

All note endpoints require the JWT token in the `x-auth-token` header:

```
x-auth-token: {your_jwt_token}
```

#### Create Note

```http
POST /api/notes
Content-Type: application/json
x-auth-token: {token}

{
  "title": "My First Note",
  "content": "This is the content of my note"
}
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "My First Note",
  "content": "This is the content of my note",
  "user": "507f1f77bcf86cd799439010",
  "isArchived": false,
  "createdAt": "2026-04-25T10:30:00.000Z",
  "updatedAt": "2026-04-25T10:30:00.000Z"
}
```

#### Get All Notes

```http
GET /api/notes
x-auth-token: {token}
```

**Response (200):** Returns array of notes (non-archived) with user details populated

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My First Note",
    "content": "Content here",
    "user": {
      "_id": "507f1f77bcf86cd799439010",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "isArchived": false,
    "createdAt": "2026-04-25T10:30:00.000Z",
    "updatedAt": "2026-04-25T10:30:00.000Z"
  }
]
```

#### Update Note

```http
PUT /api/notes/{noteId}
Content-Type: application/json
x-auth-token: {token}

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Response (200):** Returns updated note object

#### Archive Note (Soft Delete)

```http
PUT /api/notes/archive/{noteId}
x-auth-token: {token}
```

**Response (200):**

```json
{
  "msg": "Note archived successfully",
  "note": { ... }
}
```

#### Unarchive Note

```http
PUT /api/notes/unarchive/{noteId}
x-auth-token: {token}
```

**Response (200):**

```json
{
  "msg": "Note unarchived successfully",
  "note": { ... }
}
```

#### Delete Note (Permanent)

```http
DELETE /api/notes/{noteId}
x-auth-token: {token}
```

**Response (200):**

```json
{
  "msg": "Note deleted permanently"
}
```

## 🔑 Authentication Flow

1. **Register:** User creates account → Password hashed with bcryptjs → User saved to database
2. **Login:** User provides email/password → Password compared with hash → JWT token generated
3. **Request:** Frontend includes token in `x-auth-token` header
4. **Verify:** Middleware verifies token validity → Request proceeds or rejected
5. **Authorize:** User ID from token used to filter user's own notes

## 🔒 Security Features

- ✅ **Password Hashing:** Bcryptjs with salt rounds
- ✅ **JWT Tokens:** 1-hour expiration by default
- ✅ **Authorization:** Users can only access their own notes
- ✅ **CORS:** Configurable cross-origin access
- ✅ **Environment Variables:** Sensitive data never hardcoded
- ✅ **Unique Email:** Database constraint prevents duplicate accounts

## 📝 Error Handling

The API returns appropriate HTTP status codes:

| Status | Meaning                             |
| ------ | ----------------------------------- |
| 200    | Success                             |
| 201    | Created                             |
| 400    | Bad Request (invalid data)          |
| 401    | Unauthorized (no/invalid token)     |
| 404    | Not Found (note/user doesn't exist) |
| 500    | Server Error                        |

## 🧪 Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'

# Create Note (replace TOKEN)
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "x-auth-token: {TOKEN}" \
  -d '{"title":"Test Note","content":"Test content"}'
```

### Using Postman

1. Import the API endpoints into Postman
2. Set up environment variables: `baseUrl` and `token`
3. Register a user and copy the returned token
4. Use the token in subsequent requests via `x-auth-token` header

## 📦 Dependencies

```json
{
  "bcryptjs": "^3.0.3", // Password hashing
  "cors": "^2.8.6", // CORS middleware
  "dotenv": "^17.4.2", // Environment variables
  "express": "^5.2.1", // Web framework
  "jsonwebtoken": "^9.0.3", // JWT handling
  "mongoose": "^9.5.0" // MongoDB ODM
}
```

**Dev Dependencies:**

```json
{
  "nodemon": "^3.1.14" // Auto-reload on file changes
}
```

## 🎯 Git Workflow

The project uses Git for version control with feature branches:

```bash
# View current branch
git branch -a

# Create new feature branch
git checkout -b feature/feature-name

# Commit changes
git add .
git commit -m "descriptive message"

# Push to remote
git push origin feature/feature-name

# Create pull request on GitHub
```

## 📚 Learning Outcomes (Week 3 Project)

This project demonstrates:

- ✅ Express.js routing and middleware
- ✅ MongoDB database design and Mongoose ODM
- ✅ JWT authentication and authorization
- ✅ Password security with bcryptjs
- ✅ RESTful API design principles
- ✅ Soft-delete patterns for data preservation
- ✅ Environment variable management
- ✅ Error handling and validation

## 🔄 Future Enhancements

- [ ] Add note categories/tags
- [ ] Implement note sharing between users
- [ ] Add search and filter functionality
- [ ] Implement rate limiting
- [ ] Add email verification for registration
- [ ] Create frontend application
- [ ] Add unit and integration tests
- [ ] Implement logging system
- [ ] Add database backup automation

## 📞 Support & Troubleshooting

**Q: JWT token expired?**
A: Login again to get a new token. Current expiration is 1 hour.

**Q: Cannot access other user's notes?**
A: Authorization checks prevent viewing notes outside your ownership.

**Q: Server crashes on startup?**
A: Check `.env` file exists, `MONGO_URI` is correct, and MongoDB is running.

**Q: Port 5000 already in use?**
A: Change `PORT` in `.env` to an available port (e.g., 5001).

## 📄 License

ISC License - This project is part of the Syntecxhub Backend Development Internship program.

---

**Last Updated:** April 2026  
**Developer:** Amila  
**Version:** 1.0.0

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
