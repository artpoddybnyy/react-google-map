import React, {Component} from 'react';
import './App.css';
import {Link} from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import HelloWorldComponent from './components/HelloWorldComponent';
import PostsService from './components/PostsService';
import GoogleMapComponent from './components/GoogleMapComponent';

export default class App extends Component {

    render() {
        return (
            <Router>
            <div className="main-comp">
                <h1 >React.js application</h1>
                <div className="nav-bar">
                    <div className="nav-bar-item"><Link to='/hello-world'>To hello world</Link></div>
                    <div className="nav-bar-item"><Link to='/posts'> To posts list</Link></div>
                    <div className="nav-bar-item"><Link to='/google-map'> To Maps</Link></div>
                </div>
                    <Switch>
                        <Route exact path='/hello-world' component={HelloWorldComponent}/>
                        <Route path='/posts' component={PostsService}/>
                        <Route path='/google-map/:lat/:lng' component={GoogleMapComponent}/>
                        <Route path='/google-map' component={GoogleMapComponent}/>
                    </Switch>
            </div>
            </Router>
        );
    }
}


