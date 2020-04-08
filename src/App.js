import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polyline, Marker } from "react-google-maps"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import CustomDrawingManagerControl from "./CustomDrawingManagerControl";
import UploadButton from "./UploadButton";

const MyMapComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAYF8KmrqIUJ1F33q7YsAtcS1odJ3fdR9s&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `800px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)((props) => {
    // Declare a state for the coordinates drawn for the line segments.
    let [pathCoordinates, pathUpdate] = useState([]);

    let [resultCoordinates, updateResult] = useState([]);

    // Declare state for the chosen drawing position based on the user's request.
    let [drawingPosition, updatePosition] = useState([]);

    let [onClickCallback, updateClickCallback] = useState(()=>{
        return (event)=> {};
    });
    let lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 4
    };

    let choosingLocationClicked = (e)=>{
        e.preventDefault();
      updateClickCallback(()=> {
              // (event)=>{}
          return (event)=>{
              if (event !== undefined) {
                  updatePosition([event.latLng.lat(), event.latLng.lng()]);
                  updateClickCallback(()=>{return (event) => {}});
              }
          }
          }
      );
    };

    return (<GoogleMap
        defaultZoom={8}
        defaultCenter={{lat: 50.7475373, lng: 7.1580004}}
        onClick={(event)=>onClickCallback(event)}
    >
        <CustomDrawingManagerControl marginLeft={4} marginTop={12} >
            <button onClick={(e)=>{choosingLocationClicked(e)}}>Choose Drawing Location</button>
            <UploadButton drawingPos={drawingPosition} updatePath={pathUpdate} updateResult={updateResult}/>
        </CustomDrawingManagerControl>

        {/*<CustomDrawingManagerControl marginLeft={180} marginTop={12}></CustomDrawingManagerControl>*/}

        {/* Polyline which drawn the line segments which will be received from the server.*/}
        <Polyline
            path={pathCoordinates}
            geodesic={true}
            options={{
                strokeColor: "#ff2527",
                strokeOpacity: 0.75,
                strokeWeight: 2,
                icons: [
                    {
                        icon: lineSymbol,
                        offset: "0",
                        repeat: "20px"
                    }
                ]
            }}
        />

        <Polyline
            path={resultCoordinates}
            geodesic={true}
            options={{
                strokeColor: "blue",
                strokeOpacity: 0.75,
                strokeWeight: 2,
                icons: [
                    {
                        icon: lineSymbol,
                        offset: "0",
                        repeat: "20px"
                    }
                ]
            }}
        />
        {drawingPosition.length !== 0 && <Marker position={{ lat: drawingPosition[0], lng: drawingPosition[1] }}/>}
        {/*{props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} onClick={props.onMarkerClick} />}*/}
    </GoogleMap>);
    }
);


class App extends React.Component{

    render() {

        const mapStyles = {
            width: '100%',
            height: '100%',
        };

        return (
            <MyMapComponent isMarkerShown={true}/>
        );
    }
}

export default App;
