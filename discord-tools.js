let spamInterval = null;
let messageCounter = 0;
const audio = new Audio('https://www.youtube.com/watch?v=BsOjz88B-AE');
audio.loop = true;

function updateCounter() {
    document.getElementById('message-counter').textContent = messageCounter;
}

async function sendMessage() {
    const webhook = document.getElementById('webhook-url').value;
    const content = document.getElementById('message-content').value;

    try {
        const response = await fetch(webhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        });

        if (response.ok) {
            messageCounter++;
            updateCounter();
            showStatus(`Messages sent: ${messageCounter}`, 'success');
        } else {
            showStatus('Failed to send message', 'error');
        }
    } catch (error) {
        showStatus('Error sending message', 'error');
    }
}

function toggleSpam() {
    const btn = document.getElementById('spam-btn');
    if (spamInterval) {
        clearInterval(spamInterval);
        spamInterval = null;
        btn.textContent = 'Start Spam';
        btn.classList.remove('active');
        showStatus('Spam stopped', 'success');
        audio.pause();
    } else {
        btn.textContent = 'Stop Spam';
        btn.classList.add('active');
        spamInterval = setInterval(sendMessage, 10); // 0.01 seconds
        showStatus('Spam started', 'success');
        audio.play();
    }
}

async function deleteWebhook() {
    const webhook = document.getElementById('webhook-url').value;
    try {
        const response = await fetch(webhook, {
            method: 'DELETE',
        });

        if (response.ok) {
            showStatus('Webhook deleted successfully!', 'success');
        } else {
            showStatus('Failed to delete webhook', 'error');
        }
    } catch (error) {
        showStatus('Error deleting webhook', 'error');
    }
}

function showStatus(message, type) {
    const status = document.getElementById('status-message');
    status.textContent = message;
    status.className = 'status ' + type;
    status.style.display = 'block';
    if (!spamInterval) {
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }
}