const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const {User,Exercise} = require('./database');
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const saveUser= async (name) =>{
  try{
      const data = new User({
      username : name,
      });
      const savedData = await data.save();
      console.log("User saved",savedData);
      return savedData;
  }
  catch(err){
      console.error("User not saved",err);
  }
}

const saveExercise = async (id,name,description, duration, date) =>{
  try{
      const data = new Exercise({
          userid : id,
          username : name,
          description : description,
          duration : duration,
          date : date
      });
      const savedData = await data.save();
      console.log("Exercise saved",savedData);
      return savedData;
  }
  catch(err){
      console.error("Exercise not saved",err);
  }
}


app.get('/api/users',async (req,res)=>{
  try {
    const data = await User.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve data" });
  }
})

app.post('/api/users', async (req,res)=>{
  try{
    const data = await saveUser(req.body.username);
    res.json({
      username: data.username,
      _id: data._id,
    });
  }
  catch(err){
    console.error(err);
  }
})

app.post('/api/users/:_id/exercises',async (req,res)=>{
  try{
    const id = req.params._id;
    const data = await User.findById(id);
    if (!data) res.end("not found");
    const eData = await saveExercise(id,data.username,req.body.description,req.body.duration,req.body.date);
    res.json({  
      username: eData.username,
      description : eData.description,
      duration : eData.duration,  
      date : new Date(eData.date).toDateString(),
      _id: eData.userid
  });
  }
  catch(err){
    console.error(err);
  }
})

app.get('/api/users/:_id/logs',async(req,res)=>{
  const id = req.params._id
  const user = await User.findById(id);
  const limit = Number(req.query.limit)||0;
  const from = req.query.from || new Date(0);
  const to = req.query.to || new Date(Date.now());
  const log = await Exercise.find({
    userid:id,
    date:{$gte: from , $lte: to}
  }).limit(limit);
  const count = log.length;
  let userLog = log.map((each) => {
    return {
      description: each.description,
      duration: each.duration,
      date: new Date(each.date).toDateString(),
    };
  });
  res.json({
    username: user.username,
    count : count,
    _id: user.userid,
    log: userLog
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
