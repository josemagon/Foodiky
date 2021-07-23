import React, {Component} from 'react';
import './App.css';
import firebase from 'firebase/app';
import "firebase/auth";
import firebaseConfig from './firebaseConfig.js';

import SignIn from './SignIn';
import Splash from './Splash';
import Dashboard from './Dashboard';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      user : null,
      loading: true
    }

    this.toggleLoading = this.toggleLoading.bind(this);
    this.signUserOut = this.signUserOut.bind(this);
  }

  toggleLoading(){
    this.setState({
      loading : !this.state.loading
    });
  }

  componentDidMount(){
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }else {
      firebase.app(); // if already initialized, use that one
    }

    firebase.auth().onAuthStateChanged((aUser) => {
      if (aUser) {
        this.setState({
          user: aUser
        });
      }
      this.setState({
        loading: false
      });
    });
  }

  signUserOut(){
    this.setState({
      loading: true
    });
    firebase.auth().signOut()
      .then(function(res){
        console.log("successfully logged out");
      })
      .catch(function(err){
        console.log("ERROR: " , err);
      });
      setTimeout(() => {
        this.setState({
          user: null
        });
      }, 1000);
  }


  render(){
    return (
      <div className="App">
        {<Splash show={this.state.loading} />}
        {(this.state.user) ? <Dashboard user={this.state.user} toggleLoading={this.toggleLoading} signUserOut={this.signUserOut}/> : <SignIn toggleLoading={this.toggleLoading} />}
      </div>
    );
  }
  
}

export default App;
