import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import Unauthenticated from './Unauthenticated';
import axiosInstance from '../custom_axios';
import { setAdvertisments } from '../redux-slices/advertismentSlice';


//Material UI
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import { Link } from '@mui/material';


//Helper Functions
const getCurrentPageNumber = (adds) => {
    let current_page_num = ''
    if (adds.next){
        const next_page_num = (adds.next.match(/page=(.*)&/) || adds.next.match(/page=(.*)/))[1]
        current_page_num = parseInt(next_page_num) - 1
    }
    else if (adds.previous){
        const previous_page_num = (adds.previous.match(/page=(.*)&/) || adds.previous.match(/page=(.*)/))[1]
        current_page_num = parseInt(previous_page_num) + 1
    }
    return current_page_num
}

const handleShare = (url) => {
    navigator.clipboard.writeText(url).then((res) => {
        alert(`Link "${url}" Copied to Clipbaord`)
    })
}


function Profile(){

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [userAdds, setUserAdds] = useState([])

    const username = localStorage.getItem('username')
    const first_name = localStorage.getItem('user_first_name')
    const last_name = localStorage.getItem('user_last_name')
    const current_page_num = getCurrentPageNumber(userAdds)

    useEffect(() => {
        axiosInstance.get(
            'advertisments?user=true'
        ).then((response) => {
            setUserAdds(response.data.results)
        }
        ).catch((error) => {
            console.log(error)
        })
    }, [])

    const handlePagination = (url) => {
        axiosInstance.get(url).
            then((response) => {
                console.log(response)
                dispatch(setAdvertisments(response))
                window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
            }).
            catch((error) => {
                console.log(error)
            })
    }

    //Authentication Check
    if (!username) return <Unauthenticated />

    return (
        <Container>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <h1 style={{textAlign: "center"}}>
                        Welcome { (first_name+last_name) ? `${first_name} ${last_name}` : username }
                    </h1>
                </Grid>
                <Grid item xs={12} md={6} style={{textAlign: "center"}}>
                    <Button 
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/profile/update')}
                    >
                        Update Your Profile
                    </Button>
                </Grid>
                <Grid item xs={12} md={6} style={{textAlign: 'center'}}>
                    <Button 
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/advertisments/create')}
                    >
                        Upload Car Add
                    </Button>
                </Grid>

                <div style={{width:'100%', marginTop:'3%'}}>
                    <Divider  />
                    <Typography component="h2" variant="h4" style={{textAlign:'center', margin:'3%'}}>
                        Your Adds
                    </Typography>
                    <Divider  />
                </div>
                

                <Grid container>
                    { userAdds.map((add) => {
                        return ( (add.uploaded_advertisment || add.scraped_advertisment) && (
                            <Grid item xs={12} md={12} key={add.slug}>
                                <Grid container 
                                    style={{borderBottom:'1px solid rgba(224, 224, 224, 1)', marginTop:'3%',
                                            boxShadow: '1px 1px rgba(224, 224, 224, 1)'
                                    }}>
                                    <Grid item md={3}>
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
                                    <Grid item md={1} style={{paddingTop:'6%'}}>
                                        <Button onClick={ () => handleShare(`${window.location.host}/advertisments/${add.id}`) }>
                                            <ShareIcon />
                                        </Button>
                                    </Grid>
                                    <Grid item md={1} style={{paddingTop:'6%'}}>
                                        <Button onClick={() => navigate(`/advertisments/update/${add.id}`)}>
                                            <EditIcon />
                                        </Button>
                                    </Grid>
                                    <Grid item md={1} style={{paddingTop:'6%'}}>
                                        <Button onClick={() => navigate(`/advertisments/delete/${add.id}`)}>
                                            <DeleteIcon />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))})
                    }
                </Grid>
            </Grid>

            <Grid contaier style={{margin:'5%'}}>
                <Grid item xs={12} md={12}>
                    { userAdds.previous && (
                        <Button onClick={ () => handlePagination(userAdds.previous)}>
                            {current_page_num - 1}
                        </Button>
                    )}
                    { (userAdds.previous || userAdds.next) && (
                        <Button variant="contained">
                            {current_page_num}
                        </Button>
                    )}
                    { userAdds.next && (
                        <Button onClick={ () => handlePagination(userAdds.next)}>
                            {current_page_num + 1}
                        </Button> 
                    )}
                </Grid>
            </Grid>
        </Container>
    )
}

export default Profile
