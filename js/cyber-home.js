// Cyber Home JavaScript

// Timeline Scroll Animations
document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for Timeline Items
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add pulse effect to timeline dot
                const dot = entry.target.querySelector('.timeline-dot');
                if (dot) {
                    dot.style.animation = 'pulse-glow 1s ease-out';
                }
            }
        });
    }, observerOptions);
    
    // Observe all timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });
    
    // Timeline Interactive Effects
    const timelineItems = document.querySelectorAll('.timeline-content');
    
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            // Create expansion effect
            this.style.transform = 'scale(1.1)';
            
            // Add info popup (can be expanded with more details)
            const topic = this.closest('.timeline-item').getAttribute('data-topic');
            showTopicDetails(topic);
            
            // Reset after animation
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
        
        // Hover sound effect (optional)
        item.addEventListener('mouseenter', function() {
            // Could add sound effect here
            createGlitchEffect(this);
        });
    });
    
    // Lab Card Hover Effects
    const labCards = document.querySelectorAll('.lab-card');
    
    labCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            // Add cyber lines effect
            createCyberLines(this);
            
            // Stagger nearby cards
            const allCards = document.querySelectorAll('.lab-card');
            allCards.forEach((c, i) => {
                if (i !== index) {
                    const distance = Math.abs(i - index);
                    c.style.transform = `scale(${1 - distance * 0.02})`;
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset all cards
            document.querySelectorAll('.lab-card').forEach(c => {
                c.style.transform = '';
            });
        });
    });
    
    // Add dynamic data streams
    createDataStreams();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key >= '1' && e.key <= '7') {
            const labIndex = parseInt(e.key) - 1;
            const labs = document.querySelectorAll('.lab-card');
            if (labs[labIndex]) {
                labs[labIndex].click();
            }
        }
    });
});

// Show Topic Details
function showTopicDetails(topic) {
    const details = {
        hackers: "Hackers are categorized by their intentions: Black Hat (malicious), White Hat (ethical), and Gray Hat (somewhere in between).",
        teams: "Red Teams simulate attacks to test defenses, while Blue Teams defend and respond to threats.",
        mitre: "The MITRE ATT&CK framework is a knowledge base of adversary tactics and techniques.",
        owasp: "OWASP Top 10 represents the most critical security risks to web applications.",
        standards: "Security standards ensure applications are built with protection in mind from the ground up.",
        bugbounty: "Bug bounty programs reward ethical hackers for finding and reporting vulnerabilities.",
        architecture: "Modern architectures span cloud, on-premises, and hybrid environments with API integrations.",
        misconfig: "Misconfigurations are the leading cause of data breaches and security incidents.",
        vulns: "Vulnerabilities are flaws in design, while cracking involves breaking existing protections.",
        careers: "Cybersecurity offers diverse career paths from technical to management roles.",
        mindset: "Thinking like a hacker means questioning assumptions and finding creative attack vectors."
    };
    
    // Could show a modal or tooltip with details
    console.log(`Topic: ${topic}`, details[topic]);
}

// Create Glitch Effect
function createGlitchEffect(element) {
    element.style.animation = 'glitch-anim 0.3s ease';
    setTimeout(() => {
        element.style.animation = '';
    }, 300);
}

// Create Cyber Lines Effect
function createCyberLines(card) {
    const lines = document.createElement('div');
    lines.className = 'cyber-lines-effect';
    lines.innerHTML = `
        <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0; pointer-events: none;">
            <line x1="0" y1="0" x2="100%" y2="0" stroke="cyan" stroke-width="1" opacity="0.5">
                <animate attributeName="stroke-dasharray" from="0 1000" to="1000 0" dur="1s" repeatCount="indefinite"/>
            </line>
            <line x1="100%" y1="0" x2="100%" y2="100%" stroke="cyan" stroke-width="1" opacity="0.5">
                <animate attributeName="stroke-dasharray" from="0 1000" to="1000 0" dur="1s" begin="0.25s" repeatCount="indefinite"/>
            </line>
            <line x1="100%" y1="100%" x2="0" y2="100%" stroke="cyan" stroke-width="1" opacity="0.5">
                <animate attributeName="stroke-dasharray" from="0 1000" to="1000 0" dur="1s" begin="0.5s" repeatCount="indefinite"/>
            </line>
            <line x1="0" y1="100%" x2="0" y2="0" stroke="cyan" stroke-width="1" opacity="0.5">
                <animate attributeName="stroke-dasharray" from="0 1000" to="1000 0" dur="1s" begin="0.75s" repeatCount="indefinite"/>
            </line>
        </svg>
    `;
    
    card.appendChild(lines);
    
    setTimeout(() => {
        lines.remove();
    }, 2000);
}

// Create Dynamic Data Streams
function createDataStreams() {
    const container = document.querySelector('.data-streams');
    
    setInterval(() => {
        const stream = document.createElement('div');
        stream.className = 'stream';
        stream.style.left = Math.random() * 100 + '%';
        stream.style.animationDuration = (Math.random() * 3 + 2) + 's';
        stream.style.height = Math.random() * 200 + 100 + 'px';
        
        container.appendChild(stream);
        
        // Remove after animation
        setTimeout(() => {
            stream.remove();
        }, 5000);
    }, 500);
}

// Open Lab Function
function openLab(labId) {
    // Add transition effect
    document.body.style.opacity = '0';
    document.body.style.transform = 'scale(1.1)';
    
    // Map lab IDs to filenames
    const labFiles = {
        'lab1-idor': 'lab1-idor.html',
        'lab2-bruteforce': 'lab2-bruteforce.html',
        'lab3-password-url': 'lab3-password-url.html',
        'lab4-fake-login': 'lab4-fake-login.html',
        'lab5-camera': 'lab5-camera.html',
        'lab6-payment': 'lab6-payment.html',
        'lab7-otp': 'lab7-otp.html'
    };
    
    // Navigate to lab page
    setTimeout(() => {
        const labFile = labFiles[labId] || 'lab1-idor.html';
        window.location.href = `labs/${labFile}`;
    }, 300);
}

// Add Parallax Effect to Timeline
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.timeline-item');
    
    parallaxElements.forEach((el, index) => {
        const speed = index % 2 === 0 ? 0.5 : 0.3;
        el.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
    });
});

// Terminal-style Text Effect
function typewriterEffect(element, text, speed = 50) {
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

// Add Loading Effect
window.addEventListener('load', () => {
    // Could add a cool loading animation here
    document.body.classList.add('loaded');
});

// Add CSS for dynamic effects
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .cyber-lines-effect {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    
    body.loaded {
        animation: fade-in 0.5s ease;
    }
    
    @keyframes fade-in {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(dynamicStyles); 