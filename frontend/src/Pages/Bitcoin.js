import { async } from '@firebase/util';
import { Button, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { coinWithComa } from '../components/Banner/Corousels';
import CoinInfo from '../components/CoinInfo';
import { SingleCoin } from '../config/api';
import { CryptoState } from '../CryptoContext';
import { db } from '../firebase';


const Bitcoin = () => {

  const { id } = useParams();
  const [coins, setcoins] = useState();
  const { currency, symbol, user, watchlist, setAlert } = CryptoState();
  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setcoins(data);
  };

  console.log(coins);

  useEffect(() => {
    fetchCoin();
  }, []);

  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },

    },
    sidebar: {
      width: "30%",
      [theme.breakpoints.down("md")]: {
        width: "100%",
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: "2px solid grey",
    },

    heading: {
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: "Montserrat",
      color: "white"
    },
    description: {
      width: "100%",
      fontFamily: "Montserrat",
      padding: 25,
      paddingBottom: 15,
      paddingTop: 0,
      textAlign: "justify",

    },
    marketData: {
      alignSelf: "start",
      padding: 25,
      paddingTop: 10,
      width: "100%",
      //making it responsive

      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "center",
      },

      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
      [theme.breakpoints.down("xs")]: {
        alignItems: "start",
      },


    }

  }))

  const inWatchlist = watchlist.includes(coins?.id);

  const addtowatchlist = async () => {
    const coinref = doc(db, "watchlist", user.uid,);
    try {
      await setDoc(coinref, { coins: watchlist ? [...watchlist, coins?.id] : [coins?.id] });
      setAlert({
        open: true,
        message: `${coins.name} Added to the Watchlist !`,
        type: "success"
      })
    }
    catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error"
      })
    }
  }
  const removewatchlist = async () => {
    const coinref = doc(db, "watchlist", user.uid,);
    try {
      await setDoc(coinref, { coins: watchlist.filter((watch) => watch !== coins?.id) }, { merge: "true" });
      setAlert({
        open: true,
        message: `${coins.name} Remove from the Watchlist !`,
        type: "success"
      })
    }
    catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error"
      })
    }
  }

  const classes = useStyles();
  if (!coins) return <LinearProgress style={{ backgroundColor: "#04b5e5" }}></LinearProgress>;


  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img
          src={coins?.image.large}
          alt={coins?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography
          variant='h3'
          className={classes.heading}
          style={{ color: "white" }}
        >
          {coins?.name}
        </Typography>
        <Typography variant="subtitle1" className={classes.description} style={{ color: "white" }}>
          {coins?.description.en.split(". ")[0]}.
        </Typography>
        <div className={classes.marketData}>
          <span style={{ display: "flex" }}>
            <Typography variant='h5' className={classes.heading}>
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant='h5' style={{ fontFamily: "Montserrat", color: "white" }}>
              {coins?.market_cap_rank}
            </Typography>

          </span>
          <span style={{ display: "flex" }}>
            <Typography variant='h5' className={classes.heading}>
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant='h5' style={{ fontFamily: "Montserrat", color: "white" }}>
              {symbol}{" "}
              {coinWithComa(coins?.market_data.current_price[currency.toLowerCase()])}
            </Typography>

          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Market Cap:{" "}
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat", color: "white" }}>
              {symbol}{" "}
              {coinWithComa(coins?.market_data.market_cap[currency.toLowerCase()]
                .toString()
                .slice(0, -6)
              )}M
            </Typography>

          </span>
          {user && (
            <Button
              variant="outlined"
              style={{
                width: "100%",
                height: 40,
                backgroundColor: inWatchlist ? "red " : "#04b5e5",
                fontFamily: "monospace"
              }}
              onClick={inWatchlist ? removewatchlist : addtowatchlist}
            >
              {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          )}

        </div>
      </div>
      <CoinInfo> coin = {coins}</CoinInfo>

    </div>
  );
};

export default Bitcoin;