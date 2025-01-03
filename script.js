// Loading screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
        }, 500);
    }, 1500);
});

let currentTransformation = 'wrap';

function setTransformation(type) {
    currentTransformation = type;
    transformText();
}

function transformText() {
    const text = document.getElementById('letterInput').value;
    const output = document.getElementById('output');

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
                transformedText = sha256(text);
                break;
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
    const outputText = document.getElementById('output').textContent;
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
        button.classList.toggle('active', button.textContent.toLowerCase().includes(tabId.replace('-', ' ')));
    });
}
