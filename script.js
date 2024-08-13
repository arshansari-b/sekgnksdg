// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
// import { getDatabase, ref as databaseRef, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";
// import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

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
// const db = getDatabase(app);
// const auth = getAuth(app);

// const photoContainer = document.getElementById('photoContainer');
// let user = null;

// // On Auth State Changed
// onAuthStateChanged(auth, (currentUser) => {
//     user = currentUser;
//     displayPhotos();
// });

// // Display Photos
// function displayPhotos() {
//     const picsRef = databaseRef(db, 'pictures/');
//     onValue(picsRef, (snapshot) => {
//         photoContainer.innerHTML = "";
//         const data = snapshot.val();
//         for (let key in data) {
//             const picData = data[key];
//             let photoElement = document.createElement('div');
//             photoElement.classList.add('photo');

//             photoElement.innerHTML = `
//                 <img src="${picData.picUrl}" alt="${picData.title}">
//                 <h3>${picData.title}</h3>
//                 <div class="profile">
//                     <img src="${picData.profilePic}" alt="${picData.username}">
//                     <span>${picData.username}</span>
//                 </div>
//                 <div class="like-dislike">
//                     <button class="like-btn" data-pic-id="${key}">Like (${picData.likes || 0})</button>
//                     <button class="dislike-btn" data-pic-id="${key}">Dislike (${picData.dislikes || 0})</button>
//                 </div>
//             `;

//             photoContainer.appendChild(photoElement);
//         }

//         document.querySelectorAll('.like-btn').forEach(button => {
//             button.addEventListener('click', handleLike);
//         });

//         document.querySelectorAll('.dislike-btn').forEach(button => {
//             button.addEventListener('click', handleDislike);
//         });
//     });
// }

// // Handle Like
// function handleLike(event) {
//     const picId = event.target.dataset.picId;
//     const picRef = databaseRef(db, `pictures/${picId}`);
//     if (user) {
//         runTransaction(picRef, (pic) => {
//             if (pic) {
//                 if (!pic.likedBy) pic.likedBy = {};
//                 if (!pic.dislikedBy) pic.dislikedBy = {};

//                 if (pic.likedBy[user.uid]) {
//                     // Already liked, do nothing
//                 } else {
//                     pic.likes = (pic.likes || 0) + 1;
//                     pic.likedBy[user.uid] = true;
//                     if (pic.dislikedBy[user.uid]) {
//                         pic.dislikes--;
//                         delete pic.dislikedBy[user.uid];
//                     }
//                 }
//             }
//             return pic;
//         });
//     } else {
//         alert("You must be signed in to like a picture.");
//     }
// }

// // Handle Dislike
// function handleDislike(event) {
//     const picId = event.target.dataset.picId;
//     const picRef = databaseRef(db, `pictures/${picId}`);
//     if (user) {
//         runTransaction(picRef, (pic) => {
//             if (pic) {
//                 if (!pic.likedBy) pic.likedBy = {};
//                 if (!pic.dislikedBy) pic.dislikedBy = {};

//                 if (pic.dislikedBy[user.uid]) {
//                     // Already disliked, do nothing
//                 } else {
//                     pic.dislikes = (pic.dislikes || 0) + 1;
//                     pic.dislikedBy[user.uid] = true;
//                     if (pic.likedBy[user.uid]) {
//                         pic.likes--;
//                         delete pic.likedBy[user.uid];
//                     }
//                 }
//             }
//             return pic;
//         });
//     } else {
//         alert("You must be signed in to dislike a picture.");
//     }
// }



// document.addEventListener('DOMContentLoaded', () => {
//     const menuButton = document.getElementById('menuButton');
//     const navDrawer = document.getElementById('navDrawer');

//     if (menuButton) {
//         menuButton.addEventListener('click', () => {
//             navDrawer.classList.toggle('open');
//             if (navDrawer.classList.contains('open')) {
//                 menuButton.textContent = '✖'; // Change to close icon
//             } else {
//                 menuButton.textContent = '☰'; // Change to menu icon
//             }
//         });
//     }
// });

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref as databaseRef, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

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
const db = getDatabase(app);
const auth = getAuth(app);

