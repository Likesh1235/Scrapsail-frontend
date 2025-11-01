# ScrapSail Frontend - React Application

Modern, responsive web application for waste management and recycling platform built with React, Tailwind CSS, and React Router.

## 🚀 Features

- **User Authentication**: Login/Register with OTP verification
- **Role-based Dashboards**: Separate interfaces for Admin, Collector, and Users
- **Scrap Pickup Requests**: GPS-enabled order placement
- **Carbon Wallet**: Track and redeem carbon credits
- **Leaderboard**: Gamified recycling competition
- **Real-time Notifications**: Order status updates
- **Responsive Design**: Mobile-first, works on all devices
- **Modern UI**: Clean interface with Tailwind CSS

## 📋 Prerequisites

- **Node.js 16+** or higher
- **npm 8+** or yarn
- **ScrapSail Backend** running on `http://localhost:8080`

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd scrapsail-frontend-new
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Endpoint
Update `src/config/api.js` if needed:
```javascript
export const API_CONFIG = {
  SPRING_BOOT_URL: 'http://localhost:8080/api'
};
```

### 4. Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000` or `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 📁 Project Structure

```
scrapsail-frontend-new/
├── public/
│   ├── index.html
│   ├── logo.svg
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ScrapSailLogo.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── CollectorDashboard.jsx
│   │   ├── PickupForm.jsx
│   │   ├── Wallet.jsx
│   │   ├── CarbonWallet.jsx
│   │   ├── Leaderboard.jsx
│   │   └── CarbonCredits.jsx
│   ├── config/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🎨 Pages Overview

### Public Pages
- **Home** (`/`) - Landing page with features
- **Login** (`/login`) - User/Admin/Collector login
- **Register** (`/register`) - User registration

### User Pages
- **Dashboard** (`/dashboard`) - User overview
- **Pickup Form** (`/pickup`) - Request scrap collection
- **Wallet** (`/wallet`) - View and redeem credits
- **Leaderboard** (`/leaderboard`) - Community rankings

### Admin Pages
- **Admin Dashboard** (`/admin/dashboard`) - Manage orders

### Collector Pages
- **Collector Dashboard** (`/collector/dashboard`) - Assigned orders with GPS

## 🔑 Login Credentials

### Admin
- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@scrapsail.com`
- **Password**: `admin123`

### Collector
- **URL**: `http://localhost:3000/collector/login`
- **Email**: `collector@scrapsail.com`
- **Password**: `collector123`

### User
Register at `http://localhost:3000/register` or login if already registered.

## 🛠️ Available Scripts

### Development
```bash
npm start          # Start development server
npm test           # Run tests
npm run build      # Build for production
npm run eject      # Eject from Create React App (irreversible)
```

## 🌐 Deployment

### Deploy to GitHub Pages
```bash
npm run deploy
```

### Deploy to Netlify
1. Build the project: `npm run build`
2. Drag & drop `build/` folder to Netlify
3. Configure environment variables:
   - `REACT_APP_API_URL=https://your-backend-domain.com/api`

### Deploy to Vercel
```bash
vercel deploy
```

## ⚙️ Environment Variables

Create `.env` file for environment-specific configuration:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_RAZORPAY_KEY=your_razorpay_key
```

Access in code:
```javascript
const apiUrl = process.env.REACT_APP_API_URL;
```

## 🎯 Key Features Explained

### GPS-Enabled Orders
- Automatically captures user's location
- Sends coordinates to backend
- Collector receives Google Maps navigation link

### Carbon Wallet
- Real-time credit tracking
- Minimum withdrawal: ₹50
- Direct bank transfer (via Razorpay)

### Leaderboard
- Shows lifetime points (never decreases)
- Top 10 users
- Medal icons for top 3

### OTP Verification
- Email-based verification
- 6-digit OTP code
- 10-minute expiration

## 🐛 Troubleshooting

### Backend connection failed
- Ensure backend is running on `http://localhost:8080`
- Check CORS configuration in backend
- Verify API endpoints in `src/config/api.js`

### GPS not working
- Grant location permission in browser
- Use HTTPS in production (required for geolocation)
- Check browser console for errors

### Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📦 Dependencies

### Core
- **React 19.2.0** - UI library
- **React Router DOM 7.9.4** - Routing
- **Axios 1.12.2** - HTTP client

### UI
- **Tailwind CSS** (via index.css) - Styling
- **Framer Motion 12.23.24** - Animations
- **@headlessui/react** - UI components
- **@heroicons/react** - Icons

### Payment
- **Razorpay 2.9.6** - Payment gateway

## 🎨 Styling

This project uses **Tailwind CSS** for styling. Key classes:

- **Colors**: `bg-green-500`, `text-blue-600`
- **Spacing**: `p-4`, `m-2`, `space-y-4`
- **Layout**: `flex`, `grid`, `container`
- **Responsive**: `md:`, `lg:`, `sm:`

## 🔒 Security Best Practices

- Never commit `.env` files
- Use HTTPS in production
- Validate all user inputs
- Sanitize data before display
- Use secure authentication tokens
- Implement rate limiting

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For issues and questions:
- Create an issue in the repository
- Email: support@scrapsail.com

---

**Built with React for a sustainable future 🌱**

