var express = require("express")
var app = express()
var db = require("./database.js")
var md5 = require("md5")
var minimist = require("minimist");
var bodyParser = require("body-parser");
// Create express app
//var express = require("express")
const args = minimist(process.argv.slice(2));
var app = express()
var bodyParser = require("body-parser");
app.use(express.static('./main'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});


// Root endpoint
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/main/home.html');
  });

// Insert here other API endpoints
app.get("/api/users", (req, res, next) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.post("/api/user/", (req, res, next) => {
    var errors=[]
    console.log("in user")
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        username: req.body.username,
        password : md5(req.body.password)
    }
    var sql ='INSERT INTO user (username, password, yoga, run, meditate, breathing, gym, therapy, read) VALUES (?,?,?,?,?,?,?,?,?)'
    var params =[data.username, data.password,0,0,0,0,0,0,0]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            console.log('error running', err.message)
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
        // console.log(res)
    });
})

app.patch("/api/user/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        password : req.body.password ? md5(req.body.password) : null
    }
    db.run(
        `UPDATE user set 
           name = COALESCE(?,name), 
           password = COALESCE(?,password) 
           WHERE id = ?`,
        [data.name, data.password, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

app.post("/api/login/", (req, res) => {
    //Respond w status 200
    console.log("in login")
    var isUserNamePresent = false
    let data = {
        username: req.body.username,
        password: req.body.password,
        yoga: req.body.yoga,
        run: req.body.run,
        meditate: req.body.meditate,
        breathing: req.body.breathing,
        gym: req.body.gym,
        therapy: req.body.therapy,
        read: req.body.read
    } 

    res.statusCode = 200;
    var login = false
    db.get((`SELECT * FROM user WHERE  username = ? AND password = ?`), [data.username, md5(data.password)], (err, row) => {
        if (err){
            return console.error(err.message)
        }
        if (typeof data.yoga != "undefined"){
            row.yoga += 1
        }
        if (typeof data.run != "undefined"){
            row.run += 1
        }
        if (typeof data.meditate != "undefined"){
           row.meditate +=  1
        } 
        if (typeof data.breathing != "undefined"){
            row.breathing +=  1
        } 
        if (typeof data.gym != "undefined"){
            row.gym += 1
        } 
        if (typeof data.therapy != "undefined"){
            row.therapy += 1
        } 
        if (typeof data.read != "undefined"){
            row.read += 1
        }
        //var sql = "UPDATE table_name SET (yoga, run, meditate, breathing, gym, therapy, read) =(?,?,?,?,?,?,?) WHERE id = ?"
        // var params = [yoga, run, meditate, breathing, gym, therapy, read,row.id]
        // db.run(sql, params, (err, result)  => {
        //     if (err){
        //         res.status(400).json({"error": err.message})
        //         console.log('error running', err.message)
        //         return;
        //     }
        //     console.log("added to database")
        //     return
        //     })
        //var list = [row.yoga, row.run, row.meditate, row.breathing, row.gym, row.therapy, row.read]
        return row
            ? console.log(row) & res.status(200).json({"status":"LOGIN", "user":data.username}) & console.log("LOGIN") 
            : console.log("not found") & res.status(200).json({"status":"BAD"}) & console.log("NO USER")
    });
});

// app.post("/api/goals/", (req, res) => {
//     //Respond w status 200
//     console.log("in goals")
//     let data = {
//         yoga: req.body.yoga,
//         run: req.body.password,
//         meditate: req.body.meditate,
//         breathing: req.body.breathing,
//         gym: req.body.gym,
//         therapy: req.body.therapy,
//         read: req.body.read
//     } 
//     console.log(data.yoga)
//     console.log(data.run)
//     console.log(data.meditate)
//     console.log(data.breathing)
//     console.log(data.gym)
//     console.log(data.therapy)
//     console.log(data.read)
//     res.statusCode = 200;
//     var login = false
//     db.get((`SELECT * FROM user WHERE  username = ? AND password = ?`), [data.username, md5(data.password)], (err, row) => {
//         if (err){
//             return console.error(err.message)
//         }
//         return row  
//             ? console.log(row) & res.status(200).json({"status":"LOGIN", "user":data.username}) & console.log("LOGIN") 
//             : console.log("not found") & res.status(200).json({"status":"BAD"}) & console.log("NO USER")
//     });
// });

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});



