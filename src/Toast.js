
function Toast(props){
    setTimeout(() => {
        var notifications = document.getElementsByClassName("Toast");

        for (let index = 0; index < notifications.length; index++) {
            const element = notifications[index];
            element.style.bottom = "-100px";
            setTimeout(() => {
                element.style.display = "none";
            }, 1000);
        } 
    }, 3000);

    return(
        <div className="Toast" style={{bottom:"0px"}}>
            <p>{props.message}</p>
        </div>
    );
}

export default Toast;