import React, {Component} from 'react';
import './App.css';
import { Route, Switch, Link} from 'react-router-dom';
import HelloWorldComponent from './components/HelloWorldComponent';
import PostsService from './components/PostsService';
import GoogleMapComponent from './components/GoogleMapComponent';

export default class App extends Component {

    render() {
        return (
            <div className="main-comp">
                <h1 >React.js application</h1>
                <div className="nav-bar">
                    {/*<div className="nav-bar-item"><Link to='/hello-world'>To hello world</Link></div>*/}
                    <div className="btn-main"><Link to='/posts'> To posts list</Link></div>
                    <div className="btn-main"><Link to='/google-map'> To Maps</Link></div>
                </div>
                    <Switch>
                        <Route exact path='/hello-world' component={HelloWorldComponent}/>
                        <Route path='/posts' component={PostsService}/>
                        <Route path= '/google-map/:hash/' component={GoogleMapComponent}/>
                        <Route path= '/google-map'  component={GoogleMapComponent}/>
                    </Switch>
            </div>

        );
    }
}


