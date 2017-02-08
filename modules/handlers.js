var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
var path = require('path');
var mime = require('mime');


function upload(request, response) {
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = path.join(__dirname, '../uploaded');


    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    response.write("<h1 style='font-family: arial; margin: 20px;'>Otrzymane obrazy:</h1><br/>");

    form.on('file', function (field, file) {
        var fileType = mime.lookup(path.join(form.uploadDir, file.name));
        try {
            fs.renameSync(file.path, path.join(form.uploadDir, file.name));
        } catch (err) {
            console.error("wystąpił błąd przy zapisie pliku: ".red, err.message);
            response.write("<p>wystąpił błąd zapisu pliku: " + file.name + "'</p>");
            return;
        }

        if (fileType.indexOf("image") > -1) {
            response.write("<img style='margin: 10px 10px 10px 0; width: 600px; height: auto;' src='../uploaded/" + file.name + "'/>");
        }

    });

    form.on('error', function (err) {
        console.log('Wystąpił błąd: \n'.red + err.message);
    });

    form.on('end', function () {
        response.end();
    });

    form.parse(request);
}

function welcome(request, response) {
    console.log("Rozpoczynam obsługę żądania welcome.");
    fs.readFile('templates/start.html', function (err, html) {
        if (err) {
            console.error("błąd przy odczycie pliku: ".red, err.message);
            error(request, response);
            return;
        }
        response.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8"
        });
        response.write(html);
        response.end();
    });
}

function styleStart(request, response) {
    fs.readFile('templates/css/start.css', function (err, css) {
        if (err) {
            console.error("błąd przy odczycie pliku: ".red, err.message);
            return;
        }
        response.writeHead(200, {
            "Content-Type": "text/css"
        });
        response.write(css);
        response.end();
    });
}

function error(request, response) {
    console.error("Nie wiem co robić.".red);
    response.write("404 :(");
    response.end();
}

function showImages(requestedUrl, request, response) {
    var uploadedFilePath = path.join(__dirname, '..', requestedUrl);

    fs.readFile(uploadedFilePath, "binary", function (err, file) {
        if (err) {
            console.error("błąd przy odczycie pliku: ".red, err.message);
            error(request, response);
            return;
        }
        response.writeHead(200, {
            "Content-Type": "image/png"
        });
        response.write(file, "binary");
        response.end();
    });
}

module.exports = {
    upload: upload,
    welcome: welcome,
    styleStart: styleStart,
    error: error,
    showImages: showImages
}