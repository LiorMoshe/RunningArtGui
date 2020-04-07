import React, {useEffect, useState} from 'react';
import { createPortal } from 'react-dom';
import { MAP } from 'react-google-maps/lib/constants';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
}));


export default function CustomDrawingManagerControl(
    {marginLeft, marginTop, position = window.google.maps.ControlPosition.TOP_LEFT, children },
    context
) {
    const map = context[MAP];
    const controlDiv = document.createElement('div');
    // const [uploadedImage, updateImage] = useState({});

    // Use effect hook with a cleanup that removes the div from the controls.
    useEffect(() => {
        const controls = map.controls[position];
        const index = controls.length;
        controls.push(controlDiv);
        return () => {
            controls.removeAt(index);
        };
    });

    // let onSubmit = ()=> {
    //   console.log("Fuck yeah");
    // };
    //
    // const classes = useStyles();
    return createPortal(
        <div style={{ marginLeft: marginLeft, marginTop: marginTop }}>
            {children}
            {/*<input*/}
            {/*    accept="image/*"*/}
            {/*    className={classes.input}*/}
            {/*    id="contained-button-file"*/}
            {/*    multiple*/}
            {/*    type="file"*/}
            {/*/>*/}
            {/*<label htmlFor="contained-button-file">*/}
            {/*    <Button variant="contained" color="primary" component="span">*/}
            {/*        Upload*/}
            {/*    </Button>*/}
            {/*</label>*/}
        </div>,
        controlDiv
    );
}

CustomDrawingManagerControl.contextTypes = {
    [MAP]: PropTypes.object,
};