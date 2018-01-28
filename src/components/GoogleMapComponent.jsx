import React, {Component} from 'react';
import { withScriptjs, withGoogleMap, GoogleMap} from "react-google-maps"
import {MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel";
import Modal from 'react-modal';



const GoogleMapComp = withScriptjs(withGoogleMap(props =>


    <GoogleMap
        defaultZoom={11}
        defaultCenter={{ lat: 49.9935, lng: 36.230382999 }}>

        {  props.userCoords &&
         <MarkerWithLabel
            position={{ lat: props.userCoords.lat, lng: props.userCoords.lng }}
            labelAnchor={{x: 65, y: 90}}
             labelClass={'custom-marker-style'}
            draggable={true}
            onDragEnd={position => {props.moveCoords(position.latLng.lat(), position.latLng.lng());}}
        >
            <div className="label-name">You are here</div>
        </MarkerWithLabel>
        }


        {props.friendsMarkers.map((item, index) => {
            return (
        props.userName !== item.userName ?
            <MarkerWithLabel
                key={index}
                position={{lat: +item.lat, lng: +item.lng }}
                labelAnchor={{x: 65, y: 90}}
                labelClass={'custom-marker-style'}
            >

            <div>{item.userName}</div>
            </MarkerWithLabel> : null
            )}
        )}
    </GoogleMap>

));

export default class GoogleMapComponent extends Component {
        constructor () {
            super();
           this.state = {
               isMarkerShown: false,
               coords: {lat: null, lng: null},
               friendCoords: [{userName: null, lat: null, lng: null}],
               theHash: null,
               hashFromParams: null,
               modalIsOpen: false,
               userName: ''
            };

             // this.websocket = new WebSocket("ws://localhost:1000");
             this.websocket = new WebSocket("wss://node-js-websocket.herokuapp.com");
        }

        getCords = () => {
            if (navigator && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    this.setState({coords: {lat: position.coords.latitude, lng: position.coords.longitude}});
                });
            }
        };

        formHash = () => {
            this.websocket.send(JSON.stringify({theHash: this.state.theHash, lat: this.state.coords.lat, lng: this.state.coords.lng }));
            console.log(this.state.theHash);

        };


    moveMarker = (lat, lng) => {
        this.websocket.send(JSON.stringify({userName: this.state.userName, lat, lng }));
        console.log('координаты ушли после перемещения маркера', lat, lng);
        this.setState({coords: {lat, lng}})
    };

    setName = () => {
        this.setState({userName: this.refs.userName.value, modalIsOpen: false});
        this.getFriendCoords();
        this.websocket.send(JSON.stringify({userName: this.refs.userName.value, lat: this.state.coords.lat, lng: this.state.coords.lng}));
        this.setState({friendCoords: [...this.state.friendCoords,
            {userName: this.refs.userName.value, lat: this.state.coords.lat, lng: this.state.coords.lng}]})
    };


    getFriendCoords = () => {
        this.websocket.onmessage = evt => {
            let parse = JSON.parse(evt.data);
            let friendCoords = this.state.friendCoords;
            let searchUser = friendCoords.map(item => item.userName).indexOf(parse.userName);
            if (searchUser === -1){
                friendCoords.push({userName: parse.userName, lat: parse.lat, lng: parse.lng});
                this.setState({friendCoords: friendCoords});
            } else if (searchUser > -1) {
                friendCoords[searchUser].lat = +parse.lat;
                friendCoords[searchUser].lng = +parse.lng;
                this.setState({friendCoords: friendCoords});
            }
            console.log(friendCoords);
        };

    };

    openModal = () => {
        this.setState({modalIsOpen: true});
    };

    componentWillMount() {
        this.getCords();
        this.setState({theHash: Math.random()});
        this.setState({modalIsOpen: true});
    }

    componentDidMount() {
        this.websocket.onmessage = evt => {
        let friendCoords =[];
          let parse = JSON.parse(evt.data);
           for (let i = 0; i < parse.length; i++) {
             friendCoords.push(parse[i]);
           }
            this.setState({friendCoords: friendCoords});
        };

    }


    render() {
        return (
            <div className="google-cont">
                <Modal
                    isOpen={this.state.modalIsOpen}
                    contentLabel="Example Modal"
                    className="modal-window">
                    <form className="post-form">
                        <label >Enter Name</label>
                        <input className="in" type="text" ref="userName"/>
                        <button className="btn" onClick={this.setName}>Save</button>
                    </form>
                </Modal>

                {/*<button className="btn-main" onClick={this.openModal}>Set name</button>*/}

                {/*<CopyToClipboard onCopy={this.onCopy} text={`artpoddybnyy.github.io/react-starter/#${this.props.match.url}/${this.state.theHash}`}>*/}
                    {/*<button className="btn-main" onClick={this.formHash}>Copy to clipboard you coords</button>*/}
                {/*</CopyToClipboard>*/}

                {/*{this.props.match.params.hash &&  <button className="btn-main" onClick={this.formHash}>Send your coords back</button>}*/}

                <GoogleMapComp
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCAA_SNg2m0lVDs7_-CVt6n2fJLr6_xcpA&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `800px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    userCoords={{lat: this.state.coords.lat, lng:  this.state.coords.lng}}
                    options={{draggable:true}}
                    moveCoords={this.moveMarker}
                    friendsMarkers={this.state.friendCoords}
                    userName={this.state.userName}
                />
            </div>
        );
    }
}
