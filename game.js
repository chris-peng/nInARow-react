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
      xIscomputer: randomBoolean(),
      lastStep: null,
      winner: null
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
      xIscomputer: randomBoolean(),
      lastStep: null,
      winner: null
    });
  }
  handleClick(i, j){
    this.check(i, j);
  }
  check(i, j){
    if(this.state.squares[i][j]){
      return;
    }
    const squares = deepClone2DimArray(this.state.squares);
    const lastStep = !this.isComputerStep() ? deepClone2DimArray(squares) : this.state.lastStep;
    squares[i][j] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares, 
      xIsNext: !this.state.xIsNext,
      xIscomputer: this.state.xIscomputer,
      lastStep: lastStep,
      winner: this.state.winner
    });
  }
  toLastStep(){
    this.setState({
      squares: this.state.lastStep, 
      xIsNext: this.state.xIsNext,
      xIscomputer: this.state.xIscomputer,
      lastStep: null,
      winner: this.state.winner
    });
  }
  isComputerStep(){
    return ((this.state.xIsNext && this.state.xIscomputer) || (!this.state.xIsNext && !this.state.xIscomputer));
  }
  componentDidMount(){
    if(this.isComputerStep()){
      this.computerAction();
    }
  }
  componentDidUpdate(){
    if(!this.state.winner && this.isComputerStep()){
      this.computerAction();
    }
  }
  computerAction(){
    let checkedPoint = getBestEvaluatePoint(this.state.squares, this.props.rowSize, this.props.colSize, this.props.targetCount, this.state.xIscomputer ? 'X' : 'O');
    this.check(checkedPoint.r, checkedPoint.c);
  }
  render(){
    this.state.winner = calculateWinner(this.state.squares, this.props.rowSize, this.props.colSize, this.props.targetCount);
    let status;
    return (
      <div className="game">
        <div className="game-board-ctn">
          <div className={`game-board cursor-${this.state.xIsNext ? 'X' : 'O'}`}>
            <Board squares={this.state.squares} onClick={(i, j) => this.handleClick(i, j)} />
          </div>
          {this.state.winner ? <div className="mask-panel"><span>{this.state.winner}胜利!</span></div> : null}
          {this.isComputerStep() && !this.state.winner ? <div className="mask-panel"><span>{this.state.winner}对方正在思考...</span></div> : null}
        </div>
        <div className="game-info">
          <div>　我：{this.state.xIscomputer ? 'O' : 'X'}</div>
          <div>电脑：{this.state.xIscomputer ? 'X' : 'O'}</div>
          <br/>
          {this.state.lastStep && !this.state.winner && !this.isComputerStep() ? <button onClick={() => this.toLastStep()}>悔棋</button> : null}
          {this.state.winner ? <button onClick={() => this.initGame()}>再来一局</button> : null}
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

function getBestEvaluatePoint(squares, rowSize, colSize, targetCount, mySymbol){
  const bestPoints = [];
  const pointScores = {};
  let bestScore = Number.NEGATIVE_INFINITY;
  for(let r = 0; r < rowSize; r++){
    for(let c = 0; c < colSize; c++){
      const score = evaluate(squares, r, c, rowSize, colSize, targetCount, mySymbol);
      console.log(r + ',' + c + ': ' + score);
      if(score >= bestScore){
        bestScore = score;
        if(!pointScores['score-' + bestScore]){
          pointScores['score-' + bestScore] = [];
        }
        pointScores['score-' + bestScore].push({r:r,c:c});
      }
    }
  }
  return randomItem(pointScores['score-' + bestScore]);
}

function evaluate(squares, r, c, rowSize, colSize, targetCount, mySymbol){
  if(squares[r][c]){
    return Number.NEGATIVE_INFINITY;
  }
  const attackFactor = 5;
  const defenseFactor = 3;
  return evaluateAttack(squares, r, c, rowSize, colSize, targetCount, mySymbol) * attackFactor +
          evaluateDefense(squares, r, c, rowSize, colSize, targetCount, mySymbol) * defenseFactor;
}

function evaluateAttack(squares, r, c, rowSize, colSize, targetCount, mySymbol){
  const myRowSeria = getMyRowSeria(squares, r, c, rowSize, colSize, targetCount, mySymbol);
  const myColSeria = getMyColSeria(squares, r, c, rowSize, colSize, targetCount, mySymbol);
  const myDiaLeftSeria = getMyDiaLeftSeria(squares, r, c, rowSize, colSize, targetCount, mySymbol);
  const myDiaRightSeria = getMyDiaRightSeria(squares, r, c, rowSize, colSize, targetCount, mySymbol);
  return evaluateAttackInSeria(myRowSeria.seria, myRowSeria.myIndex, targetCount, mySymbol) +
          evaluateAttackInSeria(myColSeria.seria, myColSeria.myIndex, targetCount, mySymbol) +
          evaluateAttackInSeria(myDiaLeftSeria.seria, myDiaLeftSeria.myIndex, targetCount, mySymbol) +
          evaluateAttackInSeria(myDiaRightSeria.seria, myDiaRightSeria.myIndex, targetCount, mySymbol);
}

function evaluateDefense(squares, r, c, rowSize, colSize, targetCount, mySymbol){
  const oppSymbol = mySymbol === 'X' ? 'O' : 'X';
  return evaluateAttack(squares, r, c, rowSize, colSize, targetCount, oppSymbol);
}

function getMyRowSeria(squares, r, c, rowSize, colSize, targetCount, mySymbol){
  const seria = [squares[r][c]];
  let myIndex = 0;
  for(let i = c - 1; i >= 0; i--){
    seria.splice(0, 0, squares[r][i]);
    myIndex++;
  }
  for(let i = c + 1; i < colSize; i++){
    seria.push(squares[r][i]);
  }
  return {seria:seria, myIndex:myIndex};
}

function getMyColSeria(squares, r, c, rowSize, colSize, targetCount, mySymbol){
  const seria = [squares[r][c]];
  let myIndex = 0;
  for(let i = r - 1; i >= 0; i--){
    seria.splice(0, 0, squares[i][c]);
    myIndex++;
  }
  for(let i = r + 1; i < rowSize; i++){
    seria.push(squares[i][c]);
  }
  return {seria:seria, myIndex:myIndex};
}

function getMyDiaLeftSeria(squares, r, c, rowSize, colSize, targetCount, mySymbol){
  const seria = [squares[r][c]];
  let myIndex = 0;
  for(let i = r - 1, j = c + 1; i >= 0 && j < colSize; i--, j++){
    seria.splice(0, 0, squares[i][j]);
    myIndex++;
  }
  for(let i = r + 1, j = c - 1; i < rowSize && j >= 0; i++, j--){
    seria.push(squares[i][j]);
  }
  return {seria:seria, myIndex:myIndex};
}

function getMyDiaRightSeria(squares, r, c, rowSize, colSize, targetCount, mySymbol){
  const seria = [squares[r][c]];
  let myIndex = 0;
  for(let i = r - 1, j = c - 1; i >= 0 && j >= 0; i--, j--){
    seria.splice(0, 0, squares[i][j]);
    myIndex++;
  }
  for(let i = r + 1, j = c + 1; i < rowSize && j < colSize; i++, j++){
    seria.push(squares[i][j]);
  }
  return {seria:seria, myIndex:myIndex};
}

function evaluateAttackInSeria(seria, myIndex, targetCount, mySymbol){
  let mySymbolLength = 1, vMySymbolLength = 1;
  let mySymbolStartStop = false, mySymbolEndStop = false;
  let stopFactor = 1, stopFactorDec = 0.4;
  let continuityStartIndex = myIndex, continuityEndIndex = myIndex;
  for(let i = myIndex - 1; i >= 0; i--){
    if(seria[i] === mySymbol){
      if(!mySymbolStartStop){
        mySymbolLength++;
        continuityStartIndex--;
      }
      vMySymbolLength++;
    }else if(!seria[i]){
      mySymbolStartStop = true;
      vMySymbolLength++;
    }else{
      if(!mySymbolStartStop){
        stopFactor -= stopFactorDec;
      }
      mySymbolStartStop = true;
      break;
    }
  }
  if(myIndex == 0){
    stopFactor -= stopFactorDec;
  }
  if(myIndex == seria.length - 1){
    stopFactor -= stopFactorDec;
  }

  for(let i = myIndex + 1; i < seria.length; i++){
    if(seria[i] === mySymbol){
      if(!mySymbolEndStop){
        mySymbolLength++;
        continuityEndIndex++;
      }
      vMySymbolLength++;
    }else if(!seria[i]){
      mySymbolEndStop = true;
      vMySymbolLength++;
    }else{
      if(!mySymbolEndStop){
        stopFactor -= stopFactorDec;
      }
      mySymbolEndStop = true;
      break;
    }
  }
  
  if(mySymbolLength == targetCount){
    return 9999999;
  }
  let score = 0;
  if(vMySymbolLength >= targetCount){
    //尝试评价不连续的情况
    const discontinuityLikeCount = evaluateDisContinue(seria, mySymbol, targetCount, mySymbolLength, continuityStartIndex, continuityEndIndex);
    score = (mySymbolLength + discontinuityLikeCount) * (mySymbolLength + discontinuityLikeCount) * stopFactor;
  }
  return score;
}

function evaluateDisContinue(seria, mySymbol, targetCount, mySymbolLength, continuityStartIndex, continuityEndIndex){
  const continuityThreshold = Math.ceil(targetCount / 2);
    let discontinuityLikeCount = 0;
    const nullFactor = 0.2, flySymbolFactor = 0.2;
    if(mySymbolLength >= continuityThreshold){
      discontinuityLikeCount = targetCount - 1;
      //可进行非连续评价
      if(mySymbolLength < targetCount - 1){
        let discontinuityLikeStartOrientCount = targetCount - 1;
        let discontinuityLikeEndOrientCount = targetCount - 1;

        let flySymbolCount = 0;
        let nullCount = 0;
        for(let i = 1; i <= targetCount - mySymbolLength; i++){
          if(continuityStartIndex - i < 0){
            break;
          }else if(!seria[continuityStartIndex - i]){
            nullCount++;
          }else if(seria[continuityStartIndex - i] === mySymbol){
            flySymbolCount++;
          }else{
            break;
          }
        }
        if(flySymbolCount > 0){
          discontinuityLikeStartOrientCount *= Math.pow(nullFactor, nullCount) * (1 - Math.pow(1 - flySymbolFactor, flySymbolCount));
        }else{
          discontinuityLikeStartOrientCount = 0;
        }

        flySymbolCount = 0;
        nullCount = 0;
        for(let i = 1; i <= targetCount - mySymbolLength; i++){
          if(continuityStartIndex + i >= seria.length){
            break;
          }else if(!seria[continuityStartIndex + i]){
            nullCount++;
          }else if(seria[continuityStartIndex + i] === mySymbol){
            flySymbolCount++;
          }else{
            break;
          }
        }
        if(flySymbolCount > 0){
          discontinuityLikeEndOrientCount *= Math.pow(nullFactor, nullCount) * (1 - Math.pow(1 - flySymbolFactor, flySymbolCount));
        }else{
          discontinuityLikeEndOrientCount = 0;
        }
        discontinuityLikeCount = discontinuityLikeStartOrientCount > discontinuityLikeEndOrientCount ? 
                              discontinuityLikeStartOrientCount : discontinuityLikeEndOrientCount;
      }
    }
    return discontinuityLikeCount;
}

function deepClone2DimArray(array){
  let newArray = [];
  for(let i = 0; i < array.length; i++){
    let [...newRow] = array[i];
    newArray.push(newRow);
  }
  return newArray;
}

function randomItem(array){
  const randomIndex = Math.floor(Math.random()*array.length);
  return array[randomIndex];
}

function randomBoolean(){
  return Math.random() >= 0.5;
}