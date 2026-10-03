// Firebase Configuration
const firebaseConfig = {
  databaseURL: "https://mekmoney-633a9-default-rtdb.firebaseio.com"
};

// Firebase Initialize
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const database = firebase.database();

// DOM Elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const authBox = document.getElementById('auth-box');
const dashboard = document.getElementById('dashboard');
const userBalance = document.getElementById('user-balance');

// Sign Up Function
if (signupBtn) {
  signupBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Maaloo Email fi Password guutuu galchi!");
      return;
    }

    if (password.length < 6) {
      alert("Password'n jechoota/lakkoollee 6 fi isaa ol ta'uu qaba!");
      return;
    }

    signupBtn.innerText = "Eegaa jira...";
    signupBtn.disabled = true;

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Save initial balance to Realtime Database
        return database.ref('users/' + user.uid).set({
          email: email,
          balance: 0,
          createdAt: new Date().toISOString()
        });
      })
      .then(() => {
        alert("Baga gammaddan! Akkoountiin keessan sirriitti uumameera!");
        signupBtn.innerText = "Sign Up";
        signupBtn.disabled = false;
      })
      .catch((error) => {
        alert("Error: " + error.message);
        signupBtn.innerText = "Sign Up";
        signupBtn.disabled = false;
      });
  });
}

// Log In Function
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Maaloo Email fi Password galchi!");
      return;
    }

    loginBtn.innerText = "Eegaa jira...";
    loginBtn.disabled = true;

    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        loginBtn.innerText = "Log In";
        loginBtn.disabled = false;
      })
      .catch((error) => {
        alert("Error: " + error.message);
        loginBtn.innerText = "Log In";
        loginBtn.disabled = false;
      });
  });
}

// Log Out Function
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    auth.signOut();
  });
}

// Auth State Observer
auth.onAuthStateChanged((user) => {
  if (user) {
    if (authBox) authBox.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';

    // Fetch user balance
    database.ref('users/' + user.uid).on('value', (snapshot) => {
      const data = snapshot.val();
      if (data && userBalance) {
        userBalance.innerText = data.balance || 0;
      }
    });
  } else {
    if (authBox) authBox.style.display = 'block';
    if (dashboard) dashboard.style.display = 'none';
  }
});
