window.addEventListener('DOMContentLoaded', () => {
  // Firebase Configuration
  const firebaseConfig = {
    databaseURL: "https://mekmoney-633a9-default-rtdb.firebaseio.com"
  };

  // Initialize Firebase safely
  if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();
  const database = firebase.database();

  const signupBtn = document.getElementById('signup-btn');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const authBox = document.getElementById('auth-box');
  const dashboard = document.getElementById('dashboard');
  const userBalance = document.getElementById('user-balance');

  // Sign Up Click
  if (signupBtn) {
    signupBtn.onclick = function(e) {
      if (e) e.preventDefault();
      
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
    };
  }

  // Log In Click
  if (loginBtn) {
    loginBtn.onclick = function(e) {
      if (e) e.preventDefault();
      
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
    };
  }

  // Log Out Click
  if (logoutBtn) {
    logoutBtn.onclick = function() {
      auth.signOut();
    };
  }

  // Auth State Listener
  auth.onAuthStateChanged((user) => {
    if (user) {
      if (authBox) authBox.style.display = 'none';
      if (dashboard) dashboard.style.display = 'block';

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
});
