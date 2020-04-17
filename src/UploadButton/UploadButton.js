import React from "react";
import Button from "@material-ui/core/Button";
import axios from 'axios';
// import './UploadButton.css';

export default class UploadButton extends React.Component {

    constructor(props) {
        super(props);
        this.image = null;
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
            this.props.updateImage(reader.result);
            // this.sendImage(reader.result);
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