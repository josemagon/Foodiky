import React, {Component} from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';

import Spinner from './Spinner';
import logo from './logo.png';
import './SignIn.css';

import ForgotPass from './ForgotPass';


class SignIn extends Component{
    constructor(props){
        super(props);

        this.state = {
            email : "",
            password : "",
            showRegisterForm : false,
            forgotPass : false
        }

        this.handleSubmitSignIn = this.handleSubmitSignIn.bind(this);
        this.handleSubmitQuestion = this.handleSubmitQuestion.bind(this);
        this.showQuestionModal = this.showQuestionModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleShowRegisterForm = this.toggleShowRegisterForm.bind(this);
    }

    componentDidMount(){
        
    }

    handleSubmitSignIn(evt){
        evt.preventDefault();

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
         }else {
            firebase.app(); // if already initialized, use that one
         }

        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(function(result){

            })
            .catch(function(err){
                var error_msg = document.createElement("p");
                error_msg.innerText = err.message;
                error_msg.style.color = "red";
                evt.target[1].parentNode.appendChild(error_msg);

                setTimeout(() => {
                    error_msg.remove();
                }, 10000);
            });
    }

    handleSubmitQuestion(evt){

    }

    handleChange(evt){
        this.setState({
            [evt.target.type] : evt.target.value
        });
    }
    
    showQuestionModal(evt){

    }

    toggleShowRegisterForm(){
        this.setState({
            showRegisterForm : !this.state.showRegisterForm
        })
    }

    showSignInForm(){
        return(
            <form onSubmit={this.handleSubmitSignIn}>
                <h2>Welcome! Sign in</h2>
                <div className="input-control">
                    <input autoFocus type="email" name="residence-manager" id="residence-manager" placeholder="email" required autoFocus onChange={this.handleChange}/>
                    <small><a style={{textDecoration : "underline"}} href="#manager">Manager?</a></small><br></br>
                    <small><a style={{textDecoration : "underline"}} href="#residence-account">Residence account?</a></small>
                </div>
                <div className="input-control">
                    <input type="password" name="manager-password" id="manager-password" placeholder="Password" required onChange={this.handleChange}/>
                </div>
                <div className="input-control">
                    <button type="submit">Sign in</button>
                </div>
                <div className="input-control">
                    <a onClick={this.toggleShowRegisterForm} href="#register-form" style={{textDecoration : "underline", fontWeight : "bolder"}}>I don't have a residence</a>
                </div>
                <a onClick={() => {this.setState({forgotPass : true})}}>Forgot my password</a>
            </form>
        );
    }

    render(){
        return(
            <div className="SignIn">
                <main>
                    <div className="SignIn-Box" >
                        <div className="SignIn-logo">
                            <img alt="FDKY logo" src={logo}></img>
                        </div> 
                        {(this.state.forgotPass) ? <ForgotPass close={() => {this.setState({forgotPass : false})}}/> : this.showSignInForm()}
                    </div>
                </main>
                
            </div>
        );
    }


}


export default SignIn;