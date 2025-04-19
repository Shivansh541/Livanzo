const connectToMongo = require('./db')
connectToMongo()
const cors = require('cors');
const express = require('express')
const app = express()
const port = 5000
app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/auth',require('./routes/auth'))
app.use('/api/hostel', require('./routes/hostel'))
app.listen(port, () => {
  console.log(`HostelHub app listening on http://localhost:${port}/`)
})