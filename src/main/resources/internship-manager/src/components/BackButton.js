import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

export default function BackButton() {

    const history = useHistory()

    const goBack = () => history.goBack();

    return (
        <IconButton
            onClick={() => goBack()}>
            <KeyboardBackspaceIcon />
            <Typography>Retour</Typography>
        </IconButton>
    )
}