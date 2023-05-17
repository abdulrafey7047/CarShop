import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

import Unauthenticated from './Unauthenticated';
import { axiosInstanceForFiles } from '../custom_axios';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CameraAltIcon from '@mui/icons-material/CameraAlt';


function AdvertismentCreate(){

	const user_id = localStorage.getItem('user_id')

    const navigate = useNavigate()
    const [formData, setFormData] = useState({})
    const [errors, setErrors] = useState({})
	const [image, setImage] = useState(null)

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
		
		axiosInstanceForFiles.post(
			`advertisments/create/`, 
			{
				...formData,
				category: {'name': formData.category},
				uploaded_advertisment: {
					image: image ? image[0] : null,
					uploaded_by_user: user_id},
				scraped_advertisment: {user_id},
			}
		)
		.then((response) => {
			navigate('/profile');
		}).catch((error) =>{
			console.log(error.response)
			if (error.response === undefined) navigate('/profile')
			setErrors(error.response.data)
			
		});
	};

	//Authentication Check
	if (!user_id) return <Unauthenticated />
	
    return (
        <Container component="main" maxWidth="xs">
			<CssBaseline />
			<div>
				<Typography component="h1" variant="h5" style={{textAlign:'center', marginTop:'15%', marginBottom:'5%'}}>
					Upload New Advertisment
				</Typography>
				<form noValidate encType="multipart/form-data">
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								error={errors.title}
								variant="outlined"
								required
								fullWidth
								id="title"
								label="Title"
								name="title"
								autoComplete="title"
								onChange={handleChange}
								helperText={errors.title && errors.title}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								error={errors.category}
								variant="outlined"
								required
								fullWidth
								id="category"
								label="Category"
								name="category"
								autoComplete="category"
								value={formData.category}
								onChange={handleChange}
								helperText={errors.category && errors.category.name}
							/>
						</Grid>
                        <Grid item xs={12}>
							<TextField
								error={errors.price}
								variant="outlined"
								required
								fullWidth
								id="price"
								label="Price"
								name="price"
								autoComplete="price"
								value={formData.price}
								onChange={handleChange}
								helperText={errors.price && errors.price}
							/>
						</Grid>
                        <Grid item xs={12}>
							<TextField
								error={errors.description}
								variant="outlined"
								required
								fullWidth
								id="description"
								label="Description"
								name="description"
								autoComplete="description"
								onChange={handleChange}
								multiline
								minRows={10}
								helperText={errors.description && errors.description}
							/>
						</Grid>
						<Grid item xs={12}>
							<Button
								variant="contained"
								component="label"
								>
								{/* Uoload Car Image */}
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
								Upload Add
							</Button>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
    )
}

export default AdvertismentCreate
