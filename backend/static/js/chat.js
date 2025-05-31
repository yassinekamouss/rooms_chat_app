let socket;
let username;
let room;
let isTyping = false;
let typingTimeout;

const avatarColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

function initializeChat(user, roomName) {
    username = user;
    room = roomName;
    
    // Initialiser Socket.IO
    socket = io();
    
    // Écouter les événements
    setupSocketListeners();
    
    // Rejoindre la room
    socket.emit('join_room', { username, room });
    
    // Configuration de l'input
    setupMessageInput();
    
    console.log(`🚀 Chat initialisé: ${username} dans ${room}`);
}

function setupSocketListeners() {
    socket.on('connected', (data) => {
        console.log('✅ Connecté au serveur');
    });
    
    socket.on('room_joined', (data) => {
        console.log(`✅ Room rejointe: ${data.room}`);
        
        // Afficher les messages existants
        if (data.messages && data.messages.length > 0) {
            data.messages.forEach(message => {
                displayMessage(message);
            });
        }
        
        // Message de bienvenue
        displayNotification(`Bienvenue dans #${data.room}`);
        scrollToBottom();
    });
    
    socket.on('new_message', (message) => {
        displayMessage(message);
        scrollToBottom();
    });
    
    socket.on('user_joined', (data) => {
        displayNotification(`${data.username} a rejoint la conversation`);
        updateUserCount('+');
        scrollToBottom();
    });
    
    socket.on('user_left', (data) => {
        displayNotification(`${data.username} a quitté la conversation`);
        updateUserCount('-');
        scrollToBottom();
    });
    
    socket.on('error', (error) => {
        console.error('❌ Erreur:', error.message);
        alert('Erreur: ' + error.message);
    });
}

function setupMessageInput() {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
        
        // Indicateur de frappe
        if (!isTyping && messageInput.value.trim()) {
            isTyping = true;
            showTypingIndicator();
        }
        
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            isTyping = false;
            hideTypingIndicator();
        }, 1000);
    });
    
    messageInput.addEventListener('input', () => {
        const hasText = messageInput.value.trim().length > 0;
        sendButton.style.background = hasText ? '#4ecdc4' : '#bdc3c7';
        sendButton.disabled = !hasText;
    });
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    socket.emit('send_message', { message });
    messageInput.value = '';
    hideTypingIndicator();
    
    // Reset du bouton
    const sendButton = document.getElementById('send-button');
    sendButton.style.background = '#bdc3c7';
    sendButton.disabled = true;
}

function displayMessage(message) {
    const messagesContainer = document.getElementById('messages');
    const isMyMessage = message.username === username;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${isMyMessage ? 'my-message' : 'other-message'}`;
    
    const time = new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    if (isMyMessage) {
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-bubble my-bubble">
                    ${escapeHtml(message.message)}
                </div>
                <div class="message-time">
                    <i class="fas fa-clock"></i>
                    ${time}
                    <i class="fas fa-check-circle"></i>
                </div>
            </div>
        `;
    } else {
        const avatarColor = getAvatarColor(message.username);
        messageElement.innerHTML = `
            <div class="avatar" style="background-color: ${avatarColor}">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <div class="sender-name">
                    ${escapeHtml(message.username)}
                    <i class="fas fa-user"></i>
                </div>
                <div class="message-bubble other-bubble">
                    ${escapeHtml(message.message)}
                </div>
                <div class="message-time">
                    <i class="fas fa-clock"></i>
                    ${time}
                </div>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageElement);
}

function displayNotification(text) {
    const messagesContainer = document.getElementById('messages');
    const notificationElement = document.createElement('div');
    notificationElement.className = 'notification';
    notificationElement.innerHTML = `
        <i class="fas fa-crown"></i>
        ${escapeHtml(text)}
        <i class="fas fa-star"></i>
    `;
    messagesContainer.appendChild(notificationElement);
}

function showTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'flex';
}

function hideTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'none';
}

function updateUserCount(action) {
    const userCountElement = document.getElementById('user-count');
    const currentText = userCountElement.textContent;
    const currentCount = parseInt(currentText.match(/\d+/)[0]);
    
    let newCount = currentCount;
    if (action === '+') newCount++;
    else if (action === '-') newCount = Math.max(1, currentCount - 1);
    
    userCountElement.textContent = `${newCount} en ligne`;
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getAvatarColor(username) {
    const hash = username.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    return avatarColors[Math.abs(hash) % avatarColors.length];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function leaveRoom() {
    if (confirm('Êtes-vous sûr de vouloir quitter cette conversation ?')) {
        socket.disconnect();
        window.location.href = '/';
    }
}