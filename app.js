const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const rfs = require('rotating-file-stream')
const port = 80
const oracleDb = require('oracledb')
const schedule = require('node-schedule')
const fs = require('fs');
const archiver = require('archiver');

const access = require('./route/access');

require('dotenv').config()

// create a rotating write stream
const pad = num => (num > 9 ? "" : "0") + num;
const generator = () => {
  var today = new Date();

  var month = today.getFullYear() + "" + pad(today.getMonth() + 1);
  var day = pad(today.getDate());

  return `${month}/${month}${day}-file.log`;
};

const accessLogStream = rfs.createStream(generator, {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
})
//매년 1월 1일 1시에 로그파일 백업 
schedule.scheduleJob('* 1 0 0 *', function () {
  const output = fs.createWriteStream('/log/backup/' + 'logbackup.zip');
  const archive = archiver('zip');

  var today = new Date();
  var month = today.getFullYear() + "" + pad(today.getMonth() + 1);
  var day = pad(today.getDate());
  console.log(`${month}.${day} log file is backup -ing...`);

  // listen for all archive data to be written
  // 'close' event is fired only when a file descriptor is involved
  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  archive.on('error', function (err) {
    throw err;
  });

  // pipe archive data to the file
  archive.pipe(output);

  archive.directory('/log/202102', false);

  archive.finalize();

});

app.use(morgan('combined', { stream: accessLogStream }))

app.use(cors())

app.use(express.json())

app.use(express.static(__dirname + '/public'))


app.options("/*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

oracleDb.getConnection({
  user: 'datausr',
  password: 'nccrekr1!',
  connectString: '10.32.29.204:1521/kccsisdb',
}, (err, conn) => {
  if (err) {
    console.log('Oracle 접속 실패', err);
  } else {
    console.log('Oracle 접속 test 성공');
  }
})

app.get('/', (req, res) => {
  res.render('index.html')
})

app.use('/access', access);

app.listen(port, () => {
  console.log(`sync complete & listening at ${port}`)
})



