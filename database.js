var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"



let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
    //   console.error(err.message)
      throw err
    }else{
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,  
            password TEXT,
            yoga INTEGER DEFAULT 0,
            run INTEGER DEFAULT 0,
            meditate INTEGER DEFAULT 0,
            breathing INTEGER DEFAULT 0,
            gym INTEGER DEFAULT 0,
            therapy INTEGER DEFAULT 0,
            read INTEGER DEFAULT 0
            )`,
        (err) => {
            if (err) {
                // Table already created
                // console.log(err)
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO user (username, password) VALUES (?,?)'
                db.run(insert, ["admin",md5("admin123456")])
                db.run(insert, ["user",md5("user123456")])
            }
        });  
    }
});


module.exports = db
