import React, { useState, useCallback, useContext, memo } from 'react';
import { START_GAME, TableContext} from './MineSweeper'

const Form = memo(() => {

    const [row, setRow] = useState(10);
    const[cell, setCell] = useState(10);
    const [mine, setMine] = useState(20);
    const { dispatch } = useContext(TableContext);

    const onChangeRow = useCallback ((e) => {
        setRow(e.target.value)
    }, []);

    const onChangeCell = useCallback ((e)=> {setCell(e.target.value)}, [])

    const onChangeMine = useCallback ((e) => {setMine(e.target.value)}, [])
    const onClickBtn = useCallback(() => {dispatch({type: START_GAME, row, cell, mine});
}, [row,cell,mine])

return (
    <div>
        <input type="number" placeholder="Column" value={cell} onChange={onChangeCell}/>
        <input type="number" placeholder="Row" value={row} onChange={onChangeRow}/>
        <input type="number" placeholder="Mine" value={mine} onChange={onChangeMine}/>
    <button onClick={onClickBtn}>Play</button>
    </div>
)
})

export default Form;
