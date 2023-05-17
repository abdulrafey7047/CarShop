import React from "react";

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';


function Unauthorized(){

    return (
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h4" style={{textAlign:'center', margin:'5%'}}>
                You do not have the Authorization to Perform this Action
            </Typography>
        </Container>
    )
}

export default Unauthorized
