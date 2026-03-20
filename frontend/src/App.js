import './App.css';
import Header from './components/Header';
import Home from './Pages/Home';
import Bitcoin from './Pages/Bitcoin';
import {BrowserRouter, Route} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import  Alert from './components/Alert';

function App() {
  const useStyle = makeStyles(()=>({
    App:{
      backgroundColor:"#14161a",
      color:"#04b5e5",
      minHeight:'100vh'


    }
  }))
  const classes = useStyle();
  return (
    <>
    <BrowserRouter>
    <div className={classes.App}>
    <Header/>
    <Route path='/' component={Home} exact ></Route>
    <Route path='/coins/:id' component={Bitcoin} exact ></Route>
    </div>
    <Alert/>
    </BrowserRouter>
 </>
  );
}

export default App;
