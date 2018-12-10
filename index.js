var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var l=[];
var clients=0;


io.on('connection', function(socket){
	clients++;
	socket.on('online',function(msg){
		l.push([socket.id,msg]);
		io.emit('online',l);
	})
	console.log(l);
	console.log('USer connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('typing1',function(msg){
		socket.broadcast.emit('typing1',msg);
	});
   socket.on('typing2',function(msg){
		socket.broadcast.emit('typing2',msg);
	});
  var msg1="A USer Disconnected";
socket.on('disconnect',function(socket){
	console.log("Disconnected");
	var in_l=-8;
	clients--;
	for(i=0;i<clients;i++){

			if(clients>0){
				if(l[i][0]==socket.id){
					in_l=i;
				}
			}
	}
	l.splice(in_l,1);
	io.emit('online',l);
		

	io.sockets.emit('broadcast',clients);
	console.log(l);

	
});
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
