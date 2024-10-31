document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const interests = [];
  const api_token = '1a23c37e86b33ae9af63b7d2c2c72d36d5243a08';

  if (document.getElementById('advertising').checked) interests.push(document.getElementById('advertising').value);
  if (document.getElementById('youtube').checked) interests.push(document.getElementById('youtube').value);
  if (document.getElementById('music').checked) interests.push(document.getElementById('music').value);
  if (document.getElementById('other').checked) interests.push(document.getElementById('other').value);
  const message = document.getElementById('message').value;

  const personData = {
      name: name,
      email: [{ value: email, primary: true }],
      phone: [{ value: phone, primary: true }]
  };

  // First, create a person in Pipedrive
  fetch(`https://api.pipedrive.com/v1/persons?api_token=${api_token}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(personData)
  })
  .then(response => response.json())
  .then(personResponse => {
      if (personResponse.success) {
          const leadData = {
              title: `Lead from ${name}`,
              person_id: personResponse.data.id
          };

          // Then, create a lead in Pipedrive
          return fetch(`https://api.pipedrive.com/v1/leads?api_token=${api_token}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(leadData)
          })
          .then(response => response.json())
          .then(leadResponse => {
              if (leadResponse.success) {
                  const noteData = {
                      content: `Interests: ${interests.join(', ')}\nMessage: ${message}`,
                      lead_id: leadResponse.data.id
                  };

                  // Create a note for the lead
                  return fetch(`https://api.pipedrive.com/v1/notes?api_token=${api_token}`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(noteData)
                  });
              } else {
                  throw new Error('Failed to create lead in Pipedrive');
              }
          });
      } else {
          throw new Error('Failed to create person in Pipedrive');
      }
  })
  .then(response => response.json())
  .then(noteResponse => {
      if (noteResponse.success) {
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