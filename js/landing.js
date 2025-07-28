// Landing Page JavaScript

// Language Management
let currentLanguage = 'ar';

// Switch Language Function
function switchLanguage(lang) {
    if (currentLanguage === lang) return;
    
    currentLanguage = lang;
    const html = document.documentElement;
    
    // Update HTML attributes
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Hide previous language content
    const previousLang = currentLanguage === 'en' ? 'ar' : 'en';
    const previousTexts = document.querySelectorAll(`.text-${previousLang}`);
    const newTexts = document.querySelectorAll(`.text-${lang}`);
    
    // Fade out previous language
    previousTexts.forEach(text => {
        text.classList.add('hidden');
    });
    
    // Fade in new language
    setTimeout(() => {
        newTexts.forEach(text => {
            text.classList.remove('hidden');
            text.classList.add('show');
        });
        
        // Update glitch effect data attribute
        const glitchElement = document.querySelector('.glitch');
        if (glitchElement) {
            const dataAttr = lang === 'ar' ? 'data-text-ar' : 'data-text';
            glitchElement.setAttribute('data-text', glitchElement.getAttribute(dataAttr));
        }
    }, 300);
    
    // Save language preference
    localStorage.setItem('preferred-language', lang);
    
    console.log(`Language switched to: ${lang}`);
}

// Initialize Language on Page Load
function initializeLanguage() {
    const savedLang = localStorage.getItem('preferred-language') || 'ar';
    if (savedLang !== 'ar') {
        switchLanguage(savedLang);
    }
}

// Navigation Functions
function navigateToCyber() {
    // Add exit animation
    document.body.classList.add('exit-animation');
    
    // Navigate after animation
    setTimeout(() => {
        window.location.href = 'cyber-home.html';
    }, 500);
}

function navigateToAI() {
    // Add exit animation
    document.body.classList.add('exit-animation');
    
    // Navigate to AI Home
    setTimeout(() => {
        window.location.href = 'ai-home.html';
    }, 500);
}

// Matrix Rain Effect (optional enhancement)
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.className = 'matrix-rain';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F3';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
}

// Particle System Enhancement
function enhanceParticles() {
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const delay = index * 0.5;
        particle.style.animationDelay = `${delay}s`;
        
        // Add random colors
        const colors = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = randomColor;
        particle.style.boxShadow = `0 0 20px ${randomColor}`;
    });
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
    enhanceParticles();
    
    // Optional: Add matrix rain effect
    // createMatrixRain();
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    console.log('Landing page initialized with Arabic support');
});

// Handle window resize for responsive design
window.addEventListener('resize', function() {
    // Adjust particle positions if needed
    enhanceParticles();
});

// Export functions for global access
window.switchLanguage = switchLanguage;
window.navigateToCyber = navigateToCyber;
window.navigateToAI = navigateToAI;

// Add exit animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    .exit-animation {
        animation: exit-fade 0.5s ease-out forwards;
    }
    
    @keyframes exit-fade {
        to {
            opacity: 0;
            transform: scale(1.1);
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-effect 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-effect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 