// const api = require('api/api_desc')
const fs = require("fs")
const path = require('path')
const express = require("express")
const mongoos = require("mongoose")

const article = require('./js/article_actions')
const typeOfArticle = require('./js/type_of_article_actions')
const typeOfUser = require('./js/type_of_user_actions')
const user = require('./js/user_actions')
const viewArticles = require('./js/view_article_actions')

/**
 * Парсер json-в запросах
 * */
const jsonParser = express.json();

const {APP_PORT, APP_IP, APP_PATH, DB_CONNECTION_STRING} = process.env;
const app = express()

const urlIndex = path.join(path.resolve(''), '..\\www\\index\\index.html')
const urlAdmin = path.join(path.resolve(''), '..\\www\\admin\\dist\\index.html')

/*
* Подключаемся к БД, при удачном подключении подвязываем к серверу слушателя подключений
* */
mongoos.connect(DB_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true}, err => {
    if (err) return console.error(err)
    app.listen(APP_PORT, APP_IP, () => {
        console.log(`Wait connection to ${APP_IP}:${APP_PORT}`)
    })
})
app
    .use(express.static(__dirname + '\\..\\www'))
    .get('/', (req, res) => {
        fs.readFile(urlIndex, (err, data) => {
            if (err) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.write('index.html not found');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
            }
            res.end();
        })
    })
    .get('/admin', (req, res) => {
        fs.readFile(urlAdmin, (err, data) => {
            if (err) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.write('index.html not found');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
            }
            res.end();
        })
    })
    .post(/\/article(\/.+)?/, jsonParser, (req, res) => {
        if (!req.body) res.sendStatus(400)
        article.execute(req.url, req.body, res)
    })
    .post(/\/typeOfArticle(\/.+)?/, jsonParser, (req, res) => {
        if (!req.body) res.sendStatus(400)
        res.json(typeOfArticle.execute(req.url, req.body))
    })
    .post(/\/typeOfUser(\/.+)?/, jsonParser, (req, res) => {
        if (!req.body) res.sendStatus(400)
        res.json(typeOfUser.execute(req.url, req.body))
    })
    .post(/\/user(\/.+)?/, jsonParser, (req, res) => {
        if (!req.body) res.sendStatus(400)
        res.json(user.execute(req.url, req.body))
    })
    .post(/\/viewArticle(\/.+)?/, jsonParser, (req, res) => {
        if (!req.body) res.sendStatus(400)
        res.json(viewArticles.execute(req.url, req.body))
    })


