function transposeArray(array, arrayLength){
    var newArray = [];
    for(var i = 0; i < array.length; i++){
        newArray.push([]);
    };

    for(var i = 0; i < array.length; i++){
        for(var j = 0; j < arrayLength; j++){
            newArray[j].push(array[i][j]);
        };
    };

    return newArray;
}

class TicTacToe{
  constructor(){
    this.cellsize = 70
    this.board = []
    this.initBoard()
    this.selections = createVector(0, 0)
    this.flatSel = 0
  }
  initBoard(){
    this.board = [[0, 0, 0],
                 [0, 0, 0],
                 [0, 0, 0]]
  }
  moveCross(place){
    if (place > 8 || place < 0){return false}
    let row = place % 3
    let column = floor(place/3)
    if (this.board[column][row] == 0){
      this.board[column][row] = 1;
      return true
    }
    return false
  }
  moveO(place){
    if (place > 8 || place < 0){return false}
    let row = place % 3
    let column = floor(place/3)
    if (this.board[column][row] == 0){
      this.board[column][row] = 2;
      return true
    }
    return false
  }
  rowIsWinning(arr, item){
    for (let i of arr){
      if (i != item){
        return false
      }
    }
    return true
  }
  getDiags(arr){
    let diags = []
    let temp = []
    for (let i in arr){
        temp.push(arr[i][i])
    }
    diags.push(temp)
    temp = []
    for (let i=arr.length-1;i>-1;i--){
        temp.push(arr[arr.length-1-i][i])
    }
    diags.push(temp)
    return diags
  }
  checkForWin(){
    let rot = transposeArray(this.board, this.board.length)
    let diags = this.getDiags(this.board)
    for (let r of this.board){
      if (this.rowIsWinning(r, 2)){
        return 2
      }
    }
    for (let r of rot){
      if (this.rowIsWinning(r, 2)){
        return 2
      }
    }
    for (let r of diags){
      if (this.rowIsWinning(r, 2)){
        return 2
      }
    }

    for (let r of this.board){
      if (this.rowIsWinning(r, 1)){
        return 1
      }
    }
    for (let r of rot){
      if (this.rowIsWinning(r, 1)){
        return 1
      }
    }
    for (let r of diags){
      if (this.rowIsWinning(r, 1)){
        return 1
      }
    }

    for (let i of this.board.flat()){
      if (i == 0){
        return -1
      }
    }
    return 0
  }
  getState(turn){
    let state = this.board.flat()
    if (turn == 1){
        for (let i=0;i<state.length;i++){
            if (state[i] == 2){
                state[i] = 1
            }
            else if (state[i] == 1){
                state[i] = 2
            }
        }
    }
    return state
  }
  
  
  drawCross(x, y, si){
    line(x-si/2, y-si/2, x+si/2, y+si/2)
    
    line(x+si/2, y-si/2, x-si/2, y+si/2)
  }
  show(){
    let x = width/2 - this.cellsize
    line(width/2-this.cellsize*1.5, height/2, width/2+this.cellsize*1.5, height/2)
    line(width/2-this.cellsize*1.5, height/2+this.cellsize, width/2+this.cellsize*1.5, height/2+this.cellsize)
    
    line(width/2-this.cellsize/2, height/2-this.cellsize, width/2-this.cellsize/2, height/2+this.cellsize*2)
    line(width/2+this.cellsize/2, height/2-this.cellsize, width/2+this.cellsize/2, height/2+this.cellsize*2)
    
    let flatPos = 0
    let points = []
    let pointInds = []
    for (let c=0;c<this.board.length;c++){
      let y = height/2 - this.cellsize/2
      for (let r=0;r<this.board[c].length;r++){
        points.push(createVector(x, y))
        pointInds.push(createVector(c, r))
        push()
        if (this.selections.x == c && this.selections.y == r){
          stroke(0, 255, 0, 200)
          noFill()
          rectMode(CENTER)
          rect(x, y, this.cellsize)
          stroke(0)
        }
        if (this.board[r][c] == 1){
          this.drawCross(x, y, this.cellsize/2)
        }
        else if (this.board[r][c] == 2){
          noFill()
          circle(x, y, this.cellsize/2)
        }
        pop()
        y+=this.cellsize
        flatPos++
      }
      x+=this.cellsize
    }
    let clampedX = constrain(mouseX, width/2-this.cellsize*1.5, width/2+this.cellsize*1.5)
    let clampedY = constrain(mouseY, height/2-this.cellsize, height/2+this.cellsize*2)
    let closest = 999999
    for (let i=0;i<points.length;i++){
      let d = dist(points[i].x, points[i].y, clampedX, clampedY)
      if (d < closest){
        closest = d
        this.selections = pointInds[i].copy()
      }
    }
    this.flatSel = this.selections.x + (3*this.selections.y)
  }
  printBoard(){
    console.log(this.board[0])
    console.log(this.board[1])
    console.log(this.board[2])
  }
}