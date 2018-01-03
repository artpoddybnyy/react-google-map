import React, {Component} from 'react';
import { withScriptjs, withGoogleMap, GoogleMap} from "react-google-maps"
import {Link} from 'react-router-dom';
import {MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel";

const customMarkerStyle = {
    backgroundColor: "red", fontSize: "16px", padding: "16px", borderRadius: "50%"
};

const GoogleMapComp = withScriptjs(withGoogleMap(props =>

    <GoogleMap
        defaultZoom={11}
        defaultCenter={{ lat: 49.990304, lng: 36.232535 }}>

        <MarkerWithLabel
            position={{ lat: props.userCoords.lat, lng: props.userCoords.lng }}
            labelAnchor={{x: 30, y: 90}}
            labelStyle={customMarkerStyle}
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
               coords: {lat: null, lng: null},
            }
        }

        getCords = () => {
            if (navigator && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    this.setState({coords: {lat: position.coords.latitude, lng: position.coords.longitude}});
                }, error => {
                    console.log(error)
                });
            }
        };

    componentWillMount() {
        this.getCords();
        console.log(this.props.match.params);
    }

    componentDidMount() {
        this.delayedShowMarker();
    }

    delayedShowMarker = () => {
        setTimeout(() => {
            this.setState({ isMarkerShown: true })
        }, 3000)
    };

    handleMarkerClick = () => {
        this.setState({ isMarkerShown: false });
        this.delayedShowMarker()
    };

    render() {
        return (
            <div>
                <Link to={`${this.props.match.url}/${this.state.coords.lat}/${this.state.coords.lng}`}>get url with your coords</Link>
                <GoogleMapComp
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCAA_SNg2m0lVDs7_-CVt6n2fJLr6_xcpA&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `800px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    onMarkerClick={this.handleMarkerClick}
                    isMarkerShown={this.state.isMarkerShown}
                    userCoords={{lat: this.state.coords.lat, lng:  this.state.coords.lng}}
                    senderCoords={{lat: this.props.match.params.lat, lng:  this.props.match.params.lng}}

                />
            </div>
        );
    }
}
