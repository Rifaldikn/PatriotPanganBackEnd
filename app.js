var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
// var mongoose =  require('mongoose');
var CronJob = require('cron').CronJob;

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// mongoose.connect('mongodb://localhost/PatriotPangan');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, 'public')));

var sequelize = require(__dirname + '/dbconnection');
var Kecamatan = sequelize.import(__dirname + '/model/rgn_district.model');
var Summary = sequelize.import(__dirname + '/model/Summaries.model');
var moment = require('moment');

Summary.belongsTo(Kecamatan, {foreignKey: 'fk_kecamatanid'});

var LaporanController = require(__dirname + '/controllers/Laporans.controller');

var createsummary = new CronJob({
	cronTime: '00 00 00 1 * *',
	onTick: () => {
    Kecamatan
      .findAll()
      .then((kecamatan) => {
        kecamatan = JSON.parse(JSON.stringify(kecamatan));
        for(var i=0; i<kecamatan.length; i++) {
          Summary
            .create({
              fk_kecamatanid: kecamatan[i].id,
              bulan: moment().month(),
              tahun: moment().year()
            });
        }
      });
	},
	start: false,
	timeZone: 'Asia/Jakarta'
});

var updatesummary = new CronJob({
  cronTime: '00 10 00 1 * *',
	onTick: () => {
    var bulan;
    var tahun;
    if(moment().month() == 0) {
      bulan = 11;
      tahun = moment().year() - 1;
    } else {
      bulan = moment().month();
      tahun = moment().year();
    }
    Summary
      .findAll({
        where: {
          bulan: bulan,
          tahun: tahun
        },
        include: [{
          model: Kecamatan
        }]
      })
      .then((result) => {
        result = JSON.parse(JSON.stringify(result));
        for(let i=0; i<result.length; i++) {
          Summary
            .update({
              kondisi: LaporanController.GetStatusKeluargaMiskinAngka(result[i])
            }, {
              where: {
                bulan: bulan,
                tahun: tahun,
                fk_kecamatanid: result[i].fk_kecamatanid
              }
            });
        }
      })
	},
	start: false,
	timeZone: 'Asia/Jakarta'
});

createsummary.start();
updatesummary.start();

var Token  = require(__dirname + '/controllers/Token.controller');
var AuthRouter = require(__dirname + '/routes/Auth.route');
var AdminRouter = require(__dirname + '/routes/Admin.route');
var PatriotsRouter = require(__dirname + '/routes/Patriots.route');
var ArtikelsRouter = require(__dirname + '/routes/Artikel.route');
var KMRouter = require(__dirname + '/routes/KeluargaMiskins.route');
var LokasiRouter = require(__dirname + '/routes/Lokasi.route');
var SummariesRouter = require(__dirname + '/routes/Summaries.route');

app.use('/auth', AuthRouter);
app.use('/lokasi', LokasiRouter);
app.use('/summary', SummariesRouter);
// Checking token gajadi pake ini
// Kudu make, untuk memastikan yang login punya token dari kita
app.use((req, res, next) => {
	if(!req.headers.token) {
		// Cant find token
    res.status(200)
      .json({
        status: false, 
        message: "Sorry we can't find your token, please make new request"
      });
	} else {
		Token.CheckingToken(req.headers.token, res, next);
		next();
	}
});
app.use('/admin', AdminRouter);
app.use('/patriot', PatriotsRouter);
app.use('/artikel', ArtikelsRouter);
app.use('/keluargamiskin', KMRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
