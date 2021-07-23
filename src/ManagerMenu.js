import React, {Component} from 'react';
import DinerRequests from './DinerRequests';
import EditDiners from './EditDiners';
import EditStatus from './EditStatus';
import ResidenceShield from './ResidenceShield';
import Guests from './Guests';
import Managers from './Managers';

class ManagerMenu extends Component{
    constructor(props){
        super(props);

        this.state = {
            loading: true,
            checkingRequests : false,
            editingDiners : false,
            editingOptions: false,
            editingShield: false,
            editingGuests : false,
            editingManagers : false
        }
    }

    componentDidMount(){
        this.setState({
            loading : false
        });

    }

    getOptions(){
        return(
            <>
                <li><a onClick={() => {this.setState({checkingRequests: true})}}>Residence Requests</a></li>
                <li><a onClick={() => {this.setState({editingDiners: true})}}>Diners (users)</a></li>
                <li><a onClick={() => {this.setState({editingGuests: true})}}>Guests</a></li>
                <li><a onClick={() => {this.setState({editingOptions : true})}}>Food Options</a></li>
                <li><a onClick={() => {this.setState({editingManagers : true})}}>Managers</a></li>
                <li><a onClick={() => this.setState({editingShield: true})}>Residence Shield</a></li>
            </>
        )
    } 

    render(){
        return(
            <>
                {(this.state.loading) ? "" : ""}
                {(this.props.isManager) ? this.getOptions() : ""}
                {(this.state.checkingRequests) ? <DinerRequests show={this.state.checkingRequests} close={() => this.setState({checkingRequests : false})} residence={this.props.residence}/> : <></>}
                {(this.state.editingDiners) ? <EditDiners show={this.state.editingDiners} close={() => window.location.reload()} residence={this.props.residence} /> : <></>}
                {(this.state.editingOptions) ? <EditStatus show={this.state.editingOptions} close={() => {this.setState({editingOptions : false})}} residence={this.props.residence}/> : <></>}
                {(this.state.editingShield) ? <ResidenceShield show={this.state.editingShield} close={() => this.setState({editingShield: false})} residence={this.props.residence}/> : null}
                {(this.state.editingGuests) ? <Guests close={() => this.setState({editingGuests: false})} residence={this.props.residence}/> : null}
                {this.state.editingManagers ? <Managers close={() => this.setState({editingManagers: false})} residence={this.props.residence} /> : null}
            </>
        );
    }  
    
}


export default ManagerMenu;