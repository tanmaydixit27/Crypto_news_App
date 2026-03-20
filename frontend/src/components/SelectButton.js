import { makeStyles } from '@material-ui/core'
import React from 'react'

const SelectButton = ({children,selected,onClick}) => {

 const useStyles = makeStyles({
   selectbutton:{
     border:"1px solid #04b5e5",
     borderRadius:5,
     padding:10,
     paddingLeft:20,
     paddingRight:20,
     fontFamily:"Montserrat",
     cursor:"pointer",
     backgroundColor:selected ? "#04b5e5":"",
     color:selected ? "black" : "",
     fontWeight:selected ? 700 : 500,
     "&:hover":{
       backgroundColor:"#04b5e5",
       color:"black",
     },
     width:"22%"
   }

 }

 )

 const classes = useStyles();

  return (
    <span  className={classes.selectbutton}
    onClick={onClick}
    >{children}</span>
  )
}

export default SelectButton