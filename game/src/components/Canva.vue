<template>
	<div class="quadro">
		<canvas ref="quadro"></canvas>
	</div>
</template>

<style scoped>
	.quadro, 
	.quadro canvas{
		width: 100%;
		height: 100%;
	}
</style>

<script>

export default {
	name	: 'Canva',
	props	: ["socket"],
	data(){
		return {
            config: {
                comprimento: 100,
                altura: 0
            },
            positionX: {
                player1: 0,
                player2: 0
            },
            mousePos: {
                x: 0,
                y: 0
            },
			users: null,
            element: null,
            ctx: null
		}
	},
	methods: {
		debounce(func, timeout = 300) {
			let timer;
			return (...args) => {
				clearTimeout(timer);
				timer = setTimeout( () => { 
					func.apply(this, args); 
				}, timeout);
			};
		},
        render(){
			// solicita novo waiter de frame
			requestAnimationFrame(this.render);

			// faz o render
			this.ctx.clearRect(0, 0, this.element.width, this.element.height);

			// põe a posição no meio do mouse
			this.positionX.user1 = this.mousePos.x - (this.config.comprimento / 2);

			this.addLine(this.positionX.user1, this.config.altura, this.config.comprimento)
			/*
			for(let i in users)
				this.addLine(users[i].x, altura - 100, comprimento)*/

        },
        addLine(posX, posY, size) {
			this.ctx.beginPath();
			this.ctx.moveTo(posX, posY);
			this.ctx.lineTo(posX + size, posY);
			this.ctx.stroke();
		}
	},
	mounted(){
		let that = this;
        
		this.element = this.$refs.quadro;
		this.ctx     = this.element.getContext("2d");

		setInterval(function(){
			//x:element.width / mousePos.x,
			//y:element.height / mousePos.y
			that.socket.emit("move", JSON.stringify(that.mousePos) );
		}, 100)//16)

		window.onmousemove = function(e){
			that.mousePos.x = e.clientX;
			that.mousePos.y = e.clientY;
		}

		this.element.height = window.innerHeight;
		this.element.width  = window.innerWidth;

		this.config.altura = this.element.height * .75;

		// let lines = [];
	
		
		// inicia a renderização
		this.render();
	}
}
</script>
