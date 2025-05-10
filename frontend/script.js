const socket = io();
const secretKey = 'supersecretkey';  // AES key for encryption
let username = '';

// Toggle visibility of elements
const loginDiv = document.getElementById('login');
const chatDiv = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('m');

document.getElementById('connect').addEventListener('click', () => {
  username = document.getElementById('username').value.trim();
  
  if (username) {
    socket.emit("join", username);
    loginDiv.style.display = 'none';
    chatDiv.style.display = 'block';
    form.style.display = 'flex';
  } else {
    alert("Please enter your name to join the chat!");
  }
});

// Encrypt the message using AES
function encryptMessage(message) {
  return CryptoJS.AES.encrypt(message, secretKey).toString();
}

// Decrypt the message
function decryptMessage(encrypted) {
  const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Display the message in the chat
function displayMessage(user, message) {
  const li = document.createElement("li");
  const decryptedMessage = decryptMessage(message);

  // Add class to align messages differently based on the sender
  if (user === username) {
    li.classList.add("message-left");  // Align current user's messages to the right
  } else {
    li.classList.add("message-right"); // Align others' messages to the left
  }

  li.textContent = `${user}: ${decryptedMessage}`;
  chatDiv.appendChild(li);
  chatDiv.scrollTop = chatDiv.scrollHeight;  // Scroll to the bottom
}

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = input.value.trim();
  
  if (message) {
    const encryptedMessage = encryptMessage(message);
    socket.emit("chat message", { user: username, message: encryptedMessage });
    input.value = '';  // Clear input field
  }
});

// Listen for new messages from the server
socket.on("chat message", ({ user, message }) => {
  displayMessage(user, message);  // Show the message from the server
});
