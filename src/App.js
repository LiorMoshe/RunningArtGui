import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polyline, Marker, InfoWindow} from "react-google-maps"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'semantic-ui-react'
import CustomDrawingManagerControl from "./CustomDrawingManagerControl";
import UploadButton from "./UploadButton/UploadButton";
import Select from '@material-ui/core/Select';
import SendButton from "./SendButton/SendButton";
import {TextField} from "@material-ui/core";
import shortid from "shortid";
import axios from 'axios';
import OSMNode from "./OSMNode";



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
    // let [nodes, updateNodes] = useState([]);

    // Declare a state for the nodes map.
    let [nodesMap, updateNodesMap] = useState({});

    // Declare a state for the run's distance.
    let [distance, updateDist] = useState(1000);

    // Declare a state for the drawn text.
    let [text, updateText] = useState('H');

    // Declare a state for the saved image.
    let [image, updateImage] = useState({});

    // Declare a state for the mode.
    let [mode, updateMode] = useState('I');

    // Declare path for all of dijkstra's paths.
    let [paths, updatePaths] = useState([]);

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

    let symbolThreePink = {
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
          return (event)=>{
              if (event !== undefined) {
                  updatePosition([event.latLng.lat(), event.latLng.lng()]);
                  updateClickCallback(()=>{return (event) => {}});
              }
          }
          }
      );
    };

    useEffect(()=>{
        async function getNodes() {
            const response = await axios.get("http://localhost:5000/nodes");
            console.log("Response Data: ",response);
            console.log(response.data.nodes_map);
            // updateNodes(response.data.nodes);
            updateNodesMap(response.data.nodes_map);
        }

        getNodes();
    },[]);

    var google = window.google;

    let getString = (point, segments)=>{
        let finalString = "";
        segments.forEach((otherPoint, idx)=>{
            if (Math.abs(point.lat - otherPoint.lat) < 1e-20 && Math.abs(point.lng - otherPoint.lng) < 1e-20) {
                if (finalString.length > 0) {
                    finalString += ',';
                }
                finalString += idx.toString();
            }
        });
        return finalString;
    };

    // Get the label string with
    let getStringWithPath = (node_id, dijkstraPaths)=>{
        let finalString = "";
        let cnt = 0;
        dijkstraPaths.forEach((path, idx)=>{
                path.forEach((otherPoint, _)=>{
                    if (parseFloat(otherPoint.id) === parseFloat(node_id)) {
                        if (finalString.length > 0) {
                            finalString += ',';
                        }
                        finalString += idx.toString() + ":" + cnt.toString();
                    }
                    cnt++;
                });
        });
        return finalString;
    };

    return (<GoogleMap
        defaultZoom={16}
        defaultCenter={{lat: 32.0596552, lng: 34.7724450}}
        onClick={(event)=>onClickCallback(event)}
    >
        <CustomDrawingManagerControl marginLeft={4} marginTop={12} >
            <button onClick={(e)=>{choosingLocationClicked(e)}}>Choose Drawing Location</button>
            <UploadButton updateImage={updateImage} drawingPos={drawingPosition} updatePath={pathUpdate} updateResult={updateResult}
                />

                <TextField defaultValue={text} id={shortid.generate()} onBlur={(event)=>
                    updateText(event.target.value)} id={shortid.generate()}
                />
                <div/>
                    <TextField defaultValue={distance} onBlur={(event)=>
                        updateDist(parseFloat(event.target.value))} id={shortid.generate()}
                               />
            <div/>
            <Select
                native
                value={mode}
                onChange={(event)=>{updateMode(event.target.value)}}
                inputProps={{
                    name: 'age',
                    id: 'age-native-simple',
                }}
            >
                <option value={'T'}>Text</option>
                <option value={'I'}>Image</option>
            </Select>

            <SendButton distance={distance} mode={mode}
                text={text} image={image} drawingPos={drawingPosition} updatePath={pathUpdate} updateResult={updateResult}
                        updatePaths={updatePaths}
            />

        </CustomDrawingManagerControl>

        {segments.map((segment,_)=> {return <Marker label={getString(segment, segments)} icon={symbolThree} position={segment}/>})}

        <Polyline
            path={segments}
            geodesic={true}
            options={{
                strokeColor: "#ff2527",
                strokeOpacity: 0.75,
                strokeWeight: 2,
                icons: [
                    {symbolThree}
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
            }}
        />
        }
        {Object.keys(nodesMap).map(node_id => {
            return <OSMNode label={getStringWithPath(node_id, paths)} icon={starSymbolCyan} lat={nodesMap[node_id][0]} lng={nodesMap[node_id][1]} info={node_id.toString()}/>
        })}
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
