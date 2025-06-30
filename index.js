const express = require('express');
const { connection } = require('./Database/db');
 
 
const app = express();
 
const PORT = 5000;
 
 
app.get('/', (req, res) => {
    res.send(`Server is running on ${PORT}`);
});
 
connection();
 
app.listen(PORT, () => {
 
   
    console.log(`Server is running on http://localhost:${PORT}`);
});