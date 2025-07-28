// AI Lab 3 - Text to Image Functionality

let selectedStyle = 'realistic';
let generationHistory = [];
let generationCount = 0;

// Initialize the lab
document.addEventListener('DOMContentLoaded', () => {
    initializeDataStreams();
    initializeImageLab();
});

// Initialize data streams background effect
function initializeDataStreams() {
    const streamsContainer = document.querySelector('.ai-data-streams');
    
    for (let i = 0; i < 20; i++) {
        const stream = document.createElement('div');
        stream.className = 'image-stream';
        
        const x = Math.random() * window.innerWidth;
        const duration = Math.random() * 12 + 8;
        const delay = Math.random() * 5;
        
        stream.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: -50px;
            width: 2px;
            height: 100px;
            background: linear-gradient(180deg, transparent, #00ff00, transparent);
            animation: image-stream-fall ${duration}s linear infinite;
            animation-delay: ${delay}s;
            opacity: 0.6;
        `;
        
        streamsContainer.appendChild(stream);
    }
    
    // Add image stream animation CSS
    const streamStyles = document.createElement('style');
    streamStyles.textContent = `
        @keyframes image-stream-fall {
            0% { transform: translateY(-100px); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { transform: translateY(${window.innerHeight + 100}px); opacity: 0; }
        }
    `;
    document.head.appendChild(streamStyles);
}

// Initialize image lab interface
function initializeImageLab() {
    // Prompt input handling
    const promptInput = document.getElementById('image-prompt');
    const charCount = document.getElementById('prompt-char-count');
    const generateBtn = document.getElementById('generate-btn');
    
    promptInput.addEventListener('input', () => {
        const count = promptInput.value.length;
        charCount.textContent = `${count}/500`;
        
        if (count > 450) {
            charCount.style.color = '#ff6666';
        } else if (count > 350) {
            charCount.style.color = '#ff9900';
        } else {
            charCount.style.color = '#666';
        }
        
        // Enable/disable generate button
        generateBtn.disabled = count === 0 || count > 500;
    });
    
    // Style selection
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedStyle = btn.dataset.style;
        });
    });
}

// Use quick prompt
function useQuickPrompt(prompt) {
    const promptInput = document.getElementById('image-prompt');
    promptInput.value = prompt;
    
    // Trigger input event to update character count
    promptInput.dispatchEvent(new Event('input'));
    promptInput.focus();
    
    // Add visual feedback
    const clickedBtn = event.target;
    clickedBtn.style.animation = 'pulse-glow 0.5s ease';
    setTimeout(() => {
        clickedBtn.style.animation = '';
    }, 500);
}

// Generate image
async function generateImage() {
    const prompt = document.getElementById('image-prompt').value.trim();
    
    if (!prompt) return;
    
    const startTime = Date.now();
    
    // Show AI thinking and update progress
    showAIThinking();
    updateProgress(0, 'Initializing AI models...');
    
    // Simulate generation process with progress updates
    const progressSteps = [
        { progress: 20, message: 'Processing text prompt...' },
        { progress: 40, message: 'Understanding visual concepts...' },
        { progress: 60, message: 'Generating base composition...' },
        { progress: 80, message: 'Adding details and style...' },
        { progress: 95, message: 'Final rendering...' },
        { progress: 100, message: 'Generation complete!' }
    ];
    
    for (let i = 0; i < progressSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
        updateProgress(progressSteps[i].progress, progressSteps[i].message);
    }
    
    // Generate the actual image
    const generatedImage = await createGeneratedImage(prompt, selectedStyle);
    const generationTime = ((Date.now() - startTime) / 1000).toFixed(1);
    
    hideAIThinking();
    displayGeneratedImage(generatedImage, prompt, selectedStyle, generationTime);
    
    // Add to history
    addToHistory(generatedImage, prompt, selectedStyle, generationTime);
    
    // Show achievement
    generationCount++;
    if (generationCount === 1) {
        showAchievement("🎨 First Creation!", "You've generated your first AI image!");
    } else if (generationCount === 5) {
        showAchievement("🖼️ Image Artist!", "5 images generated - you're getting creative!");
    } else if (generationCount === 10) {
        showAchievement("🏆 Master Creator!", "10 images! You're an AI art master!");
    }
}

// Create generated image (simulated)
async function createGeneratedImage(prompt, style) {
    // Create a canvas to generate a simulated image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;
    
    // Generate based on prompt keywords and style
    const image = generateImageFromPrompt(ctx, prompt, style);
    
    return {
        dataUrl: canvas.toDataURL('image/png'),
        canvas: canvas,
        width: canvas.width,
        height: canvas.height
    };
}

// Generate image from prompt (artistic simulation)
function generateImageFromPrompt(ctx, prompt, style) {
    const words = prompt.toLowerCase().split(' ');
    
    // Base colors and themes based on prompt keywords
    let baseColors = ['#1a1a2e', '#16213e', '#0f3460']; // Default dark theme
    let accentColors = ['#00ff00', '#00ffff', '#ff00ff'];
    
    // Analyze prompt for themes
    if (words.some(w => ['cyberpunk', 'neon', 'futuristic', 'cyber'].includes(w))) {
        baseColors = ['#0a0a0a', '#1a0a2e', '#2e0a4f'];
        accentColors = ['#ff0080', '#00ffff', '#ff8000'];
    } else if (words.some(w => ['fantasy', 'magic', 'forest', 'fairy'].includes(w))) {
        baseColors = ['#0d4f3c', '#1a5f4a', '#2d8659'];
        accentColors = ['#90ee90', '#ffd700', '#ff69b4'];
    } else if (words.some(w => ['space', 'station', 'galaxy', 'star'].includes(w))) {
        baseColors = ['#000011', '#001122', '#002244'];
        accentColors = ['#ffffff', '#4169e1', '#ffd700'];
    } else if (words.some(w => ['underwater', 'ocean', 'sea', 'coral'].includes(w))) {
        baseColors = ['#001f3f', '#003d7a', '#0074d9'];
        accentColors = ['#39cccc', '#ff851b', '#ffdc00'];
    }
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, baseColors[0]);
    gradient.addColorStop(0.5, baseColors[1]);
    gradient.addColorStop(1, baseColors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    // Add geometric shapes based on style
    if (style === 'realistic' || style === 'digital-art') {
        drawRealisticElements(ctx, words, accentColors);
    } else if (style === 'anime' || style === 'cartoon') {
        drawCartoonElements(ctx, words, accentColors);
    } else if (style === 'oil-painting') {
        drawPaintingElements(ctx, words, accentColors);
    } else if (style === 'sketch') {
        drawSketchElements(ctx, words, accentColors);
    }
    
    // Add style-specific effects
    applyStyleEffects(ctx, style);
    
    return ctx.getImageData(0, 0, 512, 512);
}

// Draw realistic/digital art elements
function drawRealisticElements(ctx, words, colors) {
    // Draw buildings for city scenes
    if (words.some(w => ['city', 'building', 'cyberpunk', 'urban'].includes(w))) {
        for (let i = 0; i < 8; i++) {
            const x = (i * 64) + Math.random() * 20;
            const height = 200 + Math.random() * 200;
            const width = 40 + Math.random() * 30;
            
            ctx.fillStyle = colors[i % colors.length] + '80';
            ctx.fillRect(x, 512 - height, width, height);
            
            // Add windows
            for (let j = 0; j < height; j += 30) {
                if (Math.random() > 0.3) {
                    ctx.fillStyle = colors[(i + 1) % colors.length] + 'ff';
                    ctx.fillRect(x + 5, 512 - height + j + 5, 8, 8);
                }
            }
        }
    }
    
    // Draw trees for forest scenes
    if (words.some(w => ['forest', 'tree', 'nature', 'wood'].includes(w))) {
        for (let i = 0; i < 12; i++) {
            const x = Math.random() * 512;
            const y = 300 + Math.random() * 100;
            
            // Tree trunk
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x - 5, y, 10, 212 - y);
            
            // Tree crown
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.arc(x, y, 20 + Math.random() * 15, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Add floating elements for space scenes
    if (words.some(w => ['space', 'station', 'star', 'planet'].includes(w))) {
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const size = Math.random() * 3 + 1;
            
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add a planet
        ctx.fillStyle = colors[0] + '80';
        ctx.beginPath();
        ctx.arc(400, 100, 60, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw cartoon elements
function drawCartoonElements(ctx, words, colors) {
    // Simpler, more colorful shapes
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 40 + 20;
        
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        
        if (Math.random() > 0.5) {
            // Circle
            ctx.arc(x, y, size, 0, Math.PI * 2);
        } else {
            // Rectangle
            ctx.rect(x - size/2, y - size/2, size, size);
        }
        ctx.fill();
    }
}

// Draw painting elements
function drawPaintingElements(ctx, words, colors) {
    // Brush-like strokes
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const length = Math.random() * 100 + 20;
        const angle = Math.random() * Math.PI * 2;
        
        ctx.strokeStyle = colors[i % colors.length] + '60';
        ctx.lineWidth = Math.random() * 8 + 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        ctx.stroke();
    }
}

// Draw sketch elements
function drawSketchElements(ctx, words, colors) {
    // Line-based drawing
    ctx.strokeStyle = '#ffffff80';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 80 + 20;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.stroke();
        
        // Add cross-hatching
        for (let j = 0; j < 5; j++) {
            ctx.beginPath();
            ctx.moveTo(x - size, y - size + j * 10);
            ctx.lineTo(x + size, y - size + j * 10);
            ctx.stroke();
        }
    }
}

// Apply style-specific effects
function applyStyleEffects(ctx, style) {
    const imageData = ctx.getImageData(0, 0, 512, 512);
    const data = imageData.data;
    
    if (style === 'oil-painting') {
        // Add texture effect
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 30 - 15;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
    } else if (style === 'sketch') {
        // Convert to grayscale with high contrast
        for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
            const contrast = gray > 128 ? 255 : 0;
            data[i] = contrast;
            data[i + 1] = contrast;
            data[i + 2] = contrast;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// Display generated image
function displayGeneratedImage(image, prompt, style, generationTime) {
    const viewport = document.getElementById('image-viewport');
    const imageInfo = document.getElementById('image-info');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    
    // Clear viewport and add image
    viewport.innerHTML = `
        <img src="${image.dataUrl}" alt="Generated Image" class="generated-image">
    `;
    
    // Update image info
    document.getElementById('used-prompt').textContent = prompt;
    document.getElementById('used-style').textContent = getStyleName(style);
    document.getElementById('generation-time').textContent = `${generationTime}s`;
    
    // Show info and controls
    imageInfo.style.display = 'block';
    downloadBtn.style.display = 'inline-block';
    shareBtn.style.display = 'inline-block';
    
    // Store current image for download
    viewport.dataset.imageData = image.dataUrl;
    viewport.dataset.prompt = prompt;
    
    // Animate image appearance
    const img = viewport.querySelector('.generated-image');
    img.style.animation = 'image-appear 1s ease';
}

// Add to history
function addToHistory(image, prompt, style, generationTime) {
    const historyItem = {
        image: image.dataUrl,
        prompt: prompt,
        style: style,
        generationTime: generationTime,
        timestamp: new Date().toISOString()
    };
    
    generationHistory.unshift(historyItem);
    
    // Keep only last 20 generations
    if (generationHistory.length > 20) {
        generationHistory = generationHistory.slice(0, 20);
    }
    
    updateHistoryDisplay();
    
    // Show history section if first generation
    if (generationHistory.length === 1) {
        document.getElementById('history-section').style.display = 'block';
    }
}

// Update history display
function updateHistoryDisplay() {
    const historyGrid = document.getElementById('history-grid');
    
    historyGrid.innerHTML = generationHistory.map((item, index) => `
        <div class="history-item" onclick="viewHistoryItem(${index})">
            <img src="${item.image}" alt="Generated Image ${index + 1}">
            <div class="history-info">
                <div class="history-prompt">${item.prompt.substring(0, 50)}${item.prompt.length > 50 ? '...' : ''}</div>
                <div class="history-meta">
                    <span>${getStyleName(item.style)}</span>
                    <span>${item.generationTime}s</span>
                </div>
            </div>
        </div>
    `).join('');
}

// View history item
function viewHistoryItem(index) {
    const item = generationHistory[index];
    displayGeneratedImage(
        { dataUrl: item.image },
        item.prompt,
        item.style,
        item.generationTime
    );
    
    // Scroll to image display
    document.querySelector('.image-display').scrollIntoView({ behavior: 'smooth' });
}

// Download image
function downloadImage() {
    const viewport = document.getElementById('image-viewport');
    const imageData = viewport.dataset.imageData;
    const prompt = viewport.dataset.prompt;
    
    if (!imageData) {
        alert('No image to download!');
        return;
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `ai-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAchievement("💾 Image Downloaded!", "Your AI creation has been saved!");
}

// Share image
function shareImage() {
    const viewport = document.getElementById('image-viewport');
    const prompt = viewport.dataset.prompt;
    
    if (!prompt) {
        alert('No image to share!');
        return;
    }
    
    // Create share text
    const shareText = `Check out this AI-generated image! Prompt: "${prompt}" - Created with CyberNet Academy AI Lab`;
    
    if (navigator.share) {
        navigator.share({
            title: 'AI Generated Image',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            showAchievement("📤 Share Text Copied!", "Share text copied to clipboard!");
        });
    }
}

// Clear history
function clearHistory() {
    const confirmClear = confirm('Are you sure you want to clear your generation history?');
    
    if (confirmClear) {
        generationHistory = [];
        document.getElementById('history-grid').innerHTML = '';
        document.getElementById('history-section').style.display = 'none';
    }
}

// Update progress
function updateProgress(percentage, message) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('generation-progress');
    
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = message;
}

// Show achievement notification
function showAchievement(title, message) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement-notification';
    achievement.innerHTML = `
        <div class="achievement-icon">${title.split(' ')[0]}</div>
        <div class="achievement-content">
            <div class="achievement-title">${title.substring(2)}</div>
            <div class="achievement-message">${message}</div>
        </div>
    `;
    
    achievement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid #00ff00;
        border-radius: 15px;
        padding: 1rem;
        color: white;
        font-family: 'Orbitron', monospace;
        z-index: 1001;
        animation: achievement-slide-in 0.5s ease;
        max-width: 300px;
        box-shadow: 0 10px 30px rgba(0, 255, 0, 0.3);
    `;
    
    document.body.appendChild(achievement);
    
    // Remove after 4 seconds
    setTimeout(() => {
        achievement.style.animation = 'achievement-slide-out 0.5s ease';
        setTimeout(() => {
            if (achievement.parentNode) {
                achievement.parentNode.removeChild(achievement);
            }
        }, 500);
    }, 4000);
}

// Helper functions
function getStyleName(style) {
    const names = {
        'realistic': 'Realistic',
        'anime': 'Anime',
        'cartoon': 'Cartoon',
        'oil-painting': 'Oil Painting',
        'digital-art': 'Digital Art',
        'sketch': 'Sketch'
    };
    return names[style] || style;
}

// Show/hide AI thinking
function showAIThinking() {
    document.getElementById('ai-thinking').classList.add('show');
}

function hideAIThinking() {
    document.getElementById('ai-thinking').classList.remove('show');
}

// Add image-specific CSS
const imageStyles = document.createElement('style');
imageStyles.textContent = `
    .image-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        background: rgba(0, 0, 0, 0.8);
        border: 2px solid rgba(0, 255, 0, 0.3);
        border-radius: 20px;
        overflow: hidden;
        backdrop-filter: blur(15px);
        box-shadow: 0 10px 50px rgba(0, 255, 0, 0.1);
    }
    
    .prompt-section {
        padding: 2rem;
    }
    
    .prompt-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .prompt-header h3 {
        font-family: 'Orbitron', monospace;
        color: var(--neon-green);
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }
    
    .prompt-input-area {
        margin-bottom: 2rem;
    }
    
    #image-prompt {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(0, 255, 0, 0.3);
        border-radius: 15px;
        padding: 1rem;
        color: white;
        font-family: 'Rajdhani', sans-serif;
        font-size: 1rem;
        resize: vertical;
        min-height: 100px;
        margin-bottom: 1rem;
    }
    
    #image-prompt:focus {
        outline: none;
        border-color: var(--neon-green);
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    }
    
    .prompt-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .generate-btn {
        background: linear-gradient(135deg, var(--neon-green), var(--primary-cyan));
        border: none;
        border-radius: 15px;
        padding: 1rem 2rem;
        color: white;
        font-family: 'Orbitron', monospace;
        font-weight: 700;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .generate-btn:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(0, 255, 0, 0.4);
    }
    
    .generate-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .quick-prompts {
        margin-bottom: 2rem;
    }
    
    .quick-prompts h4 {
        font-family: 'Orbitron', monospace;
        color: var(--primary-cyan);
        margin-bottom: 1rem;
    }
    
    .prompt-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.8rem;
    }
    
    .quick-prompt-btn {
        padding: 0.8rem;
        background: rgba(0, 255, 0, 0.1);
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 10px;
        color: var(--neon-green);
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
    }
    
    .quick-prompt-btn:hover {
        background: rgba(0, 255, 0, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 255, 0, 0.3);
    }
    
    .style-section h4 {
        font-family: 'Orbitron', monospace;
        color: var(--primary-cyan);
        margin-bottom: 1rem;
    }
    
    .style-buttons {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.8rem;
    }
    
    .style-btn {
        padding: 0.8rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        color: #ccc;
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }
    
    .style-btn:hover {
        background: rgba(0, 255, 0, 0.1);
        border-color: var(--neon-green);
    }
    
    .style-btn.selected {
        background: var(--neon-green);
        color: black;
        box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
    }
    
    .image-display {
        padding: 2rem;
        background: rgba(0, 0, 0, 0.3);
    }
    
    .display-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .display-header h3 {
        font-family: 'Orbitron', monospace;
        color: var(--neon-green);
        font-size: 1.3rem;
    }
    
    .image-controls {
        display: flex;
        gap: 1rem;
    }
    
    .image-viewport {
        width: 100%;
        height: 400px;
        border: 2px solid rgba(0, 255, 0, 0.3);
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.5);
        margin-bottom: 1rem;
    }
    
    .placeholder-content {
        text-align: center;
        color: #666;
    }
    
    .placeholder-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        animation: placeholder-float 3s ease-in-out infinite;
    }
    
    .generated-image {
        max-width: 100%;
        max-height: 100%;
        border-radius: 10px;
    }
    
    .image-info {
        background: rgba(0, 255, 0, 0.05);
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 10px;
        padding: 1rem;
    }
    
    .info-item {
        display: flex;
        margin-bottom: 0.5rem;
    }
    
    .info-item .label {
        font-family: 'Orbitron', monospace;
        color: var(--neon-green);
        font-weight: 700;
        min-width: 120px;
    }
    
    .info-item .value {
        color: #ccc;
        font-family: 'Rajdhani', sans-serif;
    }
    
    .history-section {
        margin-top: 2rem;
        background: rgba(0, 0, 0, 0.6);
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 20px;
        padding: 2rem;
    }
    
    .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .history-header h3 {
        font-family: 'Orbitron', monospace;
        color: var(--neon-green);
    }
    
    .history-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .history-item {
        background: rgba(0, 255, 0, 0.05);
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 10px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .history-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 255, 0, 0.2);
    }
    
    .history-item img {
        width: 100%;
        height: 120px;
        object-fit: cover;
    }
    
    .history-info {
        padding: 1rem;
    }
    
    .history-prompt {
        font-family: 'Rajdhani', sans-serif;
        color: white;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }
    
    .history-meta {
        display: flex;
        justify-content: space-between;
        font-family: 'Source Code Pro', monospace;
        color: #666;
        font-size: 0.8rem;
    }
    
    @keyframes image-appear {
        0% { opacity: 0; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1); }
    }
    
    @keyframes placeholder-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    @media (max-width: 768px) {
        .image-container {
            grid-template-columns: 1fr;
        }
        
        .prompt-controls {
            flex-direction: column;
            gap: 1rem;
        }
        
        .style-buttons {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .display-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }
    }
`;
document.head.appendChild(imageStyles); 