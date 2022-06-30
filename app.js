const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql');
var db  = require('./dbmsConnection.js');
const { render } = require('ejs');
const { debugPort } = require('process');

app.use('/static',express.static('static'));
app.use(express.urlencoded());//take date from input form

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.get("/studentFAQ",(req,res)=>{
    res.render('FAQ');
})

app.get("/facultyFAQ",(req,res)=>{
    res.render('FAQ2');
})


app.get('/',(req,res)=>{

    let sql = `SELECT * FROM intern where status='open'`
    db.query(sql,(err,data)=>{

        res.render('MainPage',{data});
    })

})
app.get('/FacultyFAQ',(req,res)=>{
    res.render('FacultyFAQ');
})
app.get('/FacultyLogin',(req,res)=>{ 
    res.render('FacultyLogin');
})
app.post('/faculty/',(req,res)=>{
    let faculty = req.body;
    console.log(req.body);
    let sql = `SELECT * FROM faculty WHERE facultyId='${faculty.User_Id}' AND passwords='${faculty.Password}'`
    db.query(sql,(err,data)=>{
        if(err){
            throw err;
        }
        let sql2 = `SELECT * FROM intern`
        db.query(sql2,(err,data2)=>{
            if(err){
                throw err;
            }
            res.render('FacultyDashBoard',{data,data2});
        })
        console.log(data);
    })

})
app.post('/addIntern',(req,res)=>{
    let info=req.body;
    console.log(info.internId);
    console.log(info);
    let sql2 = `SELECT * FROM intern WHERE internId = '${info.internId}'`
    db.query(sql2,(err,data2)=>{
        if(err){
            throw err;
        }
       else if(data2[0]!=null){
           console.log(data2[0]);
            res.send('project Id is already exist so please give other Project Id');
        }
        else{

            let sql = `INSERT INTO intern value('${info.internId}','${info.projectName}','${info.facultyName}','${info.stipend}','${info.startingDate}','${info.timePeriod}','${info.AboutInternship}','${info.status}','${info.facultyId}')`

            db.query(sql,(err,data)=>{
                if(err){
                    throw err;
                }
                res.send('project added successfully');
            })
        }
    })
})
app.get('/faculty/profile/:facultyId',(req,res)=>{
    let sql = `SELECT * FROM faculty WHERE facultyId='${req.params.facultyId}'`;
    db.query(sql,(err,data)=>{

        res.render('FacultyProfile',{data});
    })
})

app.get('/faculty/addInternship/:facultyId',(req,res)=>{
    let sql = `SELECT * FROM faculty WHERE facultyId='${req.params.facultyId}'`;
    db.query(sql,(err,data)=>{
        res.render('FacultyInternship',{data});
    })
})
app.get('/faculty/facultyFAQ/:facultyId',(req,res)=>{
    let facultyId=req.params.facultyId;
    res.render('FacultyFAQ',{facultyId});
})

//////////////// for student part

app.get('/studentLogin',(req,res)=>{
    res.render('StudentLogin',{massage:'login here !'});
})
app.post('/studentRegistration',(req,res)=>{
    console.log(req.body);

    let info = req.body;

    let sql =  `SELECT * FROM student WHERE studentId = '${info.studentId}'`
    db.query(sql,(err,data)=>{
        if(err){
            throw err;
        }
       else if(data[0]!=null){
            res.send('your are already registred');
        }
        else{
            let sql2 = `insert into student (studentName,courseName,studentId,passwords,email,phoneNumber,DOB,gender) value ('${info.studentName}','${info.courseName}','${info.studentId}','${info.Password}','${info.Email_Id}','${info.phoneNumber}','${info.DOB}','${info.gender}')`
            db.query(sql2,(err,data2)=>{
                if(err){
                    throw err;
                }
                console.log(data2);
                res.send('login successfull');
            })
        }
    })
})
app.post('/student/',(req,res)=>{
    let student = req.body;
    console.log(req.body);
    let sql =  `SELECT * FROM student WHERE studentId = '${student.User_Id}' AND passwords = '${student.Password}'`
    db.query(sql,(err,data)=>{
        if(err){
            throw err;
        }
       else if(data[0]==null){
            res.render('StudentLogin');
        }
        else{
            let sql2 = `select * from intern,internStatus where  internStatus.studentId='${student.User_Id}' AND intern.internId=internStatus.internId`
            db.query(sql2,(err,data2)=>{

                console.log(data2);
                res.render('studentDashboard',{data,data2});
            })
        }
    })
})

app.get('/student/newInternship/:studentId',(req,res)=>{
    
    let sql = `SELECT * FROM student WHERE studentId='${req.params.studentId}'`;
    db.query(sql,(err,data)=>{
        if(err){
            throw err;
        }
        console.log(data);
        let sql2 = `SELECT * FROM intern`
        db.query(sql2,(err,data2)=>{
            if(err){
                throw err;
            }
            console.log(data2);
            res.render('StudentInternship',{data,data2});
        })

    })
})

app.get('/student/profile/:studentId',(req,res)=>{
    let sql = `SELECT * FROM student WHERE studentId='${req.params.studentId}'`;
    db.query(sql,(err,data)=>{

        res.render('StudentProfile',{data});
    })
})
app.get('/student/StudentFAQ/:studentId',(req,res)=>{
    let sql = `SELECT * FROM student WHERE studentId='${req.params.studentId}'`;
    db.query(sql,(err,data)=>{

        res.render('StudentFAQ',{data});
    })
})

app.listen('80',()=>{
    console.log('server is started on port 80');
});
