document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileImage').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});
document.getElementById('shareButton').addEventListener('click', function() {
    // Check if the Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: 'John Doe\'s Profile',
            text: 'Check out this profile!',
            url: window.location.href, // Share current page URL
        }).then(() => {
            console.log('Profile shared successfully');
        }).catch((error) => {
            console.error('Error sharing the profile:', error);
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        alert('Your browser does not support the Web Share API. Please copy the URL manually.');
    }
});
// chatbot_-->
document.getElementById('sendBtn').addEventListener('click', function() {
    sendMessage();
});

document.getElementById('userInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const userInput = document.getElementById('userInput').value.trim();
    
    if (userInput === '') return;

    // Display user message
    const chatBox = document.getElementById('chatBox');
    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'user-message');
    userMessage.textContent = 'You: ' + userInput;
    chatBox.appendChild(userMessage);

    // Clear input
    document.getElementById('userInput').value = '';

    // Scroll to the bottom of the chat box
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulate bot reply
    setTimeout(function() {
        const botMessage = document.createElement('div');
        botMessage.classList.add('message', 'bot-message');

        // Process user input and respond accordingly
        const response = getBotReply(userInput);
        botMessage.textContent = 'Bot: ' + response;
        chatBox.appendChild(botMessage);

        // Scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);
}

function getBotReply(input) {
    input = input.toLowerCase();

    // Simple responses based on keywords
    if (input.includes('hello')) {
        return 'Hi there! How can I assist you today?';
    } else if (input.includes('availability') && input.includes('doctor')) {
        // Generate a random date for doctor availability
        const randomDate = getRandomFutureDate();
        return `The next available appointment with a doctor is on ${randomDate}. Would you like to book it?`;
    } else {
        return 'Sorry, I did not understand that. Can you ask something else?';
    }
}

function getRandomFutureDate() {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + randomDays);

    // Format date as "Month day, Year"
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return futureDate.toLocaleDateString(undefined, options);
}

