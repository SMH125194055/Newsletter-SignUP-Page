//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");
const path = require('path');

const app = express();
app.use(express.static('publics'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.Email;
    console.log(firstName, lastName, email);
    //    res.send("Thank you for registering!");

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    "FNAME": firstName,
                    "LNAME": lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us13.api.mailchimp.com/3.0/lists/603c1efb63";
    const options = {
        method: "POST",
        auth: "huzaifa:8d9cfc7e1c134980ce4e2af3af737184-us13"
    }

    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            //res.send("Pleae Try Again Later.");
            res.sendFile(__dirname + "/failure.html");
        }


        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    });


    request.write(jsonData);
    request.end();

});

app.post("/failure", function (req, res) {
    res.redirect("/");
});
app.post("/success", function (req, res) {
    res.redirect("/");
});







// API Key
// 8d9cfc7e1c134980ce4e2af3af737184-us13


// Audiance ID
// 603c1efb63


app.listen(process.env.PORT || 3000, function (res, req) {
    console.log("Server is running on port 3000");
});