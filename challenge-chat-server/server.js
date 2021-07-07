const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

const welcomeMessage = {
  id: 1,
  from: "Jonathan",
  text: "Welcome to CYF chat system!",
  timeSent: new Date(),
};

let messages = [welcomeMessage];

// Render file on front-End
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Get all messages
app.get("/messages", (req, res) => res.send(messages));

// Search messages - Read only messages with certain substrings
app.get("/messages/search", (req, res) => {
  const searchText = req.query.text;

  if (searchText) {
    const searchMsg = messages.filter((msg) => {
      return msg.text.toLowerCase().includes(searchText.toLowerCase());
    });
    res.send(searchMsg);
  } else {
    res.status(404).json({ msg: "No Results Found" });
  }
});

// Get only latest 10 messages
app.get("/messages/latest", (req, res) => res.send(messages.slice(-10)));

// Add messages
app.post("/messages", (req, res) => {
  const newMsg = {
    id: "",
    ...req.body,
    timeSent: new Date(),
  };

  if (
    !newMsg.from ||
    newMsg.from === "" ||
    !newMsg.text ||
    newMsg.text === ""
  ) {
    return res.status(400).json({ msg: "Please include a name and message" });
  }

  messages.push(newMsg);
  messages.forEach((msg, index) => (msg.id = index + 1));

  res.json(messages);
});

// Get single message by id
// const idMessage = (req) => (message) => message.id === parseInt(req.params.id);

app.get("/messages/:id", (req, res) => {
  // const foundMsg = messages.some(idMessage(req));
  const { id } = req.params;

  const foundMsg = messages.find((msg) => msg.id === parseInt(id));

  if (foundMsg) {
    res.send(foundMsg);
    // res.json(messages.filter(idMessage(req)));
  } else {
    res.status(400).json({ msg: `No message with the id: ${id}` });
  }
});

// Update messages
app.put("/messages/:id", (req, res) => {
  const { id } = req.params;

  const foundMsg = messages.find((msg) => msg.id === parseInt(id));

  if (foundMsg) {
    const updateMsg = req.body;
    messages.forEach((msg) => {
      if (msg.id === parseInt(id)) {
        msg.from = updateMsg.from ? updateMsg.from : msg.from;
        msg.text = updateMsg.text ? updateMsg.text : msg.text;

        res.json({
          msg: `Message updated with id: ${id}`,
          msg,
        });
      }
    });
  }
});

// Delete a message by id
app.delete("/messages/:id", (req, res) => {
  const { id } = req.params;

  const found = messages.find((msg) => msg.id === parseInt(id));

  if (found) {
    messages = messages.filter((msg) => msg.id !== parseInt(`${id}`));
    res.send(`Message deleted with id: ${id}`);
  } else {
    res.status(400).json({ msg: `No message with the id: ${id}` });
  }
});

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
