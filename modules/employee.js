var mongoose = require('mongoose');
/*here we can perform all task in offline database */
mongoose.connect('mongodb://localhost:27017/employee',{useNewUrlParser: true});
// mongoose.connect('mongodb+srv://mongouser:asifsaifi@cluster0-akjum.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true});

// var conn=mongoose.connection;

var employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    etype:String,
    hourlyrate: Number,
    totalHour: Number,
    total: Number
});

var employeeModel = mongoose.model('empcollaction', employeeSchema);
module.exports= employeeModel;