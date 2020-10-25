var express = require('express');
var router = express.Router();
var empModle = require('../modules/employee');
var employee = empModle.find({});
var multer = require('multer');
var path = require('path');
var ejs = require('ejs');
var imgModle = require('../modules/File');
var imgData = imgModle.find({});
var jwt = require('jsonwebtoken');
if(typeof localStorage === "undefined" || localStorage === null){
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

// set public folder path
router.use(express.static(__dirname+'./public'));
//storage object to store file destination and filename
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb){
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});
const upload = multer({
  storage:storage
}).single("file");
//get and post to upload a file and display
router.post('/upload',upload,function(req, res, next) {
  var imgName = req.file.filename;
  var success =req.file.filename+" Upload Successfully";
  var imgDetails = new imgModle({
    imgfile:imgName
  });
  imgDetails.save(function(err,doc){
    if(err) throw err;
    imgData.exec(function(err,data){
      if(err) throw err;
      res.render('upload-file', { title: 'Upload image', records:data ,success:success });
    });
  });
});
router.get('/upload', function(req, res, next) {
  imgData.exec(function(err,data){
    if(err) throw err;
    res.render('upload-file', { title: 'Upload image',records:data,success:"" });
  });
});

//checkLogin Function to verify login and logout token
function checkLogin(req,res,next){
  var myToken = localStorage.getItem('myToken');
  try{
    jwt.verify(myToken,'loginToken');
  }catch(err){
    res.send('you need to login');
  }
  next();
}

/* GET home page. */
router.get('/',checkLogin,function(req, res, next) {
  employee.exec(function(err,data){
    if(err) throw err;
    res.render('index', { title: 'Employee recordes', records:data,success:"" });
  });
});

//Login route
router.get('/login', function(req, res, next) {
  var token =jwt.sign({ foo: 'bar' }, 'loginToken');
  localStorage.setItem('myToken', token)
  res.send('Login Successfully');
});
//Logout route
router.get('/logout', function(req, res, next) {
  localStorage.removeItem('myToken');
  res.send('Logout Successfully');
});


// This code for form of insert employee records
router.post('/',function(req,res,next){
  var empDetail = new empModle({
    name: req.body.uname,
    email: req.body.email,
    etype: req.body.emptype,
    hourlyrate: req.body.hrlyrate,
    totalHour: req.body.ttlhr,
    total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),
  });
  empDetail.save(function(err,res1){
    if(err) throw err;
    employee.exec(function(err,data){
      if(err) throw err;
      res.render('index', { title: 'Employee recordes', records:data, success:" Insert Records Successfully" });
      // res.redirect('/');
    });
  });
});

// This code for searching records
router.post('/search/',function(req,res,next){
    var filterName = req.body.fltrname;
    var filterEmail = req.body.fltremail;
    var filterType = req.body.fltremptype;
    if(filterName !='' && filterEmail !='' && filterType !=''){
      var filterParameter={
        $and:[
              {name:filterName},{$and:[{email:filterEmail},{etype:filterType}]}
        ]
      }
    }else if(filterName !='' && filterEmail =='' && filterType !=''){
      var filterParameter={
        $and:[{name:filterName},{etype:filterType}] 
      }
    }else if(filterName =='' && filterEmail !='' && filterType !=''){
      var filterParameter={
        $and:[{email:filterEmail},{etype:filterType}]
      }
    }else if(filterName !='' && filterEmail !='' && filterType ==''){
      var filterParameter={
        $and:[{name:filterName},{email:filterEmail}]
      }
    }else if(filterName =='' && filterEmail =='' && filterType !=''){
      var filterParameter = {etype:filterType}
    }else{
      var filterParameter={}
    }   
  var employeeFilter = empModle.find(filterParameter);
  employeeFilter.exec(function(err,data){
    if(err) throw err;
    res.render('index', { title: 'Employee recordes', records:data, success:"" });
  }); 
});

// This code for delete records
router.get('/delete/:id', function(req, res, next) {
  var del= empModle.findByIdAndDelete(req.params.id);
  del.exec(function(err){
    if(err) throw err;
    employee.exec(function(err,data){
      if(err) throw err;
      res.render('index', { title: 'Employee recordes', records:data, success:" Delete Records Successfully" });
    });
    // res.redirect('/');
  });
});

// this code for update employee details
router.get('/edit/:id', function(req, res, next) {
  var edit = empModle.findById(req.params.id);
  edit.exec(function(err,data){
    if(err) throw err;
    res.render('edit',{title:'Edit Employee Details',records:data});
  });
});

router.post('/update/', function(req, res, next) {
  var update = empModle.findByIdAndUpdate(req.body.id,{
    name: req.body.uname,
    email: req.body.email,
    etype: req.body.emptype,
    hourlyrate: req.body.hrlyrate,
    totalHour: req.body.ttlhr,
    total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr)
  });
  update.exec(function(err,data){
    if(err) throw err;
    employee.exec(function(err,data){
      if(err) throw err;
      res.render('index', {title: 'Employee recordes', records:data, success:" Update Records Successfully" });
    });
    // res.redirect("/");
  });
});

module.exports = router;
