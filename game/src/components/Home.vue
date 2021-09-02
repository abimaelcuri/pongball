<template>
	<div class="home">
		<body>
			<div v-if="!isUserReady" ref="userStartup">
				Insira seu nome:
				<input type="text" ref="name" minlength=1>

				<div class="button" @click="startup()">Start!</div>
			</div>

			<canva v-if="isUserReady" :socket="socket"></canva>
		</body>
	</div>
</template>

<script>

import Canva    from './Canva.vue'

export default {
	name: 'Home',
	components: {
		Canva
	},
	props: {
		msg: String
	},
	data(){
		return {
			socket: null,
			users: null,
			isUserReady: false
		}
	},
	mounted () {
		console.log("io", this.io);
	},
	methods: {
		startup () {
			let name = this.$refs.name.value;
			if(!name.length) return false;

			this.$refs.userStartup.className = "opened";

			let socket  = this.socket =  this.io/*({
                debug: true,
                connection: "localhost:8081"
            });*/
            this.isUserReady = true;
			let users   = this.users = {};

			socket.on("connect", () => {
				console.log(socket.id); // "G5p5..."

				socket.emit("user", {
					name
				});
				
				setTimeout(function(){
					// start();
				}, 1000)
			});

			socket.on('user', function(data){
				//if(typeof users[data.id] == "undefined")
				users[data.id] = JSON.parse(data.data);
			});
		}
	}
}
</script>
<style scoped>
	input{
		display: inline-block;
		border: 1px solid #ccc;
		padding: 3px 12px;
	}
	.button{
		display: inline-block;
		border: 1px solid #ccc;
		border-radius: 100px;
		padding: 3px 12px;
		margin: 5px;
	}
	#quadro {
		width: 100%;
		height: 100%;
	}
	html, body{
		margin: 0;
		padding: 0;
		border: 0;
	}

	#userStartup{
		width: 100%;
		height: 100%;
		position:absolute;
		top: 0;
		left: 0;
		background: #ccc;
	}
	#userStartup.opened{
		display: none
	}
</style>
