  document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const interests = [];
    if (document.getElementById('advertising').checked) interests.push(document.getElementById('advertising').value);
    if (document.getElementById('youtube').checked) interests.push(document.getElementById('youtube').value);
    if (document.getElementById('music').checked) interests.push(document.getElementById('music').value);
    if (document.getElementById('other').checked) interests.push(document.getElementById('other').value);
    const message = document.getElementById('message').value;

    const data = {
      title: `Lead from ${name}`,
      person_id: {
        name: name,
        email: [{ value: email, primary: true }],
        phone: [{ value: phone, primary: true }]
      },
      note: `Interests: ${interests.join(', ')}\nMessage: ${message}`
    };

    fetch('https://api.pipedrive.com/v1/leads?api_token=1a23c37e86b33ae9af63b7d2c2c72d36d5243a08', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Your message has been sent successfully!');
        document.getElementById('contactForm').reset();
      } else {
        alert('There was an error sending your message. Please try again later.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('There was an error sending your message. Please try again later.');
    });
  });