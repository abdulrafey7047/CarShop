import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Unauthorized from './Unauthorized';
import Unauthenticated from './Unauthenticated';
import axiosInstance from '../custom_axios';
import { axiosInstanceForFiles } from '../custom_axios';

//Material UI
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CameraAltIcon from '@mui/icons-material/CameraAlt';


function AdvertismentUpdate(){

    const navigate = useNavigate();
    const [formData, setFormData] = useState({})
    const [addNotFoundError, setAddNotFoundError] = useState('')
    const [formErros, setFormErrors] = useState({})
	const [image, setImage] = useState(null)

    const advertisment_id = useParams().id
	const current_user_id = localStorage.getItem('user_id')

    //Fetching Current Addvertisment Data 
    useEffect(() => {
        axiosInstance.get(`/advertisments/${advertisment_id}`).
        then((response) => {
            setFormData({
                title: response.data.title,
                category: response.data.category.name,
                description: response.data.description,
                price: response.data.price ? response.data.price : '',
				advertisment_owner_id: response.data.uploaded_advertisment.uploaded_by_user
            })
        }).
        catch((error) => {
            // console.log(error)
            setAddNotFoundError(error.message)
        })
    }, [])

	const handleChange = (e) => {
		if (e.target.name === 'image'){
			setImage(e.target.files)
		}
		else{
			setFormData({
				...formData,
				[e.target.name]: e.target.value,
			});
		}        
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		axiosInstanceForFiles.put(
			`advertisments/update/${advertisment_id}/`, 
			{
				...formData,
				category: {'name': formData.category},
				uploaded_advertisment: {
					image: image ? image[0] : null,
					uploaded_by_user: current_user_id},
				scraped_advertisment: {current_user_id},
			}
		)
		.then((response) => {
			console.log('SUCCESS')
			console.log(response)
			navigate('/profile');
		}).catch((error) =>{
			console.log(error.response)
			if (error.response === undefined) navigate('/profile')
			setFormErrors(error.response.data)
			
		});
	};

	//Authentication Check
	if (!current_user_id) return <Unauthenticated />

	//Authorization Check
	if (current_user_id != formData.advertisment_owner_id) return <Unauthorized />

	//Non Existent Advertisment Check
    if (addNotFoundError){
        return (
            <Container style={{textAlign: "center", marginTop:"3%"}}>
                <Typography component="h1" variant="h3">
                    Add Not Found
                </Typography>
            </Container>
        )
    }

    return (
        <Container component="main" maxWidth="xs">
			<CssBaseline />
			<div>
				<Typography component="h1" variant="h5" style={{textAlign:'center', marginTop:'15%', marginBottom:'5%'}}>
					Update Advertisment
				</Typography>
				<form noValidate>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								error={Boolean(formErros.title)}
								variant="outlined"
								required
								fullWidth
								id="title"
								label="Title"
								name="title"
								autoComplete="title"
                                value={formData.title ? formData.title : ""}
								onChange={handleChange}
								helperText={formErros.title && formErros.title}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								error={Boolean(formErros.category)}
								variant="outlined"
								required
								fullWidth
								id="category"
								label={formData.category ? '' : "Category"} 
								name="category"
								autoComplete="category"
								value={formData.category}
								onChange={handleChange}
								helperText={formErros.category && formErros.category.name}
							/>
						</Grid>
                        <Grid item xs={12}>
							<TextField
								error={Boolean(formErros.price)}
								variant="outlined"
								required
								fullWidth
								id="price"
								label={formData.price ? '' : "Price"}
								name="price"
								autoComplete="price"
								value={formData.price}
								onChange={handleChange}
								helperText={formErros.price && formErros.price}
							/>
						</Grid>
                        <Grid item xs={12}>
							<TextField
								error={Boolean(formErros.description)}
								variant="outlined"
								required
								fullWidth
								id="description"
								label={formData.description ? '' : "Description"} 
								name="description"
								autoComplete="description"
								onChange={handleChange}
                                value={formData.description}
								multiline
								minRows={10}
								helperText={formErros.description && formErros.description}
							/>
						</Grid>
						<Grid item xs={12}>
							<Button
								variant="contained"
								component="label"
								>
								Upload Car Image <CameraAltIcon />
								<input
									type="file"
									hidden
									name="image"
									onChange={handleChange}
								/>
							</Button>
							{image && <h3>{image[0].name}</h3>}
						</Grid>
						<Grid item xs={12}>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							onClick={handleSubmit}
						>
							Update Add
						</Button>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
    )
}

export default AdvertismentUpdate
