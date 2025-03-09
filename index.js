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

const calculatePoints = (age, bmi, bloodPressure, familyDisease) => { // Written by Savannah Stumpf
  let totalPoints = 0

  if (age < 30) {
    totalPoints += 0
  } else if (age < 45) {
    totalPoints += 10
  } else if (age < 60) {
    totalPoints += 20
  } else {
    totalPoints += 30
  }

  if (bmi >= 18.5 && bmi <= 24.9) { // normal
    totalPoints += 0
  } else if (bmi >= 25.0 && bmi <= 29.9) { // overweight
    totalPoints += 30
  } else { // obesity
    totalPoints += 75
  }

  if (bloodPressure == 'normal') {
    totalPoints += 0
  } else if (bloodPressure == 'elevated') {
    totalPoints += 15
  } else if (bloodPressure == 'stage 1') {
    totalPoints += 30
  } else if (bloodPressure == 'stage 2') {
    totalPoints += 75
  } else if (bloodPressure == 'crisis') {
    totalPoints += 100
  }

  // for family disease, maybe it can be an array? 
  // Each disease can be searched for in the array
  if (familyDisease.includes('diabetes')) {
    totalPoints += 10
  }
  if (familyDisease.includes('cancer')) {
    totalPoints += 10
  }
  if (familyDisease.includes('Alzheimer\'s')) {
    totalPoints += 10
  }

}

app.get('/calculatePoints', (request, response) => { // Written by Savannah Stumpf
  console.log('Calling "/totalPoints" on the Node.js server.')
  const pointTotal = calculatePoints(age, bmi, bloodPressure, familyDisease)
  response.json({ pointTotal })
})

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