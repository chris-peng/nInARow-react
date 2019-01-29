'use strict';

class Square extends React.Component {
  render() {
    return (
      <button className={`square ${this.props.isLastPosition ? 'last-position' : ''} ${this.props.isWinPos ? 'win-position' : ''}`} onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i, j){
    let isLastPosition = false;
    if(this.props.lastPosition
        && this.props.lastPosition.r == i
        && this.props.lastPosition.c == j){
        isLastPosition = true;
    }
    let isWinPos = false;
    if(this.props.winPos){
      for(let k = 0; k < this.props.winPos.length; k++){
        if(i == this.props.winPos[k].r
            && j == this.props.winPos[k].c){
          isWinPos = true;
        }
      }
    }
    return <Square 
              value={this.props.squares[i][j]}
              onClick={() => this.props.onClick(i, j)}
              isLastPosition={isLastPosition}
              isWinPos={isWinPos}
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
  _delay = 100;
  winner = null;
  constructor(props){
    super(props);
    this.state = this.genInitState();
  }
  genInitState(){
    let squares = [];
    for(let i = 0; i < this.props.rowSize; i++){
      squares.push(Array(this.props.colSize).fill(null));
    }
    return {
      squares: squares,
      xIsNext: true,
      xIscomputer: randomBoolean(),
      lastStep: null,
      lastPosition: null
    };
  }
  initGame(){
    this.setState(this.genInitState());
    this.winner = null;
  }
  handleClick(i, j){
    this.check(i, j);
  }
  //落子
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
      lastStep: lastStep,
      lastPosition: {r:i, c:j}
    });
  }
  //悔棋
  toLastStep(){
    this.setState({
      squares: this.state.lastStep,
      lastStep: null
    });
  }
  //当前是否电脑步骤
  isComputerStep(){
    //return ((this.state.xIsNext && this.state.xIscomputer) || (!this.state.xIsNext && !this.state.xIscomputer));
    return true;
  }
  //电脑行动
  computerAction(){
    let checkedPoint = getBestEvaluatePoint(this.state.squares, this.props.rowSize, this.props.colSize, this.props.targetCount, this.state.xIscomputer ? 'X' : 'O');
    this.check(checkedPoint.r, checkedPoint.c);
  }
  componentDidMount(){
    if(this.isComputerStep()){
      this.computerAction();
    }
  }
  componentDidUpdate(){
    if(!this.winner && this.isComputerStep()){
      setTimeout(()=>this.computerAction(), this._delay);
    }
  }
  slowly(){
    this._delay += 100;
  }
  quickly(){
    this._delay -= 100;
    if(this._delay < 0){
      this._delay = 0;
    }
  }
  render(){
    let winObj = calculateWinner(this.state.squares, this.props.rowSize, this.props.colSize, this.props.targetCount);
    let winPos = null;
    if(winObj){
      this.winner = winObj.winner;
      winPos = winObj.winPos;
    }else{
      this.winner = null;
    }
    return (
      <div className="game">
        <div className="game-board-ctn">
          <div className={`game-board`}>
            <Board squares={this.state.squares} /* onClick={(i, j) => this.handleClick(i, j)} */ lastPosition={this.state.lastPosition} winPos={winPos}/>
          </div>
          {this.winner ? <div className="mask-panel"><span>{this.winner}胜利!</span></div> : null}
        </div>
        <div className="game-info">
          <div>电脑：{this.state.xIscomputer ? 'O' : 'X'}</div>
          <div>电脑：{this.state.xIscomputer ? 'X' : 'O'}</div>
          <br/>
          <button onClick={() => this.slowly()}>减慢</button>
          <button onClick={() => this.quickly()}>加快</button>
          {this.state.lastStep && !this.winner && !this.isComputerStep() ? <button onClick={() => this.toLastStep()}>悔棋</button> : null}
          {this.winner ? <button onClick={() => this.initGame()}>再来一局</button> : null}
        </div>
      </div>
    );
  }
}

function deepClone2DimArray(array){
  let newArray = [];
  for(let i = 0; i < array.length; i++){
    let [...newRow] = array[i];
    newArray.push(newRow);
  }
  return newArray;
}

function randomBoolean(){
  return Math.random() >= 0.5;
}