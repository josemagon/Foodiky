import React, {Component} from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Toast from './Toast';

class EditMyName extends Component{

    constructor(props){
        super(props);

        this.state = {
            newname : "",
            showToast: false
        }

        this.handleSubmit = this.handleSubmit.bind((this));
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(evt){
        evt.preventDefault();
        const db = firebase.firestore();

        db.collection("residences").doc(this.props.residence.idResidence).collection("diners").doc(this.props.user.uid).update({
            name : this.state.newname
        }).then(result => {
            // window.location.reload();
            this.setState({
                showToast : true
            });
            setTimeout(() => {
                this.setState({
                    showToast : false
                });
            }, 4000);
        });
    }

    componentWillUnmount(){
        this.setState({
            newname : ""
        });
    }

    handleChange(evt){
        this.setState({
            newname : evt.target.value
        });
    }   

    render(){
        var style;
        if (this.props.show)
            style = {display : "flex"}
        else
            style = {display : "none"};


        return(
            <div className="EditOptions" style={style}>
                {(this.state.showToast) ? <Toast message="Name has been saved. Reload page to view changes."/> : null}
                <form onSubmit={this.handleSubmit}>
                    <h3>Editing name</h3>
                    <p>This is the name that will appear in the table. If you haven't set a name, you will see your email.</p>
                    <div className="EditOptions-InputControl">
                        <input type="text" name="newname" id="newname" autoFocus placeholder="New name here" onChange={this.handleChange} required></input>
                    </div>
                    <button type="submit">Save new name</button>
                    <div className="EditOptions-InputControl">
                        <a onClick={this.props.close}>Close</a>
                    </div>
                </form>
                
            </div>
        );
    }

    
}

export default EditMyName;