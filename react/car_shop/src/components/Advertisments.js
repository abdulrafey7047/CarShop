import React, {useState, useRef, useCallback, useEffect} from 'react'; 
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import axiosInstance from '../custom_axios';
import { setAdvertisments } from '../redux-slices/advertismentSlice';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

//Material UI
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ShareIcon from '@mui/icons-material/Share';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Container } from '@mui/system';
import { Grid, Typography, Link, Checkbox } from '@mui/material';


//Declaring Variables
var category_filters = new Set([]);
var price_filters = new Set([]);
let last_query_param = '';
const price_filter_labels = [
    { id: 1, label: 'Below 1,000,000' },
    { id: 2, label: '1,000,000 to 5,000,000' },
    { id: 3, label: '5,000,000 to 10,000,000' },
    { id: 4, label: 'Above 10,000,000' },
]

//Helper Functions
const generateFilterString = (category_filters, price_filters) => {
    let filter_string = '/'

    let category_filter_string = ''
    if (category_filters.size > 0)
        category_filter_string = `category=${Array.from(category_filters).join('+')}`

    let price_filter_string = ''
    if (price_filters.size > 0)
        price_filter_string = `price=${Array.from(price_filters).join('+')}`

    if (category_filter_string && price_filter_string){
        filter_string = `?${category_filter_string}&${price_filter_string}`
    }
    else if (category_filter_string){
        filter_string = `?${category_filter_string}`
    }
    else if (price_filter_string){
        filter_string = `?${price_filter_string}`
    }
    
    return filter_string   
}

const updateFilters = (filter_label, filter_type, addition) => {
    if (filter_type === 'category'){
        if (addition)
            category_filters.add(filter_label)
        else
            category_filters.delete(filter_label)
    }
    else if (filter_type === 'price'){
        if (addition)
            price_filters.add(filter_label)
        else
            price_filters.delete(filter_label)
    }
}

const getCurrentPageNumber = (adds) => {
    let current_page_num = ''
    if (adds.next){
        const next_page_num = (adds.next.match(/page=(.*)&/) || adds.next.match(/page=(.*)/))[1]
        current_page_num = parseInt(next_page_num) - 1
    }
    else if (adds.previous){
        let previous_page_num = (adds.previous.match(/page=(.*)&/) || adds.previous.match(/page=(.*)/))
        if (previous_page_num) previous_page_num = previous_page_num[1]
        current_page_num = parseInt(previous_page_num) + 1
    }
    return current_page_num
}

const handleShare = (url) => {
    navigator.clipboard.writeText(url).then((res) => {
        alert(`Link "${url}" Copied to Clipbaord`)
    })
}


