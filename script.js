document.getElementById("sendBtn").addEventListener("click", () => {
    const webhookUrl = document.getElementById("webhook").value;
    const message = document.getElementById("message").value;
    const announcementTime = document.getElementById("announcement-time").value;
    const options = getCheckedOptions();

    if (webhookUrl === "" || message === "") {
        document.getElementById("status").textContent = "Please fill in the webhook and message.";
        return;
    }

    document.getElementById("status").textContent = "Sending message...";

    // Simulate sending a message
    setTimeout(() => {
        sendMessageToWebhook(webhookUrl, message, options);
    }, announcementTime * 1000); // Send after the specified time
});

function sendMessageToWebhook(webhookUrl, message, options) {
    // Construct message with selected options
    let finalMessage = message;

    // Apply selected options to message
    if (options.mentionEveryone) finalMessage = "@everyone " + finalMessage;
    if (options.mentionHere) finalMessage = "@here " + finalMessage;
    if (options.addTimestamp) finalMessage += " " + new Date().toISOString();
    if (options.spoilerTag) finalMessage = "||" + finalMessage + "||";
    if (options.customEmoji) finalMessage += " :customemoji:"; // Assuming custom emoji ID is handled

    const embed = {
        title: options.richEmbedTitle ? "Custom Embed Title" : undefined,
        description: options.description ? "This is a description" : undefined,
        color: options.changeColor ? 0x00ff00 : undefined, // Example color change (green)
        footer: options.footerText ? { text: "Custom Footer" } : undefined,
        image: options.includeImage ? { url: "https://example.com/image.png" } : undefined,
        video: options.includeVideo ? { url: "https://example.com/video.mp4" } : undefined,
        timestamp: options.addTimestamp ? new Date().toISOString() : undefined,
    };

    const payload = {
        content: finalMessage,
        embeds: [embed],
    };

    console.log(`Sending message to ${webhookUrl}`);
    console.log(`Message: ${finalMessage}`);
    console.log("Embed: ", embed);

    // Example for actual sending the request to Discord webhook
    fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    }).then(() => {
        document.getElementById("status").textContent = "Message sent successfully!";
    }).catch(error => {
        document.getElementById("status").textContent = "Failed to send message!";
        console.error(error);
    });
}

function getCheckedOptions() {
    const checkedOptions = {};

    // Iterate over all checkboxes and capture their states
    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        checkedOptions[checkbox.id] = checkbox.checked;
    });

    return checkedOptions;
}
