import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, Drawer } from '@material-ui/core';
import { CryptoState } from '../../CryptoContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { AiFillDelete } from "react-icons/ai"
import { coinWithComa } from '../Banner/Corousels';
import { doc, setDoc } from 'firebase/firestore';


const useStyles = makeStyles({
  container: {
    width: 350,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "monospace"
  },
  picture: {
    width: 200,
    height: 200,
    cursor: "pointer",
    backgroundColor: "#04b5e5",
    objectFit: "contain"
  },
  profile: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    height: "92%",
  },
  logout: {
    height: "8%",
    width: "100%",
    backgroundColor: "#04b5e5",
    marginTop: 20,
    fontFamily: "monospace"
  },
  watchlist: {
    flex: 1,
    width: "100%",
    backgroundColor: "grey",
    borderRadius: 10,
    padding: 15,
    paddingTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    overflowY: "scroll"
  },
  coin: {
    padding: 10,
    borderRadius: 5,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#04b5e5",
    boxShadow: "0 0 3px black"


  }
});



export default function UserSidebar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });
  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };
  const removewatchlist = async (coin) => {
    const coinref = doc(db, "watchlist", user.uid,);
    try {
      await setDoc(coinref, { coins: watchlist.filter((watch) => watch !== coin?.id) }, { merge: "true" });
      setAlert({
        open: true,
        message: `${coin.name} Remove from the Watchlist !`,
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
  const { user, setAlert, watchlist, coins, symbol } = CryptoState();
  const logOut = () => {
    signOut(auth);
    setAlert({
      open: true,
      type: "success",
      message: "Logout Succesfully !"
    })
    toggleDrawer();
  }
  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 38,
              width: 38,
              cursor: "pointer",
              backgroundColor: "#04b5e5"
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />

          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar
                  className={classes.picture}
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                />
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word"
                  }}
                >
                  {user.displayName || user.email}
                </span>
                <div className={classes.watchlist}>
                  <span style={{ fontSize: 15, textShadow: "0 0 5px black" }}>
                    Watchlist
                  </span>
                  {coins.map((coin) => {
                    if (watchlist.includes(coin.id))
                      return (
                        <div className={classes.coin}>
                          <span style={{ display: "flex", gap: 8 }}>{coin.name}</span>
                          {symbol}
                          {coinWithComa(coin.current_price.toFixed(2))}
                          <AiFillDelete
                            style={{ cursor: "pointer" }}
                            fontSize='16'
                            onClick={() => removewatchlist(coin)}
                          />
                        </div>

                      );
                  })}
                </div>
              </div>
              <Button
                variant='contained'
                className={classes.logout}
                onClick={logOut}
              >
                Log Out
              </Button>

            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

