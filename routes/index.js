var express = require('express');
var router = express.Router();
var workoutModel = require('../modules/db');
var deadliftModel = require('../modules/db-d');
var squatModel = require('../modules/db-s');
var benchModel = require('../modules/db-b');
var userModel = require('../modules/user');

var muscle = [
  {
  img:"images/pexels-mister-mister-3490348.jpg",
  name:"Close Grip Bench Press",
  problem:"You lack strength at lock out",
  why:"It places more loading demand on the triceps and therefore builds tricep strength.",
  weight:"10% less than your usual sets",
  set:"3 to 5 sets of 5+ reps",
  desc:"The close grip bench press uses a grip that is at least five finger-lengths inside where you normally grip the bar. Therefore, how narrow your grip is on a close grip bench will depend on how wide your grip is normally. As a general rule of thumb though, don’t grip the bar narrower than shoulder-width distance on a close-grip bench press.",
  link:"https://docs.google.com/spreadsheets/d/16raF4jbE3gmugNAm8HOdkMk44iOt0eNFkYOo8C0oPZY/edit#gid=824460270",
}
];

var compound;
var ex;

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('main');
});

router.get('/accessories', function(req, res, next) {
  res.render('accessories');
});

router.get('/bench', function(req, res, next) {
  res.render('bench');
});

router.get('/custom', function(req, res, next) {
  res.render('custom');
});

// router.post('/custom-program', async function(req, res, next) {
//   var goal = req.body.goal;
//   var week = req.body.week;
//   var day = req.body.day;
//   workout = await workoutModel.find();
//   res.render('custom-program', {compound, ex, goal, week, day, workout});
// });

router.post('/custom-program', async function(req, res, next) {
  var exp = parseInt(req.body.experience);
  var lift = req.body.lift.split(' ');
  var workout;
  if(req.body.week == "short"){
    if(req.body.day == "short"){
      workout = await workoutModel.find(
        {experience: exp,
        goal: { $all: [req.body.goal] },
        lift: { $all: lift },
        duration: {$lte: 6},
        day: {$lte: 3}}
      );
    }else{
      workout = await workoutModel.find(
        {experience: exp,
        goal: { $all: [req.body.goal] },
        lift: { $all: lift },
        duration: {$lte: 6},
        day: {$gt: 3}}
      );
    };
  }else if(req.body.week == "long"){
    if(req.body.day == "short"){
      workout = await workoutModel.find(
        {experience: exp,
        goal: { $all: [req.body.goal] },
        lift: { $all: lift },
        duration: {$gt: 6},
        day: {$lte: 3}}
      );
    }else{
      workout = await workoutModel.find(
        {experience: exp,
        goal: { $all: [req.body.goal] },
        lift: { $all: lift },
        duration: {$gt: 6},
        day: {$gt: 3}}
      );
    };
  }else{
    if(req.body.day == "short"){
      workout = await workoutModel.find(
        {experience: exp,
        goal: { $all: [req.body.goal] },
        lift: { $all: lift },
        day: {$lte: 3}}
      );
    }else{
      workout = await workoutModel.find(
        {experience: exp,
        goal: { $all: [req.body.goal] },
        lift: { $all: lift },
        day: {$gt: 3}}
      );
    };
  };
  if(workout.length == 0){
    workout = await workoutModel.find(
      {experience: exp,
      goal: { $all: [req.body.goal] },
      lift: { $all: lift }}
    );
  };
  if(workout.length>1){
    workout = [workout[0]];
  };
  var users = await userModel.find();
  
  if(req.session.user!=undefined && req.session.user!=null){
    await userModel.updateOne(
      {email: req.session.user.email},
      {$push: {workouts: workout}}
    );
  };
  res.render('custom-program', {workout});
});

router.get('/compound', async function(req, res, next) {
  var exercise;
  var deadlift = await deadliftModel.find();
  console.log('deadlift', deadlift)
  var squat = await squatModel.find();
  var bench = await benchModel.find();
  if(req.query.page == "Deadlift"){
    exercise = deadlift;
    console.log('deadlift', deadlift)
    console.log('ex', exercise)
  }else if(req.query.page == "Squat"){
    exercise = squat;
  }else if(req.query.page == "Bench"){
    exercise = bench;
  };
  res.render('compound',{exercise, lift: req.query.page});
});

