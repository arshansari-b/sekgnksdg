
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref as databaseRef, onValue, set, runTransaction,push } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

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
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// HTML elements
const videoPlayer = document.getElementById('videoPlayer');
const videoTitle = document.getElementById('videoTitle');
const videoTime = document.getElementById('videoTime');
const userProfilePic = document.getElementById('userProfilePic');
const userName = document.getElementById('userName');
const followBtn = document.getElementById('followBtn');
const followerCount = document.getElementById('followerCount');
const likeBtn = document.getElementById('likeBtn');
const dislikeBtn = document.getElementById('dislikeBtn');
const likeCount = document.getElementById('likeCount');
const viewCount = document.getElementById('viewCount');
const dislikeCount = document.getElementById('dislikeCount');

let user = null;
let videoId = null;

// Get video ID from URL
const urlParams = new URLSearchParams(window.location.search);
videoId = urlParams.get('id');

if (videoId) {
    const videoRef = databaseRef(db, `videos/${videoId}`);
    onValue(videoRef, (snapshot) => {
        const videoData = snapshot.val();
        if (videoData) {
            videoPlayer.innerHTML = `<video controls src="${videoData.videoURL}"></video>`;
            videoTitle.textContent = videoData.title;
            userProfilePic.src = videoData.userProfilePic;
            userName.textContent = videoData.userName;
            videoTime.textContent = calculateElapsedTime(videoData.timestamp);
            updateFollowerCount(videoData.userId);
            checkIfFollowing(videoData.userId);
            updateLikeDislikeCount(videoId);
            checkIfLikedDisliked(videoId);
            incrementViewCount(videoId);  // Increment view count
            updateViewCount(videoId);
        } else {
            videoPlayer.innerHTML = `<p>Video not found</p>`;
        }
    });
} else {
    videoPlayer.innerHTML = `<p>Invalid video ID</p>`;
}

// Check authentication state
onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
        user = currentUser;
    } else {
        signInWithPopup(auth, provider).then((result) => {
            user = result.user;
        }).catch((error) => {
            console.error("Error during sign in:", error);
        });
    }
});

function calculateElapsedTime(timestamp) {
    const now = Date.now();
    const elapsed = now - timestamp;

    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}

function updateFollowerCount(userId) {
    const userRef = databaseRef(db, `users/${userId}/followersCount`);
    onValue(userRef, (snapshot) => {
        const followersCount = snapshot.val() || 0;
        followerCount.textContent = `Followers: ${followersCount}`;
    });
}

function checkIfFollowing(userId) {
    if (user) {
        const followRef = databaseRef(db, `followers/${userId}/${user.uid}`);
        onValue(followRef, (snapshot) => {
            if (snapshot.exists()) {
                followBtn.textContent = "Following";
                followBtn.classList.remove('not-following');
                followBtn.classList.add('following');
            } else {
                followBtn.textContent = "Follow";
                followBtn.classList.remove('following');
                followBtn.classList.add('not-following');
            }
        });
    }
}

followBtn.addEventListener('click', () => {
    if (!user) {
        alert("Please log in to follow.");
        return;
    }

    const videoRef = databaseRef(db, `videos/${videoId}`);
    onValue(videoRef, (snapshot) => {
        const videoData = snapshot.val();
        if (videoData) {
            const userId = videoData.userId;
            const followRef = databaseRef(db, `followers/${userId}/${user.uid}`);

            runTransaction(followRef, (currentData) => {
                if (currentData) {
                    // Unfollow
                    decrementFollowerCount(userId);
                    return null;
                } else {
                    // Follow
                    incrementFollowerCount(userId);
                    return true;
                }
            }).then((result) => {
                updateFollowerCount(userId);
                checkIfFollowing(userId);

                // Update the follow button text and color
                if (result) {
                    followBtn.textContent = "Following";
                    followBtn.classList.remove('not-following');
                    followBtn.classList.add('following');
                } else {
                    followBtn.textContent = "Follow";
                    followBtn.classList.remove('following');
                    followBtn.classList.add('not-following');
                }
            }).catch((error) => {
                console.error("Error updating follow status:", error);
            });
        }
    });
});

