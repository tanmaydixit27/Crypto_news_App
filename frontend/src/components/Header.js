import React from 'react'
import {AppBar,Container,Toolbar, Typography,Select,MenuItem, makeStyles, createTheme, ThemeProvider} from '@material-ui/core'
import { useHistory } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';
import AuthModal from './Athentication/AuthModal';
import UserSidebar from './Athentication/UserSidebar';

const useStyles = makeStyles(()=>({
  title:{
    flex:1,
    color:"#04b5e5",
    fontFamily:"Montserrat",
    fontWeight:"bold",
    cursor:"pointer"
  }
}))
const Header = () => {
  const classes = useStyles();
  const  history = useHistory();
  const { currency,setCurrency , user} = CryptoState();
  const darkTheme = createTheme({
    palette:{
      primary:{
        main:"#04b5e5"
      },
      type:"dark",
    }
  })
  return (
   <>
   <ThemeProvider theme={darkTheme}>
       <AppBar color='transparent' position='static'>
       <Container>
       <Toolbar>
       <Typography variant='h6' className={classes.title} onClick={()=>history.push("/")}>
       Crypto Hunter
       </Typography>
       <Select
       variant='outlined'
       value={currency}
       onChange={(e)=>setCurrency(e.target.value)}
       style={
         {
           width:100,
           height:40,
           marginRight:15,
         }
       }
       >
       <MenuItem value={"INR"}>INR</MenuItem>
       <MenuItem value={"USD"}>USD</MenuItem>
       </Select>
     { user ? <UserSidebar/> : <AuthModal/>}
        </Toolbar>
       </Container>

           
       </AppBar>
       </ThemeProvider>
   </>
  )
}

export default Header