# Prism - Analytics Dashboard

A beautiful, fully functional analytics dashboard built with HTML, CSS, JavaScript, Bootstrap, Node.js, and MongoDB. Features glassmorphic UI, light/dark mode toggle, and a complete authentication system.

## Features

✨ **Beautiful Design**
- Glassmorphism UI with frosted glass effects
- Gradient backgrounds and smooth animations
- 3D-like depth and modern visual hierarchy

🌓 **Light & Dark Mode**
- Seamless theme switching
- User preference persistence
- Beautiful color transitions

🔐 **Authentication**
- User signup and login
- JWT-based session management
- Password encryption with bcryptjs

📊 **Analytics Dashboard**
- Real-time metric cards
- Interactive charts
- Editable metrics
- Data export functionality

📱 **Responsive Design**
- Mobile-friendly interface
- Adaptive layouts
- Touch-optimized buttons

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with optional demo mode)
- **Authentication**: JWT, bcryptjs
- **Styling**: Custom CSS with glassmorphism effects

## Project Structure

```
/
├── public/
│   ├── css/
│   │   └── styles.css          # Main styles with glassmorphism & dark mode
│   ├── js/
│   │   └── main.js              # Shared utilities & auth helpers
│   ├── index.html               # Home/landing page
│   ├── login.html               # Login page
│   ├── signup.html              # Sign up page
│   └── dashboard.html           # Main dashboard
├── server.js                     # Express backend & API endpoints
├── .env                          # Environment configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or pnpm
- MongoDB (optional - app works in demo mode without it)

### Step 1: Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### Step 2: Configure Environment

The `.env` file is already configured with default values:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/prism_dashboard
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345678
NODE_ENV=development
```

### Step 3: Start the Server

```bash
# Using npm/pnpm scripts
pnpm dev
# or
npm run dev

# Or directly with Node
node server.js
```

The server will start on **http://localhost:3000**

### Step 4: Open in Browser

Navigate to:
```
http://localhost:3000
```

## Using the Application

### Demo Account (Works Immediately)
- **Email**: demo@prism.com
- **Password**: password123

Use these credentials to log in and test the dashboard without setting up MongoDB.

### Creating New Accounts
Simply click "Sign Up" and create a new account. The app works in demo mode without MongoDB.

### Features to Try

1. **Theme Toggle**: Click the moon/sun icon in the navbar to switch between light and dark modes
2. **Edit Metrics**: Click "Edit Metrics" on the dashboard to update analytics values
3. **Export Data**: Click "Export Data" to download dashboard data as JSON
4. **Refresh**: Click "Refresh" to reload dashboard data
5. **View Toggle**: Click "Toggle View" to test dark/light mode switching

## MongoDB Setup (Optional)

To persist data beyond the current session, set up MongoDB:

### On Windows
1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will start as a service automatically
4. Restart the Node.js server

### On macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

### On Linux
```bash
# Using apt (Ubuntu/Debian)
sudo apt-get install -y mongodb

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Verify MongoDB is Running
```bash
# Connect to MongoDB CLI
mongosh
# or older version
mongo
```

Once MongoDB is running and the server is restarted, all user accounts and dashboard data will be persisted.

## API Endpoints

### Authentication

**Sign Up**
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: { "message": "User registered successfully", "userId": "..." }
```

**Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { 
  "message": "Login successful",
  "token": "jwt_token_here",
  "userId": "...",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Dashboard

**Get Dashboard Data**
```
GET /api/dashboard
Authorization: Bearer {token}

Response: {
  "_id": "...",
  "userId": "...",
  "revenue": 124592,
  "users": 2840,
  "conversions": 64,
  "engagement": 92,
  "metrics": [...]
}
```

**Update Dashboard Data**
```
PUT /api/dashboard
Authorization: Bearer {token}
Content-Type: application/json

{
  "revenue": 150000,
  "users": 3500,
  "conversions": 72,
  "engagement": 95
}

Response: { "updated": true, "data": {...} }
```

**Get User Profile**
```
GET /api/user
Authorization: Bearer {token}

Response: {
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

## Styling

### Color Scheme

The app uses a carefully selected color palette:

**Light Mode**
- Background: Soft lavender gradient
- Primary: Purple (#7c3aed)
- Secondary: Cyan (#06b6d4)
- Text: Dark slate (#1e293b)

**Dark Mode**
- Background: Deep navy gradient
- Primary: Purple (#7c3aed)
- Secondary: Cyan (#06b6d4)
- Text: Light gray (#f1f5f9)

### Glassmorphism Effects

All cards use glassmorphic styling with:
- Semi-transparent backgrounds
- Backdrop blur filters
- Subtle gradients
- Smooth shadows

## Customization

### Change Brand Color
Edit `/public/css/styles.css` and update:
```css
:root {
  --primary-color: #7c3aed;    /* Change this */
  --secondary-color: #06b6d4;  /* And this */
}
```

### Change Site Title
Update the `<title>` tags in HTML files and logo in navbar

### Add More Dashboard Metrics
Edit `/public/dashboard.html` and add new stat cards in the `stats-overview` section

### Customize Charts
Modify the chart data in the `generateCharts()` function in `/public/dashboard.html`

## Troubleshooting

### Server won't start
```bash
# Check if port 3000 is in use
lsof -i :3000
# Kill the process using that port
kill -9 <PID>
# Restart the server
node server.js
```

### MongoDB connection error
- If MongoDB is not installed, the app works in demo mode
- To use MongoDB, follow the MongoDB setup section above
- Restart the server after starting MongoDB

### Styling not loading
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Check console for any errors

### Login not working
- Ensure you're using the correct credentials
- Check browser console for error messages
- Try creating a new account

## Performance Tips

1. **Caching**: Browser caches static assets for faster loading
2. **Lazy Loading**: Images and data load on demand
3. **Compression**: Enable gzip compression on the server
4. **CDN**: Bootstrap CSS is loaded from CDN

## Security Considerations

1. **JWT Tokens**: 7-day expiration for security
2. **Password Hashing**: bcryptjs with salt rounds
3. **Input Validation**: Server-side validation on all endpoints
4. **CORS**: Configured to allow requests from the same origin
5. **Environment Variables**: Sensitive data stored in .env

## Production Deployment

Before deploying to production:

1. **Change JWT Secret**
```bash
openssl rand -base64 32
```
Update `JWT_SECRET` in `.env`

2. **Set NODE_ENV to production**
```
NODE_ENV=production
```

3. **Enable HTTPS**
Use a reverse proxy like Nginx

4. **Set up MongoDB Atlas**
Use MongoDB Atlas for cloud database instead of local MongoDB

5. **Use a proper process manager**
```bash
npm install -g pm2
pm2 start server.js --name "prism"
```

## File Sizes

- Total HTML: ~17 KB (all pages)
- Total CSS: ~20 KB (with comments)
- Total JS: ~5 KB
- Total: ~42 KB (before minification and gzip)

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: All modern versions

## Contributing

To add features or fix bugs:

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - Feel free to use for personal and commercial projects

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Check browser console for errors
4. Visit: https://nodejs.org/docs/
5. Visit: https://mongodb.com/docs/

## Changelog

### Version 1.0.0 (Initial Release)
- ✅ Complete authentication system
- ✅ Glassmorphic UI design
- ✅ Light/dark mode toggle
- ✅ Analytics dashboard
- ✅ Responsive design
- ✅ MongoDB integration
- ✅ API endpoints
- ✅ Demo mode support

---

**Made with ❤️ by Prism Team**

Happy analyzing! 🎉
