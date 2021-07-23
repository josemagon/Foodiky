
function Spinner(props){
    var style;
    if(props.show)
        style = {display : "block"}
    else
        style = {display : "none"};

    return(
        <div className="Spinner" style={style}></div>
    );
}

export default Spinner;