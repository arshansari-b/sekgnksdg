// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
// import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
// import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
// import { getDatabase, ref as databaseRef, push, set } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

 
//   const firebaseConfig = {
//     apiKey: "AIzaSyCbeWaVWqfwtLWaHePWJqsFXqZXJEOKm4Q",
//     authDomain: "project-vws-cb0cb.firebaseapp.com",
//     databaseURL: "https://project-vws-cb0cb-default-rtdb.firebaseio.com",
//     projectId: "project-vws-cb0cb",
//     storageBucket: "project-vws-cb0cb.appspot.com",
//     messagingSenderId: "575337970725",
//     appId: "1:575337970725:web:2065eb7f903a79c62f53cc",
//     measurementId: "G-YJ26VNF9MT"
//   };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const storage = getStorage(app);
// const db = getDatabase(app);
// const provider = new GoogleAuthProvider();

// let googleAuthBtn = document.getElementById('googleAuthBtn');
// let picTitleInput = document.getElementById('picTitle');
// let picFileInput = document.getElementById('picFile');
// let uploadPicBtn = document.getElementById('uploadPic');
// let user = null;

// // Google Sign-In
// googleAuthBtn.addEventListener('click', () => {
//     signInWithPopup(auth, provider)
//         .then((result) => {
//             user = result.user;
//             alert("Signed in as " + user.displayName);
//             picTitleInput.disabled = false;
//             picFileInput.disabled = false;
//             uploadPicBtn.disabled = false;
//         })
//         .catch((error) => {
//             alert("Failed to sign in: " + error.message);
//         });
// });

// // On Auth State Changed
// onAuthStateChanged(auth, (currentUser) => {
//     if (currentUser) {
//         user = currentUser;
//     } else {
//         user = null;
//     }
// });

// // Upload Picture
// uploadPicBtn.addEventListener('click', () => {
//     if (!picFileInput.files[0]) {
//         alert("Please select a picture file.");
//         return;
//     }

//     const file = picFileInput.files[0];
//     const fileName = new Date().getTime() + "_" + file.name;
//     const storageReference = storageRef(storage, 'pictures/' + fileName);

//     uploadBytes(storageReference, file).then(snapshot => {
//         getDownloadURL(snapshot.ref).then(url => {
//             savePicData(url);
//         });
//     }).catch(error => {
//         alert("Failed to upload picture: " + error.message);
//     });
// });

// // Save Picture Data
// function savePicData(picUrl) {
//     if (user) {
//         const newPicRef = push(databaseRef(db, 'pictures/'));
//         set(newPicRef, {
//             username: user.displayName,
//             profilePic: user.photoURL || 'default-profile.png',
//             title: picTitleInput.value,
//             picUrl: picUrl,
//             likes: 0,
//             dislikes: 0
//         }).then(() => {
//             alert("Picture uploaded successfully");
//             window.location.href = "photo.html";
//         }).catch((error) => {
//             alert("Failed to save picture data: " + error.message);
//         });
//     } else {
//         alert("You must be signed in to upload a picture.");
//     }
// }
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
import { getDatabase, ref as databaseRef, push, set } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyB3iJv4XVViLowqVB4yWjhNbdprjXEwvSY",
    authDomain: "blaze-z.firebaseapp.com",
    databaseURL: "https://blaze-z-default-rtdb.firebaseio.com",
    projectId: "blaze-z",
    storageBucket: "blaze-z.appspot.com",
    messagingSenderId: "856918814032",
    appId: "1:856918814032:web:bb615150a7821df0eb1055",
    measurementId: "G-9G9CXSQRR4"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

let googleAuthBtn = document.getElementById('googleAuthBtn');
let picTitleInput = document.getElementById('picTitle');
let picFileInput = document.getElementById('picFile');
let uploadPicBtn = document.getElementById('uploadPic');
let user = null;

// Google Sign-In
googleAuthBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            user = result.user;
            alert("Signed in as " + user.displayName);
            picTitleInput.disabled = false;
            picFileInput.disabled = false;
            uploadPicBtn.disabled = false;
        })
        .catch((error) => {
            console.error("Failed to sign in:", error);
            alert("Failed to sign in: " + error.message);
        });
});

// On Auth State Changed
onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
        user = currentUser;
    } else {
        user = null;
    }
});

// Upload Picture
uploadPicBtn.addEventListener('click', () => {
    if (!picFileInput.files[0]) {
        alert("Please select a picture file.");
        return;
    }

    const file = picFileInput.files[0];
    const fileName = new Date().getTime() + "_" + file.name;
    const storageReference = storageRef(storage, 'pictures/' + fileName);

    uploadBytes(storageReference, file).then(snapshot => {
        getDownloadURL(snapshot.ref).then(url => {
            savePicData(url);
        }).catch(error => {
            console.error("Failed to get download URL:", error);
            alert("Failed to get picture URL: " + error.message);
        });
    }).catch(error => {
        console.error("Failed to upload picture:", error);
        alert("Failed to upload picture: " + error.message);
    });
});

// Save Picture Data
function savePicData(picUrl) {
    if (user) {
        const newPicRef = push(databaseRef(db, 'pictures/'));
        set(newPicRef, {
            username: user.displayName,
            profilePic: user.photoURL || 'default-profile.png',
            title: picTitleInput.value,
            picUrl: picUrl,
            likes: 0,
            dislikes: 0
        }).then(() => {
            alert("Picture uploaded successfully");
            window.location.href = "index.html";
        }).catch((error) => {
            console.error("Failed to save picture data:", error);
            alert("Failed to save picture data: " + error.message);
        });
    } else {
        alert("You must be signed in to upload a picture.");
    }
}
