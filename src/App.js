import React,{useRef, useState} from 'react'; 
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
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn/>} 
      </section>
    </div>
  );
}

function SignIn() {
  const SignInWithGoogle = () =>{
      const provider = new firebase.auth.GoogleAuthProvider(); 
      auth.signInWithPopup(provider); 
    } 
  return (<button className="sign-in" onClick={SignInWithGoogle}> Sign In with Google</button>) 
}

function SignOut() {
  return auth.currentUser && (
     <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom(){
  // au Chat room nous avons des messages : 
  const dummy = useRef();
  const messagesRef = firestore.collection('messages'); // reference vers la collection message de firestore 
  const query = messagesRef.orderBy('createdAt').limit(25);  // requeter des éléments dans une base de données 

  const [messages] = useCollectionData(query, {idField: 'id'}); 

  const [formValue, setFormValue] = useState(''); 
  

  
  
  
  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid , photoURL} = auth.currentUser;


    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setFormValue(''); // initialiser le champs d'envoie
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }
  
  return (
      <> 
        <main>
          {messages && messages.map (msg=> <ChatMessage key={msg.id} message={msg} />)}
          <span ref={dummy}></span>
        </main>


        <form onSubmit={sendMessage}>
          <input value={formValue} onChange={(e)=> setFormValue(e.target.value)} placeholder="say hello to ur dady"></input>
          <button type="submit" disabled={!formValue}>🔥</button>
        </form>
      </>
  )
}

function ChatMessage (props){
  const {text, uid, photoURL}= props.message;

  const classMessage = uid === auth.currentUser.uid ? 'sent' : 'received';  
  return (
    <div className={`message ${classMessage}`}>
         <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
        <p>{text}</p>
    </div>
  )

}


export default App;
