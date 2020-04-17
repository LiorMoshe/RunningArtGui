import React from "react";
import Button from "@material-ui/core/Button";
import axios from 'axios';
// import './UploadButton.css';

export default class UploadButton extends React.Component {

    constructor(props) {
        super(props);
        this.image = null;
    }

    async sendImage(event) {
        event.preventDefault();
        let data = {};
        if (this.props.mode === "I") {
            if (Object.keys(this.props.image).length === 0 && this.props.image.constructor === Object) {
                alert("Requested to send in image mode but there is no image, insert image!");
                return;
            }
            data = {
                "Image": this.props.image,
                "Position": this.props.drawingPos, "Distance": this.props.distance
            };
        } else {
            data = {
                "Text": this.props.text,
                "Position": this.props.drawingPos, "Distance": this.props.distance
            };
        }

        const response = await axios.post("http://localhost:5000/polylines",data);

        let parseCoordsFormat = (coords)=>{
            let parsedCoords = [];
            coords.forEach((coord)=>{
                parsedCoords.push({"lat": parseFloat(coord[0]), "lng": parseFloat(coord[1])});
            });
            return parsedCoords;
        };

        // Reformat the response and update the paths coordinates.
        console.log("Received data: ", response.data);
        let resultCoords = response.data.result;
        this.props.updateNodes(response.data.nodes);
        // let pathCoords = parseCoordsFormat(coords);
        let pathResult = parseCoordsFormat(resultCoords);

        // Update the drawn coordinates used in the given Polyline.
        this.props.updatePath(parseCoordsFormat(response.data.segments));
        // this.props.updatePath(segments);
        this.props.updateResult(pathResult);
    }

    render() {
        return (
            <div>
                    <Button variant="contained" color="primary" component="span"
                            onClick={async (event) => {await this.sendImage(event);}}
                            // onClick={this.sendImage.bind(this)}>
                        >
                        Send
                    </Button>
            </div>
        )
    }

}