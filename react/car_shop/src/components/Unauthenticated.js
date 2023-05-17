import React from "react";

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';


function Unauthenticated(){

    return (
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h4" style={{textAlign:'center', margin:'5%'}}>
                You need to be Logged in to Acces this page
            </Typography>
        </Container>
    )
}

export default Unauthenticated
