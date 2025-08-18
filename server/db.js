const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
});

db.connect((err)=>{
    if(err){
        console.log('error in connecting to db',err);
    }
    else{
        console.log('connected to db');
    }
})

module.exports = db;