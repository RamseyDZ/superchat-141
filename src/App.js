
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore'; 
import 'firebase/auth'; 


import { useAuthState } from 'react-firebase-hooks/auth'; 
import { useCollectionData } from 'react-firebase-hooks/firestore'; 


firebase.initializeApp({
  // congigurer firebase ; 
    apiKey: "AIzaSyAUDC5xdSj9k84Otfe_iG-JABxUJ3xEOYk",
    authDomain: "superchat-141.firebaseapp.com",
    projectId: "superchat-141",
    storageBucket: "superchat-141.appspot.com",
    messagingSenderId: "809746837858",
    appId: "1:809746837858:web:09284dfe33ab7bc1bb7c3b"
})

const auth = firebase.auth();
const firestore = firebase.firestore();  

const [user] = useAuthState(auth);

function App() {
  return (
    <div className="App">
      <header className="App-header">

       {user ? <ChatRoom /> : <SignIn/>} 
      
      </header>
    </div>
  );
}

function SignIn(){
  const SignInWithGoogle = () =>{
      const provider = new firebase.auth.GoogleAuthProvider(); 
      auth.signInWithPopup(provider); 
  } 
  
  
  return (<button onClick={SignInWithGoogle}> Sign In with Google</button>) 
}

function ChatRoom(){

}


export default App;
