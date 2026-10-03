window.addEventListener('DOMContentLoaded', () => {
  const signupBtn = document.getElementById('signup-btn');
  const loginBtn = document.getElementById('login-btn');

  if (signupBtn) {
    signupBtn.onclick = function() {
      alert("Sign Up button hojjeteera! Testing success!");
    };
  }

  if (loginBtn) {
    loginBtn.onclick = function() {
      alert("Log In button hojjeteera!");
    };
  }
});
