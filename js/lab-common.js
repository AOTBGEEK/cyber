// Common Lab Functionality

// Timer Functionality
let startTime = Date.now();
let timerInterval;

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor(elapsed / 1000) % 60;
    const minutes = Math.floor(elapsed / 60000) % 60;
    const hours = Math.floor(elapsed / 3600000);
    
    const timerDisplay = document.querySelector('.lab-timer');
    if (timerDisplay) {
        timerDisplay.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// View Switching
function switchView(view) {
    // Update buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Update active button
    const activeBtn = document.querySelector(`.toggle-btn[onclick*="${view}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Update view sections
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const activeView = document.getElementById(`${view}-view`);
    if (activeView) {
        activeView.classList.add('active');
        
        // Add entrance animation
        activeView.style.animation = 'none';
        setTimeout(() => {
            activeView.style.animation = 'fade-in 0.5s ease';
        }, 10);
    }
    
    // Update progress based on view
    updateProgress(view === 'developer' ? 75 : 50);
}

// Progress Bar
function updateProgress(percentage) {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    // Update step indicators
    const steps = document.querySelectorAll('.step-indicator');
    const activeSteps = Math.floor((percentage / 100) * steps.length);
    
    steps.forEach((step, index) => {
        if (index < activeSteps) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Cyber Particles Effect
function createCyberParticles() {
    const container = document.querySelector('.cyber-particles');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'cyber-particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: ${Math.random() > 0.5 ? 'var(--primary-cyan)' : 'var(--primary-magenta)'};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.5};
            animation: float ${Math.random() * 10 + 10}s linear infinite;
        `;
        container.appendChild(particle);
    }
}

// Add floating animation
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) translateX(0);
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
        }
    }
`;
document.head.appendChild(floatStyle);

// Terminal Effect
function addTerminalEffect(element, text, speed = 50) {
    let index = 0;
    element.textContent = '';
    
    const type = () => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    };
    
    type();
}

// Code Syntax Highlighting (basic)
function highlightCode() {
    document.querySelectorAll('.code-block pre').forEach(block => {
        let html = block.innerHTML;
        
        // Highlight comments
        html = html.replace(/(\/\/.*$)/gm, '<span style="color: #666;">$1</span>');
        
        // Highlight strings
        html = html.replace(/('.*?'|".*?")/g, '<span style="color: #98c379;">$1</span>');
        
        // Highlight keywords
        const keywords = ['const', 'let', 'var', 'function', 'if', 'else', 'return', 'app', 'req', 'res'];
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            html = html.replace(regex, `<span style="color: #c678dd;">${keyword}</span>`);
        });
        
        // Highlight functions
        html = html.replace(/(\w+)\(/g, '<span style="color: #61afef;">$1</span>(');
        
        block.innerHTML = html;
    });
}

// Sound Effects (optional)
function playSound(type) {
    // Could add sound effects for various actions
    // const audio = new Audio(`/sounds/${type}.mp3`);
    // audio.play();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    startTimer();
    createCyberParticles();
    highlightCode();
    updateProgress(25);
    
    // Add hover effects to all buttons
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            playSound('hover');
        });
        
        btn.addEventListener('click', () => {
            playSound('click');
        });
    });
    
    // Add glitch effect on hover for certain elements
    document.querySelectorAll('.section-header, .lab-title').forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.animation = 'glitch-anim 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
});

// Export functions for use in specific lab files
window.labCommon = {
    updateProgress,
    addTerminalEffect,
    playSound,
    startTimer
}; 