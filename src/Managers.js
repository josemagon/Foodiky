import React, { Component } from "react";

import firebase from 'firebase/app';
import 'firebase/firestore';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome' ;
import {faArrowAltCircleUp, faArrowAltCircleDown} from '@fortawesome/free-solid-svg-icons';

import Toast from './Toast';

class Managers extends Component{
    constructor(props){
        super(props);

        this. state = {
            diners : [],
            managers : [],
            toasts : []
        }

        this.promote = this.promote.bind(this);
        this.demote = this.demote.bind(this);
    }

    componentDidMount(){
        const db = firebase.firestore();

        var residenceRef =  db.collection("residences").doc(this.props.residence.idResidence);

        residenceRef.collection("diners")
            .get()
            .then(diners => {
                diners.forEach(diner => {
                    this.setState(state => ({
                        diners : [...state.diners, diner]
                    }));
                })
            })

        residenceRef.collection("managers")
            .get()
            .then(managers => {
                managers.forEach(manager => {
                    this.setState(state => ({
                        managers : [...state.managers, manager]
                    }));
                })
            });
    }

    showManagers(){
        return(
            this.state.managers.map(manager => {
                var ManagerDiner = this.state.diners.filter(diner => diner.ref.id === manager.ref.id)[0];
                return(
                    <tr>
                        <td>{ManagerDiner.data().name ? ManagerDiner.data().name : ManagerDiner.data().email}</td>
                        <td><a onClick={() => this.demote(ManagerDiner)} style={{color: "red"}}>Demote</a></td>
                    </tr>
                )
            })
        )
    }

    showDiners(){
        return(
            this.state.diners.map(diner => {
                if(this.state.managers.filter(manager => manager.ref.id === diner.ref.id).length == 0){
                    return(
                        <tr>
                            <td>{diner.data().name ? diner.data().name : diner.data().email}</td>
                            <td><a onClick={() => this.promote(diner)}  style={{color: "green"}}>Promote</a></td>
                        </tr>
                    )
                }
            })
        )
    }

    promote(aUser){
        const db = firebase.firestore();

        db.collection("residences").doc(this.props.residence.idResidence).collection("managers")
            .doc(aUser.ref.id)
            .set({})
            .then(result => {
                this.setState(state => ({
                    managers : [...state.managers, aUser],
                    toasts : [...state.toasts, <Toast message="User promoted" />]
                }))
            })
    }

    demote(aManager){
        const db = firebase.firestore();

        db.collection("residences").doc(this.props.residence.idResidence).collection("managers")
            .doc(aManager.ref.id)
            .get()
            .then(managerRes => {
                managerRes.ref.delete();
                this.setState(state => ({
                    managers : this.state.managers.filter(manager => manager.ref.id !== aManager.ref.id),
                    toasts : [...state.toasts, <Toast message="Manager demoted" />]
                }));
            })
    }


    render(){
        return(
            <div className="EditOptions">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.showManagers()}
                        {this.showDiners()}
                    </tbody>
                </table>
                <div className="EditOptions-InputControl">
                    <a onClick={this.props.close}>Close</a>
                </div>
                {this.state.toasts.map(toast => {
                    return toast;
                })}
            </div>
        )
    }
}

export default Managers;