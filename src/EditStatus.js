import React, {Component} from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome' ;
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import NewStatusForm from './NewStatusForm';

import Spinner from './Spinner';

import Toast from './Toast';
import Clock from './Clock';

class EditStatus extends Component{
    constructor(props){
        super(props);

        this.state = {
            status : [],
            addingNewStatus : false,
            loading : true,
            toasts : [],
            settingLimitTime: false,
            limitTime : 9,
            friendlyFire : true
        }

        this.delete = this.delete.bind(this);
        this.addNewStatus = this.addNewStatus.bind(this);
        this.showClock = this.showClock.bind(this);
        this.changeTime = this.changeTime.bind(this);
        this.submitResidenceLimitTime = this.submitResidenceLimitTime.bind(this);
    }

    componentDidMount(){
        const db = firebase.firestore();

        this.setState({
            friendlyFire : this.props.residence.friendlyFire
        });

        db.collection("residences")
            .doc(this.props.residence.idResidence)
            .collection("status")
            .get()
            .then(statuses => {
                statuses.forEach(status => {
                    this.setState(state => ({
                        status : [...state.status, status]
                    }));
                });
                this.setState({
                    loading : false
                })
            });
    }

    delete(aStatus){
        if(window.confirm("Are you sure you want to delete the option \""+ aStatus.data().description +"\"")){
            const db = firebase.firestore();
            db.collection("residences").doc(this.props.residence.idResidence).collection("foods")
                .where("status", "==", aStatus.data().description)
                .get()
                .then(foods => {
                    foods.forEach(food => {
                        food.ref.delete();
                    });
                });

            aStatus.ref.delete();

            this.setState({
                status : this.state.status.filter(status => status.ref.id !== aStatus.ref.id)
            });

            this.setState(state => ({
                toasts : [...state.toasts, <Toast message="Option deleted" />]
            }));
        }
        
    }

    addNewStatus(aStatus){
        this.setState(state => ({
            status : [...state.status, aStatus]
        }))

        this.setState(state => ({
            toasts : [...state.toasts, <Toast message="New option saved" />]
        }));
    }


    showTable(){
        return(
            <>
                <h3>These options have been saved for this residence.</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Food Option</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.status.map(status => {
                            return (
                                <tr>
                                    <td>{status.data().description}</td>
                                    <td><a onClick={() => this.delete(status)}><FontAwesomeIcon icon={faTrashAlt} /></a></td>
                                </tr>
                            );
                        })} 
                    </tbody>
                </table>
            </>
        );
    }

    showClock(){
        return(
            <form onSubmit={this.submitResidenceLimitTime}>
                <div className="EditOptions-InputControl">
                    <Clock setTime={this.setTime}/>
                </div>
                <div className="EditOptions-InputControl">
                    <button type="submit">Save limit time</button>
                </div>
            </form>
        )
    }

    changeTime(evt){
        this.setTime({
            limitTime : evt.target.value
        });
    }

    submitResidenceLimitTime(evt){
        evt.preventDefault();

        const db = firebase.firestore();

        db.collection("residences").doc(this.props.residence.idResidence)
            .update({
                limitTime : this.state.limitTime
            })
            .then(result => {
                this.setState(state => ({
                    toasts : [...state.toasts, <Toast message="Limit time saved" />],
                    settingLimitTime : false
                }));
            })
            .catch(err => {
                this.setState(state => ({
                    toasts : [...state.toasts, <Toast message={err.message} />],
                    settingLimitTime : false
                }));
            });
    }

    setFriendlyFire(aBool){
        const db = firebase.firestore();

        db.collection("residences").doc(this.props.residence.idResidence)
            .update({
                friendlyFire : aBool
            })
            .then(result => {
                this.setState(state => ({
                    friendlyFire : aBool,
                    toasts : [...state.toasts, <Toast message={aBool ? "User can now edit eachother's options" : "Users now can't modify eachother's options"} />]
                }));
            })
    }

    render(){
        var style;
        if(this.props.show)
            style = {display : "flex"}
        else
            style = {display : "none"};

        return(
            <div className="EditOptions" style={style}>

                <button onClick={() => {this.setState({addingNewStatus: true})}}>{(this.state.addingNewStatus) ? "Adding New Status" : "Add new status"}</button>

                <div className="EditOptions-InputControl">
                    {this.state.settingLimitTime ? this.showClock() : <a onClick={() => this.setState({settingLimitTime : true})}>Set limit time</a>}
                </div>
                
                <div className="EditOptions-InputControl">
                    {(this.state.friendlyFire) ? <a onClick={() => this.setFriendlyFire(false)} style={{color: "green"}}>Current (default): Allow users edit eachother's options</a> : <a onClick={() => this.setFriendlyFire(true)} style={{color: "red"}}>Current: Don't allow user to edit other's options</a>}
                </div>

                {(this.state.loading) ? <Spinner show={this.state.loading} /> : ""}

                {(this.state.addingNewStatus) ? <NewStatusForm close={() => {this.setState({addingNewStatus : false})}} residence={this.props.residence} addNewStatus={this.addNewStatus}/> : <></>}
                
                {(this.state.status.length > 0 && !this.state.addingNewStatus) ? this.showTable() : <></>}

                <div className="EditOptions-InputControl">
                    <a onClick={() => {this.props.close()}}>close</a>
                </div>
                

                {this.state.toasts.map(toast => {
                    return(
                        toast
                    );
                })}
            </div>
        );
    }
}


export default EditStatus;