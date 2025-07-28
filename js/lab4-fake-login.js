// Lab 4 - Fake Login Page (Phishing) Functionality

let selectedDomain = '';
let phishingPageDeployed = false;
let harvestedCredentials = [];

// Clone website
function cloneWebsite() {
    const statusDiv = document.getElementById('clone-status');
    statusDiv.innerHTML = '<div class="loading">Cloning target website...</div>';
    
    // Simulate cloning process
    setTimeout(() => {
        statusDiv.innerHTML = `
            <div class="clone-progress">
                <div class="progress-item">✓ Downloading HTML structure</div>
                <div class="progress-item">✓ Extracting CSS styles</div>
                <div class="progress-item">✓ Copying images and assets</div>
                <div class="progress-item">✓ Modifying form actions</div>
                <div class="progress-item success">✓ Clone complete!</div>
            </div>
        `;
        
        // Show each item progressively
        const items = statusDiv.querySelectorAll('.progress-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 300);
        });
        
        updateProgress(25);
    }, 1500);
}

// Select phishing domain
function selectDomain(domain) {
    selectedDomain = domain;
    
    // Update UI
    document.querySelectorAll('.domain-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Display selected domain
    const displayDiv = document.getElementById('selected-domain');
    displayDiv.innerHTML = `
        <div class="domain-selected">
            <span class="label">Selected Domain:</span>
            <span class="domain">${domain}</span>
            <span class="status">✓ Available</span>
        </div>
    `;
    
    updateProgress(40);
}

// Deploy phishing page
function deployPhishingPage() {
    if (!selectedDomain) {
        alert('Please select a domain first!');
        return;
    }
    
    const previewDiv = document.getElementById('phishing-preview');
    previewDiv.innerHTML = '<div class="loading">Deploying phishing site...</div>';
    
    setTimeout(() => {
        // Create fake login page
        previewDiv.innerHTML = `
            <div class="fake-login-page">
                <div class="fake-header">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjMzMzIj5UZWNoQ29ycDwvdGV4dD48L3N2Zz4=" alt="TechCorp">
                    <span class="fake-title">Employee Portal</span>
                </div>
                <div class="fake-form">
                    <h3>Sign In</h3>
                    <input type="email" id="fake-email" placeholder="Email Address">
                    <input type="password" id="fake-password" placeholder="Password">
                    <button onclick="captureCredentials()" class="fake-submit">Sign In</button>
                    <p class="fake-footer">
                        <a href="#">Forgot password?</a> | 
                        <a href="#">IT Support</a>
                    </p>
                </div>
                <div class="url-bar">
                    <span class="protocol">🔒 https://</span>
                    <span class="domain">${selectedDomain}</span>
                    <span class="path">/login</span>
                </div>
            </div>
        `;
        
        phishingPageDeployed = true;
        updateProgress(60);
        
        // Update phishing link
        document.getElementById('phishing-link').href = `https://${selectedDomain}/login`;
    }, 2000);
}

// Capture credentials from fake form
function captureCredentials() {
    const email = document.getElementById('fake-email').value;
    const password = document.getElementById('fake-password').value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    // Add to harvested credentials
    harvestedCredentials.push({
        email: email,
        password: password,
        timestamp: new Date().toLocaleString(),
        ip: '192.168.1.' + Math.floor(Math.random() * 255),
        userAgent: 'Chrome/120.0.0.0'
    });
    
    // Clear form
    document.getElementById('fake-email').value = '';
    document.getElementById('fake-password').value = '';
    
    // Show fake error to encourage retry
    alert('Invalid credentials. Please try again.');
    
    // Update harvested credentials display
    updateHarvestedDisplay();
    
    if (harvestedCredentials.length >= 3) {
        document.getElementById('success-indicator').classList.add('show');
        updateProgress(100);
    }
}

// Send phishing email
function sendPhishingEmail() {
    if (!phishingPageDeployed) {
        alert('Please deploy the phishing page first!');
        return;
    }
    
    const button = event.target;
    button.disabled = true;
    button.innerHTML = '📤 Sending...';
    
    setTimeout(() => {
        button.innerHTML = '✓ Email Sent!';
        button.style.background = '#00ff00';
        button.style.color = '#000';
        
        updateProgress(80);
        
        // Simulate incoming victims
        setTimeout(simulateVictims, 2000);
    }, 2000);
}

// Simulate victims falling for phishing
function simulateVictims() {
    const victims = [
        { email: 'john.smith@techcorp.com', password: 'JohnPass123!' },
        { email: 'sarah.jones@techcorp.com', password: 'SarahSecure2024' },
        { email: 'mike.wilson@techcorp.com', password: 'MikeW@Corp99' },
        { email: 'admin@techcorp.com', password: 'Admin@TechCorp2024!' }
    ];
    
    let index = 0;
    const interval = setInterval(() => {
        if (index < victims.length) {
            harvestedCredentials.push({
                email: victims[index].email,
                password: victims[index].password,
                timestamp: new Date().toLocaleString(),
                ip: '10.0.0.' + Math.floor(Math.random() * 255),
                userAgent: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)]
            });
            
            updateHarvestedDisplay();
            index++;
            
            if (harvestedCredentials.length >= 3) {
                document.getElementById('success-indicator').classList.add('show');
                updateProgress(100);
            }
        } else {
            clearInterval(interval);
        }
    }, 3000);
}

