const express = require('express')
const app = express()
const port = 5000
app.use(express.json())
let estimatedTime = 15;
app.get('/', (req, res) => {
  res.send("hello")
})
app.get('/estimatedTime',(req,res)=>{
    res.status(200).send({estimatedTime});
})
app.post('/estimatedTime',(req,res)=>{
    const body = req.body;
    estimatedTime = (estimatedTime + body.time)/2;
    res.status(200).send("ok")
})
app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})