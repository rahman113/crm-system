#  CRM System - Zoho-like Clone

A full-stack Customer Relationship Management (CRM) system built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows businesses to manage their leads efficiently with complete CRUD operations, user authentication, and filtering capabilities.

##  Features

### Core Features
- **User Authentication**
  - Secure registration and login
  - JWT-based authentication
  - Password hashing with bcrypt
  - Protected routes and API endpoints

- **Leads Management**
  - Create new leads with name, email, phone, and status
  - Read/View all leads in a sortable table
  - Update existing lead information
  - Delete leads with confirmation dialog
  - Filter leads by status (New, Contacted, Qualified, Lost, Closed)
  - View lead creation dates

- **Dashboard**
  - Clean, responsive dashboard interface
  - Real-time lead count display
  - Status-based filtering
  - Action buttons for edit/delete operations

### Technical Features
- RESTful API architecture
- Input validation on both frontend and backend
- Error handling with meaningful messages
- Loading states for better UX
- Responsive design for mobile and desktop
- Environment variable configuration
- CORS enabled for security

##  Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Encryption**: bcryptjs
- **Validation**: express-validator
- **Environment Variables**: dotenv

### Frontend
- **Library**: React.js
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: Custom CSS with modern design
- **Icons**: React Icons (optional)

### Development Tools
- **Backend Dev**: nodemon for auto-restart
- **Frontend Dev**: Create React App
- **Version Control**: Git

##  Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional, for cloning)

##  Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/crm-system.git
cd crm-system



Step 2: Backend Setup

# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm_system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
EOF

# Start MongoDB (choose one based on your OS)

# For Ubuntu/Debian Linux:
sudo systemctl start mongod

# For macOS with Homebrew:
brew services start mongodb-community

# For Windows:
net start MongoDB

# Or use MongoDB Atlas cloud (recommended for production)

# Start backend server
npm run dev


Step 3: Frontend Setup

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF

# Start frontend development server
npm start

# The frontend application will open automatically at http://localhost:3000


# Step 4: Access the Application

1. Open your browser and go to http://localhost:3000

2. Register a new account

3. Login with your credentials

4. Start managing leads!

# Project Structure

crm-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentication logic
│   │   │   └── leadController.js    # Lead CRUD operations
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # JWT verification
│   │   │   └── errorMiddleware.js   # Error handling
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Lead.js              # Lead schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Auth endpoints
│   │   │   └── leadRoutes.js        # Lead endpoints
│   │   ├── utils/
│   │   │   └── validation.js        # Validation helpers
│   │   └── app.js                   # Express app setup
│   ├── .env                          # Environment variables
│   ├── package.json                  # Backend dependencies
│   └── server.js                     # Server entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx         # Main dashboard
│   │   │   ├── LeadForm.jsx          # Lead add/edit form
│   │   │   ├── LeadList.jsx          # Leads table
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Navbar.jsx            # Navigation bar
│   │   │   └── Register.jsx          # Registration page
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth state management
│   │   ├── services/
│   │   │   └── api.js                # API service layer
│   │   ├── App.jsx                   # Main app component
│   │   ├── index.js                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── .env                          # Environment variables
│   └── package.json                  # Frontend dependencies
│
└── README.md                         # Documentation

#API Endpoints


Authentication Routes

Method	Endpoint	            Description	                  Access


POST	/api/auth/register	    Register new user	           Public
POST	/api/auth/login	        Login user	Public
GET	    /api/auth/me	        Get current user	           Private



# Lead Routes (All Private)


Method	Endpoint	                 Description	                        Query Params
GET	    /api/leads	                  Get all leads	                        ?status=New
GET	     /api/leads/:id	              single lead	                         -
POST	/api/leads	                  Create new lead	                     -
PUT	    /api/leads/:id	               Update lead	                          -
DELETE	/api/leads/:id	               Delete lead	                          -