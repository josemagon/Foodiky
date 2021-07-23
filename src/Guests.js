import React, {Component} from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';
import Toast from './Toast';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome' ;
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';

import Spinner from './Spinner';

class Guests extends Component{
    constructor(props){
        super(props);

        this.state = {
            guests : [],
            addingNewGuest: false,
            newGuest : {"name" : "", "qty" : 1},
            toasts : [],
            loading: true
        }

        this.handleChangeNewGuest = this.handleChangeNewGuest.bind(this);
        this.handleSubmitNewGuest = this.handleSubmitNewGuest.bind(this);

        this.showGuestsTable = this.showGuestsTable.bind(this);
        this.showNewGuestForm = this.showNewGuestForm.bind(this);
    }

    componentDidMount(){
        const db = firebase.firestore();

        db.collection("residences").doc(this.props.residence.idResidence).collection("guests")
            .get()
            .then(guests => {
                guests.forEach(guest => {
                    this.setState(state => ({
                        guests : [...state.guests, guest]
                    }));
                });
                this.setState({
                    loading: false
                });
            })
    }

    deleteGuest(aGuest){
        if(window.confirm("Are you sure you want to remove guest " + aGuest.data().name + "?")){
            const db = firebase.firestore();

            db.collection("residences").doc(this.props.residence.idResidence).collection("guests")
                .doc(aGuest.ref.id)
                .get()
                .then(guest => {
                    guest.ref.delete();
                    this.deleteGuestFoods(db, aGuest);
                    this.setState(state => ({
                        guests : state.guests.filter(guest => guest.ref.id !== aGuest.ref.id),
                        toasts : [...state.toasts, <Toast message="Guest removed"/>]
                    }));
                });
        }           
    }

    deleteGuestFoods(db, aGuest){
        db.collection("residences").doc(this.props.residence.idResidence).collection("foods")
            .where("idDiner", "==", aGuest.ref.id)
            .get()
            .then(foods => {
                foods.forEach(food => {
                    food.ref.delete();
                });
            })
    }

    handleSubmitNewGuest(evt){
        evt.preventDefault();

        const db = firebase.firestore();

        db.collection("residences").doc(this.props.residence.idResidence).collection("guests")
            .add({
                name: this.state.newGuest.name,
                qty : this.state.newGuest.qty
            })
            .then(result => {
                result.get().then(guestRef => {
                    this.setState(state => ({
                        toasts : [...state.toasts, <Toast message="Guest added."/>],
                        guests : [...state.guests, guestRef],
                        addingNewGuest : false
                    }));
                })
            });
    }

    handleChangeNewGuest(evt){
        var prevNewGuest = this.state.newGuest;
        prevNewGuest[evt.target.name] = evt.target.value;
        this.setState({
            newGuest : prevNewGuest 
        });
    }

    showNewGuestForm(){
        return(
            <form onSubmit={this.handleSubmitNewGuest}>
                <div className="EditOptions-InputControl">
                    <input type="name" name="name" maxLength="50" placeholder="Name or identifier for the guest(s)" required autoFocus onChange={this.handleChangeNewGuest} value={this.state.newGuest.name}></input>
                </div>
                <div className="EditOptions-InputControl">
                    <input type="number" name="qty" min="1" placeholder="How many guests?" required value={this.state.newGuest.qty} onChange={this.handleChangeNewGuest}></input>
                </div>
                <button type="submit">Save</button>
                <a onClick={() => {this.setState({addingNewGuest : false})}}>Cancel</a>
            </form>
        );
    }

    showGuestsTable(){
        if(this.state.guests.length > 0){
            return(
                <table>
                    <thead>
                        <tr>
                            <th>Name/Identifier</th>
                            <th>Quantity</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.guests.map(guest => {
                            return(
                                <tr key={guest.ref.if}>
                                    <td>{guest.data().name}</td>
                                    <td>{guest.data().qty}</td>
                                    <td>
                                        <a onClick={() => this.deleteGuest(guest)}>
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </a>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            );
        }else{
            return (<p>You don't have any guests at the moment.</p>);
        }

    }

    render(){
        return(
            <div className="EditOptions">
                {(this.state.loading) ? <Spinner show={this.state.loading}/> : null}
                {(this.state.addingNewGuest) ? this.showNewGuestForm() : this.showGuestsTable()}
                {!this.state.addingNewGuest ? <button onClick={() => {this.setState({addingNewGuest : true})}}>Add new guests</button> : ""}
                {this.state.toasts.map(toast => {
                    return(
                        toast
                    );
                })}
                <a onClick={this.props.close}>Close</a>
            </div>
        )
    }
}


export default Guests;