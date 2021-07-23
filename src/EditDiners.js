import React, {Component} from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome' ;
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import Spinner from './Spinner';

import Toast from './Toast';

class EditDiners extends Component{
    constructor(props){
        super(props);

        this.state = {
            diners : [],
            loading: true,
            toasts : []
        }

        this.delete = this.delete.bind(this);
        this.deleteFoods = this.deleteFoods.bind(this);
        this.deleteManager = this.deleteManager.bind(this);
        this.showTable = this.showTable.bind(this);
    }

    componentDidMount(){
        const db = firebase.firestore();

        db.collection("residences").doc(this.props.residence.idResidence).collection("diners")
            .get()
            .then(diners => {
                diners.forEach(diner => {
                    var newDiner = diner.data();
                    newDiner.idDiner = diner.ref.id;
                    var tempdiners = this.state.diners;
                    tempdiners.push(newDiner);
                    this.setState({
                        diners : tempdiners,
                    });
                });
                
                this.setState({
                    loading: false
                });
            })
        
    }

    delete(aDiner){
        if(window.confirm("Are you sure you want to remove " + aDiner.email)){
            const db = firebase.firestore();
            db.collection("residences")
                .doc(this.props.residence.idResidence)
                .collection("diners")
                .doc(aDiner.idDiner)
                .get()
                .then(diner => {
                    diner.ref.delete();
                    this.deleteFoods(aDiner, db);
                    this.deleteManager(aDiner, db);
                    this.setState(prevState => ({
                        diners : prevState.diners.filter(diner => {
                            return (diner.idDiner !== aDiner.idDiner);
                        })
                    }));
                });
        
            this.setState(state => ({
                toasts : [...state.toasts, <Toast message="Diner deleted" />]
            }));
        }
        
    }

    deleteManager(aDiner, db){
        db.collection("residences")
            .doc(this.props.residence.idResidence)
            .collection("managers")
            .doc(aDiner.idDiner)
            .get()
            .then(manager => {
                if(manager.exists){
                    manager.ref.delete();
                }
            });
    }

    deleteFoods(aDiner, db){
        db.collection("residences")
            .doc(this.props.residence.idResidence)
            .collection("foods")
            .where("idDiner", "==", aDiner.idDiner)
            .get()
            .then(foods => {
                foods.forEach(food => {
                    food.ref.delete();
                });
            })
    }

    showTable(){
        return(
            <>
                <h3>These diners are part of your residence.</h3>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Name (optional)</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.diners.map(diner => {
                                return (
                                    <tr key={diner.idDiner}>
                                        <td>{diner.email}</td>
                                        <td>{diner.name}</td>
                                        <td><a onClick={() => this.delete(diner)}><FontAwesomeIcon icon={faTrashAlt} /></a></td>
                                    </tr>
                                );
                            })} 
                        </tbody>
                    </table>
                </div>
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
                {(this.state.diners.length > 0) ? this.showTable() : "There are no diners in this residence."}
                {(this.state.loading) ? <Spinner show={this.state.loading} /> : ""}
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


export default EditDiners;