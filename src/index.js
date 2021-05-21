const firebaseConfig = {
    apiKey: "AIzaSyD6mIN2RjGLihi15-W-IlWZhP8z1JDqkH8",
    authDomain: "alkoholdatenbank.firebaseapp.com",
    databaseURL: "https://alkoholdatenbank-default-rtdb.firebaseio.com",
    projectId: "alkoholdatenbank",
    storageBucket: "alkoholdatenbank.appspot.com",
    messagingSenderId: "142784195708",
    appId: "1:142784195708:web:e87fca0cdf84507c342df9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


db.collection("Getraenke").get().then(value => {
    const docs = value.docs;
    console.log(docs[0].id);
    console.log(docs[0].data());
});

