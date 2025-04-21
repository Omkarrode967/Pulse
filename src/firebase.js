import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC6Ec_gPlbjN0u3xNyYoHrJPMNXdwRuiwA",
  authDomain: "pulse-9dbd3.firebaseapp.com",
  projectId: "pulse-9dbd3",
  storageBucket: "pulse-9dbd3.firebasestorage.app",
  messagingSenderId: "82202686773",
  appId: "1:82202686773:web:9f4408089cc298e584487c",
  measurementId: "G-4XDHEGZEEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, analytics }; 