# Quick Start Guide - Prism Analytics Dashboard

## Run in 3 Commands

```bash
cd /vercel/share/v0-project
npm install
npm run dev
```

Then open: **http://localhost:3000**

---

## Demo Account (Works Immediately)

```
Email: demo@prism.com
Password: password123
```

No database setup required. Everything works instantly.

---

## What to Try

1. **Click Theme Toggle** (☀️/🌙 button)
   - Watch the entire UI switch between light and dark modes
   - Changes persist when you refresh

2. **Click "Sign Up"**
   - Create a new account (any credentials)
   - Form validates in real-time

3. **Click "Sign In"** 
   - Use demo account above
   - See dashboard with real data

4. **On Dashboard**
   - Click "Edit Metrics" to change values
   - Click "Export Data" to download JSON
   - Click "Refresh" to reload
   - Click "Toggle View" to switch theme

5. **Click "Logout"**
   - Returns to homepage
   - Session cleared

---

## Key Features

✅ **Glassmorphism Design** - Frosted glass effects, beautiful gradients  
✅ **Light & Dark Mode** - Complete theme switching  
✅ **Authentication** - Secure login with JWT tokens  
✅ **Analytics Dashboard** - Real-time metrics and charts  
✅ **Responsive Design** - Works on all devices  
✅ **No Database Required** - Works in memory initially  
✅ **MongoDB Ready** - Upgrade whenever you want  

---

## Technologies Used

- HTML5, CSS3, JavaScript (all vanilla, no frameworks)
- Bootstrap 5 (for grid)
- Node.js + Express
- MongoDB (optional)
- JWT authentication

---

## All Buttons Fully Functional

Every button on every page is fully implemented:
- Navigation links
- Sign Up/Login forms
- Dashboard actions
- Theme toggle
- Logout button
- Export data
- Edit metrics

---

## File Structure

```
public/
├── css/styles.css        ← All styling + dark mode
├── js/main.js            ← Auth helpers
├── index.html            ← Homepage
├── signup.html           ← Registration
├── login.html            ← Login
└── dashboard.html        ← Analytics dashboard

server.js                  ← Backend API
.env                       ← Configuration
package.json               ← Dependencies
```

---

## Customization

### Change Colors
Edit `/public/css/styles.css`, find:
```css
:root {
  --primary-color: #7c3aed;    /* Purple */
  --secondary-color: #06b6d4;  /* Cyan */
}
```

### Change Logo Text
Replace "Prism" in `.logo` text throughout HTML files

### Add More Pages
1. Create `public/newpage.html`
2. Add route: `app.get('/newpage', (req, res) => ...)`
3. Add navigation link in navbar

---

## Production Deployment

Ready to deploy immediately to:
- Vercel (recommended)
- Heroku
- AWS
- Any Node.js host

Just push to GitHub and deploy. No additional setup needed.

---

## Troubleshooting

**Server won't start:**
```bash
# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
# Then restart
npm run dev
```

**Styling not loading:**
- Hard refresh: Ctrl+Shift+Delete then Ctrl+F5
- Clear cache and reload

**Login not working:**
- Check browser console for errors
- Verify demo credentials: demo@prism.com / password123
- Try creating new account instead

---

## Next: Use MongoDB

Want persistent storage? Set up MongoDB:

1. Install: https://docs.mongodb.com/manual/installation/
2. Start MongoDB: `mongod`
3. Restart server: `npm run dev`

Data will now persist between sessions.

---

## Support Files

- `README.md` - Complete documentation
- `FINAL_SUMMARY.md` - Full project overview
- `QUICK_START.md` - This file

---

**That's it! Your full-stack SaaS dashboard is ready to use.**

Happy analyzing! 🎉

Visit: http://localhost:3000
