import { Container, Box, Typography, Button, Grid } from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import BeerList from '../components/beer_components/BeerList';

const Beers = () => {
   const [sortingParam, setSortingParam] = useState('default');
   const [sortingDirection, setSortingDirection] = useState('default');
   const [sortingOption, setSortingOption] = useState(0);

   const navigate = useNavigate();
   const [beers, setBeers] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         const requestOptions = {
            method: 'GET',
            headers: {
               'x-access-token': localStorage['access-token'],
               'x-auth-token': localStorage['refresh-token'],
            },
         };
         const url = `/api/beers?sort=${sortingDirection}&param=${sortingParam}`;
         const response = await fetch(url, requestOptions);

         if (response.status === 401) {
            localStorage.clear();
            navigate('/login');
         }
         if (response.status === 403) {
            navigate('/confirmaccount');
         }

         const result = await response.json();

         if (!result.payload) return;

         localStorage['access-token'] = result.payload.newAccessToken || localStorage['access-token'];

         setBeers(result.payload || []);
      };
      fetchData();
   }, [sortingParam, sortingDirection, navigate]);

   useEffect(() => {
      switch (sortingOption) {
         case 1:
            setSortingParam('name');
            setSortingDirection('ascending');
            break;
         case 2:
            setSortingParam('name');
            setSortingDirection('descending');
            break;
         case 3:
            setSortingParam('type');
            setSortingDirection('ascending');
            break;
         case 4:
            setSortingParam('type');
            setSortingDirection('descending');
            break;
         case 5:
            setSortingParam('abv');
            setSortingDirection('ascending');
            break;
         case 6:
            setSortingParam('abv');
            setSortingDirection('descending');
            break;
         case 7:
            setSortingParam('ibu');
            setSortingDirection('ascending');
            break;
         case 8:
            setSortingParam('ibu');
            setSortingDirection('descending');
            break;
         default:
            setSortingParam('default');
            setSortingDirection('default');
            break;
      }
   }, [sortingOption]);

   return (
      <Box>
         <Box>
            <img
               style={{ height: '30em', width: '100%', objectFit: 'cover' }}
               src={'https://source.unsplash.com/random?patio'}
               alt='A drinking patio at a bar.'
            />
         </Box>
         <Container maxWidth={'lg'}>
            <Grid container sx={{ mt: 5 }}>
               <Grid item md={10} sm={12}>
                  <Typography variant='h1'>The Biergarten Index</Typography>
                  <Typography variant='h2' gutterBottom sx={{ mb: '1em' }}>
                     Beers
                  </Typography>
               </Grid>
               <Grid md={2} sm={12} item>
                  <Button
                     startIcon={<AddCircleOutlinedIcon />}
                     onClick={() => navigate('/beers/create')}
                     variant='contained'
                     sx={{ width: '100%' }}
                  >
                     Post a new beer
                  </Button>
               </Grid>
            </Grid>

            <BeerList
               beers={beers}
               sortingOption={sortingOption}
               setSortingOption={setSortingOption}
               sortingDirection={sortingDirection}
               setSortingDirection={setSortingDirection}
            />
         </Container>
      </Box>
   );
};

export default Beers;
