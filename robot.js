const attackFactor = 1;
const defenseFactor = 0.5;

/**
 * 电脑评价棋面，获得最佳落子位置
 * @param {*} squares 
 * @param {*} rowSize 
 * @param {*} colSize 
 * @param {*} targetCount 
 * @param {*} mySymbol 
 */
function getBestEvaluatePoint(squares, rowSize, colSize, targetCount, mySymbol){
    const bestPoints = [];
    const pointScores = {};
    let bestScore = Number.NEGATIVE_INFINITY;
    for(let r = 0; r < rowSize; r++){
      for(let c = 0; c < colSize; c++){
        const score = evaluate(squares, r, c, rowSize, colSize, targetCount, mySymbol);
        //console.log(r + ',' + c + ': ' + score);
        if(score >= bestScore){
          bestScore = score;
          if(!pointScores['score-' + bestScore]){
            pointScores['score-' + bestScore] = [];
          }
          pointScores['score-' + bestScore].push({r:r,c:c});
        }
      }
    }
    //从最佳位置中随机选择一个
    return randomItem(pointScores['score-' + bestScore]);
  }
  
  /**
   * 评价某一位置落子的棋面得分
   * @param {*} squares 
   * @param {*} r       落子位置所在行，从0开始
   * @param {*} c       落子位置所在列，从0开始
   * @param {*} rowSize 
   * @param {*} colSize 
   * @param {*} targetCount 
   * @param {*} mySymbol 
   */
  function evaluate(squares, r, c, rowSize, colSize, targetCount, mySymbol){
    if(squares[r][c]){
      return Number.NEGATIVE_INFINITY;
    }
    return evaluateAttack(squares, r, c, rowSize, colSize, targetCount, mySymbol) * attackFactor +
            evaluateDefense(squares, r, c, rowSize, colSize, targetCount, mySymbol) * defenseFactor;
  }
  
  /**
   * 评价某一位置落子的棋面攻击方面的得分
   * @param {*} squares 
   * @param {*} r 
   * @param {*} c 
   * @param {*} rowSize 
   * @param {*} colSize 
   * @param {*} targetCount 
   * @param {*} mySymbol 
   */
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
  
  /**
   * 评价某一位置落子的棋面防守方面的得分，这里简单处理为“等于若对方在此落子的攻击得分”
   * @param {*} squares 
   * @param {*} r 
   * @param {*} c 
   * @param {*} rowSize 
   * @param {*} colSize 
   * @param {*} targetCount 
   * @param {*} mySymbol 
   */
  function evaluateDefense(squares, r, c, rowSize, colSize, targetCount, mySymbol){
    const oppSymbol = mySymbol === 'X' ? 'O' : 'X';
    return evaluateAttack(squares, r, c, rowSize, colSize, targetCount, oppSymbol);
  }
  
  /**
   * 获取指定棋格所在行的所有棋格，及本身在此数组中的位置
   * @param {*} squares 
   * @param {*} r 
   * @param {*} c 
   * @param {*} rowSize 
   * @param {*} colSize 
   * @param {*} targetCount 
   * @param {*} mySymbol 
   */
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
  
  /**
   * 获取指定棋格所在列的所有棋格，及本身在此数组中的位置
   * @param {*} squares 
   * @param {*} r 
   * @param {*} c 
   * @param {*} rowSize 
   * @param {*} colSize 
   * @param {*} targetCount 
   * @param {*} mySymbol 
   */
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
  
  /**
   * 获取指定棋格所在左斜线的所有棋格，及本身在此数组中的位置
   * @param {*} squares 
   * @param {*} r 
   * @param {*} c 
   * @param {*} rowSize 
   * @param {*} colSize 
   * @param {*} targetCount 
   * @param {*} mySymbol 
   */
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
  
  /**
   * 获取指定棋格所在右斜线的所有棋格，及本身在此数组中的位置
   * @param {*} squares 
   * @param {*} r 
   * @param {*} c 
   * @param {*} rowSize 
   * @param {*} colSize 
   * @param {*} targetCount 
   * @param {*} mySymbol 
   */
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
  
  /**
   * 计算棋格在所在行、列或斜线中的得分
   * @param {*} seria 
   * @param {*} myIndex 
   * @param {*} targetCount 
   * @param {*} mySymbol 
   */
  function evaluateAttackInSeria(seria, myIndex, targetCount, mySymbol){
    let mySymbolLength = 1, vMySymbolLength = 1;
    let mySymbolStartStop = false, mySymbolEndStop = false;
    let stopFactor = [1, 0.4, 0], stopCount = 0;
    let continuityStartIndex = myIndex, continuityEndIndex = myIndex;
    
    if(myIndex == 0){
      stopCount++;
    }
    if(myIndex == seria.length - 1){
      stopCount++;
    }
    
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
          stopCount++;
        }
        mySymbolStartStop = true;
        break;
      }
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
          stopCount++;
        }
        mySymbolEndStop = true;
        break;
      }
    }
    
    if(mySymbolLength == targetCount){
      return 9999999999;
    }
    let score = 0;
    if(vMySymbolLength >= targetCount){
      //尝试评价不连续的情况
      const discontinuityLikeCount = evaluateDisContinue(seria, mySymbol, targetCount, mySymbolLength, continuityStartIndex, continuityEndIndex);
      const avgSymbolCount = mySymbolLength > discontinuityLikeCount ? mySymbolLength : discontinuityLikeCount;
      score = Math.pow(targetCount, avgSymbolCount) * (avgSymbolCount * stopFactor[stopCount]);
    }
    return score;
  }
  
  /**
   * 评价棋格在所在行、列或斜线中的“不连续情况”，转化为“相当于连续的几颗棋子”
   * @param {*} seria 
   * @param {*} mySymbol 
   * @param {*} targetCount 
   * @param {*} mySymbolLength 
   * @param {*} continuityStartIndex 
   * @param {*} continuityEndIndex 
   */
  function evaluateDisContinue(seria, mySymbol, targetCount, mySymbolLength, continuityStartIndex, continuityEndIndex){
    if(mySymbolLength == targetCount - 1){
      return mySymbolLength;
    }
    let discontinuityLikeCount = 0;
    const nullFactor = 0.7;
    let discontinuityLikeStartOrientCount = 0;
    let discontinuityLikeEndOrientCount = 0;
  
    let flySymbolCount = 0;
    let nullCount = 0;
    let stopFactor = 1;
    for(let i = 1; i <= targetCount - mySymbolLength; i++){
      if(continuityStartIndex - i < 0){
        stopFactor = 0;
        break;
      }else if(!seria[continuityStartIndex - i]){
        nullCount++;
      }else if(seria[continuityStartIndex - i] === mySymbol){
        flySymbolCount++;
      }else{
        stopFactor = 0;
        break;
      }
    }
    if(flySymbolCount > 0){
      discontinuityLikeStartOrientCount = flySymbolCount * stopFactor * Math.pow(nullFactor, nullCount);
    }
  
    flySymbolCount = 0;
    nullCount = 0;
    stopFactor = 1;
    for(let i = 1; i <= targetCount - mySymbolLength; i++){
      if(continuityEndIndex + i >= seria.length){
        stopFactor = 0;
        break;
      }else if(!seria[continuityEndIndex + i]){
        nullCount++;
      }else if(seria[continuityEndIndex + i] === mySymbol){
        flySymbolCount++;
      }else{
        stopFactor = 0;
        break;
      }
    }
    if(flySymbolCount > 0){
      discontinuityLikeEndOrientCount = flySymbolCount * stopFactor * Math.pow(nullFactor, nullCount);
    }
    discontinuityLikeCount = discontinuityLikeStartOrientCount > discontinuityLikeEndOrientCount ? 
                          discontinuityLikeStartOrientCount : discontinuityLikeEndOrientCount;
    return mySymbolLength + discontinuityLikeCount;
  }
  
  function randomItem(array){
    const randomIndex = Math.floor(Math.random()*array.length);
    return array[randomIndex];
  }