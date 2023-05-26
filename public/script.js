// public/script.js
const form = document.getElementById('waitlistForm');
const message = document.getElementById('message');


form.addEventListener('submit', function(event) {
    // Prevent the form from submitting normally
    event.preventDefault();
  
    // Get form data
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;
    const role = document.getElementById('roleInput').value;
    const termsChecked = document.getElementById('termsCheckbox').checked;
  
    // Check if the terms and conditions are accepted
    if (!termsChecked) {
      message.textContent = 'You must agree to the terms and conditions';
      message.style.color = 'red';
      return;
    }
  
    // Send an AJAX request to the signup route
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, role }),
    })
    .then(response => {
      if (response.ok) {
        // Clear the form and display a success message
        form.reset();
        message.textContent = 'Data saved successfully';
        message.style.color = 'green';
      } else {
        // Display a failure message
        message.textContent = 'Error: ' + response.statusText;
        message.style.color = 'red';
      }
    })
    .catch((error) => {
      // Display a failure message
      message.textContent = 'Error: ' + error;
      message.style.color = 'red';
    });
  });
  