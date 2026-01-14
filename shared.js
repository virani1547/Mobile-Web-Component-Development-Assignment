// Shared utilities and API functions
const API_BASE = 'http://localhost:5000/api';

const api = {
  async request(method, endpoint, body = null) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = './login.html';
    }

    return response.json();
  },

  get(endpoint) { return this.request('GET', endpoint); },
  post(endpoint, body) { return this.request('POST', endpoint, body); },
  put(endpoint, body) { return this.request('PUT', endpoint, body); },
  delete(endpoint) { return this.request('DELETE', endpoint); }
};

// Utility functions
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getDaysUntil(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const diff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function getUrlParam(param) {
  const url = new URLSearchParams(window.location.search);
  return url.get(param);
}

// Auth check
function ensureAuthenticated() {
  const user = localStorage.getItem('user');
  if (!user) {
    window.location.href = './login.html';
  }
  return JSON.parse(user);
}
