const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.get('/.netlify/functions/server', (req, res) => {
  res.send('Hello from Node.js on Netlify!');
});

module.exports.handler = serverless(app);
