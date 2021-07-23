import './Clock.css';

function Clock(props){
    return(
        <div className="EditOptions-InputControl">
            <div className="Clock">
                <input onChange={props.setTime} type="number" max="24" min="1" defaultValue="9" placeholder="9, for example"></input>
                <small>Use 24 hours format.</small>
            </div>
        </div>
        
    );
}

export default Clock;