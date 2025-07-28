// Lab 2 - Brute Force Attack Functionality

// Generate pattern-based passwords
function generatePatternPasswords() {
    const patterns = [];
    const bases = ['Admin', 'User', 'Pass', 'Test'];
    const years = ['2023', '2024'];
    const symbols = ['!', '@', '#'];
    
    bases.forEach(base => {
        years.forEach(year => {
            symbols.forEach(symbol => {
                patterns.push(base + year);
                patterns.push(base + symbol + year);
                patterns.push(base + year + symbol);
            });
        });
    });
    
    return patterns;
}

// Attack configurations
const attackMethods = {
    dictionary: {
        name: 'Dictionary Attack',
        nameAr: 'هجوم القاموس',
        passwords: ['password', 'admin', '123456', 'password123', 'admin123', 'qwerty', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'sunshine', 'princess', 'football', 'shadow'],
        speed: 100
    },
    common: {
        name: 'Common Passwords',
        nameAr: 'كلمات المرور الشائعة',
        passwords: ['Password1', 'Admin@123', 'Welcome123', 'Spring2024', 'Company123', 'Secure123!', 'Manager1', 'Testing123', 'Access2024', 'Portal123'],
        speed: 150
    },
    pattern: {
        name: 'Pattern-Based',
        nameAr: 'القائم على الأنماط',
        passwords: generatePatternPasswords(),
        speed: 200
    }
};

let selectedMethod = 'dictionary';
let isAttacking = false;
let attackInterval = null;
let attemptCount = 0;
let attackStartTime = null;
let correctPassword = 'Admin@123'; // The password to crack
let attackButton = null; // Reference to the attack button

// Make variables globally accessible
window.selectedMethod = selectedMethod;
window.updateMethodDisplay = updateMethodDisplay;

// Select attack method
function selectAttack(method, buttonElement) {
    selectedMethod = method;
    window.selectedMethod = selectedMethod; // Update global reference
    
    // Update UI
    document.querySelectorAll('.attack-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find the clicked button if not passed directly
    if (!buttonElement) {
        buttonElement = document.querySelector(`[onclick="selectAttack('${method}')"]`);
    }
    
    if (buttonElement) {
        buttonElement.classList.add('active');
    }
    
    // Show method info and update display
    console.log(`Selected: ${attackMethods[method].name}`);
    console.log(`Password list size: ${attackMethods[method].passwords.length}`);
    
    // Update method display
    updateMethodDisplay(method);
}

// Start brute force attack
function startBruteForce(buttonElement) {
    console.log('startBruteForce called, isAttacking:', isAttacking);
    
    if (isAttacking) {
        // If already attacking, stop the attack
        console.log('Stopping attack...');
        stopBruteForce();
        return;
    }
    
    console.log('Starting attack...');
    isAttacking = true;
    attemptCount = 0;
    attackStartTime = Date.now();
    
    // Store button reference
    attackButton = buttonElement || document.querySelector('.cyber-btn.large') || event?.target;
    if (attackButton) {
        attackButton.textContent = '⏸ STOP ATTACK';
        console.log('Button text changed to STOP ATTACK');
    }
    
    // Clear previous attempts
    document.getElementById('attempts-list').innerHTML = '';
    document.getElementById('success-indicator').classList.remove('show');
    
    const method = attackMethods[selectedMethod];
    let passwordIndex = 0;
    
    // Update progress
    if (typeof labCommon !== 'undefined' && labCommon.updateProgress) {
        labCommon.updateProgress(50);
    }
    
    attackInterval = setInterval(() => {
        if (passwordIndex >= method.passwords.length) {
            stopBruteForce();
            showFailure();
            return;
        }
        
        const password = method.passwords[passwordIndex];
        attemptPassword(password);
        
        if (password === correctPassword) {
            stopBruteForce();
            showSuccess(password);
            return;
        }
        
        passwordIndex++;
    }, method.speed);
    
    // Update stats
    updateStats();
}

// Stop attack
function stopBruteForce() {
    console.log('stopBruteForce called');
    isAttacking = false;
    if (attackInterval) {
        clearInterval(attackInterval);
        attackInterval = null;
        console.log('Attack interval cleared');
    }
    
    if (attackButton) {
        attackButton.textContent = '⚡ START ATTACK';
        console.log('Button text changed to START ATTACK');
    }
}

// Attempt a password
function attemptPassword(password) {
    attemptCount++;
    
    // Add to visual list
    const attemptsList = document.getElementById('attempts-list');
    const attemptDiv = document.createElement('div');
    attemptDiv.className = 'password-attempt';
    attemptDiv.innerHTML = `
        <span class="attempt-number">#${attemptCount}</span>
        <span class="attempt-password">${password}</span>
        <span class="attempt-result ${password === correctPassword ? 'success' : 'fail'}">
            ${password === correctPassword ? '✓ MATCH' : '✗ FAIL'}
        </span>
    `;
    
    attemptsList.insertBefore(attemptDiv, attemptsList.firstChild);
    
    // Keep only last 10 attempts visible
    while (attemptsList.children.length > 10) {
        attemptsList.removeChild(attemptsList.lastChild);
    }
    
    // Animate
    attemptDiv.style.animation = 'slide-in-left 0.3s ease';
}

// Update attack statistics
function updateStats() {
    if (!isAttacking) return;
    
    const elapsed = Date.now() - attackStartTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    
    document.getElementById('attempt-count').textContent = attemptCount;
    document.getElementById('attack-speed').textContent = Math.floor(attemptCount / (elapsed / 1000)) || 0;
    document.getElementById('attack-time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    
    if (isAttacking) {
        requestAnimationFrame(updateStats);
    }
}

// Show success
function showSuccess(password) {
    document.getElementById('cracked-password').textContent = password;
    document.getElementById('success-indicator').classList.add('show');
    
    // Update progress
    if (typeof labCommon !== 'undefined' && labCommon.updateProgress) {
        labCommon.updateProgress(100);
    }
    
    // Visual effects
    document.body.style.animation = 'pulse-glow 0.5s ease';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 500);
    
    // Update visualization
    drawSuccessVisualization();
}

// Show failure
function showFailure() {
    const attemptsList = document.getElementById('attempts-list');
    const failDiv = document.createElement('div');
    failDiv.className = 'attack-failed';
    failDiv.textContent = '❌ ATTACK FAILED - Password not in wordlist';
    attemptsList.insertBefore(failDiv, attemptsList.firstChild);
}

// Visualization
function drawBruteForceVisualization() {
    const canvas = document.getElementById('brute-force-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw attack visualization
    if (isAttacking) {
        // Draw progress bar
        const progress = attemptCount / attackMethods[selectedMethod].passwords.length;
        
        ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.fillRect(0, canvas.height - 30, canvas.width * progress, 30);
        
        // Draw attack waves
        const waveCount = 5;
        for (let i = 0; i < waveCount; i++) {
            const offset = (Date.now() / 1000 + i * 0.5) % 3;
            const x = offset * canvas.width / 3;
            
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.5 - i * 0.1})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + 50, canvas.height);
            ctx.stroke();
        }
        
        // Draw attempt counter
        ctx.fillStyle = '#00ffff';
        ctx.font = '24px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(`Attempts: ${attemptCount}`, canvas.width / 2, canvas.height / 2);
    }
}

