const connectToMongo = require('./db')
connectToMongo()
const cors = require('cors');
const express = require('express')
const app = express()
const port = process.env.PORT

app.use(cors());
require("dotenv").config()
app.use(cors({
  origin: 'https://livanzo.vercel.app',
  credentials: true,
}));
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/auth',require('./routes/auth'))
app.use('/api/hostel', require('./routes/hostel'))
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`HostelHub app listening on http://localhost:${port}/`)
})