// AI Home Page JavaScript

// Initialize AI Academy
document.addEventListener('DOMContentLoaded', () => {
    initializeAIParticles();
    initializeNeuralNetwork();
    initializeScrollAnimations();
    initializeConceptAnimations();
});

// Create AI particles effect
function initializeAIParticles() {
    const particlesContainer = document.querySelector('.ai-particles');
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'ai-particle';
        
        // Random position and properties
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const size = Math.random() * 4 + 2;
        const duration = Math.random() * 10 + 10;
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, #00ffff, transparent);
            border-radius: 50%;
            opacity: ${Math.random() * 0.5 + 0.3};
            animation: ai-particle-float ${duration}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        particlesContainer.appendChild(particle);
    }
    
    // Add particle animation CSS
    const particleStyles = document.createElement('style');
    particleStyles.textContent = `
        @keyframes ai-particle-float {
            0%, 100% { 
                transform: translate(0, 0) scale(1);
                opacity: 0.3;
            }
            25% { 
                transform: translate(20px, -30px) scale(1.2);
                opacity: 0.7;
            }
            50% { 
                transform: translate(-15px, -60px) scale(0.8);
                opacity: 0.5;
            }
            75% { 
                transform: translate(25px, -30px) scale(1.1);
                opacity: 0.6;
            }
        }
    `;
    document.head.appendChild(particleStyles);
}

// Create neural network background
function initializeNeuralNetwork() {
    const neuralContainer = document.querySelector('.neural-network');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    neuralContainer.appendChild(canvas);
    
    // Neural nodes
    const nodes = [];
    const nodeCount = 30;
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 2
        });
    }
    
    function drawNeuralNetwork() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (150 - distance) / 150 * 0.2;
                    ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }
        
        // Draw nodes
        ctx.fillStyle = 'rgba(0, 255, 255, 0.6)';
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        });
        
        requestAnimationFrame(drawNeuralNetwork);
    }
    
    drawNeuralNetwork();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Initialize scroll-triggered animations
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger specific animations based on concept
                const concept = entry.target.dataset.concept;
                if (concept) {
                    triggerConceptAnimation(concept);
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe all concept items
    document.querySelectorAll('.concept-item').forEach(item => {
        observer.observe(item);
    });
    
    // Observe lab cards for staggered animation
    document.querySelectorAll('.ai-lab-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
}

// Trigger specific concept animations
function triggerConceptAnimation(concept) {
    switch (concept) {
        case 'what-is-ai':
            animateRobotLearning();
            break;
        case 'chatgpt':
            animateChatGPTFlow();
            break;
        case 'vectors':
            animateVectorDemo();
            break;
        case 'use-cases':
            animateUseCases();
            break;
        case 'prompt-engineering':
            animatePromptComparison();
            break;
    }
}

// Animate robot learning concept
function animateRobotLearning() {
    const brainCore = document.querySelector('.brain-core');
    const dataFlow = document.querySelector('.data-flow');
    const knowledgeBase = document.querySelector('.knowledge-base');
    
    if (brainCore) {
        brainCore.style.animation = 'brain-pulse 1s ease-in-out 3';
    }
    
    if (dataFlow) {
        setTimeout(() => {
            dataFlow.style.animation = 'data-stream 2s ease-in-out 3';
        }, 500);
    }
    
    if (knowledgeBase) {
        setTimeout(() => {
            knowledgeBase.style.animation = 'knowledge-grow 2s ease-in-out 2';
        }, 1000);
    }
}

// Animate ChatGPT flow
function animateChatGPTFlow() {
    const tokens = document.querySelectorAll('.token');
    
    tokens.forEach((token, index) => {
        setTimeout(() => {
            token.style.animation = 'token-appear 0.5s ease';
            
            if (token.classList.contains('next')) {
                setTimeout(() => {
                    token.style.animation = 'token-predict 1s ease-in-out infinite';
                }, 500);
            }
        }, index * 200);
    });
}

// Animate vector demonstration
function animateVectorDemo() {
    const word = document.querySelector('.word');
    const transformation = document.querySelector('.transformation');
    const vector = document.querySelector('.vector');
    const similarityLine = document.querySelector('.similarity-line');
    
    if (word) {
        word.style.animation = 'pulse-glow 0.5s ease';
    }
    
    if (transformation) {
        setTimeout(() => {
            transformation.style.animation = 'transform-pulse 1s ease-in-out 2';
        }, 500);
    }
    
    if (vector) {
        setTimeout(() => {
            vector.style.animation = 'slide-in-right 0.5s ease';
        }, 1000);
    }
    
    if (similarityLine) {
        setTimeout(() => {
            similarityLine.style.animation = 'similarity-pulse 2s ease-in-out infinite';
        }, 1500);
    }
}

// Animate use cases
function animateUseCases() {
    const useCases = document.querySelectorAll('.use-case');
    
    useCases.forEach((useCase, index) => {
        setTimeout(() => {
            useCase.style.animation = 'bounce-in 0.6s ease';
            useCase.addEventListener('animationend', () => {
                useCase.style.animation = '';
            });
        }, index * 100);
    });
}

// Animate prompt comparison
function animatePromptComparison() {
    const badExample = document.querySelector('.prompt-example.bad');
    const goodExample = document.querySelector('.prompt-example.good');
    
    if (badExample) {
        badExample.style.animation = 'shake 0.5s ease';
    }
    
    if (goodExample) {
        setTimeout(() => {
            goodExample.style.animation = 'pulse-glow 0.5s ease';
        }, 500);
    }
}

// Initialize concept-specific animations
function initializeConceptAnimations() {
    // Add hover effects to concept items
    document.querySelectorAll('.concept-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            const dot = item.querySelector('.concept-dot');
            if (dot) {
                dot.style.animation = 'concept-pulse 0.5s ease';
            }
        });
    });
    
    // Add click effects to use cases
    document.querySelectorAll('.use-case').forEach(useCase => {
        useCase.addEventListener('click', () => {
            useCase.style.animation = 'pulse-glow 0.3s ease';
            
            // Show tooltip or info
            const name = useCase.querySelector('.use-case-name').textContent;
            showTooltip(`AI ${name}: Explore endless possibilities!`, useCase);
        });
    });
}

