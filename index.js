const express = require('express');
const cors = require("cors");
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'static')));
const allowedOrigin = '*'; // Right now, the server allows requests from any source. We will need to replace the asterisk with URL to the static website
app.use(cors({
  origin: allowedOrigin
}));


// We need an app.get function for adding up the points.

// We need an app.get function for calculating BMI.

// Any other calculations also need an app.get function.

app.use((request, response) => {
    response.status(404);
    response.sendFile(path.join(__dirname, 'static', '404.html'));
});

app.listen(port, () => console.log(
    `Express started at "http://localhost:${port}"\n` +
    `press Ctrl-C to terminate.`
));