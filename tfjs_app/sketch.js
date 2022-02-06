let tic
let turn = 1
let model

async function loadModel(){
	model = await tf.loadLayersModel("https://raw.githubusercontent.com/Bobingstern/TicTacToeAI/main/tfjs_app/model/model.json")
}
loadModel()
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  tic = new TicTacToe()
  
}

function draw() {
  background(220);
  textAlign(CENTER)
  //text("You are Os (Knots). Press a key from 0-8", width/2, 100)
  if (tic.checkForWin() == -1){
	  if (turn == 0){
	  	let tn = tf.tensor([tic.getState(turn)])
	  	let act = model.predict(tn).dataSync()
	  	
	  	tic.moveCross(act.indexOf(Math.max(...act)))
	  	turn = 1
	  }
  }
  else{
  	text("There was a win/draw", width/2, 50)
  }
  tic.show()
}

function mouseClicked(){
	if (turn == 1){
		tic.moveO(tic.flatSel)
		turn = 0
	}
}
// function keyPressed(){
// 	if (turn == 1){
// 		if (keyCode == 48){
// 			tic.moveO(0)
// 			turn = 0
// 		}
// 		if (keyCode == 49){
// 			tic.moveO(1)
// 			turn = 0
// 		}
// 		if (keyCode == 50){
// 			tic.moveO(2)
// 			turn = 0
// 		}
// 		if (keyCode == 51){
// 			tic.moveO(3)
// 			turn = 0
// 		}
// 		if (keyCode == 52){
// 			tic.moveO(4)
// 			turn = 0
// 		}
// 		if (keyCode == 53){
// 			tic.moveO(5)
// 			turn = 0
// 		}
// 		if (keyCode == 54){
// 			tic.moveO(6)
// 			turn = 0
// 		}
// 		if (keyCode == 55){
// 			tic.moveO(7)
// 			turn = 0
// 		}
// 		if (keyCode == 56){
// 			tic.moveO(8)
// 			turn = 0
// 		}
		
// 	}
// }