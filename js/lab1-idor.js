// Lab 1 - IDOR Specific Functionality

// Simulated user database
const users = {
    '0': { name: 'System', role: 'system', access: 'FULL SYSTEM ACCESS', secret: 'CLASSIFIED' },
    '1': { name: 'Admin', role: 'admin', access: 'ADMIN PANEL ACCESS', secret: 'Admin API Keys' },
    '1000': { name: 'John Doe', role: 'moderator', access: 'Moderator Access', secret: 'Mod Tools' },
    '1001': { name: 'Jane Smith', role: 'user', access: 'Basic User Access', secret: 'Personal Data' },
    '1002': { name: 'Bob Johnson', role: 'user', access: 'Basic User Access', secret: 'Personal Data' },
    '999': { name: 'Test Account', role: 'test', access: 'Test Environment', secret: 'Test Data' }
};

// Try User ID Function
function tryUserID() {
    const input = document.getElementById('user-id-input');
    const responseDisplay = document.getElementById('response-display');
    const successIndicator = document.getElementById('success-indicator');
    
    const userId = input.value.trim();
    
    // Add loading effect
    responseDisplay.innerHTML = '<pre style="color: #ffff00;">Accessing database...</pre>';
    
    setTimeout(() => {
        if (users[userId]) {
            const user = users[userId];
            let responseColor = '#00ff00';
            let responseText = '';
            
            if (user.role === 'admin' || user.role === 'system') {
                responseColor = '#ff0000';
                responseText = `🚨 CRITICAL ACCESS DETECTED! 🚨\n\n`;
                successIndicator.classList.add('show');
                labCommon.updateProgress(100);
                
                // Add dramatic effect
                document.body.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 500);
            }
            
            responseText += `User ID: ${userId}\n`;
            responseText += `Name: ${user.name}\n`;
            responseText += `Role: ${user.role.toUpperCase()}\n`;
            responseText += `Access Level: ${user.access}\n`;
            responseText += `Secret Data: ${user.secret}\n`;
            
            if (user.role === 'admin') {
                responseText += '\n⚠️ WARNING: Admin privileges exposed!\n';
                responseText += 'You now have access to:\n';
                responseText += '- User Management\n';
                responseText += '- System Configuration\n';
                responseText += '- Database Access\n';
                responseText += '- API Keys\n';
            }
            
            responseDisplay.innerHTML = `<pre style="color: ${responseColor};">${responseText}</pre>`;
            
            // Log the attempt
            logAttempt(userId, user.role);
            
        } else {
            responseDisplay.innerHTML = `<pre style="color: #ff6666;">Error 404: User ID ${userId} not found\nTry another ID...</pre>`;
        }
    }, 1000);
}

// Log attempts for visualization
let attempts = [];

function logAttempt(userId, role) {
    attempts.push({ userId, role, timestamp: Date.now() });
    updateVisualization();
}

// Attack Visualization
function updateVisualization() {
    const canvas = document.getElementById('attack-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    
    for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    
    // Draw attempts
    const maxAttempts = 10;
    const recentAttempts = attempts.slice(-maxAttempts);
    
    recentAttempts.forEach((attempt, index) => {
        const x = (index + 1) * (canvas.width / (maxAttempts + 1));
        const y = canvas.height / 2;
        
        // Draw connection line
        if (index > 0) {
            const prevX = index * (canvas.width / (maxAttempts + 1));
            ctx.beginPath();
            ctx.moveTo(prevX, canvas.height / 2);
            ctx.lineTo(x, y);
            ctx.strokeStyle = attempt.role === 'admin' ? '#ff0000' : '#00ffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Draw node
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = attempt.role === 'admin' ? '#ff0000' : 
                       attempt.role === 'system' ? '#ff00ff' : 
                       '#00ffff';
        ctx.fill();
        
        // Draw user ID
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(attempt.userId, x, y - 15);
    });
    
    // Add scan line effect
    const scanY = (Date.now() % 3000) / 3000 * canvas.height;
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, scanY);
    ctx.lineTo(canvas.width, scanY);
    ctx.stroke();
}

// Animate visualization continuously
setInterval(updateVisualization, 100);

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initial visualization
    updateVisualization();
    
    // Enter key support
    document.getElementById('user-id-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            tryUserID();
        }
    });
    
    // Add hints system
    const hints = [
        "💡 Hint: Admin accounts often have low ID numbers",
        "💡 Hint: Try ID 0 or 1",
        "💡 Hint: System accounts might use special IDs",
        "💡 Hint: Enumerate sequentially from 0"
    ];
    
    let hintIndex = 0;
    setInterval(() => {
        if (!document.getElementById('success-indicator').classList.contains('show')) {
            console.log(hints[hintIndex % hints.length]);
            hintIndex++;
        }
    }, 15000);
});

// Add terminal typing effect to response
function typeResponse(element, text) {
    let index = 0;
    element.textContent = '';
    
    const type = () => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, 20);
        }
    };
    
    type();
} 