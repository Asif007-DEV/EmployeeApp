var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/employee',{useNewUrlParser: true});
var imgSchema = new mongoose.Schema({
    imgfile: String,
});

var imgModel = mongoose.model('imgCollection', imgSchema);
module.exports= imgModel;