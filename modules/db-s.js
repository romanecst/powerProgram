var mongoose = require('mongoose');

var deadliftSchema = mongoose.Schema({
    img: String,
    name: String,
    problem: String,
    why: String,
    weight: String,
    set: String,
    desc: String,
    link: String
    });
    

var squatModel = mongoose.model('squat', deadliftSchema);

module.exports = squatModel;