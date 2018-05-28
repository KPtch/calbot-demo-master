// var restify = require('restify');
// var builder = require('botbuilder');
// var data = require('./respond.json');
// var question = require('./question.json');

// var server = restify.createServer();
// server.listen(process.env.port || process.env.PORT || 3978, function(){
//     console.log('%s listening to %s', server.name, server.url);
// });

// // Setup Bot
// var connector = new builder.ChatConnector({
//     appId: process.env.MICROSOFT_APP_ID,
//     appPassword: process.env.MICROSOFT_APP_PASSWORD
// });
// var bot = new builder.UniversalBot(connector);


// var timeout = undefined;

// var msg = server.post('api/messages', connector.listen());


// bot.dialog('/', function (session) {
    
//     var req = session.message.text;
//     var resKey = null;
//     var keys = Object.keys(data);
//     for(var i=0; i<keys.length; i++){
//         var key = keys[i];
//         var regex = new RegExp(key);
//         if(req.match(regex)){
//             resKey = key;            
//             break;
//         }
        
//     }
//     if(resKey){
//         var s = 'นี้จ้า'+"\n";
//         session.send(s+data[resKey]);
// //         setTimeout(function(){ session.send(s+data[resKey]) }, 500);
        
        
//     } else {
        
//         var res = 'สวัสดีจ้าา เราคือบอท KunSri'+'\n';
//         question.forEach(function(questions,index){
//             res += "\n"+questions;
            
//         });
// //         setTimeout(function(){ session.send(res) }, 500);
//         session.send(res);
//     }           
           
// });




//                           ---------3/5/2018--------
// var firebase = require('firebase');
// firebase.initializeApp({
//     databaseURL: 'https://ksbot-test.firebaseio.com/',
//     serviceAccount: 'ksbot-test-dec.json', //this is file that I downloaded from Firebase Console
// });

// var ref = firebase.database().ref();

// ref.on("value", function (snapshot) {
//     data  = snapshot.val();
//     console.log(data[0].key);
// });



"use strict";
var restify     = require('restify');
var builder     = require('botbuilder');
var data1        = require('./respond.json');
var data2        = require('./Case3.json');
var question    = require('./question.json');
var firebase    = require('firebase');
const fbTemplate = require('fb-message-builder');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log('%s listening to %s', server.name, server.url);
});

// Setup Bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);

var msg = server.post('api/messages', connector.listen());


firebase.initializeApp({
        databaseURL: 'https://ksbot-test.firebaseio.com/',
        serviceAccount: 'ksbot-test-dec.json', //this is file that I downloaded from Firebase Console
});

var ref = firebase.database().ref();



