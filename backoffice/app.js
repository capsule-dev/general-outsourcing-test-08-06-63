const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
var mysql = require('mysql');
var mysqlConfig = {
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    password: "root",
    database:"go_test"
  }


app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/export', (req, res) => {
  const con = mysql.createConnection(mysqlConfig);
  con.connect()
  con.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'go_test' AND TABLE_NAME = 'e_learning_export';", function (err, rows, fields) {
      if (err) throw err
      res.send(rows)
  });
  con.end()
})

app.post('/export', (req, res) => {
  var datas = req.body;
  var mapdatas = datas.map(data => {
    return data.title
  })
  var sql = "";
  var end = mapdatas.length;
  for(var i = 0; i < mapdatas.length; i++){
    sql += mapdatas[i]
    if(end-1 !== i){
      sql += ","
    }
  }
  const con = mysql.createConnection(mysqlConfig);
  if(sql !== ""){
    con.connect()
    con.query("SELECT "+ sql +" FROM e_learning_export;", function (err, rows, fields) {
        if (err) throw err
        // console.log(fields)
        res.send(rows)
    });
    con.end()
  }
})

app.listen(4000, () => {
  console.log('Start server at port 4000.')
})


