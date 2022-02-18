import React, { useEffect, useMemo, useReducer, createContext } from 'react';
import Table from './Table'
import Form from './Form'

export const CODE = {
    MINE: -7,
    NORMAL: -1,
    QUESTION: -2,
    FLAG: -3,
    QUESTION_MINE: -4,
    FLAG_MINE: -5,
    CLICK_MINE: -6,
    OPEN: 0,
}

export const TableContext = createContext({
    tableData: [],
    hold: true,
    dispatch: () => {},
});

const initialState = {
    tableData: [],
    data: {
        row: 0,
        cell: 0,
        mine: 0,
    },
     timer: 0,
     result: '',
     hold: true,
     openCount:0,
}

const plantMine = (row, cell, mine) => {
    console.log (row, cell, mine);
    const candidate = Array(row * cell).fill().map((arr, i) => { 
      return i;
    });
    const shuffle = [];
    while (candidate.length > row * cell - mine) {
        const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
    shuffle.push(chosen);
    }

    const data = [];
    for (let i = 0; i < row; i++) {
        const rowData= [];
        data.push(rowData);
        for (let j = 0; j < cell; j++) {
            rowData.push(CODE.NORMAL);
        }
    }

    for ( let k = 0; k < shuffle.length; k++) {
        const ver = Math.floor(shuffle[k] / cell);
        const hor = shuffle[k] % cell;
        data[ver][hor] = CODE.MINE
    }   

        console.log(data);
        return data;
    }

    export const START_GAME = 'START_GAME'
    export const OPEN_CELL = 'OPEN_CELL'
    export const CLICK_MINE = 'CLICK_MINE'
    export const FLAG_CELL = 'FLAG_CELL'
    export const QUESTION_CELL = 'QUESTION_CELL'
    export const NORMALIZE_CELL = 'NORMALIZE_CELL'
    export const INCREASE_TIMER = 'INCREASE_TIMER'

    const reducer = (state, action) => {
        switch (action.type) {
            case START_GAME:
                return {
                    ...state,
                    date:{
                        row: action.row,
                        cell: action.cell,
                        mine: action.mine,
                    },
                    openCount: 0,
                    tableData: plantMine(action.row, action.cell, action.mine),
                    hold: false,
                    timer: 0
                };


                case OPEN_CELL: {
                    const tableData = [...state.tableData];
                    tableData.forEach((row, i) => {
                      tableData[i] = [...row];
                    });
                    const checked = [];
                    let openCount = 0;
                    console.log(tableData.length, tableData[0].length);
                    const checkAround = (row, cell) => {
                      console.log(row, cell);
                      if (row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length) {
                        return;
                      } // 상하좌우 없는칸은 안 열기
                      if ([CODE.OPEN, CODE.FLAG, CODE.FLAG_MINE, CODE.QUESTION_MINE, CODE.QUESTION].includes(tableData[row][cell])) {
                        return;
                      } // 닫힌 칸만 열기
                      if (checked.includes(row + '/' + cell)) {
                        return;
                      } else {
                        checked.push(row + '/' + cell);
                      } // 한 번 연칸은 무시하기
                      let around = [
                        tableData[row][cell - 1], tableData[row][cell + 1],
                      ];
                      if (tableData[row - 1]) {
                        around = around.concat([tableData[row - 1][cell - 1], tableData[row - 1][cell], tableData[row - 1][cell + 1]]);
                      }
                      if (tableData[row + 1]) {
                        around = around.concat([tableData[row + 1][cell - 1], tableData[row + 1][cell], tableData[row + 1][cell + 1]]);
                      }
                      const count = around.filter(function (v) {
                        return [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v);
                      }).length;
                      if (count === 0) { // 주변칸 오픈
                        if (row > -1) {
                          const near = [];
                          if (row - 1 > -1) {
                            near.push([row -1, cell - 1]);
                            near.push([row -1, cell]);
                            near.push([row -1, cell + 1]);
                          }
                          near.push([row, cell - 1]);
                          near.push([row, cell + 1]);
                          if (row + 1 < tableData.length) {
                            near.push([row + 1, cell - 1]);
                            near.push([row + 1, cell]);
                            near.push([row + 1, cell + 1]);
                          }
                          near.forEach((n) => {
                            if (tableData[n[0]][n[1]] !== CODE.OPEN) {
                              checkAround(n[0], n[1]);
                            }
                          })
                        }
                      }
                      if (tableData[row][cell] === CODE.NORMAL) { // 내 칸이 닫힌 칸이면 카운트 증가
                        openCount =+ 1;
                      }
                      tableData[row][cell] = count;
                    };
                    checkAround(action.row, action.cell);
                    let hold = false;
                    let result = '';
                    console.log(state.data.row * state.data.cell - state.data.mine, state.openCount, openCount);
                    if (state.data.row * state.data.cell - state.data.mine === state.openCount + openCount) { // 승리
                      hold = true;
                      result = `You found all mines in ${state.timer}sec`;
                    }
                    return {
                      ...state,
                      tableData,
                      openCount: state.openCount + openCount,
                      hold,
                      result,
                    };
                  }
                case CLICK_MINE: {
                    const tableData = [...state.tableData];
                    tableData[action.row] = [...state.tableData[action.row]];
                    tableData[action.row][action.cell] = CODE.CLICK_MINE;
                    return {
                        ...state,
                        tableData,
                        hold: true
                    };
                    }

                case FLAG_CELL: {
                    const tableData = [...state.tableData];
                    tableData[action.row] = [...state.tableData[action.row]];
                    if (tableData[action.row][action.cell] === CODE.MINE){
                        tableData[action.row][action.cell] = CODE.FLAG_MINE;
                    } else {
                        tableData[action.row][action.cell] = CODE.FLAG;
                    }
                    return {
                        ...state,
                        tableData
                    }
                }
    
                case QUESTION_CELL: {
                    const tableData = [...state.tableData];
                    tableData[action.row] = [...state.tableData[action.row]];
                    if (tableData[action.row][action.cell] === CODE.FLAG_MINE){
                        tableData[action.row][action.cell] = CODE.QUESTION_MINE;
                    } else {
                        tableData[action.row][action.cell] = CODE.QUESTION;
                    }
                    return {
                        ...state,
                        tableData
                    }
                }
                case NORMALIZE_CELL: {
                    const tableData = [...state.tableData];
                    tableData[action.row] = [...state.tableData[action.row]];
                    if (tableData[action.row][action.cell] === CODE.QUESTION_MINE){
                        tableData[action.row][action.cell] = CODE.MINE;
                    } else {
                        tableData[action.row][action.cell] = CODE.NORMAL;
                    }
                    return {
                        ...state,
                        tableData
                    }
                }

                case INCREASE_TIMER : {
                    return{
                        ...state,
                        timer: state.timer + 1,
                    }
                }
                default:
                    return state;
                }
        }
    
        const MineSweeper = () => {
            const [state, dispatch] = useReducer(reducer,initialState);
            const { tableData, hold, timer, result } = state;

            useEffect (() => {
                let timer;
                if (hold === false) {
                    timer = setInterval(() => {
                        dispatch({ type: INCREASE_TIMER });
                    }, 1000);
                }
                return () => {
                    clearInterval(timer);
                }
            }, [hold]);

        
            const value = useMemo(() => ({ tableData, hold, dispatch}), [tableData, hold]);

            return (
                <TableContext.Provider value={value}>
                    <Form />
                    <div>{timer}</div>
                    <Table />
                    <div>{result}</div>
                </TableContext.Provider>
            );
        };

        export default MineSweeper;