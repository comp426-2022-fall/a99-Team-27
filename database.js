var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"



let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
    //   console.error(err.message)
      console.error("hola")
      throw err
    }else{
        console.log("db")
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,  
            password TEXT,
            yoga INTEGER,
            run INTEGER,
            meditate INTEGER,
            breathing INTEGER,
            gym INTEGER,
            therapy INTEGER,
            read INTEGER
            )`,
        (err) => {
            if (err) {
                // Table already created
                // console.log(err)
            }else{
                // Table just created, creating some rows
                console.log("created")
                var insert = 'INSERT INTO user (username, password) VALUES (?,?)'
                db.run(insert, ["admin",md5("admin123456")])
                db.run(insert, ["user",md5("user123456")])
            }
        });  
    }
});

module.exports = db