// Show tooltip
function showTooltip(message, element) {
    const tooltip = document.createElement('div');
    tooltip.className = 'ai-tooltip';
    tooltip.textContent = message;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: #00ffff;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        font-family: 'Source Code Pro', monospace;
        font-size: 0.8rem;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        border: 1px solid #00ffff;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.bottom + 10}px`;
    
    // Animate in
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 300);
    }, 2000);
}

// Open AI Lab function
function openAILab(labId) {
    // Add exit animation
    document.body.style.opacity = '0';
    document.body.style.transform = 'scale(0.95)';
    
    // Map lab IDs to filenames
    const labFiles = {
        'ai-lab1-chat': 'ai-lab1-chat.html',
        'ai-lab2-story': 'ai-lab2-story.html',
        'ai-lab3-image': 'ai-lab3-image.html',
        'ai-lab4-webpage': 'ai-lab4-webpage.html',
        'ai-lab5-compare': 'ai-lab5-compare.html'
    };
    
    // Navigate to lab page
    setTimeout(() => {
        const labFile = labFiles[labId] || 'ai-lab1-chat.html';
        window.location.href = `ai-labs/${labFile}`;
    }, 300);
}

// Add enhanced lab card interactions
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.ai-lab-card').forEach(card => {
        // Enhanced hover effect
        card.addEventListener('mouseenter', () => {
            const glow = card.querySelector('.lab-glow');
            if (glow) {
                glow.style.opacity = '1';
            }
            
            // Add cyber lines effect
            createCyberLines(card);
        });
        
        card.addEventListener('mouseleave', () => {
            const glow = card.querySelector('.lab-glow');
            if (glow) {
                glow.style.opacity = '0';
            }
            
            // Remove cyber lines
            const lines = card.querySelectorAll('.cyber-line');
            lines.forEach(line => line.remove());
        });
        
        // Click effect
        card.addEventListener('click', () => {
            card.style.animation = 'pulse-glow 0.3s ease';
            
            // Create ripple effect
            createRippleEffect(event, card);
        });
    });
});

// Create cyber lines effect
function createCyberLines(element) {
    for (let i = 0; i < 4; i++) {
        const line = document.createElement('div');
        line.className = 'cyber-line';
        line.style.cssText = `
            position: absolute;
            background: linear-gradient(90deg, transparent, #00ffff, transparent);
            height: 1px;
            width: 100%;
            top: ${Math.random() * 100}%;
            left: 0;
            opacity: 0;
            animation: cyber-line-move 2s ease-in-out infinite;
            animation-delay: ${i * 0.5}s;
        `;
        element.appendChild(line);
    }
    
    // Add cyber line animation if not exists
    if (!document.querySelector('#cyber-line-animation')) {
        const cyberStyles = document.createElement('style');
        cyberStyles.id = 'cyber-line-animation';
        cyberStyles.textContent = `
            @keyframes cyber-line-move {
                0% { opacity: 0; transform: translateX(-100%); }
                50% { opacity: 1; transform: translateX(0); }
                100% { opacity: 0; transform: translateX(100%); }
            }
        `;
        document.head.appendChild(cyberStyles);
    }
}

// Create ripple effect
function createRippleEffect(event, element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('div');
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 255, 255, 0.3), transparent);
        width: ${size}px;
        height: ${size}px;
        left: ${event.clientX - rect.left - size / 2}px;
        top: ${event.clientY - rect.top - size / 2}px;
        pointer-events: none;
        animation: ripple-expand 0.6s ease-out;
    `;
    
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
    
    // Add ripple animation if not exists
    if (!document.querySelector('#ripple-animation')) {
        const rippleStyles = document.createElement('style');
        rippleStyles.id = 'ripple-animation';
        rippleStyles.textContent = `
            @keyframes ripple-expand {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(1); opacity: 0; }
            }
        `;
        document.head.appendChild(rippleStyles);
    }
}

// Add additional CSS animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes bounce-in {
        0% { transform: scale(0.3) translateY(50px); opacity: 0; }
        50% { transform: scale(1.05) translateY(-10px); }
        70% { transform: scale(0.9) translateY(0); }
        100% { transform: scale(1) translateY(0); opacity: 1; }
    }
    
    @keyframes slide-in-right {
        0% { transform: translateX(50px); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(additionalStyles); 