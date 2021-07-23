import React, { Component } from "react";

import firebase from 'firebase/app';
import 'firebase/auth';

class ForgotPass extends Component{
    constructor(props){
        super(props);

        this.state = {
            email : "",
            showForm : true
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showForm = this.showForm.bind(this);
    }

    handleSubmit(evt){
        evt.preventDefault();

        firebase.auth().sendPasswordResetEmail(this.state.email).then(res => {
            this.setState({
                email : "",
                showForm : false
            });
          }).catch(error => {
            // An error happened.
            console.error(error);
          });
    }

    handleChange(evt){
        this.setState({
            email : evt.target.value
        });
    }

    showForm(){
        return(
            <form onSubmit={this.handleSubmit}>
                <h2>Recover your account</h2>
                <div className="input-control">
                    <input autoFocus type="email" name="email" id="email" placeholder="email" required autoFocus onChange={this.handleChange} value={this.state.email}/>
                </div>
                <div className="input-control">
                    <button type="submit">Send</button>
                </div>
                <a onClick={this.props.close}>Cancel</a>
            </form>
        );
    }

    showMessage(){
        return(
            <>
                <h2>Success! Check you email!</h2>
                <a onClick={this.props.close}>Close</a>
            </>
        )
    }

    render(){
        return(
            <>
                {(this.state.showForm) ? this.showForm() : this.showMessage()}
            </>
        )
    }
}

export default ForgotPass;