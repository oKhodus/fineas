import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: Date;
}

interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
}

const MainScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [activeTab, setActiveTab] = useState<'home' | 'currencies' | 'settings'>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [currencies, setCurrencies] = useState<CurrencyRate[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState('EUR');

  const addTransaction = () => {
    if (!amount || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: numAmount,
      type,
      category: type === 'income' ? 'Income' : 'Expense',
      description: description.trim(),
      date: new Date(),
    };

    setTransactions([newTransaction, ...transactions]);
    setAmount('');
    setDescription('');
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const fetchCurrencies = async () => {
    setLoadingCurrencies(true);
    try {
      // Using exchangerate-api.com free API (no API key required for basic usage)
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
      const data = await response.json();
      
      if (data.rates) {
        // Most commonly used currencies
        const popularCurrencies = ['USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY', 'INR', 'BRL', 'RUB'];
        const currencyList: CurrencyRate[] = popularCurrencies
          .filter(code => data.rates[code])
          .map(code => ({
            code,
            name: getCurrencyName(code),
            rate: data.rates[code],
          }));
        setCurrencies(currencyList);
      } else {
        Alert.alert('Error', 'Failed to fetch currency rates');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch currency rates. Please check your internet connection.');
    } finally {
      setLoadingCurrencies(false);
    }
  };

  const getCurrencyName = (code: string): string => {
    const names: { [key: string]: string } = {
      USD: 'US Dollar',
      EUR: 'Euro',
      GBP: 'British Pound',
      JPY: 'Japanese Yen',
      CHF: 'Swiss Franc',
      CAD: 'Canadian Dollar',
      AUD: 'Australian Dollar',
      CNY: 'Chinese Yuan',
      INR: 'Indian Rupee',
      BRL: 'Brazilian Real',
      RUB: 'Russian Ruble',
    };
    return names[code] || code;
  };

  useEffect(() => {
    if (activeTab === 'currencies') {
      fetchCurrencies();
    }
  }, [activeTab, baseCurrency]);

  const renderHomeTab = () => {
    const themeStyles = getThemeStyles();
    const fontMultiplier = themeStyles.fontMultiplier;
    return (
      <>
        {/* Header */}
        <View style={[styles.header, themeStyles.header]}>
          <Text style={[styles.title, themeStyles.title, { fontSize: 28 * fontMultiplier }]}>fineas</Text>
          <Text style={[styles.subtitle, themeStyles.subtitle, { fontSize: 16 * fontMultiplier }]}>Track your money, build your future</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, themeStyles.card]}>
            <Text style={[styles.summaryLabel, themeStyles.textSecondary, { fontSize: 12 * fontMultiplier }]}>Income</Text>
            <Text style={[styles.summaryAmountIncome, { fontSize: 16 * fontMultiplier }]}>
              {formatCurrency(getTotalIncome())}
            </Text>
          </View>
          
          <View style={[styles.summaryCard, themeStyles.card]}>
            <Text style={[styles.summaryLabel, themeStyles.textSecondary, { fontSize: 12 * fontMultiplier }]}>Expenses</Text>
            <Text style={[styles.summaryAmountExpense, { fontSize: 16 * fontMultiplier }]}>
              {formatCurrency(getTotalExpenses())}
            </Text>
          </View>
          
          <View style={[styles.summaryCard, themeStyles.card]}>
            <Text style={[styles.summaryLabel, themeStyles.textSecondary, { fontSize: 12 * fontMultiplier }]}>Balance</Text>
            <Text style={[
              styles.summaryAmount,
              { fontSize: 16 * fontMultiplier },
              getBalance() >= 0 ? styles.positiveBalance : styles.negativeBalance
            ]}>
              {formatCurrency(getBalance())}
            </Text>
          </View>
        </View>

        {/* Add Transaction Form */}
        <View style={[styles.formContainer, themeStyles.card]}>
          <Text style={[styles.formTitle, themeStyles.text, { fontSize: 18 * fontMultiplier }]}>Add New Transaction</Text>
          
          {/* Type Selector */}
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                themeStyles.button,
                type === 'expense' && styles.typeButtonActive
              ]}
              onPress={() => setType('expense')}
            >
              <Text style={[
                styles.typeButtonText,
                { fontSize: 14 * fontMultiplier },
                type === 'expense' ? styles.typeButtonTextActive : themeStyles.textSecondary
              ]}>
                💸 Expense
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                themeStyles.button,
                type === 'income' && styles.typeButtonActive
              ]}
              onPress={() => setType('income')}
            >
              <Text style={[
                styles.typeButtonText,
                { fontSize: 14 * fontMultiplier },
                type === 'income' ? styles.typeButtonTextActive : themeStyles.textSecondary
              ]}>
                💰 Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, themeStyles.text, { fontSize: 14 * fontMultiplier }]}>Amount (€)</Text>
            <TextInput
              style={[styles.amountInput, themeStyles.input, { fontSize: 16 * fontMultiplier }]}
              placeholder="0.00"
              placeholderTextColor={isDarkMode ? '#999' : '#999'}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, themeStyles.text, { fontSize: 14 * fontMultiplier }]}>Description</Text>
            <TextInput
              style={[styles.descriptionInput, themeStyles.input, { fontSize: 16 * fontMultiplier }]}
              placeholder="What was this for?"
              placeholderTextColor={isDarkMode ? '#999' : '#999'}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Add Button */}
          <TouchableOpacity style={styles.addButton} onPress={addTransaction}>
            <Text style={[styles.addButtonText, { fontSize: 16 * fontMultiplier }]}>Add Transaction</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <View style={[styles.transactionsContainer, themeStyles.card]}>
          <Text style={[styles.transactionsTitle, themeStyles.text, { fontSize: 18 * fontMultiplier }]}>
            Recent Transactions ({transactions.length})
          </Text>
          
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, themeStyles.textSecondary, { fontSize: 16 * fontMultiplier }]}>No transactions yet</Text>
              <Text style={[styles.emptyStateSubtext, themeStyles.textSecondary, { fontSize: 14 * fontMultiplier }]}>
                Add your first transaction above to get started!
              </Text>
            </View>
          ) : (
            transactions.map((transaction) => (
              <View key={transaction.id} style={[styles.transactionItem, themeStyles.border]}>
                <View style={styles.transactionLeft}>
                  <Text style={[styles.transactionType, { fontSize: 20 * fontMultiplier }]}>
                    {transaction.type === 'income' ? '💰' : '💸'}
                  </Text>
                  <View>
                    <Text style={[styles.transactionDescription, themeStyles.text, { fontSize: 16 * fontMultiplier }]}>
                      {transaction.description}
                    </Text>
                    <Text style={[styles.transactionDate, themeStyles.textSecondary, { fontSize: 12 * fontMultiplier }]}>
                      {transaction.date.toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  { fontSize: 16 * fontMultiplier },
                  transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount
                ]}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </Text>
              </View>
            ))
          )}
        </View>
      </>
    );
  };

  const renderCurrenciesTab = () => {
    const themeStyles = getThemeStyles();
    const fontMultiplier = themeStyles.fontMultiplier;
    return (
      <>
        <View style={[styles.header, themeStyles.header]}>
          <Text style={[styles.title, themeStyles.title, { fontSize: 28 * fontMultiplier }]}>Currency Rates</Text>
          <Text style={[styles.subtitle, themeStyles.subtitle, { fontSize: 16 * fontMultiplier }]}>Live exchange rates</Text>
        </View>

        <View style={[styles.currenciesContainer, themeStyles.card]}>
          {loadingCurrencies ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2E86AB" />
              <Text style={[styles.loadingText, themeStyles.textSecondary, { fontSize: 14 * fontMultiplier }]}>Loading rates...</Text>
            </View>
          ) : currencies.length > 0 ? (
            <>
              <View style={styles.currencyHeader}>
                <Text style={[styles.currencyHeaderText, themeStyles.text, { fontSize: 16 * fontMultiplier }]}>Base: {baseCurrency}</Text>
                <TouchableOpacity
                  style={[styles.refreshButton, themeStyles.button]}
                  onPress={fetchCurrencies}
                >
                  <Text style={[styles.refreshButtonText, themeStyles.text, { fontSize: 14 * fontMultiplier }]}>🔄 Refresh</Text>
                </TouchableOpacity>
              </View>
              {currencies.map((currency) => (
                <View key={currency.code} style={[styles.currencyItem, themeStyles.border]}>
                  <View style={styles.currencyLeft}>
                    <Text style={[styles.currencyCode, themeStyles.text, { fontSize: 18 * fontMultiplier }]}>{currency.code}</Text>
                    <Text style={[styles.currencyName, themeStyles.textSecondary, { fontSize: 14 * fontMultiplier }]}>{currency.name}</Text>
                  </View>
                  <Text style={[styles.currencyRate, themeStyles.text, { fontSize: 16 * fontMultiplier }]}>
                    {currency.rate.toFixed(4)}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, themeStyles.textSecondary, { fontSize: 16 * fontMultiplier }]}>No currency data available</Text>
            </View>
          )}
        </View>
      </>
    );
  };

  const renderSettingsTab = () => {
    const themeStyles = getThemeStyles();
    const fontMultiplier = themeStyles.fontMultiplier;
    return (
      <>
        <View style={[styles.header, themeStyles.header]}>
          <Text style={[styles.title, themeStyles.title, { fontSize: 28 * fontMultiplier }]}>Settings</Text>
          <Text style={[styles.subtitle, themeStyles.subtitle, { fontSize: 16 * fontMultiplier }]}>Customize your app</Text>
        </View>

        <View style={[styles.settingsContainer, themeStyles.card]}>
          <View style={[styles.settingItem, themeStyles.border]}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingLabel, themeStyles.text, { fontSize: 16 * themeStyles.fontMultiplier }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, themeStyles.textSecondary, { fontSize: 14 * themeStyles.fontMultiplier }]}>
                Switch between light and dark theme
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#767577', true: '#2E86AB' }}
              thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.settingItem, themeStyles.border]}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingLabel, themeStyles.text, { fontSize: 16 * themeStyles.fontMultiplier }]}>Font Size</Text>
              <Text style={[styles.settingDescription, themeStyles.textSecondary, { fontSize: 14 * themeStyles.fontMultiplier }]}>
                Adjust the text size throughout the app
              </Text>
            </View>
          </View>

          <View style={styles.fontSizeSelector}>
            <TouchableOpacity
              style={[
                styles.fontSizeButton,
                themeStyles.button,
                fontSize === 'small' && styles.fontSizeButtonActive
              ]}
              onPress={() => setFontSize('small')}
            >
              <Text style={[
                styles.fontSizeButtonText,
                fontSize === 'small' ? styles.fontSizeButtonTextActive : themeStyles.textSecondary,
                { fontSize: 12 * themeStyles.fontMultiplier }
              ]}>
                Small
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.fontSizeButton,
                themeStyles.button,
                fontSize === 'medium' && styles.fontSizeButtonActive
              ]}
              onPress={() => setFontSize('medium')}
            >
              <Text style={[
                styles.fontSizeButtonText,
                fontSize === 'medium' ? styles.fontSizeButtonTextActive : themeStyles.textSecondary,
                { fontSize: 14 * themeStyles.fontMultiplier }
              ]}>
                Medium
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.fontSizeButton,
                themeStyles.button,
                fontSize === 'large' && styles.fontSizeButtonActive
              ]}
              onPress={() => setFontSize('large')}
            >
              <Text style={[
                styles.fontSizeButtonText,
                fontSize === 'large' ? styles.fontSizeButtonTextActive : themeStyles.textSecondary,
                { fontSize: 16 * themeStyles.fontMultiplier }
              ]}>
                Large
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  const getFontSizeMultiplier = () => {
    switch (fontSize) {
      case 'small':
        return 0.85;
      case 'medium':
        return 1.0;
      case 'large':
        return 1.2;
      default:
        return 1.0;
    }
  };

  const getThemeStyles = () => {
    const fontMultiplier = getFontSizeMultiplier();
    if (isDarkMode) {
      return {
        header: { backgroundColor: '#1a1a1a' },
        card: { backgroundColor: '#2a2a2a' },
        text: { color: '#ffffff' },
        textSecondary: { color: '#b0b0b0' },
        title: { color: '#2E86AB' },
        subtitle: { color: '#b0b0b0' },
        button: { backgroundColor: '#3a3a3a', borderColor: '#4a4a4a' },
        input: { backgroundColor: '#3a3a3a', borderColor: '#4a4a4a', color: '#ffffff' },
        border: { borderBottomColor: '#3a3a3a' },
        fontMultiplier,
      };
    }
    return {
      header: { backgroundColor: '#fff' },
      card: { backgroundColor: '#fff' },
      text: { color: '#333' },
      textSecondary: { color: '#666' },
      title: { color: '#2E86AB' },
      subtitle: { color: '#666' },
      button: { backgroundColor: '#f5f5f5', borderColor: '#e0e0e0' },
      input: { backgroundColor: '#f8f9fa', borderColor: '#e0e0e0', color: '#333' },
      border: { borderBottomColor: '#f0f0f0' },
      fontMultiplier,
    };
  };

  const themeStyles = getThemeStyles();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f8f9fa' }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'home' && renderHomeTab()}
        {activeTab === 'currencies' && renderCurrenciesTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNav, themeStyles.card, { borderTopColor: isDarkMode ? '#3a3a3a' : '#e0e0e0' }]}>
        <TouchableOpacity
          style={[
            styles.navButton,
            activeTab === 'home' && (isDarkMode ? { backgroundColor: '#3a3a3a' } : styles.navButtonActive)
          ]}
          onPress={() => setActiveTab('home')}
        >
          <Text style={[
            styles.navButtonText,
            { fontSize: 14 * themeStyles.fontMultiplier },
            activeTab === 'home' ? styles.navButtonTextActive : themeStyles.textSecondary
          ]}>
            Home
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.navButton,
            activeTab === 'currencies' && (isDarkMode ? { backgroundColor: '#3a3a3a' } : styles.navButtonActive)
          ]}
          onPress={() => setActiveTab('currencies')}
        >
          <Text style={[
            styles.navButtonText,
            { fontSize: 14 * themeStyles.fontMultiplier },
            activeTab === 'currencies' ? styles.navButtonTextActive : themeStyles.textSecondary
          ]}>
            Currencies
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.navButton,
            activeTab === 'settings' && (isDarkMode ? { backgroundColor: '#3a3a3a' } : styles.navButtonActive)
          ]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[
            styles.navButtonText,
            { fontSize: 14 * themeStyles.fontMultiplier },
            activeTab === 'settings' ? styles.navButtonTextActive : themeStyles.textSecondary
          ]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E86AB',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E86AB',
  },
  summaryAmountIncome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  summaryAmountExpense: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F44336',
  },
  positiveBalance: {
    color: '#4CAF50',
  },
  negativeBalance: {
    color: '#F44336',
  },
  formContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  typeButtonActive: {
    backgroundColor: '#2E86AB',
    borderColor: '#2E86AB',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  amountInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  descriptionInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#2E86AB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionType: {
    fontSize: 20,
    marginRight: 12,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  incomeAmount: {
    color: '#4CAF50',
  },
  expenseAmount: {
    color: '#F44336',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  navButtonActive: {
    backgroundColor: '#f0f7fa',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  navButtonTextActive: {
    color: '#2E86AB',
    fontWeight: '600',
  },
  currenciesContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  currencyHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E86AB',
  },
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  currencyLeft: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  currencyName: {
    fontSize: 14,
    color: '#666',
  },
  currencyRate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E86AB',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
  settingsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  fontSizeSelector: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
    gap: 8,
  },
  fontSizeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  fontSizeButtonActive: {
    backgroundColor: '#2E86AB',
    borderColor: '#2E86AB',
  },
  fontSizeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  fontSizeButtonTextActive: {
    color: '#fff',
  },
});

export default MainScreen;
