// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js';

// TODO: Add your web app's Firebase configuration
// PASTE YOUR firebaseConfig OBJECT HERE
const firebaseConfig = {
  apiKey: 'AIzaSyAXC10Z6hsCmH7MknRtAwnjzXsoSecpEyE',
  authDomain: 'handwriter-e701a.firebaseapp.com',
  projectId: 'handwriter-e701a',
  storageBucket: 'handwriter-e701a.firebasestorage.app',
  messagingSenderId: '132314462200',
  appId: '1:132314462200:web:b6a4cf66ba3ff04f8cc80d'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

// --- AUTHENTICATION FUNCTIONS ---

// Function to handle user sign-up
const signUpWithEmail = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log('Successfully created account:', user);
      window.location.href = 'home.html'; // Redirect to the main tool page
    })
    .catch((error) => {
      console.error('Error signing up:', error.message);
      alert(`Error signing up: ${error.message}`);
    });
};

// Function to handle user login
const logInWithEmail = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log('Successfully logged in:', user);
      window.location.href = 'home.html'; // Redirect to the main tool page
    })
    .catch((error) => {
      console.error('Error logging in:', error.message);
      alert(`Error logging in: ${error.message}`);
    });
};

// Function to handle Google Sign-In
const signInWithGoogle = () => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      console.log('Successfully signed in with Google:', user);
      window.location.href = 'home.html'; // Redirect to the main tool page
    })
    .catch((error) => {
      console.error('Error with Google sign-in:', error.message);
      alert(`Error with Google sign-in: ${error.message}`);
    });
};

// Function to handle password reset
const resetPassword = (email) => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert('Password reset email sent! Check your inbox.');
    })
    .catch((error) => {
      console.error('Error sending password reset email:', error.message);
      alert(`Error: ${error.message}`);
    });
};

// --- CONNECTING TO THE HTML ---

// Listen for registration form submission
document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('new-email').value;
  const password = document.getElementById('new-password').value;
  signUpWithEmail(email, password);
});

// Listen for login form submission
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  logInWithEmail(email, password);
});

// Listen for forgot password form submission
document.getElementById('forgotForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('forgot-email').value;
  resetPassword(email);
});

// Listen for Google sign-in button click
document.querySelector('.google-btn').addEventListener('click', (e) => {
  e.preventDefault();
  signInWithGoogle();
});

// --- AUTH STATE OBSERVER ---

// This function runs whenever the user's login state changes.
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in. You can get user info here.
    console.log('User is currently logged in:', user.uid);
    // You could redirect here if they are on the login page but already logged in
  } else {
    // User is signed out.
    console.log('User is currently signed out.');
  }
});

// --- UI LOGIC ---
const loginCard = document.getElementById('login');
const signupCard = document.getElementById('signup');
const forgotCard = document.getElementById('forgot');

// Function to show the signup card and hide the others
const showSignup = () => {
  loginCard.style.display = 'none';
  signupCard.style.display = 'block';
  forgotCard.style.display = 'none';
};

// Function to show the login card and hide the others
const showLogin = () => {
  loginCard.style.display = 'block';
  signupCard.style.display = 'none';
  forgotCard.style.display = 'none';
};

// Function to show the forgot password card and hide the others
const showForgot = () => {
  loginCard.style.display = 'none';
  signupCard.style.display = 'none';
  forgotCard.style.display = 'block';
};

// Event listeners for the links
document.querySelector("a[href='#signup']").addEventListener('click', (e) => {
  e.preventDefault();
  showSignup();
});

document.querySelector("a[href='#login']").addEventListener('click', (e) => {
  e.preventDefault();
  showLogin();
});

document.querySelector("a[href='#forgot']").addEventListener('click', (e) => {
  e.preventDefault();
  showForgot();
});