function resKeys(req){
    var resKey = null;
    var keys = Object.keys(data1);
    for(var i=0; i<keys.length; i++){
        
        var key = keys[i];
        var regex = new RegExp(key);
        if(req.match(regex)){
            resKey = key;       
            return resKey;
        }
        
    }
}
function resKeys1(req){
    var resKey1 = null;
    var keys1 = Object.keys(data2);
    for(var i=0; i<keys1.length; i++){
        
        var key = keys1[i];
        var regex = new RegExp(key);
        if(req.match(regex)){
            resKey1 = key;       
            return resKey1;
        }
        
    }
}
function sendButton(session,req){
    ref.on("value", function (snapshot) {
            var dddd  = snapshot.val();
            
            for(var i=0;i<dddd.length; i++){
                if(req===dddd[i].key){
                    var hCard = 'ต้องการเอกสารนี้ใช่ไหม?'+'\n';
                    var hh = "\n"+'ใบ'+dddd[i].key+'  :  [ '+dddd[i].link+' ]';
                    var hhh = "\n"+'คำแนะนำ  :  [ '+dddd[i].comment+' ]';
                    hCard += hh+hhh;

                    session.send(hCard);
                    
                }                
            }
     });  
}
bot.dialog('/',function (session) {
    
    var req = session.message.text;
    // session.send(req);
    var resKey = resKeys(req);
    var resKey1 = resKeys1(req);
    
//     session.send(resKey);
    if(resKey){
        sendButton(session,data1[resKey]);   
        
        
    }
    else if(resKey1){
//         session.send("ขอละเอียดกว่านี้หน่อยน้า");
        
        switch(data2[resKey1]) {
            case "ใบลา":
                session.beginDialog('SelectChoice');
//                 session.send("ขอละเอียดกว่านี้หน่อยน้า");
                break;
            case "สอบ":
                session.beginDialog('ChooseChoice');
//                 session.send("ขอละเอียดกว่านี้หน่อยน้า");
                break;
            case "เทียบ":
                session.beginDialog('PickChoice');
//                 session.send("ขอละเอียดกว่านี้หน่อยน้า");
                break;
            case "เพิ่ม":
                session.beginDialog('PickChoice1');
//                 session.send("ขอละเอียดกว่านี้หน่อยน้า");
                break;
            default:
                break;
        }
    }else {
        
        var res = 'สวัสดีจ้าา เราคือบอท KunSri'+'\n';
        question.forEach(function(questions,index){
            res += "\n"+questions;
            
        });
        session.send(res);
    }           
           
});
bot.dialog('SelectChoice',[
    function (session) {
        builder.Prompts.choice(session, "เลือกใบที่ต้องการได้เลยน้า", "ใบลาป่วย/กิจ|ใบขอลาออก|ใบขอลาพักการศึกษา|ต้องการใบอื่น", {
            listStyle: builder.ListStyle.button
        });
    },
    function (session, results) {
        
        if(results.response){
            var rrrr= resKeys(results.response.entity);
            var rrrr1= resKeys1(results.response.entity);
            if(rrrr){
                sendButton(session,data1[rrrr]);
                session.endDialog();
            }else if(rrrr1){
                session.beginDialog('/');
                session.endDialog();
            }else if("ต้องการใบอื่น"){
                session.endDialog('กรอกใบที่ต้องการใหม่หน่อยน้า');
            }else{
                session.endDialog('กรอกใบที่ต้องการใหม่หน่อยน้า');
            }
        }else{
            session.endDialog('กรอกใบที่ต้องการใหม่หน่อยน้า');
        }
        
        
//         if(results.response){
//             var rrrrr= resKeys(results.response.entity);
//             var rrrrr1= resKeys1(results.response.entity);
//             if(rrrrr){
//                 sendButton(session,data1[rrrrr]);   
//                 session.endDialog();

//             }
//             else if(rrrrr1){

//                 switch(data2[rrrrr1]) {
//                     case "ใบลา":
//                         session.beginDialog('SelectChoice');
//                         session.endDialog();
//                         break;
//                     case "สอบ":
//                         session.beginDialog('ChooseChoice');
//                         session.endDialog();
//                         break;
//                     case "เทียบ":
//                         session.beginDialog('PickChoice');
//                         session.endDialog();
//                         break;
//                     case "เพิ่ม":
//                         session.beginDialog('PickChoice1');
//                         session.endDialog();
//                         break;
//                     default:
//                         session.endDialog();
//                         break;
//                 }
//             }else if("ต้องการใบอื่น"){
//                 session.endDialog('กรอกใบที่ต้องการใหม่หน่อยน้า');
//             }else {

//                 var res = 'สวัสดีจ้าา เราคือบอท KunSri'+'\n';
//                 question.forEach(function(questions,index){
//                     res += "\n"+questions;

//                 });
//                 session.send(res);
//                 session.endDialog();
//             } 
//        }
//        session.endDialog();

    }
]);
bot.dialog('ChooseChoice',[
    function (session) {
        builder.Prompts.choice(session, "เลือกใบที่ต้องการได้เลยน้า", "ใบขอสอบชดใช้|ใบขอสอบชดใช้กรณีป่วย|ต้องการใบอื่น", {
            listStyle: builder.ListStyle.button
        });
    },
    function (session, results) {
        
        if(results.response){
            var rrrr= resKeys(results.response.entity);
            var rrrr1= resKeys1(results.response.entity);
            if(rrrr){
                sendButton(session,data1[rrrr]);
                session.endDialog();
            }else if(rrrr1){
                session.beginDialog('/');
                session.endDialog();
            }else if("ต้องการใบอื่น"){
                session.endDialog('กรอกใบที่ต้องการใหม่หน่อยน้า');
            }else{
                session.endDialog('กรอกใบที่ต้องการใหม่หน่อยน้า');
            }
        }else{
            session.endDialog('กรอกใบที่ต้องการใหม่หน่อยน้า');
        }
        
    }
]);
bot.dialog('PickChoice',[
    function (session) {
        builder.Prompts.choice(session, "เลือกใบที่ต้องการได้เลยน้า", "ใบขอเทียบโอนรายวิชา|ใบขอเทียบรายวิชา|ต้องการใบอื่น", {
            listStyle: builder.ListStyle.button
        });
    },
    function (session, results) {
        
        if(results.response){
            var rrrr= resKeys(results.response.entity);
            var rrrr1= resKeys1(results.response.entity);
            if(rrrr){
                sendButton(session,data1[rrrr]);
                session.endDialog();
            }else if(rrrr1){
                session.beginDialog('/');
                session.endDialog();
            }else if("ต้องการใบอื่น"){
                session.endDialog('กรอกใบที่ต้องการใหม่หน่อยน้า');
            }else{
                session.endDialog('กรอกใบที่ต้องการใหม่หน่อยน้า');
            }
        }else{
            session.endDialog('กรอกใบที่ต้องการใหม่หน่อยน้า');
        }
    }
]);
bot.dialog('PickChoice1',[
    function (session) {
        builder.Prompts.choice(session, "เลือกใบที่ต้องการได้เลยน้า", "ใบลงเรียนล่าช้า|ใบแอดมือ|ต้องการใบอื่น", {
            listStyle: builder.ListStyle.button
        });
    },
    function (session, results) {
        
        if(results.response){
            var rrrr= resKeys(results.response.entity);
            var rrrr1= resKeys1(results.response.entity);
            if(rrrr){
                sendButton(session,data1[rrrr]);
                session.endDialog();
            }else if(rrrr1){
                session.beginDialog('/');
                session.endDialog();
            }else if("ต้องการใบอื่น"){
                session.endDialog('กรอกใบที่ต้องการใหม่หน่อยน้า');
            }else{
                session.endDialog('กรอกใบที่ต้องการใหม่หน่อยน้า');
            }
        }else{
            session.endDialog('กรอกใบที่ต้องการใหม่หน่อยน้า');
        }
    }
]);




