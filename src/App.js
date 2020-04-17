import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polyline, Marker } from "react-google-maps"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import CustomDrawingManagerControl from "./CustomDrawingManagerControl";
import UploadButton from "./UploadButton";


const AnyReactComponent = ({text}) => <div>{text}</div>;


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
    let [segments, pathUpdate] = useState([]);

    let [resultCoordinates, updateResult] = useState([]);

    // Declare state for the chosen drawing position based on the user's request.
    let [drawingPosition, updatePosition] = useState([]);

    // Declare a state for osm's nodes, they will be drawn as markers on the map.
    let [nodes, updateNodes] = useState([]);

    let [onClickCallback, updateClickCallback] = useState(()=>{
        return (event)=> {};
    });
    let lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 4
    };

    let symbolThree = {
        path: 'M -8,-8 8,8 M 8,-8 -8,8',
        strokeColor: '#292',
        strokeWeight: 4
    };

    let symbolThreeBlue = {
        path: 'M -8,-8 8,8 M 8,-8 -8,8',
        strokeColor: 'pink',
        strokeWeight: 2
    };

    let starSymbolCyan = {
        path: 'M -2,-2 2,2 M 2,-2 -2,2',
        strokeColor: 'cyan',
        strokeWeight: 2
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

    var google = window.google;

    let getString = (point, segments)=>{
        console.log("Segments: ", segments);
        console.log("Point: ", point);
        let finalString = "";
        segments.forEach((otherPoint, idx)=>{
            if (Math.abs(point.lat - otherPoint.lat) < 1e-20 && Math.abs(point.lng - otherPoint.lng) < 1e-20) {
                if (finalString.length > 0) {
                    finalString += ',';
                }
                finalString += idx.toString();
            }
        });
        console.log("Final String: ", finalString);
        return finalString;
    };

    return (<GoogleMap
        defaultZoom={16}
        defaultCenter={{lat: 32.0596552, lng: 34.7724450}}
        onClick={(event)=>onClickCallback(event)}
    >
        <CustomDrawingManagerControl marginLeft={4} marginTop={12} >
            <button onClick={(e)=>{choosingLocationClicked(e)}}>Choose Drawing Location</button>
            <UploadButton drawingPos={drawingPosition} updatePath={pathUpdate} updateResult={updateResult}
                updateNodes={updateNodes}/>
        </CustomDrawingManagerControl>

        {segments.map(segment=> segment.map((point, idx) =><Marker label={getString(point, segment)} icon={symbolThree} position={point}/>))}

        {segments.map(segment=><Polyline
            path={segment}
            geodesic={true}
            options={{
                strokeColor: "#ff2527",
                strokeOpacity: 0.75,
                strokeWeight: 2,
                icons: [
                    {symbolThree}
                ]
            }}
        />)}


        {resultCoordinates.map((point, idx)=><Marker label={getString(point, resultCoordinates)} icon={symbolThreeBlue}  position={point}/>)}
        <Polyline
            path={resultCoordinates}
            geodesic={true}
            options={{
                strokeColor: "blue",
                strokeOpacity: 0.75,
                strokeWeight: 2,
            }}
        />

        {/*{nodes.map(node=><Marker icon={starSymbolCyan} position={{"lat": node[0], "lng":node[1]}}/>)}*/}
        {drawingPosition.length !== 0 && <Marker position={{ lat: drawingPosition[0], lng: drawingPosition[1] }}/>}
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
