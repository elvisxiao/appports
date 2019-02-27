
var express = require('express');
var compression = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);
// const config  = require('./config');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(compression());

app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '20mb'}));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: '12345',
    name: 'appports',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {
        path: '/', 
        // maxAge: 24 * 60 * 60000, 
        secure: false, 
        httpOnly: true 
    },  //设置maxAge, session和相应的cookie失效过期
    // store: new MongoStore({
    //     url: 'mongodb://' + config.db.user + ':' + config.db.pwd + '@' + config.db.host + ':' + config.db.port + '/' + config.db.db
    // })
}));

app.use(express.static(path.join(__dirname, 'public')));


var proxy = require('http-proxy-middleware');
app.use('/proxy', proxy({ 
    target: 'http://www.alloyteam.com', 
    changeOrigin: true,
    pathRewrite: {'^/proxy' : '/'},
    onProxyReq: function(proxyReq, req, res) {
        proxyReq.setHeader('referer', 'http://www.alloyteam.com');
    }
}));

app.use(function(req, res, next) {
    // console.log(req.method + ' ' + req.url + ' ' + req.headers["user-agent"] + ' httpVersion' + req.httpVersion + ' ip' + req.ip);
    res.locals.user = req.session.user;
    next();
});

//登陆用户可见
function requiredAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } 
    else {
        console.warn('Access denied, ip:' + req.ip + ',page:' + req.url + 'session:', req.session);
        
        if(req.headers['x-requested-with'] && req.headers['x-requested-with'].toLowerCase() == 'xmlhttprequest') {
            res.status(500).send('Access denied!');
        }
        else {
            req.session.error = 'Access denied!';
            res.redirect('/');
        }
    }
}

app.use('/', require('./routes/index'));
// app.use('/lucky', requiredAuthentication, require('./routes/lucky'));
// app.use('/service', require('./routes/service'));
app.use('/ui', require('./routes/ui'));
// app.use('/news', require('./routes/news'));

// app.use('/user', require('./routes/users'));

// app.use('/dingding', require('./routes/dingding'));

// catch 404 and forward to error handler
app.use(function(req, res) {
    res.render('404');
});

// production error handler
app.use(function(err, req, res, next) {
    // res.status(err.status || 500);
    console.error('页面错误：', err);
    res.render('error');
});

app.listen(3100, function() {
    console.log('server is listen on port 3100');

    // 开启定时任务----
    // require('./services');
});

