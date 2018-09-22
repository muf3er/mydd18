var express = require('express');
var cors = require('cors');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const fileUpload = require('express-fileupload');

app.get('/test', cors(), function (req, res) {
    console.log('New request to test');
    res.send("Wow Pay works");
});

app.post('/verifyPayment/', cors(), function (req, res) {
    console.log('New request to verify');
    const sql = require("mssql/msnodesqlv8");

    const config = {
        user: 'tp036861',
        password: 'Harry@123',
        server: 'tcp:tp036861.database.windows.net,1433',
        database: 'SafeLife',
        connectionTimeout: 30000
    }

    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    



    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request()
            .input('ID', sql.Int, req.params.ID)
            .query("UPDATE Requests SET Requests.Accepted = 1 WHERE Requests.ID = @ID AND Accepted != 1")
    }).then(result => {
        console.log(result);
        res.send(result.rowsAffected);
        sql.close();
    }).catch(err => {
        console.log(err);
        res.send(err);
        sql.close();
    });
    console.log('Request completed successfully');
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});