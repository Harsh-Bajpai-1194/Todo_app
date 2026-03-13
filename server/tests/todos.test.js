const request = require('supertest');
const jwt = require('jsonwebtoken');
const server = require('../server');

describe('Todos API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    // Create a user and log in to get a token before each test
    const userRes = await request(server)
      .post('/api/users')
      .send({
        name: 'Todo User',
        email: 'todo@example.com',
        password: 'password123',
      });
    token = userRes.body.token;
    const decoded = jwt.decode(token);
    userId = decoded.user.id;
  });

  describe('POST /api/todos', () => {
    it('should create a new todo for the authenticated user', async () => {
      const res = await request(server)
        .post('/api/todos')
        .set('x-auth-token', token)
        .send({ task: 'A brand new task', time: '14:00' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.task).toBe('A brand new task');
      expect(res.body.user).toEqual(userId);
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(server)
        .post('/api/todos')
        .send({ task: 'This should fail' });

      expect(res.statusCode).toEqual(401);
      expect(res.body.msg).toBe('No token, authorization denied');
    });
  });

  describe('GET /api/todos', () => {
    it('should get all todos for the authenticated user', async () => {
      // Create a todo for the user first
      await request(server)
        .post('/api/todos')
        .set('x-auth-token', token)
        .send({ task: 'My first todo' });

      const res = await request(server)
        .get('/api/todos')
        .set('x-auth-token', token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(1);
      expect(res.body[0].task).toBe('My first todo');
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(server).get('/api/todos');
      expect(res.statusCode).toEqual(401);
    });

    it("should not return another user's todos", async () => {
      // Create a todo for the main user
      await request(server)
        .post('/api/todos')
        .set('x-auth-token', token)
        .send({ task: 'Main user todo' });

      // Create a second user and get their token
      const otherUserRes = await request(server)
        .post('/api/users')
        .send({
          name: 'Other User',
          email: 'other@example.com',
          password: 'password123',
        });
      const otherToken = otherUserRes.body.token;

      // As the second user, fetch todos
      const res = await request(server)
        .get('/api/todos')
        .set('x-auth-token', otherToken);

      // The second user should see an empty array, not the main user's todo
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(0);
    });
  });

  describe('PUT /api/todos/:id', () => {
    let todoToUpdate;

    beforeEach(async () => {
      // Create a todo to be updated in each test
      const res = await request(server)
        .post('/api/todos')
        .set('x-auth-token', token)
        .send({ task: 'Task to be updated' });
      todoToUpdate = res.body;
    });

    it('should update a todo for the authenticated user', async () => {
      const res = await request(server)
        .put(`/api/todos/${todoToUpdate._id}`)
        .set('x-auth-token', token)
        .send({ completed: true, task: 'Updated Task Name' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.completed).toBe(true);
      expect(res.body.task).toBe('Updated Task Name');
    });

    it("should return 401 if a user tries to update another user's todo", async () => {
      // Create a second user and get their token
      const otherUserRes = await request(server)
        .post('/api/users')
        .send({ name: 'Other User', email: 'other@example.com', password: 'password123' });
      const otherToken = otherUserRes.body.token;

      // As the second user, try to update the first user's todo
      const res = await request(server)
        .put(`/api/todos/${todoToUpdate._id}`)
        .set('x-auth-token', otherToken)
        .send({ completed: true });

      expect(res.statusCode).toEqual(401);
      expect(res.body.msg).toBe('Not authorized');
    });

    it('should return 404 if todo not found', async () => {
      const nonExistentId = '605c72ef9b8e8b001f8e8b8e'; // A valid but non-existent ObjectId
      const res = await request(server)
        .put(`/api/todos/${nonExistentId}`)
        .set('x-auth-token', token)
        .send({ completed: true });

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    let todoToDelete;

    beforeEach(async () => {
      const res = await request(server)
        .post('/api/todos')
        .set('x-auth-token', token)
        .send({ task: 'Task to be deleted' });
      todoToDelete = res.body;
    });

    it('should delete a todo for the authenticated user', async () => {
      const res = await request(server)
        .delete(`/api/todos/${todoToDelete._id}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.msg).toBe('Todo removed');
    });

    it("should return 401 if a user tries to delete another user's todo", async () => {
      const otherUserRes = await request(server)
        .post('/api/users')
        .send({ name: 'Malicious User', email: 'malicious@example.com', password: 'password123' });
      const otherToken = otherUserRes.body.token;

      const res = await request(server)
        .delete(`/api/todos/${todoToDelete._id}`)
        .set('x-auth-token', otherToken);

      expect(res.statusCode).toEqual(401);
    });
  });
});