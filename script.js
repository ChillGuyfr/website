let currentTransformation = 'wrap';

function setTransformation(type) {
    currentTransformation = type;
    transformText();
}

function transformText() {
    let text = document.getElementById('letterInput').value;
    let output = document.getElementById('output');

    if (text) {
        let transformedText = '';
        switch (currentTransformation) {
            case 'wrap':
                transformedText = text.split('').map(char => `<${char}>`).join('');
                break;
            case 'leetspeak':
                transformedText = text.replace(/a/g, '4')
                    .replace(/e/g, '3')
                    .replace(/i/g, '1')
                    .replace(/o/g, '0')
                    .replace(/t/g, '7')
                    .replace(/s/g, '5');
                break;
            case 'uppercase':
                transformedText = text.toUpperCase();
                break;
            case 'reverse':
                transformedText = text.split('').reverse().join('');
                break;
            case 'alternate':
                transformedText = text.split('')
                    .map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase())
                    .join('');
                break;
            case 'piglatin':
                transformedText = pigLatin(text);
                break;
            case 'morse':
                transformedText = toMorse(text);
                break;
            case 'base64':
                transformedText = btoa(text);
                break;
            case 'sha256':
                sha256(text).then(hash => output.textContent = hash);
                return;
            case 'removeSpaces':
                transformedText = text.replace(/\s+/g, '');
                break;
        }
        output.textContent = transformedText;
    } else {
        output.textContent = '';
    }
}

function clearInput() {
    document.getElementById('letterInput').value = '';
    document.getElementById('output').textContent = '';
}

function copyOutput() {
    let outputText = document.getElementById('output').textContent;
    if (outputText) {
        navigator.clipboard.writeText(outputText).then(() => {
            alert('Output copied to clipboard!');
        });
    }
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabs.forEach(tab => {
        tab.style.display = tab.id === tabId ? 'block' : 'none';
    });

    tabButtons.forEach(button => {
        if (button.textContent.toLowerCase().includes(tabId.replace('-', ' '))) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Discord Tools
let spamInterval;

function sendMessage() {
    const webhookURL = document.getElementById('webhook-url').value;
    const messageContent = document.getElementById('message-content').value;

    if (webhookURL && messageContent) {
        fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: messageContent })
        }).then(response => {
            if (response.ok) {
                updateMessageCounter();
                displayStatus('Message sent successfully!', 'success');
            } else {
                displayStatus('Failed to send message. Check the webhook URL.', 'error');
            }
        }).catch(() => displayStatus('An error occurred.', 'error'));
    } else {
        displayStatus('Please provide a valid webhook URL and message content.', 'error');
    }
}

function toggleSpam() {
    const webhookURL = document.getElementById('webhook-url').value;
    const messageContent = document.getElementById('message-content').value;
    const spamButton = document.getElementById('spam-btn');

    if (spamInterval) {
        clearInterval(spamInterval);
        spamInterval = null;
        spamButton.textContent = 'Start Spam';
    } else if (webhookURL && messageContent) {
        spamInterval = setInterval(() => sendMessage(), 1000);
        spamButton.textContent = 'Stop Spam';
    } else {
        displayStatus('Please provide a valid webhook URL and message content.', 'error');
    }
}

function deleteWebhook() {
    const webhookURL = document.getElementById('webhook-url').value;

    if (webhookURL) {
        fetch(webhookURL, { method: 'DELETE' }).then(response => {
            if (response.ok) {
                displayStatus('Webhook deleted successfully!', 'success');
            } else {
                displayStatus('Failed to delete webhook. Check the webhook URL.', 'error');
            }
        }).catch(() => displayStatus('An error occurred.', 'error'));
    } else {
        displayStatus('Please provide a valid webhook URL.', 'error');
    }
}

function updateMessageCounter() {
    const counter = document.getElementById('message-counter');
    counter.textContent = parseInt(counter.textContent) + 1;
}

function displayStatus(message, type) {
    const statusMessage = document.getElementById('status-message');
    statusMessage.textContent = message;
    statusMessage.className = `status ${type}`;
    setTimeout(() => statusMessage.textContent = '', 3000);
}

// Helper Functions
function pigLatin(text) {
    return text.split(' ').map(word => {
        let firstLetter = word[0];
        return word.slice(1) + firstLetter + 'ay';
    }).join(' ');
}

function toMorse(text) {
    const morseCode = {
        'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
        'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
        'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
        's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
        'y': '-.--', 'z': '--..', '0': '-----', '1': '.----', '2': '..---',
        '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
        '8': '---..', '9': '----.', ' ': ' '
    };
    return text.toLowerCase().split('').map(char => morseCode[char] || '').join(' ');
}

async function sha256(text) {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
