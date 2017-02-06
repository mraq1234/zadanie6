var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
var path = require('path');
var mime = require('mime');


exports.upload = function (request, response) {
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = path.join(__dirname, '../uploaded');


    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    response.write("<h1 style='font-family: arial; margin: 20px;'>Otrzymane obrazy:</h1><br/>");

    form.on('file', function (field, file) {
        var fileType = mime.lookup(path.join(form.uploadDir, file.name));
        fs.renameSync(file.path, path.join(form.uploadDir, file.name));
       
        if (fileType.indexOf("image") > -1) {
            response.write("<img style='margin: 10px 10px 10px 0; width: 600px; height: auto;' src='../uploaded/" + file.name + "'/>");
        }
        
    });

    form.on('error', function (err) {
        console.log('Wystąpił błąd: \n' + err);
    });

    form.on('end', function () {
        response.end();
    });

    form.parse(request);
}

exports.welcome = function (request, response) {
    console.log("Rozpoczynam obsługę żądania welcome.");
    fs.readFile('templates/start.html', function (err, html) {
        response.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8"
        });
        response.write(html);
        response.end();
    });
}

exports.styleStart = function (request, response) {
    fs.readFile('templates/css/start.css', function (err, css) {
        response.writeHead(200, {
            "Content-Type": "text/css"
        });
        response.write(css);
        response.end();
    });
}

exports.show = function (request, response) {
    fs.readFile("test.png", "binary", function (error, file) {
        response.writeHead(200, {
            "Content-Type": "image/png"
        });
        response.write(file, "binary");
        response.end();
    });
}

exports.error = function (request, response) {
    console.log("Nie wiem co robić.");
    response.write("404 :(");
    response.end();
}

exports.showImages = function (requestedUrl, request, response) {
    var uploadedFilePath = path.join(__dirname, '..', requestedUrl);

    fs.readFile(uploadedFilePath, "binary", function (error, file) {
        response.writeHead(200, {
            "Content-Type": "image/png"
        });
        response.write(file, "binary");
        response.end();
    });
}