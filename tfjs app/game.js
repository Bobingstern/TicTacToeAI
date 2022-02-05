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
  checkForWin(){
    const reducer = (previousValue, currentValue) => previousValue + currentValue;
    //Check across for O
    let rotatedArr = transposeArray(this.board, this.board.length)
    for (let r of this.board){
      if (r.reduce(reducer) == 6){
        return 2
      }
    }
    for (let r of rotatedArr){
      if (r.reduce(reducer) == 6){
        return 2
      }
    }
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
    for (let c=0;c<this.board.length;c++){
      let y = height/2 - this.cellsize/2
      for (let r=0;r<this.board[c].length;r++){
        push()
        if (this.board[r][c] == 1){
          this.drawCross(x, y, this.cellsize/2)
        }
        else if (this.board[r][c] == 2){
          noFill()
          circle(x, y, this.cellsize/2)
        }
        pop()
        y+=this.cellsize
      }
      x+=this.cellsize
    }
  }
  printBoard(){
    console.log(this.board[0])
    console.log(this.board[1])
    console.log(this.board[2])
  }
}