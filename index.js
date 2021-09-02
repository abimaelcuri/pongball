const httpServer = require("http").createServer();
global.io = require("socket.io")(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

let room = {
    users: {},
    waiting: {},
    games: {}
}


io.on("connect", (socket) => {

    socket.on("disconnect", function(msg){
        // busca sala que o usuário tá e apaga
        if(room.users[socket.id].onRoom){
            let game = room.games[room.users[socket.id].onRoom]
            if(game.user1 !== room.users[socket.id]){
                game.user1.onRoom = false;
                room.waiting[socket.id] = game.user1;

            }

            if(game.user2 !== room.users[socket.id]){
                game.user2.onRoom = false;
                room.waiting[socket.id] = game.user2;
            }

            delete room.games[room.users[socket.id].onRoom];
        }
    })

    socket.on("user", function(msg){
        // create or update user
        if(!msg.id)
            msg.id = socket.id
        
        room.users[msg.id] = {
            name: msg.name,
            score: 0,
            socket: socket,
            onRoom: null
        }

        // add user on waiting list
        room.waiting[msg.id] = room.users[msg.id];
        roomMount();
    });


    socket.on("move", function(msg){

        if(!room.users[socket.id] || !room.users[socket.id].onRoom) return false;

        //console.log("moved ", socket.id, room.users[socket.id].onRoom)
        socket.to(room.users[socket.id].onRoom).emit({
            id: socket.id,
            data: msg
        });

/*
        let sockets = Object.fromEntries(io.sockets.sockets);

        for(let user in sockets){
            //console.log(sockets[user])
            if(socket.id == sockets[user].id) continue;

            sockets[user].emit("user", {
                id: socket.id,
                data: msg
            });
        }*/
        //console.log("recebeu move: ", msg)
    })
    console.log(socket.id); // "G5p5..."
});

console.log("Started")

httpServer.listen(8081);

var statuses = {
    isRunningRoomMount: false
};

/**
 * Create a random number for game id
 * @returns game id
 */
function getUniqueGameId(){
    let id = Math.round(Math.random() * 10e6);
    if(typeof room.games[id] != "undefined")
        return getUniqueGameId();
    return id;
}


/**
 * get users from waiting list & create rooms by pairs
 */
function roomMount(a) {
    console.log("room Mount", a);

    if(statuses.isRunningRoomMount) return;

    statuses.isRunningRoomMount = true;

    let waitingList = Object.keys(room.waiting);

    if (waitingList.length > 1 ) {
        
        for(let i = 0; i < waitingList.length; i++ ){
            let thisUser = room.waiting[ waitingList[i] ];
            let nextUser = room.waiting[ waitingList[i + 1] ];

            // existe esse +1? 
            if(nextUser){

                let gameId = waitingList[i] + "_" + waitingList[i + 1];//getUniqueGameId()
                // cria o game
                room.games[gameId] = {
                    user1: thisUser,
                    user2: nextUser
                };

                // add users to room
                thisUser.socket.join(gameId);
                nextUser.socket.join(gameId);

                thisUser.onRoom = gameId;
                nextUser.onRoom = gameId;

                // remove users from waiting list
                delete room.waiting[ waitingList[i] ];
                delete room.waiting[ waitingList[i + 1] ];
                gameMount(gameId);

                // pula o prox
                i++

            }

        }

    }
    statuses.isRunningRoomMount = false;
}

function gameMount(gameId){
    console.log("game mount", gameId)
}




