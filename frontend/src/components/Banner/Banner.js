import { Container, makeStyles ,Typography} from '@material-ui/core';
import React from 'react'
import Corousels from './Corousels';


const useStyles = makeStyles(()=>({
  banner:{
      backgroundImage:'url(./banner3.jpg)',
},
bannerContent:{
    height:400,
    display:"flex",
    flexDirection:"column",
    paddingTop:25,
    justifyContent:"space-around"
} ,
tagline:{
  display:"flex",
  height:"40%",
  flexDirection:"column",
  justifyContent:"center",
  textAlign:"center"
}
}))



const Banner = () => {
    const classes = useStyles();
  return (
    <div className={classes.banner}>
    <Container className={classes.bannerContent}>
    <div className={classes.tagline}>
    <Typography variant='h2' 
    style={{
      fontWeight:"bold",
      marginBottom:15,
      fontFamily:"Montserrat",
      color:'white'
      
    }}
    >
       Crypto Hunter
       </Typography>
       <Typography variant='subtitle2' 
    style={{
    textTransform:"capitalize",
      fontFamily:"Montserrat",
      color:'darkgrey'
      
    }}
    >
     Get all Info regarding your favourite Crypto Currency
       </Typography>

       

    </div>


    <Corousels/>

    </Container>
    </div>
  )
}

export default Banner;