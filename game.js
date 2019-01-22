'use strict';

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i, j){
    return <Square 
              value={this.props.squares[i][j]}
              onClick={() => this.props.onClick(i, j)}
              key={`${i}-${j}`}
            />;
  }
  render() {
    const squareRows = [];
    for(let i = 0; i < this.props.squares.length; i++){
      let row = [];
      for(let j = 0; j < this.props.squares[i].length; j++){
        row.push(this.renderSquare(i, j));
      }
      squareRows.push(<div key={i} className="board-row">{row}</div>);
    }
    return (
      <div>
        {squareRows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    let squares = [];
    for(let i = 0; i < this.props.rowSize; i++){
      squares.push(Array(this.props.colSize).fill(null));
    }
    this.state = {
      squares: squares,
      xIsNext: true,
      lastStep: null
    };
  }
  initGame(){
    let squares = [];
    for(let i = 0; i < this.props.rowSize; i++){
      squares.push(Array(this.props.colSize).fill(null));
    }
    this.setState({
      squares: squares,
      xIsNext: true,
      lastStep: null
    });
  }
  handleClick(i, j){
    const squares = deepClone2DimArray(this.state.squares);
    const lastStep = deepClone2DimArray(squares);
    squares[i][j] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares, 
      xIsNext: !this.state.xIsNext,
      lastStep: lastStep
    });
  }
  toLastStep(){
    this.setState({
      squares: this.state.lastStep, 
      xIsNext: !this.state.xIsNext,
      lastStep: null
    });
  }
  render(){
    const winner = calculateWinner(this.state.squares, this.props.rowSize, this.props.colSize, this.props.targetCount);
    let status;
    return (
      <div className="game">
        <div className="game-board-ctn">
          <div className={`game-board cursor-${this.state.xIsNext ? 'X' : 'O'}`}>
            <Board squares={this.state.squares} onClick={(i, j) => this.handleClick(i, j)} />
          </div>
          {winner ? <div className="win-panel"><span>{winner}胜利!</span></div> : null}
        </div>
        <div className="game-info">
          {this.state.lastStep && !winner ? <button onClick={() => this.toLastStep()}>悔棋</button> : null}
          {winner ? <button onClick={() => this.initGame()}>再来一局</button> : null}
        </div>
      </div>
    );
  }
}

function calculateWinner(squares, rowSize, colSize, targetCount){
  const squareRows = getSquareRows(squares, rowSize, colSize, targetCount);
  const squareCols = getSquareCols(squares, rowSize, colSize, targetCount);
  const squareLeftDias = getSquareLeftDias(squares, rowSize, colSize, targetCount);
  const squareDiaRight = getSquareRightDias(squares, rowSize, colSize, targetCount);
  let winner = caculateSeria(squareRows, targetCount);
  if(winner){
    return winner;
  }
  winner = caculateSeria(squareCols, targetCount);
  if(winner){
    return winner;
  }
  winner = caculateSeria(squareLeftDias, targetCount);
  if(winner){
    return winner;
  }
  winner = caculateSeria(squareDiaRight, targetCount);
  if(winner){
    return winner;
  }
  return null;
}

function getSquareRows(squares, rowSize, colSize, targetCount){
  return squares;
}

function getSquareCols(squares, rowSize, colSize, targetCount){
  const squareCols = [];
  for(let c = 0; c < colSize; c++){
    let col = [];
    for(let r = 0; r < rowSize; r++){
      col.push(squares[r][c]);
    }
    squareCols.push(col);
  }
  return squareCols;
}

function getSquareLeftDias(squares, rowSize, colSize, targetCount){
  const squareLeftDias = [];
  for(let c = targetCount - 1; c < colSize; c++){
    let dia = [];
    let colInc = 0;
    for(let r = 0; r < rowSize; r++){
      if(c - colInc >= 0){
        dia.push(squares[r][c-colInc++]);
      }else{
        break;
      }
    }
    squareLeftDias.push(dia);
  }
  for(let r = 1; r < rowSize - targetCount + 1; r++){
    let dia = [];
    let rowInc = 0;
    for(let c = colSize - 1; c >= 0; c--){
      if(r + rowInc < rowSize){
        dia.push(squares[r + rowInc++][c]);
      }else{
        break;
      }
    }
    squareLeftDias.push(dia);
  }
  return squareLeftDias;
}

function getSquareRightDias(squares, rowSize, colSize, targetCount){
  const squareRightDias = [];
  for(let c = 0; c <= colSize - targetCount; c++){
    let dia = [];
    let colInc = 0;
    for(let r = 0; r < rowSize; r++){
      if(c + colInc < colSize){
        dia.push(squares[r][c + colInc++]);
      }else{
        break;
      }
    }
    squareRightDias.push(dia);
  }
  for(let r = rowSize - targetCount; r >= 0; r--){
    let dia = [];
    let rowInc = 0;
    for(let c = 0; c < colSize; c++){
      if(r + rowInc < rowSize){
        dia.push(squares[r + rowInc++][c]);
      }else{
        break;
      }
    }
    squareRightDias.push(dia);
  }
  return squareRightDias;
}

function caculateSeria(seria, targetCount){
  for(let r = 0; r < seria.length; r++){
    for(let c = 0; c <= seria[r].length - targetCount; c++){
      if(seria[r][c]){
        let win = true;
        for(let j = c + 1; j < c + targetCount; j++){
          win = win && ( seria[r][c] === seria[r][j] );
          if(!win){
            break;
          }
        }
        if(win){
          return seria[r][c];
        }
      }
    }
  }
  return null;
}

function deepClone2DimArray(array){
  let newArray = [];
  for(let i = 0; i < array.length; i++){
    let [...newRow] = array[i];
    newArray.push(newRow);
  }
  return newArray;
}