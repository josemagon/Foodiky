import React, {Component} from 'react';
import './FoodikyTable.css';
import firebase from 'firebase/app';
import "firebase/firestore";
import daysOfTheWeek from './daysOfTheWeek';


class FoodikyTable extends Component{

    constructor(props){
        super(props);

        this.state = {
            diners : [],
            days : [],
            status : [],
            guests : []
        }

        this.initDays = this.initDays.bind(this);
        this.initStatus = this.initStatus.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.createSelect = this.createSelect.bind(this);
    }

    componentDidMount(){
        const db = firebase.firestore();

        this.initDays();

        this.getDiners(db);

        this.getGuests(db); 

        this.loadFoods(db);

        this.initStatus(db);
       
    }

    initDays(){
        // var day = new Date().getDay();
        // var afterDay = 7 - day;
        // var from = new Date();
        // from.setDate(from.getDate() - day);
        // var to = new Date();
        // to.setDate(to.getDate() + afterDay);

        var from = new Date();

        for (let index = 0; index < 7; index++) {
            var temp_days = this.state.days;
            temp_days.push({"day": index, "date": this.dateToYYYYMMDD(from)});
            this.setState({days : temp_days});
            from.setDate(from.getDate() + 1);
        }
    }

    dateToYYYYMMDD(aDate){
        return (aDate.getFullYear() + "-" + (aDate.getMonth() + 1) + "-" + aDate.getDate());
    }

    dateToDDMM(aDate){
        return (aDate.getDate() + "/" + (aDate.getMonth() + 1));
    }

    initStatus(db){
        db.collection("residences").doc(this.props.residence.idResidence).collection("status").get()
            .then(someStatus => {
                someStatus.forEach(status => {
                    // console.log(status.data());
                    var tempstatus = this.state.status;
                    tempstatus.push(status.data());
                    this.setState({
                        status : tempstatus
                    });
                });
            })
            .catch(function(err){
                console.log(err);
            });
    }

    getDiners(db){
        db.collection("residences").doc(this.props.residence.idResidence).collection("diners").get()
            .then(diners => {
                if(diners){
                    diners.forEach(diner =>{
                        var newDiner = diner.data();
                        newDiner.isGuest = false;
                        newDiner.idDiner = diner.ref.id;
                        this.loadDiner(newDiner);
                    });
                }else{
                    console.log("No records obtained");
                }
                
            });
    }

    getGuests(db){
        db.collection("residences").doc(this.props.residence.idResidence).collection("guests").get()
            .then(diners => {
                if(diners){
                    diners.forEach(diner =>{
                        var newDiner = diner.data();
                        newDiner.isGuest = true;
                        newDiner.idDiner = diner.ref.id;
                        this.loadDiner(newDiner);
                    });
                }else{
                    console.log("No records obtained");
                }
                
            });
    }

    loadDiner(aDiner){
        aDiner.foods = [];
        for (let index = 0; index < this.state.days.length; index++) {
            const element = this.state.days[index];
            aDiner.foods.push({"day": index, "date" : element.date, "turns" : [] });
        }
        var tempdiners = this.state.diners;
        tempdiners.push(aDiner);
        this.setState({
            diners : tempdiners
        });
    }

    loadFoods(db){

        db.collection("residences").doc(this.props.residence.idResidence).collection("foods")
            .where("date", ">=", new Date(this.state.days[0].date) )
            .where("date", "<=", new Date(this.state.days[6].date) )
            .get()
            .then(foods => {
                if(foods){
                    foods.forEach(food =>{
                        var thisfood = food.data();
                        // console.log("Arriving food" , thisfood);
                        var tempdiners = this.state.diners;
                        var thisdiner = tempdiners.filter(diner => diner.idDiner === thisfood.idDiner)[0];
                        // console.log("Diner: " , thisdiner);
                        var thisday = thisdiner.foods.filter(food => food.date === this.dateToYYYYMMDD(thisfood.date.toDate()))[0];
                        // console.log("thiday: " , thisday);
                        thisday.turns.push({"turn" : thisfood.turn, "status": thisfood.status});

                        this.setState({
                            diners : tempdiners
                        });
                    });
                }else{
                    console.log("No records obtained");
                }
                
            });
    }

