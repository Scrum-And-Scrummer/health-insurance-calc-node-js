const express = require('express');
const cors = require("cors");
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'static')));

// CORS config for static site
const allowedOrigin = 'https://proud-rock-062952f10.6.azurestaticapps.net';
app.use(cors({
  origin: allowedOrigin
}));

// Convert to metric units (used elsewhere)
const convertToMetric = (weight, height) => {
  const weightInKg = weight * 0.453592;
  const heightInCm = height * 2.54;
  return { weightInKg, heightInCm };
};

// /convert route (optional)
app.get('/convert', (req, res) => {
  console.log('Calling "/convert" on the Node.js server.');
  const weight = parseFloat(req.query.weight);
  const height = parseFloat(req.query.height);
  const metricValues = convertToMetric(weight, height);
  res.json(metricValues);
});

// ✅ /calcBMI route
app.get('/calcBMI', (req, res) => {
  const weight = parseFloat(req.query.weight); // in lbs
  const height = parseFloat(req.query.height); // in inches

  const weightInKg = weight * 0.453592;
  const heightInMeters = height * 0.0254;
  const bmi = weightInKg / (heightInMeters * heightInMeters);
  let category = "";

  if (bmi >= 18.5 && bmi <= 24.9) category = "normal";
  else if (bmi >= 25.0 && bmi <= 29.9) category = "overweight";
  else category = "obese";

  res.json({ bmi: bmi.toFixed(1), category });
});

// ✅ Risk calculation logic
const calculatePoints = (age, bmi, bloodPressure, familyDisease) => {
  let totalPoints = 0;
  let bmiCategory = "";

  // Age
  if (age < 30) totalPoints += 0;
  else if (age < 45) totalPoints += 10;
  else if (age < 60) totalPoints += 20;
  else totalPoints += 30;

  // BMI
  if (bmi >= 18.5 && bmi <= 24.9) { bmiCategory = "normal"; totalPoints += 0; }
  else if (bmi >= 25.0 && bmi <= 29.9) { bmiCategory = "overweight"; totalPoints += 30; }
  else { bmiCategory = "obese"; totalPoints += 75; }

  // Blood Pressure
  const bpPoints = {
    "normal": 0,
    "elevated": 15,
    "stage 1": 30,
    "stage 2": 75,
    "crisis": 100
  };
  totalPoints += bpPoints[bloodPressure] || 0;

  // Family History
  if (familyDisease.includes("diabetes")) totalPoints += 10;
  if (familyDisease.includes("cancer")) totalPoints += 10;
  if (familyDisease.includes("Alzheimer's")) totalPoints += 10;

  // Risk Category
  let riskCategory = "";
  if (totalPoints <= 20) riskCategory = "Low Risk";
  else if (totalPoints <= 50) riskCategory = "Moderate Risk";
  else if (totalPoints <= 75) riskCategory = "High Risk";
  else riskCategory = "Uninsurable";

  return { totalPoints, riskCategory, bmiCategory };
};

// ✅ /totalPoints route
app.get('/totalPoints', (req, res) => {
  console.log('Calling "/totalPoints" on the Node.js server.');
  const age = parseInt(req.query.age);
  const bmi = parseFloat(req.query.bmi);
  const bloodPressure = req.query.bloodPressure;
  const familyDisease = req.query.familyDisease ? req.query.familyDisease.split(',') : [];

  const result = calculatePoints(age, bmi, bloodPressure, familyDisease);
  res.json(result);
});

// 404 fallback
app.use((req, res) => {
  res.status(404);
  res.sendFile(path.join(__dirname, 'static', '404.html'));
});

// Start server
app.listen(port, () => console.log(
  `Express started at http://localhost:${port}\n` +
  `Press Ctrl+C to stop.`
));
