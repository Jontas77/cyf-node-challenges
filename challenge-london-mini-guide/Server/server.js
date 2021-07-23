const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) =>
  res.send(
    "Welcome to London city guide. Search for /pharmacies, /doctors, /colleges, /hospitals"
  )
);




app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
