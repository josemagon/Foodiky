import './Splash.css';

function Splash(props){
    var style;
    if(props.show){
        style = {opacity : 1, display : "fixed"};
    }else{
        style = {opacity : 0, display : "none"};
    }  

    return(
        <div className="Splash" style={style}>
            <div className="Splash-spinner"></div>
        </div>
    )
}


export default Splash;