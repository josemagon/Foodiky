import React, {Component} from 'react';

import firebase from 'firebase/app';
import 'firebase/storage';

import defaultshield from './noShield.png';

class ResidenceShield extends Component{
    constructor(props){
        super(props);

        this.state = {
            loading : true,
            hasShield : false,
            shieldURL: null
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        //check if there s already a shield uploaded
        const storage = firebase.storage().ref();

        const shieldRef = storage.child("shields/" + this.props.residence.idResidence + ".png");

        shieldRef.getDownloadURL()
            .then(url => {
                this.setState({
                    loading :false,
                    hasShield : true,
                    shieldURL : url
                })
            })
            .catch(err => {
                console.log(err);
            });
    }

    handleChange(evt){
        const storage = firebase.storage().ref();

        const shieldRef = storage.child("shields/" + this.props.residence.idResidence + ".png");

        var shieldFile = evt.target.files.item(0);

        shieldRef.put(shieldFile)
            .then(snapshot => {
                console.log(snapshot);
                snapshot.ref.getDownloadURL()
                    .then(url => {
                        this.setState({
                            hasShield : true,
                            shieldURL : url
                        });
                    });
                
            })

    }

    render(){
        var style;
        if(this.props.show)
            style ={ display: "flex"}
        else    
            style = {display : "none"};

        return(
            <div className="EditOptions">
                <img src={(this.state.hasShield) ? this.state.shieldURL : defaultshield} alt={`${this.props.residence.name}'s shield`} style={{maxWidth:"40px", maxHeight:"40px"}}></img>
                <div className="EditOptions-InputControl">
                    <button><label htmlFor="shieldFileInput">{(this.state.hasShield) ? "Change Residence Shield" : "Add a shield logo"}</label></button>
                    <input id="shieldFileInput" type="file" style={{display : "none"}} onChange={this.handleChange}></input>
                </div>
                <a onClick={this.props.close}>Close</a>
            </div>
        );
    }
}

export default ResidenceShield;