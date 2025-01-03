document.getElementById('sendBtn').addEventListener('click', () => {
    // Get the Webhook URL and message
    const webhookUrl = document.getElementById('webhook').value;
    const message = document.getElementById('message').value;

    // Check if the webhook URL is valid
    if (!webhookUrl || !message) {
        alert("Please provide both a valid webhook URL and a message.");
        return;
    }

    // Prepare the payload
    let payload = {
        content: message
    };

    // Check additional options and add them to the payload
    if (document.getElementById('mentionEveryone').checked) {
        payload.content = "@everyone " + payload.content;
    }

    if (document.getElementById('mentionHere').checked) {
        payload.content = "@here " + payload.content;
    }

    if (document.getElementById('addTimestamp').checked) {
        payload.timestamp = new Date().toISOString();
    }

    if (document.getElementById('customEmoji').checked) {
        payload.content += " :custom_emoji:";
    }

    if (document.getElementById('sendEmbed').checked) {
        payload.embeds = [{
            title: "Embed Title",
            description: "This is an embed description",
            color: 16711680,  // Red color
            timestamp: new Date().toISOString()
        }];
    }

    if (document.getElementById('includeImage').checked) {
        payload.embeds = payload.embeds || [];
        payload.embeds[0] = payload.embeds[0] || {};
        payload.embeds[0].image = { url: "https://example.com/image.png" };
    }

    if (document.getElementById('includeVideo').checked) {
        payload.embeds = payload.embeds || [];
        payload.embeds[0] = payload.embeds[0] || {};
        payload.embeds[0].video = { url: "https://example.com/video.mp4" };
    }

    if (document.getElementById('addFile').checked) {
        alert("File attachment feature is not implemented here.");
    }

    if (document.getElementById('changeColor').checked) {
        payload.embeds = payload.embeds || [];
        payload.embeds[0] = payload.embeds[0] || {};
        payload.embeds[0].color = 3447003;  // Blue color
    }

    if (document.getElementById('footerText').checked) {
        payload.embeds = payload.embeds || [];
        payload.embeds[0] = payload.embeds[0] || {};
        payload.embeds[0].footer = { text: "This is the footer text" };
    }

    if (document.getElementById('authorName').checked) {
        payload.embeds = payload.embeds || [];
        payload.embeds[0] = payload.embeds[0] || {};
        payload.embeds[0].author = { name: "Author Name", icon_url: "https://example.com/author_icon.png" };
    }

    // Send request to the Discord Webhook
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('status').textContent = "Message sent successfully!";
    })
    .catch(error => {
        document.getElementById('status').textContent = "Error sending message.";
        console.error("Error sending message: ", error);
    });
});
