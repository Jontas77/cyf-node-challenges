const express = require('express');
const cors = require('cors');
const bookings = require('./bookings.json');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Welcome
app.get('/', (req, res) => {
    res.json("Hotel booking server.  Ask for /bookings, etc.");
});

// Get all bookings
app.get('/bookings', (req, res) => {
    res.json(bookings);
});

// Create new booking
app.post('/bookings', (req, res) => {
    const newBooking = {
        id: "",
        roomId: "",
        ...req.body
    }

    bookings.push(newBooking)
    res.json(bookings);
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