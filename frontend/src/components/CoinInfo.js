import { CircularProgress, createTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { HistoricalChart } from '../config/api';
import { CryptoState } from '../CryptoContext';
import {Line} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { chartDays } from '../config/data';
import SelectButton from './SelectButton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const CoinInfo = () => {
  const {id} = useParams();
 const [historicData,sethistoricData]  = useState();
 const [days,setDays] =  useState(1);
 const {currency} = CryptoState();
 const  fetchHistoricData = async()=>{
   const {data} = await axios.get(HistoricalChart(id, days,currency));
   console.log(data.prices);
   sethistoricData(data.prices);
  
 }

 
 useEffect(()=>{
   fetchHistoricData();
 },[currency,days])

 const darkTheme = createTheme({
  palette:{
    primary:{
      main:"#fff"
    },
    type:"dark",
  }
});

const useStyles = makeStyles((theme)=>({
  container:{
    width:"75%",
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center",
    marginTop:25,
    padding:40,
    [theme.breakpoints.down("md")]:{
      width:"100%",
      marginTop:0,
      padding:20,
      paddingTop:0,
    },
  }

}))

const classes = useStyles();
  return (
   <ThemeProvider theme={darkTheme}>
   <div className={classes.container}>
   {/*charts*/}
   {
     !historicData ? (
       <CircularProgress
         style={{color:"#04b5e5"}}
         size={250}
         thickness={1}
       />
     ):(
       <>
         <Line
           data={{
             labels:historicData.map((coin)=>{
               let date = new Date(coin[0]);
               let time = date.getHours()>12?`${date.getHours()-12}:${date.getMinutes()}PM`
               : `${date.getHours()}:${date.getMinutes()}AM`;

               return days === 1? time:date.toLocaleDateString();
             }),
             datasets:[{
               data:historicData.map((coin)=>coin[1]),
               label:`Price(Past ${days} Days) in ${currency}`,
               borderColor:"#04b5e5",
             }],
           }}
           options={{
             elements:{
               point:{
                 radius:1,
               },
             }
           }}
         />
         <div style={{
           display:"flex",
           marginTop:20,
           justifyContent:"space-around",
           width:"100%",
         }}>
           {chartDays.map(day=>(
             <SelectButton onClick={()=>setDays(day.value)}  selected={day.value==days}>{day.label}</SelectButton>
           ))}
         </div>
       </>
     )
   }



   {/*buttons*/}
   </div>


   </ThemeProvider>
  )
}

export default CoinInfo