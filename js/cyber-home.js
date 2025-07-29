// Simplified Cyber Home JavaScript - No complex animations

document.addEventListener('DOMContentLoaded', () => {
    console.log('Cybersecurity Workshop loaded successfully');
    
    // Simple lab card hover effects
    const labCards = document.querySelectorAll('.lab-box');
    
    labCards.forEach((card, index) => {
        // Add simple hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 255, 255, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
        
        // Add click effect
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Keyboard shortcuts for labs
    document.addEventListener('keydown', (e) => {
        if (e.key >= '1' && e.key <= '7') {
            const labIndex = parseInt(e.key) - 1;
            const labs = document.querySelectorAll('.lab-box');
            if (labs[labIndex]) {
                labs[labIndex].click();
            }
        }
    });
});

// Simple loading effect
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add minimal CSS for smooth transitions
const simpleStyles = document.createElement('style');
simpleStyles.textContent = `
    .lab-box {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    body.loaded {
        animation: fade-in 0.5s ease;
    }
    
    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(simpleStyles); 