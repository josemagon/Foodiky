import React, {Component} from 'react';
import './Toolbar.css';

import Summary from './Summary';

class Toolbar extends Component{
    constructor(props){
        super(props);

        this.state ={
            openSummary : false
        }
    }

    getDays(){
        var days = [];
        var day = new Date().getDay();
        var afterDay = 7 - day;
        var from = new Date();
        from.setDate(from.getDate() - day);
        var to = new Date();
        to.setDate(to.getDate() + afterDay);

        for (let index = 0; index < 7; index++) {
            days.push(this.dateToDDMM(from));
            from.setDate(from.getDate() + 1);
        }

        return days;
    }

    dateToDDMM(aDate){
        return (aDate.getDate() + "-" + (aDate.getMonth() + 1));
    }


    render(){
        var days = this.getDays();
        return(
            <div className="Toolbar">
                <button onClick={() => {this.setState({openSummary : true})}}>Summary</button>
                <p>Week {`${days[0]} to ${days[6]}`}</p>
                {(this.state.openSummary) ? <Summary show={this.state.openSummary} close={() => this.setState({openSummary : false})} residence={this.props.residence}/> : ""}
            </div>
        );
    }

    
}

export default Toolbar;