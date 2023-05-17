import React, {useState, useEffect} from "react";

import axiosInstance from "../custom_axios";

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Divider from "@mui/material/Divider";
import { Grid } from "@mui/material";


function AdvertismentDetail(){

    const [add, setAdd] = useState(null);
    const [error, setError] = useState('')
    const path = window.location.pathname.split('/')
    let advertisment_id = path[path.length - 1]
    // let add_description = ''

    useEffect(() => {
        axiosInstance.get(`/advertisments/${advertisment_id}`).
        then((response) => {
            console.log(response.data)
            setAdd(response.data)
            // add_description = response.data.description.split('\n').slice(0, -1);

        }).
        catch((error) => {
            console.log(error)
            setError(error.message)
        })
    }, [])

    

    if (error) return <h3 style={{textAlign: 'center', marginTop: '2%'}}>{error}</h3>

    if (add){
        return (
            <Container maxWidth="lg" style={{marginTop: '2%'}}>
                <div style={{textAlign:'center'}}>
                    <img 
                        height="360px"
                        width="640px"
                        src={(add.uploaded_advertisment === null) ? add.scraped_advertisment.image_url : add.uploaded_advertisment.image}
                        alt={add.slug}
                    />
                </div>
                        
                <Card sx={{ display: 'flex' }} style={{marginTop:'3%'}}>
                    <CardContent sx={{ flex: 1 }}>
                        <Typography component="h2" variant="h3" style={{textAlign:'center'}}>
                            {add.title}
                        </Typography>

                        <Grid container style={{textAlign:'center', marginTop:'2%'}}>
                            <Grid item xs={12} md={6}>
                                <Typography component="h2" variant="h4">
                                    { add.price ? `Rs. ${add.price}` : "Contact For Price"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="text.secondary">
                                    Add Published On {add.publish_date}
                                </Typography>
                            </Grid>
                        </Grid>
                    
                        <Grid container>
                            {add.description.split('\n').map((row) => (
                                <Grid item xs={12} md={6}>
                                    <Divider />
                                    <p>{row}</p>
                                    {/* <Divider /> */}
                                </Grid>                                
                            ))}
                        </Grid>
                        

                        { add.scraped_advertisment && (
                        <Typography component="h2" variant="h5">
                            You can Checkout the orignal Advertisment 
                            <Link href={add.scraped_advertisment.advertisment_url} style={{marginLeft:'1%'}}>
                                Here
                            </Link>
                        </Typography>
                        )}
                        
                    </CardContent>
                </Card>
            </Container>
        )
    }
    else{
        <p></p>
    }
    
}

export default AdvertismentDetail;
