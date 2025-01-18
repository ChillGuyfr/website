import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true // Enable browser usage
});

// Make functions available globally
globalThis.switchTab = function(tabId) {
  // Update active tab button
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase().includes(tabId)) {
      btn.classList.add('active');
    }
  });

  // Show/hide tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    if (content.id === tabId) {
      content.classList.remove('hidden');
    } else {
      content.classList.add('hidden');
    }
  });
};

globalThis.generateSettings = async function() {
  const game = document.getElementById('game').value;
  const intensity = document.getElementById('intensity').value;
  const trickshots = document.getElementById('trickshots').checked;
  const description = document.getElementById('description').value;

  if (!game || !intensity || !description) {
    alert('Please fill in all required fields!');
    return;
  }

  const generateBtn = document.querySelector('#calculator .generate-btn');
  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';

  try {
    const prompt = `Based on the following inputs, calculate the best ${game} sensitivity and DPI settings:
Game Type: ${game}
Game Intensity: ${intensity}
Trickshots: ${trickshots ? 'Yes' : 'No'}
Description: ${description}

Important rules:
- Sensitivity must be between 0.1 and 1 (inclusive). Provide the best possible sensitivity value in this range.
- DPI must be between 100 and 800 (inclusive). Provide the best possible DPI value in this range.
Please provide the optimal sensitivity and DPI values accordingly.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 1,
      max_completion_tokens: 32768,
      top_p: 1,
      stream: true
    });

    let result = '';
    for await (const chunk of completion) {
      result += chunk.choices[0]?.delta?.content || '';
    }

    document.getElementById('settings-content').textContent = result;
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('result').classList.add('visible');
  } catch (error) {
    alert('Error generating settings. Please try again.');
    console.error('Error:', error);
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Perfect Settings';
  }
};

globalThis.generatePrompt = async function() {
  const game = document.getElementById('prompt-game').value;
  const skillLevel = document.getElementById('skill-level').value;
  const goals = document.getElementById('goals').value;

  if (!game || !skillLevel || !goals) {
    alert('Please fill in all required fields!');
    return;
  }

  const generateBtn = document.querySelector('#prompt .generate-btn');
  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';

  try {
    const prompt = `Create a detailed gaming profile description for a ${skillLevel} ${game} player with the following goals: ${goals}. 
Focus on describing their playstyle, preferred strategies, and what they want to achieve. 
Keep it concise but informative, perfect for generating sensitivity settings.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_completion_tokens: 32768,
      top_p: 1,
      stream: true
    });

    let result = '';
    for await (const chunk of completion) {
      result += chunk.choices[0]?.delta?.content || '';
    }

    document.getElementById('prompt-content').textContent = result;
    document.getElementById('prompt-result').classList.remove('hidden');
    document.getElementById('prompt-result').classList.add('visible');
  } catch (error) {
    alert('Error generating prompt. Please try again.');
    console.error('Error:', error);
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Custom Prompt';
  }
};

globalThis.usePrompt = function() {
  const generatedPrompt = document.getElementById('prompt-content').textContent;
  document.getElementById('description').value = generatedPrompt;
  switchTab('calculator');
};