// Update harvested credentials display
function updateHarvestedDisplay() {
    const displayDiv = document.getElementById('harvested-creds');
    
    if (harvestedCredentials.length === 0) {
        displayDiv.innerHTML = '<p class="no-creds">لم يتم حصاد أي بيانات اعتماد بعد...</p>';
        return;
    }
    
    let html = '<div class="creds-list">';
    
    harvestedCredentials.forEach((cred, index) => {
        html += `
            <div class="cred-entry">
                <div class="cred-header">
                    <span class="cred-number">#${index + 1}</span>
                    <span class="cred-time">${cred.timestamp}</span>
                </div>
                <div class="cred-details">
                    <div class="cred-field">
                        <span class="label">البريد الإلكتروني:</span>
                        <span class="value">${cred.email}</span>
                    </div>
                    <div class="cred-field">
                        <span class="label">كلمة المرور:</span>
                        <span class="value password">${cred.password}</span>
                    </div>
                    <div class="cred-meta">
                        <span>IP: ${cred.ip}</span>
                        <span>Browser: ${cred.userAgent}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    displayDiv.innerHTML = html;
    
    // Animate new entries
    const entries = displayDiv.querySelectorAll('.cred-entry');
    entries[entries.length - 1].style.animation = 'pulse-glow 1s ease';
}

// Update progress
function updateProgress(percentage) {
    labCommon.updateProgress(percentage);
}

// Add CSS for Lab 4
const lab4Styles = document.createElement('style');
lab4Styles.textContent = `
    .status-box {
        margin-top: 1rem;
        min-height: 100px;
    }
    
    .clone-progress {
        padding: 1rem;
    }
    
    .progress-item {
        padding: 0.5rem;
        margin: 0.3rem 0;
        opacity: 0;
        transform: translateX(-20px);
        transition: all 0.3s ease;
        color: var(--primary-cyan);
    }
    
    .progress-item.success {
        color: #00ff00;
        font-weight: 700;
    }
    
    .domain-generator {
        margin: 1rem 0;
    }
    
    .domain-options {
        display: grid;
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .domain-btn {
        padding: 1rem;
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid var(--primary-cyan);
        color: var(--primary-cyan);
        font-family: 'Source Code Pro', monospace;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
    }
    
    .domain-btn:hover {
        background: rgba(0, 255, 255, 0.2);
        transform: translateX(5px);
    }
    
    .domain-btn.selected {
        background: var(--primary-cyan);
        color: var(--dark-bg);
        box-shadow: 0 0 20px var(--primary-cyan);
    }
    
    .selected-display {
        margin-top: 1rem;
    }
    
    .domain-selected {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(0, 255, 0, 0.1);
        border: 1px solid rgba(0, 255, 0, 0.5);
        border-radius: 5px;
    }
    
    .domain-selected .label {
        color: #999;
    }
    
    .domain-selected .domain {
        color: var(--primary-yellow);
        font-family: 'Source Code Pro', monospace;
        font-weight: 700;
    }
    
    .domain-selected .status {
        color: #00ff00;
        margin-left: auto;
    }
    
    .phishing-container {
        margin-top: 1rem;
    }
    
    .fake-login-page {
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 2rem;
        max-width: 400px;
        margin: 0 auto;
        position: relative;
        color: #333;
    }
    
    .fake-header {
        text-align: center;
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }
    
    .fake-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1a73e8;
    }
    
    .fake-form {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .fake-form h3 {
        color: #333;
        margin-bottom: 1.5rem;
        font-family: Arial, sans-serif;
    }
    
    .fake-form input {
        width: 100%;
        padding: 0.8rem;
        margin-bottom: 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        font-family: Arial, sans-serif;
    }
    
    .fake-submit {
        width: 100%;
        padding: 0.8rem;
        background: #1a73e8;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        font-family: Arial, sans-serif;
    }
    
    .fake-submit:hover {
        background: #1557b0;
    }
    
    .fake-footer {
        text-align: center;
        margin-top: 1rem;
        color: #666;
        font-size: 0.9rem;
    }
    
    .fake-footer a {
        color: #1a73e8;
        text-decoration: none;
    }
    
    .url-bar {
        position: absolute;
        top: -30px;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        padding: 0.5rem 1rem;
        border-radius: 5px 5px 0 0;
        font-family: 'Source Code Pro', monospace;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0;
    }
    
    .url-bar .protocol {
        color: #00ff00;
    }
    
    .url-bar .domain {
        color: var(--primary-yellow);
    }
    
    .url-bar .path {
        color: #999;
    }
    
    .email-composer {
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #333;
        border-radius: 5px;
        padding: 1.5rem;
        margin: 1rem 0;
    }
    
    .email-field {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        gap: 1rem;
    }
    
    .email-field label {
        width: 80px;
        color: #999;
    }
    
    .email-field input {
        flex: 1;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid #666;
        padding: 0.5rem;
        color: var(--primary-cyan);
        font-family: 'Source Code Pro', monospace;
    }
    
    .email-body {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 5px;
        margin: 1rem 0;
        font-family: Arial, sans-serif;
        color: #ccc;
    }
    
    .email-body p {
        margin: 0.5rem 0;
    }
    
    .fake-button {
        display: inline-block;
        padding: 0.8rem 2rem;
        background: #1a73e8;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        margin: 1rem 0;
    }
    
    .credential-harvester {
        margin-top: 2rem;
        background: rgba(255, 0, 0, 0.05);
        border: 1px solid rgba(255, 0, 0, 0.3);
        border-radius: 10px;
        padding: 1.5rem;
    }
    
    .credential-harvester h3 {
        color: #ff3333;
        margin-bottom: 1rem;
    }
    
    .no-creds {
        text-align: center;
        color: #666;
        padding: 2rem;
    }
    
    .creds-list {
        max-height: 400px;
        overflow-y: auto;
    }
    
    .cred-entry {
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 0, 0, 0.3);
        border-radius: 5px;
        padding: 1rem;
        margin-bottom: 1rem;
    }
    
    .cred-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        color: #999;
        font-size: 0.85rem;
    }
    
    .cred-number {
        color: #ff6666;
        font-weight: 700;
    }
    
    .cred-field {
        margin: 0.3rem 0;
        display: flex;
        gap: 1rem;
    }
    
    .cred-field .label {
        color: #ff6666;
        min-width: 80px;
    }
    
    .cred-field .value {
        color: var(--primary-yellow);
        font-family: 'Source Code Pro', monospace;
    }
    
    .cred-field .password {
        color: #ff9900;
    }
    
    .cred-meta {
        margin-top: 0.5rem;
        font-size: 0.85rem;
        color: #666;
        display: flex;
        gap: 2rem;
    }
    
    .threat-bar.critical {
        color: #ff0000;
    }
    
    .threat-bar.critical::after {
        width: 95%;
        background: linear-gradient(90deg, #ff0000, #ff3333);
    }
    
    .threat-text.critical {
        color: #ff0000;
        font-weight: 700;
    }
    
    .attack-methods ul {
        list-style: none;
        padding: 0;
        margin: 1rem 0;
    }
    
    .attack-methods li {
        padding: 0.5rem 0;
        padding-left: 1.5rem;
        position: relative;
    }
    
    .attack-methods li::before {
        content: "→";
        position: absolute;
        left: 0;
        color: var(--primary-cyan);
    }
    
    .protection-grid {
        display: grid;
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .protection-card {
        background: rgba(0, 255, 0, 0.05);
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 5px;
        padding: 1rem;
    }
    
    .protection-card h5 {
        color: #00ff00;
        margin-bottom: 0.5rem;
        font-family: 'Orbitron', monospace;
    }
    
    .education-points {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .education-item {
        background: rgba(0, 255, 255, 0.05);
        border: 1px solid rgba(0, 255, 255, 0.3);
        border-radius: 5px;
        padding: 1rem;
    }
    
    .education-item .icon {
        font-size: 2rem;
        display: block;
        margin-bottom: 0.5rem;
    }
    
    .education-item strong {
        color: var(--primary-cyan);
        display: block;
        margin-bottom: 0.5rem;
    }
    
    .indicator-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        margin: 1rem 0;
    }
    
    .indicator {
        padding: 0.5rem;
        border-radius: 5px;
        font-size: 0.9rem;
    }
    
    .indicator.bad {
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
    }
    
    .indicator.good {
        background: rgba(0, 255, 0, 0.1);
        border: 1px solid rgba(0, 255, 0, 0.3);
    }
    
    .response-steps {
        background: rgba(255, 255, 0, 0.05);
        border: 1px solid rgba(255, 255, 0, 0.3);
        border-radius: 5px;
        padding: 1.5rem;
    }
    
    .response-steps ol {
        margin: 0;
        padding-left: 1.5rem;
    }
    
    .response-steps li {
        margin: 0.5rem 0;
        color: var(--primary-yellow);
    }
`;
document.head.appendChild(lab4Styles);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateHarvestedDisplay();
}); 