const express = require('express')
const app = express()
const port = 5000
app.use(express.json())
let estimatedTime = 13;
app.get('/', (req, res) => {
  res.send("hello")
})
app.get('/estimatedTime',(req,res)=>{
    res.status(200).send({estimatedTime});
})
app.post('/estimatedTime',(req,res)=>{
    const body = req.body;
    console.log(body)
    estimatedTime = (estimatedTime + body.time)/2;
    console.log(estimatedTime)
    res.status(200).send("ok")
})
app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})