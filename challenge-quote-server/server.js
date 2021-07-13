const express = require("express");
const cors = require("cors");
const lodash = require("lodash");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const quotes = require("./quotes.json");

app.get("/", function (request, response) {
  response.send(
    "Jonathan's Quote Server!  Ask me for /quotes/random, or /quotes"
  );
});


// Level 1
app.get("/quotes", (request, response) => {
  response.send(quotes);
});


// app.get("/quotes/random", (request, response) => {
//   response.send(pickFromArray(quotes));
// });

// Challenge add lodash library to get random quote
app.get("/quotes/random", (request, response) => {
  response.send(lodash.sample(quotes));
});


// Level 2

app.get("/quotes/search", (request, response, next) => {
  const term = request.query.term;
  console.log(term);
  if (term) {
    const searchTerm = quotes.filter((item) => {
      return (
        item.quote.toLowerCase().includes(term.toLowerCase()) ||
        item.author.toLowerCase().includes(term.toLowerCase())
      );
    });
    response.send(searchTerm);
  } else {
    response.send([]);
  }
});


function pickFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
