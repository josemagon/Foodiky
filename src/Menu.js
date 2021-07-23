import React, {Component} from 'react';

import './Menu.css';

import ManagerMenu from './ManagerMenu';
import EditMyName from './EditMyName';



class Menu extends Component{

    constructor(props){
        super(props);

        this.state = {
            editingName : false
        };
    }

    render(){
        return(
            <div className="Menu" onClick={(evt) => {if(evt.target.classList.contains("Menu")) this.props.toggleShowMenu()}}>
                <div className="Menu-content-outside">
                    <div className="Menu-content">
                        <ul>
                            <li><img alt={`${this.props.residence.name} shield`} src={this.props.residence.shieldURL}></img></li>
                            <li>{this.props.user.email}</li>
                            <li>{this.props.residence.location}</li>
                        </ul>
                    </div>
                </div>
                <div className="Menu-UserMenu">
                    <ul>
                        <li><a onClick={() => {this.setState({editingName : true})}}>Edit my name</a></li>
                        <ManagerMenu residence={this.props.residence} user={this.props.user} isManager={this.props.isManager}/>
                        <li className="logout-btn"><a onClick={() => this.props.signUserOut()}>log out</a></li>
                        <li className="Menu-close" onClick={() => this.props.toggleShowMenu()}>close</li>
                    </ul>
                </div>
                {(this.state.editingName) ? <EditMyName show={this.state.editingName} residence={this.props.residence} user={this.props.user} close={() => {this.setState({editingName: false})}}/> : <></>}
            </div>
        );
    }
    
}


export default Menu;