router.get('/exercises', function(req, res, next) {
  res.render('exercises');
});

router.get('/login', function(req, res, next) {
  var alert = false;
  var exist = null;
  res.render('login', {type: req.query.type, alert, exist});
});

router.post('/signin', async function(req, res, next){
  var user = await userModel.findOne(
    {email: req.body.email}
  );
  if(user == null){
    var alert = true;
    var exist = null;
    var type = '';
    res.render('login',{type, alert, exist});
  }else if (user.email == req.body.email && user.password == req.body.password){
    req.session.user = user;
    res.redirect('/mypage');
  }else{
    var alert = true;
    var exist = null;
    var type = '';
    res.render('login', {type, alert, exist});
  }
});

router.post('/signup', async function(req, res, next){
  var exist = await userModel.findOne(
    {email: req.body.emailup}
  );
  if(exist == null){
  var newUser = new userModel({
    username: req.body.username,
    email: req.body.emailup,
    password: req.body.passwordup
  })
  req.session.user = newUser;
  await newUser.save();
  res.redirect('/mypage')
  }else{
    var type = 'signup';
    var alert = false;
    res.render('login',{type, alert, exist});
  }
});

router.get('/logout', function(req,res){
  req.session.user = null;
  res.redirect('/login');
});

router.get('/mypage', function(req, res, next) {
  var name = req.session.user.username.charAt(0).toUpperCase() + req.session.user.username.slice(1);
  res.render('mypage', {name});
});

router.get('/mypage-modify', function(req, res, next) {
  res.render('mypage-mod', {user: req.session.user});
});

router.post('/mypage', function(req, res, next) {
  console.log(req.body);
  res.redirect('/mypage');
});

router.get('/muscles', function(req, res, next) {
  res.render('muscles');
});

router.get('/muscle-group', function(req, res, next) {
  res.render('muscle-group',{muscle, group: req.query.name});
});

router.get('/squat', function(req, res, next) {
  res.render('squat');
});

router.get('/workout', async function(req, res, next) {
  var workout;
  if(Object.keys(req.query).length == 0){
    workout = await workoutModel.find();
  }else{
    if(req.query.exp !=undefined){
      workout = await workoutModel.find(
        {experience: exp}
      );
    }else if(req.query.goal !=undefined){
      workout = await workoutModel.find(
        {goal: req.query.goal}
      );
    }else if(req.query.lift !=undefined){
      workout = await workoutModel.find(
        {lift: req.query.lift}
      );
    }else if(req.query.dur !=undefined){
      if(req.query.dur<=6){
        workout = await workoutModel.find(
          {duration: {$lte: req.query.dur}}
        );
      }else{
        workout = await workoutModel.find(
          {duration: {$gte: req.query.dur}}
        );
      }
    };
  };
  res.render('workout',{workout});
});

router.get('/yourprogram-compound', function(req, res, next) {
  res.render('yourprogram-1');
});

router.post('/yourprogram-accessories', function(req, res, next) {
  compound = req.body.compound;
  var exercise = [...deadlift];
  squat.forEach(el =>{
    exercise.push(el);
  });
  bench.forEach(el =>{
    exercise.push(el);
  });
  res.render('yourprogram-2',{exercise});
});

router.post('/yourprogram-param', function(req, res, next) {
  ex = req.body.ex;
  res.render('yourprogram-3');
});

router.get('/yourworkouts', async function(req, res, next) {
  if(req.query.add != undefined ){
    var workout = await workoutModel.find();
    var add = true;
  }else{
    var user = await userModel.findOne({email: req.session.user.email});
    var workout = user.workouts;
  }
  var display = "display: none;";
  res.render('yourworkouts', {workout, add, display});
});

router.post('/workouts', async function(req, res, next) {
  if(typeof req.body.workout == 'string'){
    var program = await workoutModel.findById(req.body.workout);
    await userModel.updateOne(
      {email: req.session.user.email},
      {$push: {workouts: program}}
    );
  }else{
    var test = req.body.workout
    test.forEach(async function(el){
      var program = await workoutModel.findOne({_id: el})
      await userModel.updateOne(
        {email: req.session.user.email},
        {$push: {workouts: program}}
      );
    }); 
  };
  res.redirect('/yourworkouts');
});

module.exports = router;
