function validatePasswords() {
  const Pass = document.getElementById('Pass').value.trim();
  const conPass = document.getElementById('conPass').value.trim();

  const passAlert = document.getElementById('passAlert');
  const conPassAlert = document.getElementById('conPassAlert');

  // Hide all alerts initially
  passAlert.classList.add('d-none');
  conPassAlert.classList.add('d-none');

  // Password strength regex
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

  // Strength check
  if (Pass && !strongPasswordRegex.test(Pass)) {
    passAlert.textContent =
      'At least 1 uppercase, 1 lowercase, 1 number, 1 special character, and min 8 characters';
    passAlert.classList.remove('d-none');
  }

  // Match check
  if (conPass && Pass !== conPass) {
    conPassAlert.textContent = 'Passwords do not match';
    conPassAlert.classList.remove('d-none');
  }
}

// main clicker()
async function clicker() {
  const oldPass = document.getElementById('OldPass').value.trim();
  const Pass = document.getElementById('Pass').value.trim();
  const conPass = document.getElementById('conPass').value.trim();

  // Re-run validation to ensure up-to-date checks
  validatePasswords();

  const oldPassAlert = document.getElementById('oldPassAlert');
  const errorAlert = document.getElementById('errorAlert');

  // Hide old alerts
  oldPassAlert.classList.add('d-none');
  errorAlert.classList.add('d-none');

  // Stop if fields invalid
  const hasVisibleError = [...document.querySelectorAll('.text-danger')]
    .some(el => !el.classList.contains('d-none'));
  if (hasVisibleError || !oldPass) {
    if (!oldPass) {
      oldPassAlert.textContent = 'Please enter your old password';
      oldPassAlert.classList.remove('d-none');
    }
    return;
  }

  try {
    const res = await fetch('/checkPasswords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPass, Pass })
    });

    const data = await res.json();

    if (data.success) {
      await Swal.fire({
        icon: 'success',
        title: 'Password changed successfully!',
        confirmButtonText: 'OK'
      });
      window.location.replace('/profile');
    } else if (data.notfound) {
      Swal.fire({
        icon: 'error',
        title: 'Incorrect Old Password',
        text: 'Please enter your correct old password'
      });
    } else if (data.errors) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.errors
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Unknown Error',
        text: 'Something went wrong, please try again later.'
      });
    }
  } catch (error) {
    console.error('Fetch error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Network Error',
      text: 'Failed to connect to the server. Please try again.'
    });
  }
}
