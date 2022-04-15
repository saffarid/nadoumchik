const http = require("http");
const fs = require("fs")

const express = require("express")

const app = express()

const url = "C:\\Something\\untitled\\www\\index.html"
const urlencodedParser = express.urlencoded({extended: false});
const jsonParser = express.json();

app.get("/", (req, res) => {
    fs.readFile(url, (err, data) => {
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
    .post("/", jsonParser, (req, res) => {
        if(!req.body) res.sendStatus(400)
        console.log('app.js')
        console.log(req.body)
        res.json(req.body)
    })
    .listen(1234, "127.0.0.1",
        () => {
            console.log("Listen start")
        }
    )


// const server = http
//     .createServer(
//         (req, res) => {
//
//             fs.readFile(url, (err, data) => {
//                 if (err) {
//                     res.writeHead(400, {'Content-Type': 'text/plain'});
//                     res.write('index.html not found');
//                 } else {
//                     res.writeHead(200, {'Content-Type': 'text/html'});
//                     res.write(data);
//                 }
//                 res.end();
//             })
//         }
//     )
//     .listen(1234, "127.0.0.1",
//         () => { console.log("Listen start") }
//     );
