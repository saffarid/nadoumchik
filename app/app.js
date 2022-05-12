// const api = require('api/api_desc')
const fs = require("fs")
const path = require('path')
const express = require("express")
const mongoos = require("mongoose")
const bodyParser = require("body-parser")

const article = require('./js/article_actions')
const themesOfPublications = require('./js/themes_of_publication_actions')
const typeOfUser = require('./js/type_of_user_actions')
const user = require('./js/user_actions')

/**
 * Парсер json-в запросах
 * */
const jsonParser = express.json();

const {APP_PORT, APP_IP, APP_PATH, DB_CONNECTION_STRING} = process.env;
const app = express()

const urlIndex = path.join(path.resolve(''), '..\\www\\index.html')
const urlAdmin = path.join(path.resolve(''), '..\\www\\admin.html')

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
    .use(bodyParser.json({limit: '50mb'}))
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
    .post(/\/article(\/.+)?/, (req, res) => {
        if (!req.body) res.sendStatus(400)
        article.execute(req.url, req.body, res)
    })
    .post(/\/themesOfPublication(\/.+)?/, jsonParser, (req, res) => {
        if (!req.body) res.sendStatus(400)
        themesOfPublications.execute(req.url, req.body, res)
    })
    .post(/\/typeOfUser(\/.+)?/, jsonParser, (req, res) => {
        if (!req.body) res.sendStatus(400)
        typeOfUser.execute(req.url, req.body)
    })
    .post(/\/user(\/.+)?/, jsonParser, (req, res) => {
        if (!req.body) res.sendStatus(400)
        user.execute(req.url, req.body)
    })
