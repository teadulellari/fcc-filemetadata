const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const mongoose = require('mongoose');
const mySecret = process.env['MONGO_URI']
const router = express.Router()
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use('/api', router)


//connect to db
mongoose.connect(mySecret);
const database = mongoose.connection

//test connection if it is an errror
database.on('error', (error) => {
  console.log(error)
})


//check with this event listener if the process happened once
database.once('connected', () => {
  console.log('Database Connected');
})


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//post the request
router.post("/fileanalyse", upload.single("upfile"), (req, res) => {
  try {
    res.json({name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size});
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
});



const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Your app is listening on port ' + port)
});
