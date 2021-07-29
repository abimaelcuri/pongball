
const httpServer = require("http").createServer();
global.io = require("socket.io")(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});


io.on("connect", (socket) => {


    socket.on("move", function(msg){

        let users = Object.fromEntries(io.sockets.sockets);

        for(let user in users){
            //console.log(users[user])
            if(socket.id == users[user].id) continue;

            users[user].emit("user", {
                id: socket.id,
                data: msg
            });
        }
        //console.log("recebeu move: ", msg)
    })
    console.log(socket.id); // "G5p5..."
});

console.log("Started")

httpServer.listen(8081);