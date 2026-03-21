import firebaseConfig from "./config/firebaseConfig";
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import { initializeApp } from 'firebase/app' 

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Failed to set auth persistence:', error);
});


export {auth,db} ;
