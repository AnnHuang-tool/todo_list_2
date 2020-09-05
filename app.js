const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes')
const flash = require('connect-flash')


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// const bcrypt = require('bcryptjs')
// / 引用 passport，放在文件上方
// const passport = require('passport')
const usePassport = require('./config/passport')

const app = express()
const PORT = process.env.PORT


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')


app.use(session({
  secret: 'process.env.SESSION_SECRET',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// const db = require('./models')
// const Todo = db.Todo
// const User = db.User

usePassport(app)

app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
// 設定路由
// 首頁
// app.get('/', (req, res) => {
//   return Todo.findAll({
//     raw: true,
//     nest: true
//   })
//     .then((todos) => { return res.render('index', { todos: todos }) })
//     .catch((error) => { return res.status(422).json(error) })
// })

// detail
// app.get('/todos/:id', (req, res) => {
//   const id = req.params.id
//   return Todo.findByPk(id)
//     .then(todo => res.render('detail', { todo: todo.toJSON() }))
//     .catch(error => console.log(error))
// })

// 登入註冊登出頁面

// app.get('/users/login', (req, res) => {
//   res.render('login')
// })

// 加入 middleware，驗證 reqest 登入狀態
// app.post('/users/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/users/login'
// }))
// app.post('/users/login', (req, res) => {
//   res.send('login')
// })

// app.get('/users/register', (req, res) => {
//   res.render('register')
// })

// app.post('/users/register', (req, res) => {
//   const { name, email, password, confirmPassword } = req.body
//   User.findOne({ where: { email } }).then(user => {
//     if (user) {
//       console.log('User already exists')
//       return res.render('register', {
//         name,
//         email,
//         password,
//         confirmPassword
//       })
//     }
//     return bcrypt
//       .genSalt(10)
//       .then(salt => bcrypt.hash(password, salt))
//       .then(hash => User.create({
//         name,
//         email,
//         password: hash
//       }))
//       .then(() => res.redirect('/'))
//       .catch(err => console.log(err))
//   })
// })


// app.post('/users/register', (req, res) => {
//   const { name, email, password, confirmPassword } = req.body
//   User.create({ name, email, password })
//     .then(user => res.redirect('/'))
// })

// app.post('/users/register', (req, res) => {
//   res.send('register')
// })



// app.get('/users/logout', (req, res) => {
//   res.send('logout')
// })

// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.isAuthenticated()
//   res.locals.user = req.user
//   next()
// })


app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})