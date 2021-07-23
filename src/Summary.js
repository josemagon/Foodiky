import React, {Component} from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';

import Spinner from './Spinner';

class Summary extends Component{
    constructor(props){
        super(props);

        this.state ={
            statuses : [],
            loading : true,
            guests : []
        }

        this.initStatus = this.initStatus.bind(this);
        this.initFoods = this.initFoods.bind(this);
        this.showTable = this.showTable.bind(this);
        this.isGuest = this.isGuest.bind(this);
        this.loadGuests = this.loadGuests.bind(this);
    }

    componentDidMount(){
        const db = firebase.firestore();

        this.loadGuests(db);

        db.collection("residences").doc(this.props.residence.idResidence).collection("foods")
            .onSnapshot(foods => {
                this.initStatus(db, foods);
            });
    }

    loadGuests(db){
        db.collection("residences").doc(this.props.residence.idResidence).collection("guests")
        .get()
        .then(guests => {
            guests.forEach(guest => {
                var newGuest = {"idDiner" : guest.ref.id, "qty": guest.data().qty};
                this.setState(state => ({
                    guests : [...state.guests, newGuest]
                }));
            });
        })
    }

    initStatus(db, foods){
        this.setState({
            statuses : [],
            loading: true
        });

        db.collection("residences").doc(this.props.residence.idResidence).collection("status")
            .get()
            .then(statuses => {
                statuses.forEach(status => {
                    var newStatus = {"description" : status.data().description, "lunchs" : 0, "dinners" : 0};
                    var tempstatuses = this.state.statuses;
                    tempstatuses.push(newStatus);
                    this.setState({
                        statuses : tempstatuses
                    });
                });
                this.initFoods(foods);
            })
    }

    isGuest(aDiner){
        return this.state.guests.filter(guest => guest.idDiner === aDiner)[0];
    }

    guestQty(aDiner){
        var guest = this.isGuest(aDiner);
        if(guest){
            return parseInt(guest.qty);
        }else{
            return 1;
        }
    }

    initFoods(foods){
        foods.forEach(food => {
            if(this.dateToYYYYMMDD(new Date()) === this.dateToYYYYMMDD(food.data().date.toDate())){

                var tempstatuses = this.state.statuses;
                var status = tempstatuses.filter(status => status.description === food.data().status)[0];

                if(food.data().turn === "lunch"){
                    for (let i = 0; i < this.guestQty(food.data().idDiner); i++) {
                        status.lunchs++;
                    }
                }else if (food.data().turn === "dinner"){
                    for (let i = 0; i < this.guestQty(food.data().idDiner); i++) {
                        status.dinners++;
                    }
                }

                this.setState({
                    statuses : tempstatuses
                });
            }
        });
        this.setState({
            loading : false
        });
    }

    dateToYYYYMMDD(aDate){
        return (aDate.getFullYear() + "-" + (aDate.getMonth() + 1) + "-" + aDate.getDate());
    }

    showTable(){
        return(
            <div>
                <h3>Today's Summary</h3>
                <table style={{fontSize: "24px", width: "90%"}}>
                    <thead>
                        <tr>
                            <th>Option</th>
                            <th>Lunch</th>
                            <th>Dinner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.statuses.map(status => {
                            return(
                                <tr>
                                    <td>
                                        {status.description}
                                    </td>
                                    <td>
                                        {status.lunchs}
                                    </td>
                                    <td>
                                        {status.dinners}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    render(){
        var style;
        if(this.props.show)
            style = {display : "flex"}
        else
            style = {display : "none"}

        return(
            <div className="EditOptions" style={style}>
                {(this.state.loading) ? <Spinner show={this.state.loading} /> : this.showTable()}
                <a onClick={this.props.close}>close</a>
            </div>
        )
    }
    
}

export default Summary;