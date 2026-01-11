const http = require('http');

const data = JSON.stringify({
  text: "Book dentist next Friday at 3pm"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/process-appointment',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    try {
        const jsonResponse = JSON.parse(body);
        console.log('Response Body:');
        console.log(JSON.stringify(jsonResponse, null, 2));
    } catch (e) {
        console.log('Raw Body:', body);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
  console.log('Make sure the server is running with "npm start"!');
});

req.write(data);
req.end();
