import React,{useState} from 'react'; 
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



function App() {
  const [user] = useAuthState(auth);
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

function SignOut(){
  return auth.currentUser && (
    <button onClick={()=> auth.signOut()}>Sign Out</button>
  )
}
  
  
  return (<button onClick={SignInWithGoogle}> Sign In with Google</button>) 
}

function ChatRoom(){
  // au Chat room nous avons des messages : 
  const messagesRef = firestore.collection('messages'); // reference vers la collection message de firestore 
  const query = messagesRef.orderBy('createdAt').limit(25);  // requeter des éléments dans une base de données 

  const [messages] = useCollectionData(query, {idField: 'id'}); 

  const [formValue, setFormValue] = useState(''); 

  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid , photoUrl} = auth.currentUser;
    await messagesRef.add({
      text:formValue, 
      createdAt: firebase.firestore.FieldValue.serverTimestamp(), 
      uid, 
      photoUrl
    });
    setFormValue(''); // initialiser le champs d'envoie
  }
  
  return (
      <> 
        <div>
          {messages && messages.map (msg=> <ChatMessage key={msg.id} message={msg} />)}
        </div>

        <form onSubmit={sendMessage}>
          <input value={formValue} onChange={(e)=> setFormValue(e.target.value)}></input>

          <button type="submit">🔥</button>
        </form>
      </>
  )
}

function ChatMessage (prop){
  const {text, uid, photoUrl}= prop.message;

  const classMessage = uid === auth.currentUser.uid ? 'sent' : 'received';  
  return (
    <div class={'message ${classMessage}'}>
        <img src={photoUrl} />
        <p>{text}</p>
    </div>
  )

}


export default App;
