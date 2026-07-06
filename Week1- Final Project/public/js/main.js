// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const body = document.body;

// Initialize theme from localStorage
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    updateThemeIcon('light');
  } else {
    body.classList.remove('dark-mode');
    updateThemeIcon('dark');
  }
};

// Update theme icon
const updateThemeIcon = (mode) => {
  if (themeToggle) {
    themeToggle.textContent = mode === 'dark' ? '☀️' : '🌙';
  }
};

// Toggle theme
const toggleTheme = () => {
  const isDark = body.classList.contains('dark-mode');
  if (isDark) {
    body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    updateThemeIcon('dark');
  } else {
    body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    updateThemeIcon('light');
  }
};

// Event listener for theme toggle
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', initTheme);

// Auth Helper Functions
const getToken = () => localStorage.getItem('token');
const getUserId = () => localStorage.getItem('userId');
const setAuth = (token, userId, userData) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
  localStorage.setItem('userData', JSON.stringify(userData));
};
const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userData');
};

// API Helper
const apiCall = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAuth();
    window.location.href = '/login';
    return null;
  }

  return response;
};

// Show alert message
const showAlert = (message, type = 'success') => {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} fade-in`;
  alertDiv.textContent = message;
  
  const container = document.querySelector('.container') || document.body;
  container.insertBefore(alertDiv, container.firstChild);

  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!getToken();
};

// Redirect if not authenticated
const requireAuth = () => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
  }
};
