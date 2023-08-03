const readline = require('readline');
const fs = require('fs');
const { exec } = require('child_process');

// const caddyfile = '/etc/caddy/Caddyfile';
const caddyfile = 'Caddyfile';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to stop the Caddy server
function stopCaddy() {
  exec('sudo caddy stop', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error stopping Caddy: ${error.message}`);
    } else {
      console.log(`Caddy stopped: ${stdout}`);
      setTimeout(startCaddy, 5000); // Wait for 5 seconds before starting Caddy again
    }
  });
}

// Function to start the Caddy server
function startCaddy() {
  exec('sudo caddy run --config /etc/caddy/Caddyfile --resume', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting Caddy: ${error.message}`);
    } else {
      console.log(`Caddy started in background: ${stdout}`);
    }
  });
}

// Function to append the template to the Caddyfile
function appendTemplate(subdomain, subdomain_local_port) {
  const template = `${subdomain}.rontohub.com {
    reverse_proxy localhost:${subdomain_local_port}
  }\n`;

  fs.appendFile(caddyfile, template, (err) => {
    if (err) {
      console.error(`Error appending template to ${caddyfile}: ${err}`);
    } else {
      console.log(`Template appended to ${caddyfile}`);
      stopCaddy();
    }
  });
}

// Ask user for input
rl.question('Enter subdomain: ', (subdomain) => {
  rl.question('Enter subdomain local port: ', (subdomain_local_port) => {
    rl.close();
    // Ensure sudo mode
    if (process.getuid() !== 0) {
      console.error('Please run the script with sudo');
      process.exit(1);
    }
    appendTemplate(subdomain, subdomain_local_port);
  });
});
