const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');

const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const rt_index = require('./routes/index');
const rt_passenger = require('./routes/passenger');
const rt_checkin = require('./routes/checkin');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', rt_index);
app.use('/v1/passenger/', rt_passenger);
app.use('/v1/checkin/', rt_checkin);

// catch 404 and forward to error handler
app.use(
  function (req, res, next)
  {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
  });

// error handler
app.use(
  function (err, req, res, next)
  {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      res.status(err.status || 500);
      res.send('You Got Error');
  });

var port = process.env.PORT || 3000;
console.log(`http://localhost:${port}/`);
console.log(`http://localhost:${port}/v1/passenger`);
console.log(`http://localhost:${port}/v1/checkin`);


//module.exports = app;
// app.listen(port);

// Create certificate 
// openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

// Then  pass the 'app' to 'https' server
https.createServer({
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem'),
  passphrase: 'MyUnsecuredDemoOnlyPassphrase'
}, app)
.listen(port);
