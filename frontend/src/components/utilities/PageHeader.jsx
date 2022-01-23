import { useContext, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import {
   AppBar,
   Toolbar,
   Container,
   Typography,
   Button,
   Box,
   Tooltip,
   IconButton,
   Avatar,
   Menu,
   MenuItem,
} from '@mui/material';

import { UserContext } from '../../util/UserContext';

const PageHeader = ({ setCurrentUser }) => {
   const [anchorElNav, setAnchorElNav] = useState(null);
   const [anchorElUser, setAnchorElUser] = useState(null);

   const handleOpenUserMenu = event => {
      setAnchorElUser(event.currentTarget);
   };

   const handleCloseNavMenu = () => {
      setAnchorElNav(null);
   };

   const handleCloseUserMenu = () => {
      setAnchorElUser(null);
   };
   const user = useContext(UserContext);

   const pagesLoggedIn = [
      { name: 'beers', link: '/beers' },
      { name: 'breweries', link: '/breweries' },
   ];
   const pagesNotLoggedIn = [
      { name: 'login', link: '/login' },
      { name: 'register', link: '/register' },
   ];
   const settings = [
      { name: 'Profile', action: () => navigate(`/profile/${user._id}`) },
      {
         name: 'Logout',
         action: () => {
            localStorage.clear();
            setCurrentUser(null);
            navigate('/login');
         },
      },
   ];

   const navigate = useNavigate();

   return (
      <>
         <AppBar position='fixed' elevation={12}>
            <Container maxWidth='xl'>
               <Toolbar sx={{ flexWrap: 'wrap' }}>
                  <Typography
                     variant='h6'
                     noWrap
                     component='div'
                     sx={{ mr: 5, display: { xs: 'none', md: 'flex' } }}
                  >
                     The Biergarten Index
                  </Typography>
                  <Box sx={{ flexGrow: 1, display: 'flex' }}>
                     {user ? (
                        <>
                           {pagesLoggedIn.map(page => (
                              <Button
                                 key={page.name}
                                 variant='contained'
                                 disableElevation
                                 onClick={() => navigate(page.link)}
                              >
                                 <Typography variant='h6'>{page.name}</Typography>
                              </Button>
                           ))}
                        </>
                     ) : (
                        pagesNotLoggedIn.map(page => (
                           <Button
                              key={page.name}
                              variant='contained'
                              disableElevation
                              onClick={() => navigate(page.link)}
                           >
                              <Typography variant='h6'>{page.name}</Typography>
                           </Button>
                        ))
                     )}
                  </Box>
                  <Box sx={{ flexGrow: 0 }}>
                     {user && (
                        <>
                           <Tooltip title='Open settings'>
                              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                 <Avatar
                                    alt={`${user.firstName} ${user.lastName}`}
                                    src={user.profile.displayImage.url}
                                 />
                              </IconButton>
                           </Tooltip>
                           <Menu
                              sx={{ mt: '45px' }}
                              id='menu-appbar'
                              anchorEl={anchorElUser}
                              anchorOrigin={{
                                 vertical: 'top',
                                 horizontal: 'right',
                              }}
                              keepMounted
                              transformOrigin={{
                                 vertical: 'top',
                                 horizontal: 'right',
                              }}
                              open={Boolean(anchorElUser)}
                              onClose={handleCloseUserMenu}
                           >
                              {settings.map(setting => (
                                 <MenuItem key={setting} onClick={handleCloseNavMenu}>
                                    <Typography component='a' textAlign='center' onClick={setting.action}>
                                       {setting.name}
                                    </Typography>
                                 </MenuItem>
                              ))}
                           </Menu>
                        </>
                     )}
                  </Box>
               </Toolbar>
            </Container>
         </AppBar>
         <Toolbar />

         <Outlet />
      </>
   );
};

export default PageHeader;
