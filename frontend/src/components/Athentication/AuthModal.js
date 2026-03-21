import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { AppBar, Box, Button, Tab, Tabs } from '@material-ui/core';
import Login from './Login';
import Signup from './Signup';
import GoogleButton from "react-google-button"
import { GoogleAuthProvider, getRedirectResult, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth } from '../../firebase';
import { CryptoState } from '../../CryptoContext';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: 400,
    backgroundColor: theme.palette.background.paper,
    color: "white",
    borderRadius: 10,
  },
  googel: {
    padding: 24,
    paddingTop: 0,
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    gap: 20,
    fontSize: 20,
  }
}));

export default function AuthModal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const { setAlert } = CryptoState();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const handleRedirectSignIn = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result?.user) return;
        setAlert({
          open: true,
          message: `Sign in successful. Welcome ${result.user.email}`,
          type: "success",
        });
      } catch (error) {
        setAlert({
          open: true,
          message: getGoogleAuthErrorMessage(error),
          type: "error",
        });
      }
    };

    handleRedirectSignIn();
  }, [setAlert]);

  const signInWithGoogle = async () => {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setAlert({
        open: true,
        message: `Sign in successful. Welcome ${res.user.email}`,
        type: "success",
      });
      handleClose();
    } catch (error) {
      if (error?.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      setAlert({
        open: true,
        message: getGoogleAuthErrorMessage(error),
        type: "error",
      });
    }
  };

  const getGoogleAuthErrorMessage = (error) => {
    const code = error?.code || '';
    if (code === 'auth/popup-closed-by-user') return 'Google sign-in was canceled before completion.';
    if (code === 'auth/popup-blocked') return 'Popup blocked by browser. We are redirecting you to continue sign-in.';
    if (code === 'auth/unauthorized-domain') return 'This domain is not authorized in Firebase Auth. Add it in Firebase Console -> Authentication -> Settings -> Authorized domains.';
    if (code === 'auth/operation-not-allowed') return 'Google provider is disabled in Firebase Auth. Enable Google under Firebase Console -> Authentication -> Sign-in method.';
    return error?.message || 'Google sign-in failed. Please try again.';
  };


  return (
    <div>
      <Button variant='contained'
        style={{
          width: 85,
          height: 40,
          backgroundColor: "#04b5e5",
          color: "black",
          fontFamily: "Montserrat",
        }}
        onClick={handleOpen}
      >
        LOGIN
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <AppBar
              position='static'
              style={{ backgroundColor: 'transparent', color: "white" }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                style={{ borderRadius: 10 }}
              >
                <Tab label="Login"></Tab>
                <Tab label="Sign Up"></Tab>
              </Tabs>
            </AppBar>
            {value === 0 && <Login handleClose={handleClose} />}
            {value === 1 && <Signup handleClose={handleClose} />}
            <Box className={classes.googel}>
              <span>OR</span>
              <GoogleButton
                style={{ width: "100%", outline: "none" }}
                onClick={signInWithGoogle}
              />
            </Box>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
