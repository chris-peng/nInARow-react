'use strict';

class Square extends React.Component {
  render() {
    return (
      <button className={`square ${this.props.isLastPosition ? ' last-position' : ''}` +
          `${this.props.isWinPos ? ' win-position' : ''}` +
          `${this.props.isTipPos ? ' tip-position' : ''}`} onClick={this.props.onClick}>
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
          break;
        }
      }
    }
    let isTipPos = false;
    if(this.props.tipPosition){
      if(i == this.props.tipPosition.r
        && j == this.props.tipPosition.c){
          isTipPos = true;
      }
    }
    return <Square 
              value={this.props.squares[i][j]}
              onClick={() => this.props.onClick(i, j)}
              isLastPosition={isLastPosition}
              isWinPos={isWinPos}
              isTipPos={isTipPos}
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
      lastPosition: null,
      tipPosition: null
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
      lastPosition: {r:i, c:j},
      tipPosition: null
    });
  }
  //悔棋
  toLastStep(){
    this.setState({
      squares: this.state.lastStep,
      lastStep: null,
      tipPosition: null
    });
  }
  //提示
  tip(){
    let checkedPoint = getBestEvaluatePoint(this.state.squares, this.props.rowSize, this.props.colSize, this.props.targetCount, this.state.xIscomputer ? 'X' : 'O');
    this.setState({
      tipPosition: {r:checkedPoint.r, c:checkedPoint.c}
    });
  }
  //当前是否电脑步骤
  isComputerStep(){
    return ((this.state.xIsNext && this.state.xIscomputer) || (!this.state.xIsNext && !this.state.xIscomputer));
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
      this.computerAction();
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
          <div className={`game-board cursor-${this.state.xIsNext ? 'X' : 'O'}`}>
            <Board squares={this.state.squares} onClick={(i, j) => this.handleClick(i, j)}
              lastPosition={this.state.lastPosition} winPos={winPos} tipPosition={this.state.tipPosition}/>
          </div>
          {this.winner ? <div className="mask-panel"><span>{this.winner}胜利!</span></div> : null}
          {this.isComputerStep() && !this.winner ? <div className="mask-panel"><span>{this.winner}对方正在思考...</span></div> : null}
        </div>
        <div className="game-info">
          <div>　我：{this.state.xIscomputer ? 'O' : 'X'}</div>
          <div>电脑：{this.state.xIscomputer ? 'X' : 'O'}</div>
          <br/>
          {this.state.lastStep && !this.winner && !this.isComputerStep() ? <div className='oper-btn'><button onClick={() => this.toLastStep()}>悔棋</button></div> : null}
          {!this.winner && !this.isComputerStep() ? <div className='oper-btn'><button onClick={() => this.tip()}>提示</button></div> : null}
          {this.winner ? <div className='oper-btn'><button onClick={() => this.initGame()}>再来一局</button></div> : null}
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