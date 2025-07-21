// eslint-disable-next-line max-len
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import {
  getAuth
  // eslint-disable-next-line max-len
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAXC10Z6hsCmH7MknRtAwnjzXsoSecpEyE',
  authDomain: 'handwriter-e701a.firebaseapp.com',
  projectId: 'handwriter-e701a',
  storageBucket: 'handwriter-e701a.firebasestorage.app',
  messagingSenderId: '132314462200',
  appId: '1:132314462200:web:b6a4cf66ba3ff04f8cc80d'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
