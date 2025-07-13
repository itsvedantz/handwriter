window.onSignIn = function onSignIn(googleUser) {
  const idToken = googleUser.getAuthResponse().id_token;

  fetch('/google-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ idToken })
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === 'Login successful') {
        document.querySelector('main').style.display = 'block';
        document.querySelector('.g-signin2').style.display = 'none';
      } else {
        alert('Google login failed');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred during Google login.');
    });
};
