# Fineas - Personal Finance Tracker

A modern, feature-rich personal finance tracking app built with React Native and Expo. Track your money, manage transactions, monitor currency rates, and customize your experience with dark mode and accessibility options.

![Fineas App](https://img.shields.io/badge/React%20Native-0.81.5-blue) ![Expo](https://img.shields.io/badge/Expo-54.0.25-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)

## 🎯 Overview

Fineas is a comprehensive personal finance management app that helps you:
- Track income and expenses in real-time
- Monitor live currency exchange rates
- Manage your financial data with an intuitive interface
- Customize your experience with themes and accessibility options

## ✨ Features

### 📱 Home Tab
- **Transaction Management**
  - Add income and expense transactions
  - Real-time balance calculation
  - Transaction history with dates and descriptions
  - Visual indicators (💰 for income, 💸 for expenses)
  
- **Financial Overview**
  - Income summary card
  - Expenses summary card
  - Balance display (with color coding for positive/negative)
  - Real-time totals update

- **Smart Warnings**
  - ⚠️ Insufficient funds warning when expense exceeds balance
  - Real-time visual feedback in the input field
  - Confirmation dialog before proceeding with insufficient funds

### 💱 Currencies Tab
- **Live Exchange Rates**
  - Real-time currency rates from free API
  - Support for 20+ major currencies
  - Base currency selection (USD, EUR, GBP, JPY, CHF, CAD, AUD, CNY, etc.)
  
- **Currency Filtering**
  - Toggle between major currencies only or all available currencies
  - Alphabetically sorted currency list
  - Manual refresh option
  - Loading indicators

- **Currency Information**
  - Currency code and full name
  - Exchange rate display (4 decimal precision)
  - Base currency indicator

### ⚙️ Settings Tab
- **Theme Customization**
  - 🌓 Dark mode / Light mode toggle
  - Seamless theme switching
  - Theme-aware UI components

- **Accessibility**
  - Font size adjustment (Small, Medium, Large)
  - App-wide font scaling
  - Improved readability options

- **Currency Settings**
  - Base currency selection (8 popular options)
  - Settings persist across app sessions
  - Instant rate updates when base currency changes

### 🧭 Navigation
- **Bottom Navigation Bar**
  - Quick access to Home, Currencies, and Settings
  - Active tab highlighting
  - Theme-aware navigation bar

## 🛠️ Tech Stack

- **React Native** (v0.81.5) - Cross-platform mobile framework
- **Expo** (v54.0.25) - Development platform and build tools
- **TypeScript** (v5.9.2) - Type-safe JavaScript
- **React Native Safe Area Context** - Safe area handling
- **Expo Status Bar** - Status bar management

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator, Android Emulator, or physical device with Expo Go app

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/oKhodus/fineas.git
   cd fineas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   npm run web      # for web
   ```

4. **Run on your device**
   - Scan QR code with Expo Go app on your physical device (if not web)

## 📁 Project Structure

```
fineas/
├── src/
│   └── screens/
│       └── MainScreen.tsx    # Main application screen with all features
├── assets/                   # App icons and splash screens
├── App.tsx                   # Root component
├── app.json                  # Expo configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🚀 Usage Guide

### Adding Transactions

1. Navigate to the **Home** tab
2. Select transaction type:
   - 💸 **Expense** - Money going out
   - 💰 **Income** - Money coming in
3. Enter the amount (in your base currency)
4. Add a description
5. Tap "Add Transaction"

**Note**: If you try to add an expense that exceeds your balance, you'll see:
- A visual warning in the input field
- A confirmation dialog before proceeding

### Viewing Currency Rates

1. Navigate to the **Currencies** tab
2. View live exchange rates relative to your base currency
3. Toggle "Show Major Currencies Only" to filter the list
4. Tap "🔄 Refresh" to update rates manually

### Customizing Settings

1. Navigate to the **Settings** tab
2. **Dark Mode**: Toggle between light and dark themes
3. **Font Size**: Choose Small, Medium, or Large
4. **Base Currency**: Select from 8 popular currencies

## 🎨 Features in Detail

### Smart Balance Warnings

The app includes intelligent warnings to prevent overspending:

- **Real-time Validation**: As you type an expense amount, the app checks if it exceeds your balance
- **Visual Feedback**: Input field turns red with a warning message
- **Confirmation Dialog**: Before adding an expense that exceeds balance, you'll see:
  - Current balance
  - Expense amount
  - Option to cancel or proceed

### Currency Exchange Rates

- **Free API Integration**: Uses exchangerate-api.com (no API key required)
- **Live Updates**: Real-time exchange rates
- **Flexible Display**: Show 20 major currencies or all available currencies
- **Base Currency**: All rates shown relative to your selected base currency

### Theme System

- **Dark Mode**: Complete dark theme with carefully chosen colors
- **Light Mode**: Clean, bright interface
- **Consistent Theming**: All components adapt to the selected theme
- **Persistent**: Theme preference maintained during app session

### Accessibility

- **Font Scaling**: Three size options (Small: 85%, Medium: 100%, Large: 120%)
- **App-wide Application**: Font size affects all text elements
- **Improved Readability**: Better experience for users with visual needs

## 🔧 Configuration

### Base Currency Options

Currently supported base currencies:
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- JPY (Japanese Yen)
- CHF (Swiss Franc)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- CNY (Chinese Yuan)

### Major Currencies Displayed

When "Show Major Currencies Only" is enabled, the app displays:
USD, GBP, JPY, CHF, CAD, AUD, CNY, INR, BRL, RUB, NZD, SEK, NOK, DKK, PLN, MXN, ZAR, TRY, KRW, SGD

## 📱 Screenshots & Features

### Home Tab
- Transaction entry form
- Financial summary cards
- Transaction history list
- Real-time balance updates

### Currencies Tab
- Live exchange rates
- Currency filter toggle
- Base currency display
- Refresh functionality

### Settings Tab
- Dark/Light theme toggle
- Font size selector
- Base currency selector

## 🚧 Future Enhancements

Potential features for future versions:

- [ ] Data persistence (AsyncStorage/SQLite)
- [ ] Transaction categories and tags
- [ ] Date range filtering
- [ ] Charts and graphs
- [ ] Budget limits and goals
- [ ] Export/Import transactions
- [ ] Multiple currency accounts
- [ ] Recurring transactions
- [ ] Transaction search and filters
- [ ] Backup and sync functionality

## 🤝 Contributing

This is a learning project! Feel free to:
- Fork the repository
- Add new features
- Improve existing functionality
- Fix bugs
- Enhance the UI/UX

## 📄 License

This project is open source and available for learning and personal use.

## 🙏 Acknowledgments

- Built with [React Native](https://reactnative.dev/)
- Powered by [Expo](https://expo.dev/)
- Currency data from [exchangerate-api.com](https://www.exchangerate-api.com/)

---

**Track your money, build your future** 💰

Made with ❤️ using React Native and Expo
