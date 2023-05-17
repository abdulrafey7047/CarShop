import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Carousel from 'react-material-ui-carousel'
import { Container } from '@mui/system';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Card, CardContent, CardMedia, Grid, Typography, Link, Paper, Box, Button, CardActions } from '@mui/material';

import sagaActions from '../app/sagaActions';
import '../Home.css'


function Home(){

    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch({ type: sagaActions.FETCH_CATEGORIES_SAGA })
        dispatch({ type: sagaActions.FETCH_ADVERTISMENT_SAGA, payload: {'filterString': '/'} })
    }, [])

    const handleCategoryPagination = (url) => {
        const page_num_query = url.split('?').at(-1)
        dispatch({ type: sagaActions.FETCH_CATEGORIES_SAGA, payload: {'filterString': `?${page_num_query}`} })
    }

    const categories = useSelector((state) => state.categories.categories)
    const adds = useSelector((state) => state.adds.adds_data)

    return (
        <>
        <Container maxWidth="md" component="main" style={{textAlign:'center'}}>
            <Typography component="h1" variant="h4" style={{marginTop:'5%'}}>
               Latest Advertisments
            </Typography>
            <Carousel height="200px" className="carousel">
                {adds.results.map((add, i) => {
                        return ( add.scraped_advertisment || add.uploaded_advertisment) && (
                            
                            <Grid container 
                                style={{borderBottom:'1px solid rgba(224, 224, 224, 1)', marginTop:'3%',
                                        boxShadow: '1px 1px rgba(224, 224, 224, 1)'
                                }}>
                                <Grid item md={6}>
                                <img 
                                    height="180px"
                                    width="320px"
                                    src={(add.uploaded_advertisment === null) ? add.scraped_advertisment.image_url : add.uploaded_advertisment.image}
                                />
                                </Grid>
                                <Grid item md={6} style={{textAlign:'center', paddingTop:'4%'}}>
                                    <Link href={`/advertisments/${add.id}`}
                                        style={{textDecoration:'None', color:'black'}}>
                                        <Typography component="h1" variant="h5">
                                            {add.title}
                                        </Typography>
                                    </Link>
                                    {add.description.substr(0, 100)}...
                                </Grid>
                            </Grid>
                            )
                    })}
                    
            </Carousel>
        </Container>

        <Container maxWidth="md" component="main" style={{marginTop:'5%'}}>
            <Typography component="h1" variant="h3" style={{textAlign:'center', marginBottom:'3%'}}>
                Car Categories
            </Typography>
            <Grid container spacing={5} alignItems="flex-end">
                
                {categories.results.map((category) => { return (
                    <Grid item key={category.id} xs={12} md={3}>
                        <Card>
                            <Link href={"/advertisments?category=" + category.name }>
                                <CardMedia
                                    component="img"
                                    sx={{pt: '1%'}}
                                    image="https://cdn3.vectorstock.com/i/1000x1000/87/02/auto-car-logo-template-icon-vector-21468702.jpg"
                                    alt="random"
                                />
                            </Link>
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="h2"
                                    style={{textAlign:'center'}}
                                >
                                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                                </Typography>
                                <div>
                                    <Typography
                                        component="p"
                                        color="textPrimary"
                                    ></Typography>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                    );
                })}
                
            </Grid>
            <Grid container style={{marginTop:'3%', marginBottom:'5%'}}>
                <Grid item md={6}>
                    <Button onClick={() => handleCategoryPagination(categories.previous)}><ArrowBackIosIcon /></Button>
                </Grid>
                <Grid item md={6} style={{textAlign:'right'}}>
                    <Button onClick={() => handleCategoryPagination(categories.next)}><ArrowForwardIosIcon /></Button>
                </Grid>
            </Grid>
        </Container>
        </>
    )
}


export default Home
