import React, {Component} from 'react';
import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/storage";
import NavBar from './NavBar';
import Menu from './Menu';
import Toolbar from "./Toolbar";
import FoodikyTable from './FoodikyTable';
import noShield from './noShield.png';

class Dashboard extends Component{
    constructor(props){
        super(props);
        this.state = {
            residence : {"name" : "loading...", "location" : "loading..."},
            showMenu : false,
            isManager : false
        }

        this.getResidenceInfo = this.getResidenceInfo.bind(this);
        this.toggleShowMenu = this.toggleShowMenu.bind(this);
        this.setIsManager = this.setIsManager.bind(this);
        this.getResidenceShield = this.getResidenceShield.bind(this);
    }

    componentDidMount(){
        const db = firebase.firestore();
        
        this.getResidenceInfo(db); 
        this.props.toggleLoading();

    }

    setIsManager(db){
        db.collection("residences").doc(this.state.residence.idResidence).collection("managers").doc(this.props.user.uid).get()
            .then(manager => {
                this.setState({
                    isManager : manager.exists
                });
            })
            .catch(err => {
                console.log(err);
            })
    }

    getResidenceInfo(db){
        db.collectionGroup('diners').where("uid", "==", this.props.user.uid).limit(1).get()
            .then(diners => {
                diners.forEach(diner =>{
                    if (diner.exists){
                        var idResidence = diner.ref.parent.parent.id;
                        db.collection('residences').doc(idResidence).get()
                            .then( (residence) => {
                                var tempresidence = residence.data();
                                tempresidence.idResidence = residence.ref.id;

                                if(tempresidence.status){
                                    this.setState({
                                        residence : tempresidence
                                    });
                                    this.setIsManager(db);
                                    this.getResidenceShield();
                                }else{
                                    window.location = "/licence-expired";
                                }
                        });
                    }else{
                        alert("The residence hasn't accepted you request or you have been rejected.");
                        firebase.auth().signOut();
                    }
                }); //end foreach
        });

    }

    getResidenceShield(){
        //check if there s already a shield uploaded
        const storage = firebase.storage().ref();

        const shieldRef = storage.child("shields/" + this.state.residence.idResidence + ".png");

        shieldRef.getDownloadURL()
            .then(url => {
                var tempresidence = this.state.residence;
                tempresidence.shieldURL = url;

                this.setState({
                    residence : tempresidence
                });
            })
            .catch(err => {
                var tempresidence = this.state.residence;
                tempresidence.shieldURL = noShield;

                this.setState({
                    residence : tempresidence
                });
            });
    }

    toggleShowMenu(){
        this.setState({
            showMenu : !this.state.showMenu
        });
    }

    render(){
        return(
            <div className="Dashboard">
                <NavBar toggleShowMenu={this.toggleShowMenu} residence={this.state.residence} signUserOut={this.props.signUserOut}/>
                {(this.state.showMenu) ? <Menu isManager={this.state.isManager} residence={this.state.residence} user={this.props.user} signUserOut={this.props.signUserOut} toggleShowMenu={this.toggleShowMenu}/> : null}
                {<Toolbar residence={this.state.residence} />}
                {(this.state.residence.idResidence) ? <FoodikyTable isManager={this.state.isManager} residence={this.state.residence} user={this.props.user}/> : <div></div>}
            </div>
        );
    }
}

export default Dashboard;