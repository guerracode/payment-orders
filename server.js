const express = require('express');

const app = express();

const port = process.env.PORT | 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Ok');
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});