const express = require("express");
const cors = require("cors");
const moment = require('moment');
const bookings = require("./bookings.json");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Welcome
app.get("/", (req, res) => {
  res.json("Hotel booking server.  Ask for /bookings, etc.");
});

// Get all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// Create new booking
app.post("/bookings", (req, res) => {
  const newBooking = {
    id: "",
    ...req.body,
  };

  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = newBooking;

  if (
    !title ||
    title === "" ||
    !firstName ||
    firstName === "" ||
    !surname ||
    surname === "" ||
    !email ||
    email === "" ||
    !roomId ||
    roomId === "" ||
    !checkInDate ||
    checkInDate === "" ||
    !checkOutDate ||
    checkOutDate === ""
  ) {
    return res.status(400).json({ msg: "Please enter a value in all fields" });
  }

  bookings.push(newBooking);
  bookings.forEach((booking, index) => {
    booking.id = index + 1;
  });
  res.json({
    msg: "Booking Added!",
    bookings,
  });
});

// Get one booking by id
const bookingId = (req) => (booking) => booking.id === parseInt(req.params.id);

app.get("/bookings/:id", (req, res) => {
  const foundBooking = bookings.some(bookingId(req));

  if (foundBooking) {
    res.json(bookings.filter(bookingId(req)));
  } else {
    res
      .status(404)
      .json({ msg: `Booking not found with id: ${req.params.id}` });
  }
});

// Delete a booking by id
app.delete("/bookings/:id", (req, res) => {
  const foundBooking = bookings.some(bookingId(req));

  if (foundBooking) {
    res.json({
      msg: "Booking deleted!",
      bookings: bookings.filter((booking) => !bookingId(req)(booking)),
    });
  } else {
    res
      .status(404)
      .json({ msg: `Booking not found with id: ${req.params.id}` });
  }
});

// Search by date
app.get('/bookings/search', (req, res) => {
    const date = req.query.date;

    if(date) {
        const searchDate = bookings.filter(item => {
            return (
                item.checkInDate.includes(date(moment().format('YYYY-MM-DD'))) ||
                item.checkOutDate.includes(date(moment().format('YYYY-MM-DD')))
            );
        })
        res.send(searchDate);
    } else {
        res.status(404).json({ msg: 'Date not found' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is started at port: ${PORT}`));

/*

| method | example path                     | behaviour                                   |
| ------ | -------------------------------- | ------------------------------------------- |
| GET    | /bookings                        | return all bookings                         |
| GET    | /bookings/17                     | get one booking by id                       |
| GET    | /bookings/search?term=jones      | get all bookings matching a search term     |
| POST   | /bookings                        | create a new booking                        |
| DELETE | /bookings/17                     | delete a booking by id                      |
| GET    | /bookings/search?date=2019-05-20 | return all bookings spanning the given date |

*/


