/**
 * 计算胜利者
 * @param {*} squares 
 * @param {*} rowSize 
 * @param {*} colSize 
 * @param {*} targetCount 
 */
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
  
  /**
   * 获取棋盘所有的行
   * @param {*} squares 
   * @param {*} rowSize 
   * @param {*} colSize 
   * @param {*} targetCount 
   */
  function getSquareRows(squares, rowSize, colSize, targetCount){
    const squareRows = [];
    for(let r = 0; r < rowSize; r++){
      let row = [];
      for(let c = 0; c < colSize; c++){
        row.push({r:r, c:c, s:squares[r][c]});
      }
      squareRows.push(row);
    }
    return squareRows;
  }
  
  /**
   * 获取棋盘所有的列
   * @param {*} squares 
   * @param {*} rowSize 
   * @param {*} colSize 
   * @param {*} targetCount 
   */
  function getSquareCols(squares, rowSize, colSize, targetCount){
    const squareCols = [];
    for(let c = 0; c < colSize; c++){
      let col = [];
      for(let r = 0; r < rowSize; r++){
        col.push({r:r, c:c, s:squares[r][c]});
      }
      squareCols.push(col);
    }
    return squareCols;
  }
  
  /**
   * 获取棋盘所有的左斜线(/)方向格子数组
   * @param {*} squares 
   * @param {*} rowSize 
   * @param {*} colSize 
   * @param {*} targetCount 
   */
  function getSquareLeftDias(squares, rowSize, colSize, targetCount){
    const squareLeftDias = [];
    for(let c = targetCount - 1; c < colSize; c++){
      let dia = [];
      let colInc = 0;
      for(let r = 0; r < rowSize; r++){
        if(c - colInc >= 0){
          dia.push({r:r, c: c-colInc, s: squares[r][c-colInc]});
          colInc++;
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
          dia.push({r:r + rowInc, c:c, s: squares[r + rowInc][c]});
          rowInc++;
        }else{
          break;
        }
      }
      squareLeftDias.push(dia);
    }
    return squareLeftDias;
  }
  
  /**
   * 获取棋盘所有的右斜线(\\)方向格子数组
   * @param {*} squares 
   * @param {*} rowSize 
   * @param {*} colSize 
   * @param {*} targetCount 
   */
  function getSquareRightDias(squares, rowSize, colSize, targetCount){
    const squareRightDias = [];
    for(let c = 0; c <= colSize - targetCount; c++){
      let dia = [];
      let colInc = 0;
      for(let r = 0; r < rowSize; r++){
        if(c + colInc < colSize){
          dia.push({r:r, c: c + colInc, s:squares[r][c + colInc]});
          colInc++;
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
          dia.push({r:r + rowInc, c:c, s:squares[r + rowInc][c]});
          rowInc++;
        }else{
          break;
        }
      }
      squareRightDias.push(dia);
    }
    return squareRightDias;
  }
  
  /**
   * 计算某一行、列或斜线上是否有胜利者，若有返回胜利者
   * @param {*} seria 
   * @param {*} targetCount 
   */
  function caculateSeria(seria, targetCount){
    for(let r = 0; r < seria.length; r++){
      for(let c = 0; c <= seria[r].length - targetCount; c++){
        if(seria[r][c].s){
          let win = true;
          let winPos = [seria[r][c]];
          for(let j = c + 1; j < c + targetCount; j++){
            win = win && ( seria[r][c].s === seria[r][j].s );
            if(!win){
              break;
            }else{
                winPos.push(seria[r][j]);
            }
          }
          if(win){
            return {
                    winner:seria[r][c].s,
                    winPos: winPos
                };
          }
        }
      }
    }
    return null;
  }