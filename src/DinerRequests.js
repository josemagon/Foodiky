import React, {Component} from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome' ;
import {faCheckCircle, faTrashAlt} from '@fortawesome/free-solid-svg-icons';

import Spinner from './Spinner';

import Toast from './Toast.js';

class DinerRequests extends Component{
    constructor(props){
        super(props);

        this.state = {
            diners : [],
            loading: true,
            toasts : []
        }

        this.accept = this.accept.bind(this);
        this.reject = this.reject.bind(this);
    }

    componentDidMount(){
        const db = firebase.firestore();

        db.collection("residences")
            .doc(this.props.residence.idResidence)
            .collection("dinerRequests")
            .get()
            .then(diners => {
                diners.forEach(diner => {
                    var tempdiners = this.state.diners;
                    var newDiner = diner.data();
                    newDiner.idDiner = diner.ref.id;
                    tempdiners.push(newDiner);
                    this.setState({
                        diners : tempdiners
                    });
                });
                this.setState({
                    loading: false
                });
            });
    }

    accept(aDiner){
        const db = firebase.firestore();
        db.collection("residences")
            .doc(this.props.residence.idResidence)
            .collection("diners")
            .doc(aDiner.idDiner)
            .set({
                uid: aDiner.idDiner,
                email : aDiner.email,
                name : null
            });

        db.collection("residences")
            .doc(this.props.residence.idResidence)
            .collection("dinerRequests")
            .doc(aDiner.idDiner)
            .get()
            .then(diner => {
                diner.ref.delete();
            });
    
        this.setState({
            diners : this.state.diners.filter(diner => diner.idDiner !== aDiner.idDiner)
        });

        this.setState(state =>({
            toasts : [...state.toasts, <Toast message="Diner accepted"/>]
        }));
    }

    reject(aDiner){
        if(window.confirm("Are you sure you want to reject " + aDiner.email)){
            const db = firebase.firestore();
            db.collection("residences")
                .doc(this.props.residence.idResidence)
                .collection("dinerRequests")
                .doc(aDiner.idDiner)
                .get()
                .then(diner => {
                    diner.ref.delete();
                });

            this.setState({
                diners : this.state.diners.filter(diner => diner.idDiner !== aDiner.idDiner)
            });

            this.setState(state =>({
                toasts : [...state.toasts, <Toast message="Diner rejected"/>]
            }));
        }
        
    }

    showTable(){
        return(
            <>
                <h3>These users are waiting to be accepted.</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Accept</th>
                            <th>Reject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.diners.map(diner => {
                            return (
                                <tr>
                                    <td>{diner.email}</td>
                                    <td><a onClick={() => this.accept(diner)} ><FontAwesomeIcon icon={faCheckCircle} /></a></td>
                                    <td><a onClick={() => this.reject(diner)}><FontAwesomeIcon icon={faTrashAlt} /></a></td>
                                </tr>
                            );
                        })} 
                    </tbody>
                </table>
            </>
        );
    }

    render(){
        var style;
        if(this.props.show)
            style = {display : "flex"}
        else
            style = {display : "none"};

        return(
            <div className="EditOptions" style={style}>
                {(this.state.loading) ? <Spinner show={this.state.loading}/> : ""}
                {(this.state.diners.length > 0) ? this.showTable() : "There're no diners to be accepted."}

                <a onClick={() => {this.props.close()}}>close</a>
                {this.state.toasts.map(toast => {
                    return (
                        toast
                    );
                })}
            </div>
        );
    }
}


export default DinerRequests;