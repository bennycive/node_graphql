const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mysql = require('mysql2');

const connection = require('./config/config');



// Define GraphQL schema
const schema = buildSchema(`
  type Student {
    id: ID!
    name: String!
    age: Int!
    major: String!
  }

  type Query {
    students: [Student]
    student(id: ID!): Student
  }

  type Mutation {
    addStudent(name: String!, age: Int!, major: String!): Student
    updateStudent(id: ID!, name: String, age: Int, major: String): Student
    deleteStudent(id: ID!): Student
  }
`);

// Root resolver
const root = {
  students: async () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM students', (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },
  student: async ({ id }) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM students WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  },
  addStudent: async ({ name, age, major }) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO students (name, age, major) VALUES (?, ?, ?)', [name, age, major], (err, results) => {
        if (err) reject(err);
        resolve({ id: results.insertId, name, age, major });
      });
    });
  },
  updateStudent: async ({ id, name, age, major }) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE students SET name = ?, age = ?, major = ? WHERE id = ?', [name, age, major, id], (err, results) => {
        if (err) reject(err);
        resolve({ id, name, age, major });
      });
    });
  },
  deleteStudent: async ({ id }) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM students WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        resolve({ id });
      });
    });
  },
};

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Enable GraphiQL interface
}));

app.listen(4000, () => console.log('Server is running on http://localhost:4000/graphql'));
