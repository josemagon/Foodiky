import React, {Component} from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';

class NewStatusForm extends Component{

    constructor(props){
        super(props);

        this.state = {
            color: "#FFFFFF",
            description : ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearAndClose = this.clearAndClose.bind(this);
    }

    handleSubmit(evt){
        evt.preventDefault();

        const db = firebase.firestore();

        db.collection("residences").doc(this.props.residence.idResidence)
            .collection("status")
            .add({
                description : this.state.description,
                color : this.state.color
            })
            .then(result => {
                result.get().then(status => {
                    this.props.addNewStatus(status);
                });
                this.clearAndClose();
            });
    }

    handleChange(evt){
        this.setState({
            [evt.target.name] : evt.target.value
        });
    }

    clearAndClose(){
        this.setState({
            description : "",
            color : "#FFFFFF"
        });

        this.props.close();
    }


    render(){
        return(
            <form onSubmit={this.handleSubmit} style={{backgroundColor: "white", border: "1px solid black", padding: "10px"}}>
                <div className="EditOptions-InputControl">
                    <input id="newStatusDesc" type="text"  name="description" required autoFocus placeholder="New option here (yes, no, takeaway...)" value={this.state.description} onChange={this.handleChange}></input>
                </div>
                <div className="EditOptions-InputControl">
                    <label htmlFor="newStatusColor">Choos a color for the choice to appear in the table (optional)</label>
                    <input id="newStatusColor" type="color" name="color"  placeholder="Choose a color" value={this.state.color} onChange={this.handleChange}></input>
                    <small>Colors can help to faster understand the table.</small>
                </div>
                <div className="EditOptions-InputControl">
                    <button type="submit">Save</button>
                </div>
                <div className="EditOptions-InputControl">
                    <a onClick={this.clearAndClose}>Cancel</a>
                </div>
            </form>
        );
    }

}


export default NewStatusForm;