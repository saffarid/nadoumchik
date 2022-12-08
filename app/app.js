const api = require('./api/api_desc')
const fs = require("fs")
const path = require('path')
const express = require("express")
const mongoos = require("mongoose")
const bodyParser = require("body-parser")

const database = require('./js/database')
const storage = require('./js/storage')
const work = require('./js/work/work')

const winston = require('winston')

/**
 * Парсер json-в запросах
 * */
const jsonParser = express.json();

const {APP_PORT, APP_IP, APP_PATH, DB_CONNECTION_STRING, HOME} = process.env;

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
    ),
    transports: [
        new winston.transports.File({filename: HOME + '/log/log.txt'})
    ]
})

const app = express()

const urlIndex = path.join(path.resolve(''), './../www/index.html')
const urlAdmin = path.join(path.resolve(''), './../www/cabinet.html')

/*
* Подключаемся к БД, при удачном подключении подвязываем к серверу слушателя подключений
* */
mongoos.connect(DB_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true}, async err => {
    //Нужна инициализация БД
    await database.init()
    if (err) return console.error(err)
    logger.info(`Connection to DB ${DB_CONNECTION_STRING} is success`)
    storage.readData()
    app.listen(APP_PORT, APP_IP, () => {
        logger.info(`Wait connection to http://${APP_IP}:${APP_PORT} or http://${APP_IP}:${APP_PORT}/cabinet `)
        console.log(`Wait connection to http://${APP_IP}:${APP_PORT} or http://${APP_IP}:${APP_PORT}/cabinet `)
    })
})
app
    .use(bodyParser.json({limit: '50mb'}))
    .use(express.static(__dirname + './../www'))
    .get('/', (req, res) => {
        fs.readFile(urlIndex, (err, data) => {
            if (err) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.write('index.html not found');
            }
            else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
            }
            res.end();
        })
    })
    .get('/cabinet', (req, res) => {
        fs.readFile(urlAdmin, (err, data) => {
            if (err) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.write('index.html not found');
            }
            else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
            }
            res.end();
        })
    })
    .post(/\/db(\/.+)?/, (req, res) => {
        if (!req.body) res.sendStatus(400)
        database.execute(req.url, req.body)
                .then(data => res.json(data))
                .catch((err) => {
                    logger.warn([`Error with`, req.url, req.body])
                    logger.warn(err)
                    res.json(err)
                })
    })
    .post(/\/work(\/.+)?/, (req, res) => {
        if (!req.body) res.sendStatus(400)
        work.execute(req.url, req.body)
            .then(data => res.json(data))
            .catch((err) => {
                logger.warn([`Error with`, req.url, req.body])
                logger.warn(err)
                res.json(err)
            })
    })
