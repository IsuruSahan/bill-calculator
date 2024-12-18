const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const path = require('path');


const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// API routes
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back the React app.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});



app.use(cors());
app.use(bodyParser.json());

app.post("/calculate-bill", (req, res) => {
  const { totalFoodAmount, totalLiquorAmount, totalCigaretteAmount, friends } = req.body;

  const drinkers = friends.filter((f) => f.drinks).length;
  const smokers = friends.filter((f) => f.smokes).length;
  const totalFriends = friends.length;

  // Calculate shares
  const foodShare = totalFoodAmount / totalFriends;
  const liquorShare = drinkers > 0 ? totalLiquorAmount / drinkers : 0;
  const cigaretteShare = smokers > 0 ? totalCigaretteAmount / smokers : 0;

  const result = friends.map((friend) => {
    let total = foodShare; // Everyone pays for food
    if (friend.drinks) total += liquorShare; // Add liquor share if applicable
    if (friend.smokes) total += cigaretteShare; // Add cigarette share if applicable
    return { name: friend.name, total: total.toFixed(2) };
  });

  res.json(result);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
