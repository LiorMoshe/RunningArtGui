import React from "react"
import {Marker, InfoWindow, GoogleMap} from "react-google-maps";

export default class OSMNode extends React.Component {

    constructor(props) {
        super(props);

        this.state = {isOpen: false};
    }

    handleToggle = () => {
        this.setState((state,_)=>{
            return {isOpen: !this.state.isOpen}
        })
    };


    render() {

        // {nodes.map(node=>{return (<Marker icon={starSymbolCyan} position={{"lat": node[0], "lng":node[1]}}><InfoWindow position={{"lat": node[0], "lng":node[1]}}><span>Something</span></InfoWindow></Marker>)
        // })}

        return (
            <Marker icon={this.props.icon} label={this.props.label} position={{"lat": this.props.lat, "lng": this.props.lng}} onClick={this.handleToggle.bind(this)}>
                { this.state.isOpen &&
                    <InfoWindow onCloseClick={this.handleToggle.bind(this)}
                                >
                    <span>
                        {this.props.info}
                    </span>
                    </InfoWindow>
                }
            </Marker>
        )
    }
}