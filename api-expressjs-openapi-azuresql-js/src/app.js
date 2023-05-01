const express = require('express');

// Import App routes
const person = require('./route_person');
const openapi = require('./route_openapi');

const port = process.env.PORT || 3000;

const app = express();

// Development only - don't do in production
// Run this to create the table in the database
if (process.env.NODE_ENV === 'development') {
  const Database = require('./dbazuresql');
  const { noPasswordConfig } = require('./config');
  const database = new Database(noPasswordConfig);
  database
    .executeQuery(
      `CREATE TABLE Person (id int NOT NULL IDENTITY, firstName varchar(255), lastName varchar(255));`
    )
    .then(() => {
      console.log('Table created');
    })
    .catch((err) => {
      // Table may already exist
      console.error(`Error creating table: ${err}`);
    });
}

// Connect App routes
app.use('/api-docs', openapi);
app.use('/persons', person);
app.use('*', (_, res) => {
  res.redirect('/api-docs');
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});