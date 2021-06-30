const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

const welcomeMessage = {
  id: 1,
  from: "Jonathan",
  text: "Welcome to CYF chat system!",
};

const messages = [welcomeMessage];

// Render file on front-End
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Get all messages
app.get("/messages", (req, res) => res.send(messages));

// Add messages
app.post("/messages", (req, res) => {
  const newMessage = {
    id: "",
    ...req.body,
  };

  if (!newMessage.from || !newMessage.text) {
    return res.status(400).json({ msg: "Please include a name and message" });
  }

  messages.push(newMessage);
  messages.forEach((msg, index) => {
    msg.id = index + 1;
  });
  res.json(messages);
});

// Get single message by id
const idMessage = req => message => message.id === parseInt(req.params.id);

app.get('/:id', (req, res) => {
    const foundMsg = messages.some(idMessage(req));

    if(foundMsg) {
        res.json(messages.filter(idMessage(req)))
    } else {
        res.status(400).json({ msg: `No message with the id: ${req.params.id}` })
    }
});

// Delete a message by id
app.delete('/:id', (req, res) => {
    const foundMsg = messages.some(idMessage(req));

    if(foundMsg) {
        res.json({
            msg: "Message deleted",
            messages: messages.filter(message => !idMessage(req)(message))
        })
    } else {
        res.status(400).json({ msg: `No message with the id: ${req.params.id}` })
    } 
});

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
