import React, {Component} from 'react';
import "./NavBar.css";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome' ;
import {faUserCircle} from '@fortawesome/free-solid-svg-icons';

function NavBar(props){
    return(
        <header>
            <nav className="NavBar">
                <div className="NavBar-container">
                    <section className="NavBar-logo">
                        <img alt={`${props.residence.name} shield`} src={props.residence.shieldURL}></img>
                        <h5>{props.residence.name}</h5> 
                    </section>
                    <section className="NavBar-menu" onClick={() => props.toggleShowMenu()}>
                        <FontAwesomeIcon icon={faUserCircle} />
                        <span>Menu</span>
                    </section>
                </div>
            </nav>
        </header>
    );
}


export default NavBar;