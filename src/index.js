import {initializeApp} from 'firebase/app';
import {getAuth,onAuthStateChanged} from 'firebase/auth';
import {getFirestore,collection,getDoc,getDocs} from 'firebase/firestore'


const   firbaseApp = initializeApp({
  apiKey: "AIzaSyDlyB2Ur303fTz3XTBYwn8MUHdrJaVj-RM",
  authDomain: "myhappyplays-3509f.firebaseapp.com",
  projectId: "myhappyplays-3509f",
  storageBucket: "myhappyplays-3509f.appspot.com",
  messagingSenderId: "141900658674",
  appId: "1:141900658674:web:1fd3bdf3e7b21d2af01d6b",
  measurementId: "G-N8VGVL3PJF"
});
const auth = getAuth(firbaseApp);
const db = getFireStore(firbaseApp);
const todosCol = collection(db,'todos');



// detect auth state
onAuthStateChanged(auth,user => {
  if(user != null) {
    console.log("logged in")
  } else {
    console.log('no user')
  }
});
