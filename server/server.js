const express = require('express')
const multer = require('multer')
const cors = require('cors')
const app = express()

app.use(cors())

const storage = multer.diskStorage(
  {
    destination:(req,file,cb)=>{
      cb(null,'uploads/')  
    },
    filename:(req,file,cb)=>{
      cb(null,req.body.hash)
    }
  },
  )
const upload = multer({storage})
const port = 5000

app.use(express.json())

app.post('/uploads',upload.single('file'),(req,res)=>{
  console.log(req.body);
  console.log(req.file);
  res.json({ message: "Successfully uploaded files" });
})

// app.use((req,res,next)=>{
//   if(req.headers.authorization !== "1234")
//     return res.status(403).json({ error: 'No credentials sent or credentials not matching!' }); 
//   else next()
// })
app.use("/uploads",express.static('uploads',{extensions:['jpg','jpeg']}))


app.listen(port, () => {
  console.log(`server listening at ${port}`)
})