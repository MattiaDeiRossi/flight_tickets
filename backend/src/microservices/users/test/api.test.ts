import { expect } from 'chai';
import { Express } from 'express';
import { startDB } from '../src/db';
import app from '../src/app';
import request from 'supertest';

interface User {
  password: string,
  username: string,
  role: string
};

describe('User API', () => {

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const response = await request(app).get('/users');
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser : User = {
        username: 'testuser',
        password: 'pass',
        role: 'admin'
      };

      const response = await request(app)
        .post('/users')
        .send(newUser);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('username', newUser.username);
    });
  });

  describe('GET /users/:username', () => {
    it('should get a specific user', async () => {
      const response = await request(app).get('/users/testuser');
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('username', 'testuser');
    });
  });

  describe('DELETE /users/:username', () => {
    it('should delete a user', async () => {
      const response = await request(app).delete('/users/testuser');
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('count', 1);
    });
  });
});