const photoContainer = document.getElementById('photoContainer');
let user = null;

// On Auth State Changed
onAuthStateChanged(auth, (currentUser) => {
    user = currentUser;
    displayPhotos();
});

// Display Photos
function displayPhotos() {
    const picsRef = databaseRef(db, 'pictures/');
    onValue(picsRef, (snapshot) => {
        photoContainer.innerHTML = "";
        const data = snapshot.val();
        if (data) {
            for (let key in data) {
                const picData = data[key];
                let photoElement = document.createElement('div');
                photoElement.classList.add('photo');

                photoElement.innerHTML = `
                    <img src="${picData.picUrl}" alt="${picData.title}">
                    <h3>${picData.title}</h3>
                    <div class="profile">
                        <img src="${picData.profilePic}" alt="${picData.username}">
                        <span>${picData.username}</span>
                    </div>
                    <div class="like-dislike">
                        <button class="like-btn" data-pic-id="${key}">Like (${picData.likes || 0})</button>
                        <button class="dislike-btn" data-pic-id="${key}">Dislike (${picData.dislikes || 0})</button>
                    </div>
                `;

                photoContainer.appendChild(photoElement);
            }

            document.querySelectorAll('.like-btn').forEach(button => {
                button.addEventListener('click', handleLike);
            });

            document.querySelectorAll('.dislike-btn').forEach(button => {
                button.addEventListener('click', handleDislike);
            });
        } else {
            console.log('No photos found.');
        }
    }, (error) => {
        console.error('Error fetching photos:', error);
    });
}

// Handle Like
function handleLike(event) {
    const picId = event.target.dataset.picId;
    const picRef = databaseRef(db, `pictures/${picId}`);
    if (user) {
        runTransaction(picRef, (pic) => {
            if (pic) {
                if (!pic.likedBy) pic.likedBy = {};
                if (!pic.dislikedBy) pic.dislikedBy = {};

                if (pic.likedBy[user.uid]) {
                    // Already liked, do nothing
                } else {
                    pic.likes = (pic.likes || 0) + 1;
                    pic.likedBy[user.uid] = true;
                    if (pic.dislikedBy[user.uid]) {
                        pic.dislikes--;
                        delete pic.dislikedBy[user.uid];
                    }
                }
            }
            return pic;
        }).then(() => {
            console.log('Like transaction successful.');
        }).catch((error) => {
            console.error('Like transaction failed:', error);
        });
    } else {
        alert("You must be signed in to like a picture.");
    }
}

// Handle Dislike
function handleDislike(event) {
    const picId = event.target.dataset.picId;
    const picRef = databaseRef(db, `pictures/${picId}`);
    if (user) {
        runTransaction(picRef, (pic) => {
            if (pic) {
                if (!pic.likedBy) pic.likedBy = {};
                if (!pic.dislikedBy) pic.dislikedBy = {};

                if (pic.dislikedBy[user.uid]) {
                    // Already disliked, do nothing
                } else {
                    pic.dislikes = (pic.dislikes || 0) + 1;
                    pic.dislikedBy[user.uid] = true;
                    if (pic.likedBy[user.uid]) {
                        pic.likes--;
                        delete pic.likedBy[user.uid];
                    }
                }
            }
            return pic;
        }).then(() => {
            console.log('Dislike transaction successful.');
        }).catch((error) => {
            console.error('Dislike transaction failed:', error);
        });
    } else {
        alert("You must be signed in to dislike a picture.");
    }
}

// Menu button functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menuButton');
    const navDrawer = document.getElementById('navDrawer');

    if (menuButton) {
        menuButton.addEventListener('click', () => {
            navDrawer.classList.toggle('open');
            if (navDrawer.classList.contains('open')) {
                menuButton.textContent = '✖'; // Change to close icon
            } else {
                menuButton.textContent = '☰'; // Change to menu icon
            }
        });
    }
});


