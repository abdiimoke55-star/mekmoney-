// Firebase Configuration
const firebaseConfig = {
  databaseURL: "https://mekmoney-633a9-default-rtdb.firebaseio.com"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const database = firebase.database();

// Event Listener for Sign Up
document.addEventListener('DOMContentLoaded', () => {
  const signupBtn = document.getElementById('signup-btn');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (signupBtn) {
    signupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
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
    });
  }
});
