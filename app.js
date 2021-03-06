const express = require("express");
const exphbs = require('express-handlebars');
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require('express-session');
const flash = require("connect-flash");
const methodOverride = require('method-override');
const passport = require('passport');
const bcrypt = require('bcrypt');

const app = express();

//设置跨域访问
// app.all("*", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By", " 3.2.1");
//   res.header("Content-Type", "application/json;charset=utf-8");
//   next();
// });

// load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);

// Connect to mongoose
mongoose.connect("mongodb://192.168.1.168/cnkiapp")
  .then(() => {
    console.log("MongoDB 数据库连接成功！");
  })
  .catch(err => {
    console.log(err);
  })

// 引入模型
require("./models/Idea");

const Idea = mongoose.model('ideas');

// handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// body-parser middleware
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

// 使用静态文件
app.use(express.static(path.join(__dirname, 'public')));

// method-override middleware
app.use(methodOverride('_method'));

// session & flash middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// 配置全局变量
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.user || null;
  next();
})

// 配置路由
app.get("/", (req, res) => {
  const title = "陕西分公司项目建设";
  res.render("index", {
    title: title
  });
})

app.get("/about", (req, res) => {
  res.render("about");
})

// 使用routes
app.use("/ideas", ideas);
app.use("/users", users);

//服务端口监听
const port = 5000;
app.listen(port, () => {
  console.log(`正在监听：${port} 端口`);
})