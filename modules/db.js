var mongoose = require('mongoose');

var workoutSchema = mongoose.Schema({
    img: String,
    name: String,
    lift: Array,
    goal: Array,
    duration: Number,
    day: Number,
    experience: Number,
    color: String,
    desc: String,
    link: String
   });


var workoutModel = mongoose.model('workout', workoutSchema);

module.exports = workoutModel;
