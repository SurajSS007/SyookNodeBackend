require("./models/config");
const http = require("http");
const events = require("events");
const express = require("express")
const cors = require("cors");

const app = express();
const static = require("node-static");
const file = new static.Server("./");
const users = require("./users");
var CryptoJS = require("crypto-js");
var crypto = require("sha256");
const mongoose = require("mongoose"); //importing mongoose


const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const Person =mongoose.model("Person");
const user = require('./routes/userRoute');  
app.use(express.json());            // import  userRoute    
app.use('/user',user);        //  setting router 

class myEvent extends events {}
const myEmit = new myEvent();

users.map((item) => {
  let encrypt = crypto(JSON.stringify(item));
  item.secret_key = encrypt;
});

let data = [];
const secret = "SecretPassphrase";
users.map((item) => {
  var encrypted = CryptoJS.AES.encrypt(JSON.stringify(item), secret).toString();
  data.push(encrypted.toString());
});
let allUsers = "";
for (let i = 0; i < data.length; i++) {
  if (i > 0) {
    allUsers = allUsers + "|" + data[i];
  } else {
    allUsers = allUsers + data[i];
  }
}



let tempUserData = [];
let arr = [];

myEmit.on("NJS-Listener", function (req) {
  let encryptedUsers = req.split("|");
  encryptedUsers.map((item) => {
    var bytes = CryptoJS.AES.decrypt(item, secret);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    let a = decryptedData.secret_key;
    delete decryptedData.secret_key;
    let encryptedOne = crypto(JSON.stringify(decryptedData));


    if (a == encryptedOne) {
      decryptedData.timestamp = new Date();
      tempUserData.push(decryptedData);
      arr.push(decryptedData);
    }
  });
});


let count = 0 ;
  setInterval(() =>{
    console.log(arr[count]);
  if(count == 10){
    count = 0 ;
  }
  let a = arr[count];
  count++;
  let persons = new Person();
  persons.name = a.name;
  persons.time = new Date();
  persons.stream = arr;
  persons.save((err, doc) => {
    if (err) {
      console.log(err);
    } else {
      arr.length = 0 ;
      console.log(doc);
    }
  });
},60000)


let num = 0 ;

      app.get("/stream", (req, res) => {
        res.set({
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
      
          // enabling CORS
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
        });
        if(num == 0){
          tempUserData.length = 0;
          num++;
        }

        let eventInterval = setInterval(() => {
          // console.log("d",tempUserData);
          res.write(`event: message\n`);
          res.write(`data: ${JSON.stringify(tempUserData)}\n\n`);
          // console.log("dwdw");
            tempUserData.length = 0;
        },10000);
      
        req.on("close", (err) => {
          clearInterval(eventInterval);
          res.end();
        });
      });

myEmit.on("NJS-Emitter", function (req) {
  myEmit.emit("NJS-Listener", req);
});

setInterval(() => {
  myEmit.emit("NJS-Emitter", allUsers);
}, 10000);




app.listen((process.env.PORT || 5000), () =>
  console.log(`Server running at http://localhost:${porte}`)
);

