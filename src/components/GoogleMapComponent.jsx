import React, {Component} from 'react';
import { withScriptjs, withGoogleMap, GoogleMap} from "react-google-maps"
import {MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel";

import {CopyToClipboard} from 'react-copy-to-clipboard';

const customMarkerStyle = {
    backgroundColor: "red", fontSize: "16px", padding: "16px", borderRadius: "50%"
};

const GoogleMapComp = withScriptjs(withGoogleMap(props =>


    <GoogleMap
        defaultZoom={11}
        defaultCenter={{ lat: 49.9935, lng: 36.230382999 }}>


        <MarkerWithLabel
            position={{ lat: props.userCoords.lat, lng: props.userCoords.lng }}
            labelAnchor={{x: 30, y: 90}}
            labelStyle={customMarkerStyle}
            draggable={true}
            onDragEnd={position => {props.moveCoords(position.latLng.lat(), position.latLng.lng());}}
        >

            <div>You</div>
        </MarkerWithLabel>



        {(+props.senderCoords.lat !== props.userCoords.lat) && (props.senderCoords.lng !== props.userCoords.lng) && <MarkerWithLabel
            position={{lat: +props.senderCoords.lat, lng: +props.senderCoords.lng }}
            labelAnchor={{x: 50, y: 90}}
             labelStyle={customMarkerStyle}
        >
            <div>You Friend</div>
        </MarkerWithLabel>}
    </GoogleMap>

));

export default class GoogleMapComponent extends Component {
        constructor () {
            super();
           this.state = {
               isMarkerShown: false,
               // coords: {lat: 49.9935, lng: 36.230382999},
               coords: {lat: null, lng: null},
               friendCoords: {},
               theHash: null,
               hashFromParams: null
            };

             // this.websocket = new WebSocket("ws://localhost:5000");
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
        this.websocket.send(JSON.stringify({theHash: this.state.theHash, lat, lng: lng }));
        console.log('координаты ушли после перемещения маркера', lat, lng);
        this.setState({coords: {lat: lat, lng: lng}})
    };





    getFriendCoords = () => {
        if (this.props.match.params.hash) {
            let hashFromParams = this.props.match.params.hash;
            this.websocket.onmessage = evt => {
                let parse = JSON.parse(evt.data);
                for (let i = 0; i < parse.length; i++) {
                    let parseArr = JSON.parse(parse[i]);
                    if (parseArr.theHash === +hashFromParams){
                        this.setState({friendCoords: {lat: +parseArr.lat, lng: +parseArr.lng}});
                        this.websocket.send(JSON.stringify({ theHash: hashFromParams, lat: this.state.coords.lat, lng: this.state.coords.lng}));
                        console.log('координыты из параметров ушли', this.state.friendCoords);
                    }
                }
            }
        }

        this.websocket.onmessage = evt => {
            console.log('координаты пришли move marker');
            console.log(this.state.theHash);
            let parse = JSON.parse(evt.data);
            if (!parse.length && this.state.coords.lat !== +parse.lat) {
                this.setState({friendCoords: {lat: +parse.lat, lng: +parse.lng}});
                console.log('координаты пришли move marker', this.state.friendCoords);
            }
        }
    };


    componentWillMount() {
        this.setState({theHash: Math.random()});
        this.getCords();

        // this.websocket.onmessage = evt => {
        //     let parse = JSON.parse(evt.data);
        //     if (!parse.length && this.state.theHash === +parse.theHash) {
        //         this.setState({friendCoords: {lat: +parse.lat, lng: +parse.lng}});
        //         console.log('координаты пришли send back', this.state.friendCoords);
        //     }
        // }
    }

    componentDidMount() {
        this.getFriendCoords();

    }


    render() {
        return (
            <div className="google-cont">

                <CopyToClipboard onCopy={this.onCopy} text={`artpoddybnyy.github.io/react-starter/#${this.props.match.url}/${this.state.theHash}`}>
                    <button className="btn-main" onClick={this.formHash}>Copy to clipboard you coords</button>
                </CopyToClipboard>

                {this.props.match.params.hash &&  <button className="btn-main" onClick={this.formHash}>Send your coords back</button>}

                <GoogleMapComp
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCAA_SNg2m0lVDs7_-CVt6n2fJLr6_xcpA&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `800px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    userCoords={{lat: this.state.coords.lat, lng:  this.state.coords.lng}}
                    senderCoords={{lat: this.state.friendCoords.lat, lng: this.state.friendCoords.lng}}
                    options={{draggable:true}}
                    moveCoords={this.moveMarker}
                />
            </div>
        );
    }
}