// Draw success visualization
function drawSuccessVisualization() {
    const canvas = document.getElementById('brute-force-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Success animation
    let radius = 0;
    const maxRadius = Math.max(canvas.width, canvas.height);
    
    const animate = () => {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        if (radius < maxRadius) {
            radius += 10;
            requestAnimationFrame(animate);
        } else {
            ctx.fillStyle = '#00ff00';
            ctx.font = '32px Orbitron';
            ctx.textAlign = 'center';
            ctx.fillText('ACCESS GRANTED', canvas.width / 2, canvas.height / 2);
        }
    };
    
    animate();
}

// Animation loop
function animateCanvas() {
    if (isAttacking) {
        drawBruteForceVisualization();
    }
    requestAnimationFrame(animateCanvas);
}

// Update method display
function updateMethodDisplay(method) {
    const methodInfo = attackMethods[method];
    const isArabic = document.documentElement.lang === 'ar';
    
    // Create or update method info display
    let infoDisplay = document.getElementById('method-info');
    if (!infoDisplay) {
        infoDisplay = document.createElement('div');
        infoDisplay.id = 'method-info';
        infoDisplay.className = 'method-info';
        
        // Insert after attack options
        const attackOptions = document.querySelector('.attack-options');
        attackOptions.parentNode.insertBefore(infoDisplay, attackOptions.nextSibling);
    }
    
    const methodName = isArabic ? methodInfo.nameAr : methodInfo.name;
    const selectedText = isArabic ? 'الطريقة المختارة' : 'Selected Method';
    const passwordListText = isArabic ? 'حجم قائمة كلمات المرور' : 'Password List Size';
    const passwordsText = isArabic ? 'كلمات مرور' : 'passwords';
    const attackSpeedText = isArabic ? 'سرعة الهجوم' : 'Attack Speed';
    const perAttemptText = isArabic ? 'مللي ثانية لكل محاولة' : 'ms per attempt';
    const sampleText = isArabic ? 'عينة كلمات المرور:' : 'Sample Passwords:';
    
    infoDisplay.innerHTML = `
        <div class="selected-method">
            <h5>✅ ${selectedText}: ${methodName}</h5>
            <p>📊 ${passwordListText}: ${methodInfo.passwords.length} ${passwordsText}</p>
            <p>⚡ ${attackSpeedText}: ${methodInfo.speed}${perAttemptText}</p>
            <div class="method-preview">
                <strong>${sampleText}</strong>
                <code>${methodInfo.passwords.slice(0, 5).join(', ')}...</code>
            </div>
        </div>
    `;
    
    // Add fade-in animation
    infoDisplay.style.opacity = '0';
    setTimeout(() => {
        infoDisplay.style.opacity = '1';
    }, 100);
}

// Add CSS for new elements
const bruteForceStyles = document.createElement('style');
bruteForceStyles.textContent = `
    .attack-options {
        display: flex;
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .attack-btn {
        flex: 1;
        padding: 1rem;
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid var(--primary-cyan);
        color: var(--primary-cyan);
        font-family: 'Orbitron', monospace;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .attack-btn:hover {
        background: rgba(0, 255, 255, 0.2);
        transform: translateY(-2px);
    }
    
    .attack-btn.active {
        background: var(--primary-cyan);
        color: var(--dark-bg);
    }
    
    .brute-force-interface {
        text-align: center;
        margin: 2rem 0;
    }
    
    .cyber-btn.large {
        font-size: 1.2rem;
        padding: 1rem 3rem;
    }
    
    .attack-stats {
        display: flex;
        justify-content: center;
        gap: 3rem;
        margin: 2rem 0;
    }
    
    .stat {
        text-align: center;
    }
    
    .stat .label {
        display: block;
        font-size: 0.8rem;
        opacity: 0.7;
        margin-bottom: 0.5rem;
    }
    
    .stat span:last-child {
        font-family: 'Orbitron', monospace;
        font-size: 1.5rem;
        color: var(--neon-green);
        text-shadow: 0 0 10px currentColor;
    }
    
    .password-attempts {
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #333;
        border-radius: 5px;
        padding: 1rem;
        max-height: 300px;
        overflow-y: auto;
    }
    
    .attempts-header {
        font-family: 'Orbitron', monospace;
        color: var(--primary-cyan);
        margin-bottom: 1rem;
        text-align: center;
    }
    
    .password-attempt {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        margin: 0.2rem 0;
        background: rgba(0, 255, 255, 0.05);
        border-left: 2px solid var(--primary-cyan);
        font-family: 'Source Code Pro', monospace;
    }
    
    .attempt-number {
        color: #666;
    }
    
    .attempt-password {
        color: var(--primary-cyan);
        flex: 1;
        text-align: center;
    }
    
    .attempt-result.fail {
        color: #ff6666;
    }
    
    .attempt-result.success {
        color: #00ff00;
        font-weight: 700;
    }
    
    .attack-failed {
        color: #ff3333;
        text-align: center;
        padding: 1rem;
        font-weight: 700;
    }
    
    .defense-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
    }
    
    .defense-card {
        background: rgba(0, 255, 0, 0.05);
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 10px;
        padding: 1rem;
        transition: all 0.3s ease;
    }
    
    .defense-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 255, 0, 0.2);
    }
    
    .defense-card h5 {
        color: #00ff00;
        margin-bottom: 0.5rem;
        font-family: 'Orbitron', monospace;
    }
    
    .defense-card code {
        display: block;
        margin-top: 0.5rem;
        font-size: 0.8rem;
        color: var(--neon-green);
    }
    
    .policy-list {
        list-style: none;
        padding: 0;
    }
    
    .policy-list li {
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .policy-list li::before {
        content: "→ ";
        color: var(--primary-cyan);
        font-weight: 700;
    }
`;
document.head.appendChild(bruteForceStyles);

// Switch between hacker and developer views
function switchView(viewType) {
    const hackerView = document.getElementById('hacker-view');
    const developerView = document.getElementById('developer-view');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    // Update button states
    toggleBtns.forEach(btn => {
        btn.classList.remove('active');
        if ((viewType === 'hacker' && (btn.textContent.includes('HACKER') || btn.textContent.includes('هاكر') || btn.textContent.includes('الهاكر'))) ||
            (viewType === 'developer' && (btn.textContent.includes('DEVELOPER') || btn.textContent.includes('مطور') || btn.textContent.includes('المطور')))) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide views
    if (viewType === 'hacker') {
        if (hackerView) {
            hackerView.classList.add('active');
            hackerView.style.display = 'block';
        }
        if (developerView) {
            developerView.classList.remove('active');
            developerView.style.display = 'none';
        }
    } else {
        if (hackerView) {
            hackerView.classList.remove('active');
            hackerView.style.display = 'none';
        }
        if (developerView) {
            developerView.classList.add('active');
            developerView.style.display = 'block';
        }
    }
}

// Initialize lab
function initializeLab() {
    // Start timer
    if (typeof labCommon !== 'undefined' && labCommon.startTimer) {
        labCommon.startTimer();
    }
    
    // Set up attack button event listeners
    document.querySelectorAll('.attack-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const method = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            selectAttack(method, this);
        });
    });
    
    // Set up other interactive elements
    const startButton = document.querySelector('.cyber-btn.large');
    if (startButton) {
        // Remove onclick to prevent double execution
        startButton.removeAttribute('onclick');
        startButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Button clicked via event listener');
            startBruteForce(this);
        });
    }
    
    // Initialize view toggle
    initializeViewToggle();
    
    // Start canvas animation
    animateCanvas();
    
    // Set default attack method
    selectAttack('dictionary', document.querySelector('.attack-btn'));
}

// Initialize view toggle functionality
function initializeViewToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.textContent.includes('HACKER') ? 'hacker' : 'developer';
            switchView(view);
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeLab);

// Make functions globally accessible for onclick attributes
window.selectAttack = selectAttack;
window.startBruteForce = startBruteForce;
window.switchView = switchView; 