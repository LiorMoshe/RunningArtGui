import React from "react";
import Button from "@material-ui/core/Button";
import axios from 'axios';

export default class UploadButton extends React.Component {

    constructor(props) {
        super(props);
        this.image = null;
    }

    async sendImage(image) {
        const response = await axios.post("http://localhost:5000/polylines",{"Image": image,
        "Position": this.props.drawingPos});

        let parseCoordsFormat = (coords)=>{
        let parsedCoords = [];
          coords.forEach((coord)=>{
              parsedCoords.push({"lat": parseFloat(coord[0]), "lng": parseFloat(coord[1])});
          });
            return parsedCoords;
        };

        // Reformat the response and update the paths coordinates.
        let coords = response.data.segments;
        let resultCoords = response.data.result;
        let nodes = response.data.nodes;
        this.props.updateNodes(response.data.nodes);
        console.log(response);
        let pathCoords = parseCoordsFormat(coords);
        let pathResult = parseCoordsFormat(resultCoords);

        // Update the drawn coordinates used in the given Polyline.
        this.props.updatePath(pathCoords);
        this.props.updateResult(pathResult);
    }

    setImage(event) {
        event.preventDefault();
        if (this.props.drawingPos.length === 0) {
            alert("You must choose a drawing position before uploading your image.")
            return;
        }
        let reader = new FileReader();
        let file = event.target.files[0];

        reader.onloadend = () => {
            this.sendImage(reader.result);
        };

        reader.readAsDataURL(file);
    }

    render() {
        return (
            <div>
                <input
                    accept="image/*"
                    style={{display: "none"}}
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={this.setImage.bind(this)}
                />
                <label htmlFor="contained-button-file">
                    <Button variant="contained" color="primary" component="span">
                        Upload
                    </Button>
                </label>
            </div>
        )
    }

}