    checkExistingFood(db, event){
        db.collection("residences").doc(this.props.residence.idResidence).collection("foods")
            .where("date", "==", new Date(event.target.attributes.date.value))
            .where("turn", "==", event.target.attributes.turn.value)
            .where("idDiner", "==", event.target.attributes.iddiner.value)
            .get()
            .then(foods => {
                foods.forEach(food => {
                    food.ref.delete();
                });

                this.addNewFood(db, event);
            });
    }

    addNewFood(db, event){
        if(event.target.value !== ""){
           db.collection("residences").doc(this.props.residence.idResidence).collection("foods").add({
                date : new Date(event.target.attributes.date.value),
                idDiner : event.target.attributes.iddiner.value,
                status : event.target.value,
                turn : event.target.attributes.turn.value
            }); 
        } 
    }

    handleSelectChange(event){
        const db = firebase.firestore();

        this.checkExistingFood(db, event);

        if(event.target.value !== "")
            this.color(event.target, event.target.value)

    }

    color(anElement, aStatus){
        var newBgColor = this.state.status.filter(stat => stat.description == aStatus)[0].color;
        anElement.style.backgroundColor = newBgColor;
        anElement.parentNode.style.backgroundColor = newBgColor;
    }

    createSelect(food, aTurn, anID, isDisabled){
        var defaultvalue = "";
        var defaultColor = "white";
        var rightBorder = "0px";

        if(aTurn === "dinner")
            rightBorder = "2px solid black";

        if(food.turns.filter(turn => turn.turn == aTurn).length > 0){ //there s a record for this turn
            defaultvalue = food.turns.filter(turn => turn.turn == aTurn)[0].status;
            if (this.state.status.filter(stat => stat.description == defaultvalue).length > 0)
                defaultColor = this.state.status.filter(stat => stat.description == defaultvalue)[0].color;
        }

        return(
            <td style={{backgroundColor:defaultColor, borderRight : rightBorder}}>
                <select date={food.date} turn={aTurn} iddiner={anID} onChange={this.handleSelectChange} style={{backgroundColor:defaultColor}} disabled={isDisabled}>
                    <option value=""> </option>
                    {this.state.status.map(stat => {
                        if(stat.description == defaultvalue)
                        return(
                            <option value={stat.description} selected>{stat.description}</option>
                        )
                        else
                            return(
                                <option value={stat.description}>{stat.description}</option>
                            );
                    })}
                </select>
            </td>
        );
    }


    showMe(me){
        if(me){
            return(
                <tr className="myrow">
                    <td className="dinerName">{(me.name) ? me.name : me.email}</td>

                    {me.foods.map(food => {
                        return(
                            <>
                                {this.createSelect(food, "lunch", me.idDiner, false)}
                                {this.createSelect(food, "dinner", me.idDiner, false)}
                            </>
                        )
                    })}
                </tr>
            )
        }else{
            return null;
        }
    }

    show(aDiner){
        if(aDiner){
            var style = {backgroundColor : aDiner.isGuest ? "#c3cfdd" : "white"};

            return(
                <tr style={style}>
                    <td className="dinerName">{(aDiner.name) ? aDiner.name : aDiner.email} {(aDiner.isGuest ? " x " + aDiner.qty : "")}</td>

                    {aDiner.foods.map(food => {
                        var disabled = this.props.isManager ? false : !this.props.residence.friendlyFire;
                        return(
                            <>
                                {this.createSelect(food, "lunch", aDiner.idDiner, disabled)}
                                {this.createSelect(food, "dinner", aDiner.idDiner, disabled)}
                            </>
                        )
                    })}
                </tr>
            )
        }else{
            return null;
        }
    }

    showGuests(){

    }

    render(){
        var me = this.state.diners.filter(diner => diner.idDiner === this.props.user.uid)[0];

        var dinersWithoutMe = [...this.state.diners];
        var myindex = dinersWithoutMe.indexOf(me);
        if(myindex !== -1)
            dinersWithoutMe.splice(myindex, 1);

        return(
            <div className="table-responsive">
                <table className="FoodikyTable">
                    <thead>
                        <tr>
                            <th></th>
                            {this.state.days.map(day =>{
                                return(
                                    <>
                                        <th colSpan="2">{`${daysOfTheWeek[day.day]} ${this.dateToDDMM(new Date(day.date))}`}</th>
                                    </>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        
                        {this.showMe(me)}

                        {dinersWithoutMe.map(diner => {
                            return this.show(diner)
                        })}
                        
                    </tbody>  
                </table>
            </div>
        )
    }
}

export default FoodikyTable;