function incrementFollowerCount(userId) {
    const userRef = databaseRef(db, `users/${userId}`);
    runTransaction(userRef, (userData) => {
        if (userData) {
            if (!userData.followersCount) {
                userData.followersCount = 0;
            }
            userData.followersCount++;
        }
        return userData;
    });
}

function decrementFollowerCount(userId) {
    const userRef = databaseRef(db, `users/${userId}`);
    runTransaction(userRef, (userData) => {
        if (userData) {
            if (!userData.followersCount) {
                userData.followersCount = 0;
            }
            userData.followersCount--;
        }
        return userData;
    });
}

function updateLikeDislikeCount(videoId) {
    const likeRef = databaseRef(db, `videos/${videoId}/likesCount`);
    const dislikeRef = databaseRef(db, `videos/${videoId}/dislikesCount`);

    onValue(likeRef, (snapshot) => {
        const likesCount = snapshot.val() || 0;
        likeCount.textContent = `Likes: ${likesCount}`;
    });

    onValue(dislikeRef, (snapshot) => {
        const dislikesCount = snapshot.val() || 0;
        dislikeCount.textContent = `Dislikes: ${dislikesCount}`;
    });
}

function checkIfLikedDisliked(videoId) {
    if (user) {
        const likeRef = databaseRef(db, `likes/${videoId}/${user.uid}`);
        const dislikeRef = databaseRef(db, `dislikes/${videoId}/${user.uid}`);

        onValue(likeRef, (snapshot) => {
            if (snapshot.exists()) {
                likeBtn.classList.add('liked');
                likeBtn.classList.remove('not-liked');
            } else {
                likeBtn.classList.remove('liked');
                likeBtn.classList.add('not-liked');
            }
        });

        onValue(dislikeRef, (snapshot) => {
            if (snapshot.exists()) {
                dislikeBtn.classList.add('disliked');
                dislikeBtn.classList.remove('not-disliked');
            } else {
                dislikeBtn.classList.remove('disliked');
                dislikeBtn.classList.add('not-disliked');
            }
        });
    }
}

likeBtn.addEventListener('click', () => {
    if (!user) {
        alert("Please log in to like.");
        return;
    }

    const likeRef = databaseRef(db, `likes/${videoId}/${user.uid}`);
    const dislikeRef = databaseRef(db, `dislikes/${videoId}/${user.uid}`);

    runTransaction(likeRef, (currentData) => {
        if (currentData) {
            decrementLikeCount(videoId);  // Unlike
            return null;
        } else {
            incrementLikeCount(videoId);  // Like
            set(dislikeRef, null); // Remove dislike if exists
            return true;
        }
    }).then(() => {
        updateLikeDislikeCount(videoId);
        checkIfLikedDisliked(videoId);
    }).catch((error) => {
        console.error("Error updating like status:", error);
    });
});

dislikeBtn.addEventListener('click', () => {
    if (!user) {
        alert("Please log in to dislike.");
        return;
    }

    const likeRef = databaseRef(db, `likes/${videoId}/${user.uid}`);
    const dislikeRef = databaseRef(db, `dislikes/${videoId}/${user.uid}`);

    runTransaction(dislikeRef, (currentData) => {
        if (currentData) {
            decrementDislikeCount(videoId);  // Un-dislike
            return null;
        } else {
            incrementDislikeCount(videoId);  // Dislike
            set(likeRef, null); // Remove like if exists
            return true;
        }
    }).then(() => {
        updateLikeDislikeCount(videoId);
        checkIfLikedDisliked(videoId);
    }).catch((error) => {
        console.error("Error updating dislike status:", error);
    });
});

function incrementLikeCount(videoId) {
    const videoRef = databaseRef(db, `videos/${videoId}`);
    runTransaction(videoRef, (videoData) => {
        if (videoData) {
            if (!videoData.likesCount) {
                videoData.likesCount = 0;
            }
            videoData.likesCount++;
        }
        return videoData;
    });
}

