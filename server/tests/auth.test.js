const request = require('supertest');
const server = require('../server');

describe('Auth API', () => {
  // Test user registration
  describe('POST /api/users', () => {
    it('should register a new user and return a token', async () => {
      const res = await request(server)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not register a user with an existing email', async () => {
      // First, create the user
      await request(server)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      // Then, try to create them again
      const res = await request(server)
        .post('/api/users')
        .send({
          name: 'Another User',
          email: 'test@example.com',
          password: 'password456',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.msg).toBe('User already exists');
    });

    it('should return validation errors for invalid input', async () => {
      const res = await request(server)
        .post('/api/users')
        .send({
          name: '',
          email: 'not-an-email',
          password: '123',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.errors).toBeInstanceOf(Array);
      expect(res.body.errors.length).toBe(3);
    });
  });

  // Test user login
  describe('POST /api/auth', () => {
    beforeEach(async () => {
      // Create a user to log in with before each test in this block
      await request(server)
        .post('/api/users')
        .send({
          name: 'Login User',
          email: 'login@example.com',
          password: 'password123',
        });
    });

    it('should log in an existing user and return a token', async () => {
      const res = await request(server)
        .post('/api/auth')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not log in with an incorrect password', async () => {
      const res = await request(server)
        .post('/api/auth')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.msg).toBe('Invalid Credentials');
    });
  });
});