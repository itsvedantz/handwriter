1import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAXC10Z6hsCmH7MknRtAwnjzXsoSecpEyE',
  authDomain: 'handwriter-e701a.firebaseapp.com',
  projectId: 'handwriter-e701a',
  storageBucket: 'handwriter-e701a.firebasestorage.app',
  messagingSenderId: '1090363743457',
  appId: '1:1090363743457:web:96558252E1114118c13a5d'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const signInWithGoogle = () => {
  console.log('signInWithGoogle function called');
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log('User signed in:', user);
      window.location.href = 'home.html';
    })
    .catch((error) => {
      console.error('Sign-in error:', error);
    });
};

const signOutUser = () => {
  signOut(auth)
    .then(() => {
      console.log('User signed out');
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.error('Sign-out error:', error);
    });
};

const checkAuthState = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User is signed in:', user);
      if (window.location.pathname !== '/home.html') {
        window.location.href = 'home.html';
      }
    } else {
      console.log('User is signed out');
    }
  });
};

const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log('User signed up with email:', user);
    return { success: true, user };
  } catch (error) {
    console.error('Sign-up error:', error);
    return { success: false, error: error.message };
  }
};

const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log('User signed in with email:', user);
    return { success: true, user };
  } catch (error) {
    console.error('Sign-in error:', error);
    return { success: false, error: error.message };
  }
};

export {
  auth,
  signInWithGoogle,
  signOutUser,
  checkAuthState,
  signUpWithEmail,
  signInWithEmail,
  sendPasswordReset
};
