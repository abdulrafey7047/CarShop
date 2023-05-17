import React from 'react';

//Material UI
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';


function Copyright() {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <Link to="/" color="inherit">
          CarShop
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}

export default Copyright;