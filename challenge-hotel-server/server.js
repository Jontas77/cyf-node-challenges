const express = require('express');
const cores = require('cores');

const app = express();


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => console.log(`Server is started at port: ${PORT}`));
