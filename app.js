const express = require('express');
const bodyParser = require('body-parser');
cors = require('cors');

require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/', require('./routes/api/calc'));

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  console.log(err.stack);

  res.status(err.status || 500);

  res.json({
    'errors': {
      message: err.message,
      error: err
    }
  });
});


if (process.env.NODE_ENV === 'local') {
  const server = app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port ' + server.address().port);
  });
}

module.exports = app