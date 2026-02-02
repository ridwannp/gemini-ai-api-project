document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    // Helper function to append messages to the chat box
    const appendMessage = (role, content) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        messageDiv.textContent = content;
        chatBox.appendChild(messageDiv);
        
        // Scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
        
        return messageDiv;
    };

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const message = userInput.value.trim();
        if (!message) return;

        // Clear input field
        userInput.value = '';

        // 1. Add user's message to the chat box
        appendMessage('user', message);

        // 2. Show a temporary "Thinking..." bot message
        const thinkingMessage = appendMessage('bot', 'Thinking...');

        try {
            // 3. Send the user's message as a POST request to /api/chat
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    conversation: [
                        { role: 'user', content: message }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // 4. When the response arrives, replace the "Thinking..." message with the AI's reply
            if (data && data.result) {
                thinkingMessage.textContent = data.result;
            } else {
                thinkingMessage.textContent = 'Sorry, no response received.';
            }

        } catch (error) {
            // 5. If an error occurs, show error message
            console.error('Error:', error);
            thinkingMessage.textContent = 'Failed to get response from server.';
            thinkingMessage.classList.add('error-message');
        }
    });
});