function Advertisments() {

    const dispatch = useDispatch()
    const ref = useRef(null)

    useEffect(() => {
        const categorySearchBar = ref.current.children[0]
        categorySearchBar.style.zIndex = 1000
    }, [])

    //Fetching Filtered Adds
    const fetchFilteredAdvertisments = useCallback(() => {
        let filter_string = '/'
        filter_string = generateFilterString(category_filters, price_filters)
        console.log(filter_string)
        
        axiosInstance.get(`/advertisments${filter_string}`).
            then((response) => {
                dispatch(setAdvertisments(response))
            }).
            catch((error) => {
                console.log(error)
            })
    })

    const handlePriceFilterChange = (event) => {
        // let [filter_type, filter_label] = event.target.name.split('-')
        updateFilters(event.target.name, 'price', event.target.checked)
        fetchFilteredAdvertisments()
    }

    const handleCategorySelect = (item) => {
        setCategoryFilters([...categoryFilters, item.name])
        updateFilters(item.name, 'category', true)
        fetchFilteredAdvertisments()
    }

    const handleCategoryUnSelect = (categoryName) => {
        console.log('Deleting Category:', categoryName)
        setCategoryFilters(categoryFilters =>
            categoryFilters.filter(element => element !== categoryName)
        )
        updateFilters(categoryName, 'category', false)
        fetchFilteredAdvertisments()
    }

    const handlePagination = (url) => {
        axiosInstance.get(url).
            then((response) => {
                // console.log(response)
                dispatch(setAdvertisments(response))
                window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
            }).
            catch((error) => {
                console.log(error)
            })
    }


    //Checking if URL contains a category filter
    const [searchParams, setSearchParams] = useSearchParams();
    const query_param = searchParams.get("category")
    if ((query_param !== last_query_param) && (query_param !== null)){
        last_query_param = query_param
        updateFilters(query_param, 'category', true)
    }

    //Array for displaying Category Filter Chips
    const [categoryFilters, setCategoryFilters] = useState(Array.from(category_filters))

    //Fetching Categoires
    const categories = useSelector((state) => state.categories.categories)
    
    //Getting Adds Data
    const adds = useSelector((state) => state.adds.adds_data)
    const error = useSelector((state) => state.adds.error)
    const searchFieldValue = useSelector((state) => state.adds.searchFieldValue)
    
    const current_page_num = getCurrentPageNumber(adds)

    let data = null;
    if (adds.results) data = adds.results
    else data = adds

    console.log(adds)

    let adds_output = <></>;

    adds_output = (
        <>
        <h1>Car Adds</h1>
        <Typography component="h1" variant="h5">
            { (searchFieldValue) && <legend>You Searched for '{searchFieldValue}'</legend> }
        </Typography>

        <Grid container>
            { data.map((add) => {
                console.log(add.title)
                return ( (add.uploaded_advertisment || add.scraped_advertisment) && (
                    <Grid item xs={12} md={12} key={`${add.slug}-${add.id}`}>
                        <Grid container spacing={2}
                            style={{borderBottom:'1px solid rgba(224, 224, 224, 1)', marginTop:'3%',
                                    boxShadow: '1px 1px rgba(224, 224, 224, 1)'
                            }}>
                            <Grid item md={4}>
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
                            <Grid item md={2} style={{paddingTop:'6%'}}>
                                <Button style={{marginTop:'5%'}}
                                    onClick={() => handleShare(`${window.location.host}/advertisments/${add.id}`)}>
                                    <ShareIcon />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                ))})
            }
        </Grid>
        <Grid contaier style={{margin:'5%'}}>
            <Grid item xs={12} md={12}>
                { adds.previous && (
                    <Button onClick={ () => handlePagination(adds.previous)}>
                        {current_page_num - 1}
                    </Button>
                )}
                { (adds.previous || adds.next) && (
                    <Button variant="contained">
                        {current_page_num}
                    </Button>
                )}
                { adds.next && (
                    <Button onClick={ () => handlePagination(adds.next)}>
                        {current_page_num + 1}
                    </Button> 
                )}
            </Grid>
        </Grid>
        </>
    )

    //Displaying Error Messages
    if (error !== 'no error') adds_output = <p>{error}</p>
    if (!data || data.length === 0) adds_output = <h2>Can not find any adds, sorry</h2>;
   
    return (
            <Grid container>
                <Grid item md={2} style={{marginLeft:'1%', borderRight:"1px solid rgba(224, 224, 224, 1)"}}>
                    <Toolbar color="primary"/>

                    <Divider />
                    <Typography component="h1" variant="h5">
                        Category Filters
                    </Typography>
                    <Divider />

                    <div style={{zIndex:1000, margin:'2%'}} ref={ref}>
                        <ReactSearchAutocomplete 
                            items={categories.results}
                            onSelect={handleCategorySelect}
                            placeholder="Search Category Filter"
                            className="test-wrapper"            
                        />
                    </div>
                    <div style={{marginTop:'1%', textAlign:'left'}}>
                        { categoryFilters.map((categoryFilter => (
                            <Chip label={categoryFilter}
                                onDelete={() => handleCategoryUnSelect(categoryFilter)}
                                style={{margin:'1%'}}
                            />
                        ))) }
                    </div>

                    <Divider style={{marginTop:'8%'}} />
                    <Typography component="h1" variant="h5">
                        Price Filters
                    </Typography>
                    <Divider />
                    <List>
                        {price_filter_labels.map((price_filter_label) => (
                        <ListItem key={price_filter_label.id} disablePadding>
                                <Checkbox id={price_filter_label.label} name={price_filter_label.id} size="small" onChange={handlePriceFilterChange}/>
                                <ListItemText primary={price_filter_label.label} />
                        </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item md={1}></Grid>
                <Grid item md={8}>
                    { adds_output }
                </Grid>
                <Grid item md={1}></Grid>
            </Grid>
    );	
}

export default Advertisments;
