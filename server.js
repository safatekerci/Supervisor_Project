//server.js
var app         = require('express')();
var http        = require('http').Server(app);
var io          = require('socket.io')(http);
var dl          = require('delivery');
var fs          = require('fs');
var formidable  = require('formidable');

// supervisor tarafında bir socket açtık..
io.sockets.on('connection', function(socket){
  // web serverı  dinle...
  var delivery = dl.listen(socket);
  // alma işlemi başarılıysa...
  delivery.on('receive.success',function(file){
    // alınan dosyayı belirtilen yere kaydet..
    console.log(file.name);
    sendFile(file.buffer);
    /*
    fs.writeFile('./receivefiles/' + file.name, file.buffer, function(err){
      if(err){
        console.log('!!! Supervisor -> Dosya kaydedilemedi : ' + err);
      }else{
        console.log('Supervisor => ' + file.name + " dosyası başarıyla kaydedildi...");
        
        // Web_Server'dan gelen dosyayı AV-Machine' e göndermek için..
        
      };
    });
    */
  });	
  
});

var sendFile = function(file)
{
      var io  = require('socket.io-client');

      // göndereceğimiz yerin socket adresi...
      var socket = io.connect('http://192.168.151.152:8080/');
      // socketi açtık...
      socket.on('connect', function(){
          // her iki tarafıda server yaptık karşıdan dönecek sonuçları alabilmek için...
          delivery = dl.listen( socket );
          delivery.connect();

          // dosya göndermek için...
          delivery.on('delivery.connect',function(delivery){
              console.log("send file", file.name);
              delivery.send(file);          
          });

          // dosya gönderme başarılı ise..
          delivery.on('send.success',function(fileUID){
              console.log('Supervisor => ' + file.name + " dosyası başarıyla gönderildi...");
              socket.close();
          });
      });

}


// portu dinle...
http.listen(5001, function () {
  console.log('5001. port dinleniyor..');
});