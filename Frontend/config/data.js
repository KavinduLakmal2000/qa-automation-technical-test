module.exports = {
  urls: {
    base: 'http://localhost:5173',
    login: 'http://localhost:5173/login',
    dashboard: 'http://localhost:5173/',
    register: 'http://localhost:5173/register',
    bulkCreate: 'http://localhost:5173/bulk-create'
  },

  credentials: {
    validUser: { email: 'john@example.com', password: 'StrongPass123!' },
    invalidUser: { email: 'john@example.com', password: 'WrongPass!' }
  },

  registration: {
    validUser: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'newuser@example.com',
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!'
    },
    missingEmail: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: '',
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!'
    },
    missingPassword: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: '',
      confirmPassword: ''
    },
    passwordMismatch: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'StrongPass123!',
      confirmPassword: 'WrongPass!'
    },
    invalidEmail: {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'invalid-email',
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!'
    },
    duplicateEmail: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!'
    }
  }
};
