// Importar módulos do Firebase
import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

// 🔹 Configuração do Firebase 
const firebaseConfig = {
  apiKey: "AIzaSyByvQs8iThKcHZynKMvOo1c0JCLPpJdqFE",
  authDomain: "cadastroprodutos-5888a.firebaseapp.com",
  projectId: "cadastroprodutos-5888a",
  storageBucket: "cadastroprodutos-5888a.firebasestorage.app",
  messagingSenderId: "136264314847",
  appId: "1:136264314847:web:841bdffa6bff39dae19e6a",
  measurementId: "G-BZK97R4YYT"
};

// 🔹 Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Inicializa o Firestore com cache persistente
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(), // mantém cache mesmo com várias abas
  }),
});
