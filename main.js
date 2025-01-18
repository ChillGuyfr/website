import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: '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'
});

async function generateSettings(gameType, intensity, trickshots, description) {
  const prompt = `Based on the following inputs, calculate the best ${gameType} sensitivity and DPI settings:
Game Type: ${gameType}
Game Intensity: ${intensity}
Trickshots: ${trickshots ? 'Yes' : 'No'}
Description: ${description}

Important rules:
- Sensitivity must be between 0.1 and 1 (inclusive). Provide the best possible sensitivity value in this range.
- DPI must be between 100 and 800 (inclusive). Provide the best possible DPI value in this range.
Please provide the optimal sensitivity and DPI values accordingly.`;

  try {
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
    return result;
  } catch (error) {
    console.error('Error generating settings:', error);
    throw error;
  }
}

async function generateCustomPrompt(game, skillLevel, goals) {
  const prompt = `Create a detailed gaming profile description for a ${skillLevel} ${game} player with the following goals: ${goals}. 
Focus on describing their playstyle, preferred strategies, and what they want to achieve. 
Keep it concise but informative, perfect for generating sensitivity settings.`;

  try {
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
    return result;
  } catch (error) {
    console.error('Error generating prompt:', error);
    throw error;
  }
}

// DOM Elements
const elements = {
  tabs: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),
  calculator: {
    game: document.getElementById('game'),
    intensity: document.getElementById('intensity'),
    trickshots: document.getElementById('trickshots'),
    description: document.getElementById('description'),
    generateBtn: document.getElementById('generate'),
    result: document.getElementById('result'),
    settingsContent: document.getElementById('settings-content')
  },
  prompt: {
    game: document.getElementById('prompt-game'),
    skillLevel: document.getElementById('skill-level'),
    goals: document.getElementById('goals'),
    generateBtn: document.getElementById('generate-prompt'),
    result: document.getElementById('prompt-result'),
    content: document.getElementById('prompt-content'),
    usePromptBtn: document.getElementById('use-prompt')
  }
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Tab Switching
  elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      // Update active tab
      elements.tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show/hide content
      elements.tabContents.forEach(content => {
        if (content.id === targetTab) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });

  // Calculator Form Submit
  elements.calculator.generateBtn.addEventListener('click', async () => {
    const { game, intensity, trickshots, description, generateBtn, result, settingsContent } = elements.calculator;
    
    if (!game.value || !intensity.value || !description.value) {
      alert('Please fill in all required fields!');
      return;
    }

    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    try {
      const settings = await generateSettings(
        game.value,
        intensity.value,
        trickshots.checked,
        description.value
      );

      settingsContent.textContent = settings;
      result.classList.remove('hidden');
      result.classList.add('visible');
    } catch (error) {
      alert('Error generating settings. Please try again.');
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generate Perfect Settings';
    }
  });

  // Prompt Generator Submit
  elements.prompt.generateBtn.addEventListener('click', async () => {
    const { game, skillLevel, goals, generateBtn, result, content } = elements.prompt;
    
    if (!game.value || !skillLevel.value || !goals.value) {
      alert('Please fill in all required fields!');
      return;
    }

    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    try {
      const customPrompt = await generateCustomPrompt(
        game.value,
        skillLevel.value,
        goals.value
      );

      content.textContent = customPrompt;
      result.classList.remove('hidden');
      result.classList.add('visible');
    } catch (error) {
      alert('Error generating prompt. Please try again.');
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generate Custom Prompt';
    }
  });

  // Use Generated Prompt
  elements.prompt.usePromptBtn.addEventListener('click', () => {
    const generatedPrompt = elements.prompt.content.textContent;
    
    // Switch to calculator tab
    elements.tabs[0].click();
    
    // Fill in the description
    elements.calculator.description.value = generatedPrompt;
  });
});