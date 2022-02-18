import React, {useContext, useCallback, memo} from 'react'
import { CODE, CLICK_MINE, FLAG_CELL, NORMALIZE_CELL, OPEN_CELL, QUESTION_CELL, TableContext} from './MineSweeper'


const getTdStyle = (code) => {
    switch (code) {
        case CODE.NORMAL:
        case CODE.MINE:
            return{
                background: '#7e7e7e',
            }
            case CODE.CLICK_MINE:
            case CODE.OPEN:
                return{
                    background: 'white'
                }    
            case CODE.QUESTION_MINE:
            case CODE.QUESTION:
                return{
                    background: 'yellow'
                }
                case CODE.FLAG_MINE:
                    case CODE.FLAG:
                        return{
                        background: 'orange'
                        }
                        default:
                            return {
                                background: 'white'
                            };
                }        

            };

const getTdText = (code) => {
    console.log('getTdtext');
    switch (code) {
        case CODE.NORMAL:
            return '';
            case CODE.MINE:
                return '.';
                case CODE.CLICK_MINE:
                return'💥';
                case CODE.FLAG_MINE:
                    case CODE.FLAG:
                        return '⚑';
                        case CODE.QUESTION_MINE:
                            case CODE.QUESTION:
                                return '?';
                                default:
                                    return code || '';
    }
}
 
const Td = memo(({ rowIndex, cellIndex }) => {
    const { tableData, dispatch, hold } = useContext(TableContext);

    const onClickTd = useCallback(() => {
        if (hold) {
            return;
        }
        switch (tableData[rowIndex][cellIndex]) {
            case CODE.OPEN:
            case CODE.FLAG_MINE:
            case CODE.FLAG:
            case CODE.QUESTION_MINE:
            case CODE.QUESTION:      
            return;
            case CODE.NORMAL:
                dispatch({type: OPEN_CELL, row: rowIndex, cell: cellIndex})
                return;

            case CODE.MINE:
                dispatch({type: CLICK_MINE, row: rowIndex, cell:cellIndex})
                return;

                default:
                    return;        
        }
    },[tableData[rowIndex][cellIndex], hold] ) 

    const onRightClickTd = useCallback((e) => {
        e.preventDefault();
        if (hold) {
            return;
        }
        switch (tableData[rowIndex][cellIndex]) {
            case CODE.NORMAL:
            case CODE.MINE:
                dispatch({ type:FLAG_CELL, row: rowIndex, cell: cellIndex });
                return;
                case CODE.FLAG_MINE:
                case CODE.FLAG:
                    dispatch({ type: QUESTION_CELL, row: rowIndex, cell: cellIndex })
                    return;

                case CODE.QUESTION_MINE:
                case CODE.QUESTION:
                    dispatch({ type: NORMALIZE_CELL, row: rowIndex, cell: cellIndex})
                    return;
                    default:
                        return;        

            }
    }, [tableData[rowIndex][cellIndex], hold])
console.log('td rendered')

return <RealTd onClickTd={onClickTd} onRightClickTd={onRightClickTd} data={tableData[rowIndex][cellIndex]}/>
});

const RealTd = memo(({onClickTd, onRightClickTd, data})=> {
    console.log('real td rendered');

return(
    <td 
     style={getTdStyle(data)} 
     onClick={onClickTd} 
     onContextMenu={onRightClickTd}>
         {getTdText(data)}</td>
    )
} );


export default Td;