function decrementLikeCount(videoId) {
    const videoRef = databaseRef(db, `videos/${videoId}`);
    runTransaction(videoRef, (videoData) => {
        if (videoData) {
            if (!videoData.likesCount) {
                videoData.likesCount = 0;
            }
            videoData.likesCount--;
        }
        return videoData;
    });
}

function incrementDislikeCount(videoId) {
    const videoRef = databaseRef(db, `videos/${videoId}`);
    runTransaction(videoRef, (videoData) => {
        if (videoData) {
            if (!videoData.dislikesCount) {
                videoData.dislikesCount = 0;
            }
            videoData.dislikesCount++;
        }
        return videoData;
    });
}

function decrementDislikeCount(videoId) {
    const videoRef = databaseRef(db, `videos/${videoId}`);
    runTransaction(videoRef, (videoData) => {
        if (videoData) {
            if (!videoData.dislikesCount) {
                videoData.dislikesCount = 0;
            }
            videoData.dislikesCount--;
        }
        return videoData;
    });
}

// function incrementViewCount(videoId) {
//     const viewRef = databaseRef(db, `videos/${videoId}`);
//     runTransaction(viewRef, (videoData) => {
//         if (videoData) {
//             if (!videoData.viewsCount) {
//                 videoData.viewsCount = 0;
//             }
//             videoData.viewsCount++;
//         }
//         return videoData;
//     }).then(() => {
//         updateViewCount(videoId);
//     }).catch((error) => {
//         console.error("Error incrementing view count:", error);
//     });
// }

// function updateViewCount(videoId) {
//     const viewCountRef = databaseRef(db, `videos/${videoId}/viewsCount`);
//     onValue(viewCountRef, (snapshot) => {
//         const count = snapshot.val() || 0;
//         viewCount.textContent = `Views: ${count}`;
//     });
// }

function incrementViewCount(videoId) {
    const viewCountRef = databaseRef(db, `views/${videoId}`);
    runTransaction(viewCountRef, (viewCount) => {
        return (viewCount || 0) + 1;
    });
}

function updateViewCount(videoId) {
    const viewCountRef = databaseRef(db, `views/${videoId}`);
    onValue(viewCountRef, (snapshot) => {
        const count = snapshot.val();
        viewCount.textContent = `Views: ${count}`;
    });
}

const commentInput = document.getElementById('commentInput');
const commentSubmitBtn = document.getElementById('commentSubmitBtn');
const commentsList = document.getElementById('commentsList');

// Listen for comment submission
commentSubmitBtn.addEventListener('click', () => {
    if (!user) {
        alert("Please log in to comment.");
        return;
    }

    const commentText = commentInput.value.trim();
    if (commentText === '') {
        alert("Comment cannot be empty.");
        return;
    }

    const newCommentRef = push(databaseRef(db, `comments/${videoId}`));
    set(newCommentRef, {
        userId: user.uid,
        userName: user.displayName,
        userProfilePic: user.photoURL,
        text: commentText,
        timestamp: Date.now()
    }).then(() => {
        commentInput.value = '';
        loadComments();
    }).catch((error) => {
        console.error("Error submitting comment:", error);
    });
});

// Load comments
function loadComments() {
    const commentsRef = databaseRef(db, `comments/${videoId}`);
    onValue(commentsRef, (snapshot) => {
        commentsList.innerHTML = '';
        const commentsData = snapshot.val();
        if (commentsData) {
            const commentsArray = Object.values(commentsData).sort((a, b) => b.timestamp - a.timestamp);
            commentsArray.forEach(comment => {
                const commentItem = document.createElement('div');
                commentItem.className = 'comment-item';
                commentItem.innerHTML = `
                    <img src="${comment.userProfilePic}" alt="User Profile Picture">
                    <div class="comment-content">
                        <div class="comment-username">${comment.userName}</div>
                        <div class="comment-text">${comment.text}</div>
                    </div>
                `;
                commentsList.appendChild(commentItem);
            });
        } else {
            commentsList.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        }
    });
}

// (Your existing code to load video, likes, dislikes, etc.)

// Load comments when video is loaded
if (videoId) {
    loadComments();
}