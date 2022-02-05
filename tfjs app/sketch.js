let tic
let turn = 0
let model
function setup() {
  createCanvas(400, 400);
  tic = new TicTacToe()
  model = tf.loadGraphModel("model/model.json")

}

function draw() {
  background(220);
  tic.show()
}