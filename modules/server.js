var http = require('http');
var colors = require('colors');
var handlers = require('./handlers');

function start() {
    function onRequest(request, response) {

        var patt = new RegExp("\/\\w+");
        var reqUrlSubstr = '/';
        if (request.url.match(patt)) {
            reqUrlSubstr = request.url.match(patt)[0].trim();
        }

        console.log("Odebrano zapytanie.".green);
        console.log("Zapytanie " + request.url + " odebrane.");

        response.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        switch (reqUrlSubstr) {
            case '/':
            case '/start':
                handlers.welcome(request, response);
                break;
            case '/upload':
                handlers.upload(request, response);
                break;
            case '/cssStart':
                handlers.styleStart(request, response);
                break;
            case '/uploaded':
                handlers.showImages(request.url, request, response);
                break;
            default:
                handlers.error(request, response);
        }
    }

    http.createServer(onRequest).listen(9000);

    console.log("Uruchomiono serwer!".green);
}

exports.start = start;