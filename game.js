
function start(){

    let element = document.getElementById("quadro");
    let ctx     = element.getContext("2d");

    let mousePos = {
        x: 0,
        y: 0
    };

    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    setInterval(function(){
        //x:element.width / mousePos.x,
        //y:element.height / mousePos.y
        socket.emit("move", JSON.stringify(mousePos) );
    }, 100)//16)

    window.onmousemove = function(e){
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    }

    element.height = window.innerHeight;
    element.width  = window.innerWidth;

    let comprimento = 100;
    let altura = element.height * .75;
    let posX = 0;

    let lines = [];
    const addLine = (posX, posY, size) => {
        ctx.beginPath();
        ctx.moveTo(posX, posY);
        ctx.lineTo(posX + size, posY);
        ctx.stroke();
    }
    
    const render = () => {
        // solicita novo waiter de frame
        requestAnimationFrame(render);

        // faz o render
        ctx.clearRect(0, 0, element.width, element.height);

        // põe a posição no meio do mouse
        posX = mousePos.x - (comprimento / 2);

        
        addLine(posX, altura, comprimento)
        
        for(let i in users)
            addLine(users[i].x, altura - 100, comprimento)

    }
    
    // inicia a renderização
    render();
}