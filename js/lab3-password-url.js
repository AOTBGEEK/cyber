// Lab 3 - Password in URL Functionality

// Simulated data
const browserHistory = [
    { 
        url: 'https://vulnerable-app.com/dashboard?user=john.doe&pass=Summer2024!&token=xyz789',
        timestamp: new Date(Date.now() - 3600000).toLocaleString(),
        title: 'Dashboard - John Doe'
    },
    { 
        url: 'https://vulnerable-app.com/profile?user=admin&pass=AdminP@ss123&session=abc123',
        timestamp: new Date(Date.now() - 7200000).toLocaleString(),
        title: 'Admin Profile'
    },
    { 
        url: 'https://vulnerable-app.com/settings?user=alice&pass=Alice123!&auth=true',
        timestamp: new Date(Date.now() - 10800000).toLocaleString(),
        title: 'User Settings'
    }
];

const serverLogs = [
    '192.168.1.105 - - [24/Mar/2024:10:15:32] "GET /login?user=bob&pass=BobSecure123 HTTP/1.1" 200',
    '10.0.0.52 - - [24/Mar/2024:10:18:45] "GET /dashboard?user=admin&pass=AdminP@ss123&token=xyz HTTP/1.1" 200',
    '172.16.0.23 - - [24/Mar/2024:10:22:11] "GET /api/data?apikey=sk_live_abcd1234&user=service HTTP/1.1" 200',
    '192.168.1.200 - - [24/Mar/2024:10:25:33] "GET /reset?email=user@example.com&token=reset123&pass=NewPass123! HTTP/1.1" 302'
];

const refererData = [
    {
        from: 'https://vulnerable-app.com/login?user=victim&pass=Victim123!',
        to: 'https://external-analytics.com/track',
        leaked: 'user=victim&pass=Victim123!'
    },
    {
        from: 'https://vulnerable-app.com/dashboard?token=secret_token_12345',
        to: 'https://social-media.com/share',
        leaked: 'token=secret_token_12345'
    }
];

let credentialsFound = [];

// Check browser history
function checkBrowserHistory() {
    const resultsDiv = document.getElementById('history-results');
    resultsDiv.innerHTML = '<div class="loading">Scanning browser history...</div>';
    
    setTimeout(() => {
        let html = '<div class="history-entries">';
        
        browserHistory.forEach(entry => {
            const credentials = extractCredentials(entry.url);
            if (credentials) {
                credentialsFound.push(credentials);
            }
            
            html += `
                <div class="history-entry">
                    <div class="entry-time">${entry.timestamp}</div>
                    <div class="entry-title">${entry.title}</div>
                    <div class="entry-url">${highlightSensitiveData(entry.url)}</div>
                </div>
            `;
        });
        
        html += '</div>';
        resultsDiv.innerHTML = html;
        
        updateProgress(30);
        checkForSuccess();
    }, 1500);
}

// Analyze server logs
function analyzeServerLogs() {
    const resultsDiv = document.getElementById('log-results');
    resultsDiv.innerHTML = '<div class="loading">Accessing server logs...</div>';
    
    setTimeout(() => {
        let html = '<div class="log-entries">';
        
        serverLogs.forEach(log => {
            const highlighted = highlightSensitiveData(log);
            const credentials = extractCredentialsFromLog(log);
            if (credentials) {
                credentialsFound.push(credentials);
            }
            
            html += `<div class="log-entry">${highlighted}</div>`;
        });
        
        html += '</div>';
        resultsDiv.innerHTML = html;
        
        updateProgress(60);
        checkForSuccess();
    }, 2000);
}

// Check referer headers
function checkRefererHeaders() {
    const resultsDiv = document.getElementById('referer-results');
    resultsDiv.innerHTML = '<div class="loading">Intercepting referer headers...</div>';
    
    setTimeout(() => {
        let html = '<div class="referer-entries">';
        
        refererData.forEach(entry => {
            html += `
                <div class="referer-entry">
                    <div class="referer-from">From: ${highlightSensitiveData(entry.from)}</div>
                    <div class="referer-to">To: ${entry.to}</div>
                    <div class="referer-leaked">Leaked: <span class="leaked-data">${entry.leaked}</span></div>
                </div>
            `;
            
            const credentials = extractCredentials(entry.from);
            if (credentials) {
                credentialsFound.push(credentials);
            }
        });
        
        html += '</div>';
        resultsDiv.innerHTML = html;
        
        updateProgress(90);
        checkForSuccess();
    }, 1500);
}

// Copy malicious link
function copyMaliciousLink() {
    const link = document.getElementById('fake-link').textContent;
    
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = link;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        
        // Visual feedback
        event.target.textContent = '✓ Copied!';
        event.target.style.background = '#00ff00';
        event.target.style.color = '#000';
        
        setTimeout(() => {
            event.target.textContent = '📋 Copy Link';
            event.target.style.background = '';
            event.target.style.color = '';
        }, 2000);
    } catch (err) {
        console.error('Copy failed:', err);
    }
    
    document.body.removeChild(textarea);
}

// Extract credentials from URL
function extractCredentials(url) {
    const params = new URLSearchParams(url.split('?')[1]);
    const credentials = {};
    
    ['pass', 'password', 'pwd', 'token', 'apikey', 'key'].forEach(param => {
        if (params.has(param)) {
            credentials[param] = params.get(param);
        }
    });
    
    if (params.has('user') || params.has('username')) {
        credentials.user = params.get('user') || params.get('username');
    }
    
    return Object.keys(credentials).length > 0 ? credentials : null;
}

// Extract credentials from log
function extractCredentialsFromLog(log) {
    const urlMatch = log.match(/GET\s+([^\s]+)/);
    if (urlMatch) {
        return extractCredentials(urlMatch[1]);
    }
    return null;
}

// Highlight sensitive data
function highlightSensitiveData(text) {
    return text
        .replace(/(pass|password|pwd)=([^&\s]+)/gi, '<span class="sensitive">$1=$2</span>')
        .replace(/(token|apikey|key|session)=([^&\s]+)/gi, '<span class="sensitive">$1=$2</span>')
        .replace(/(user|username)=([^&\s]+)/gi, '<span class="sensitive-user">$1=$2</span>');
}

// Check for success
function checkForSuccess() {
    if (credentialsFound.length >= 3) {
        document.getElementById('success-indicator').classList.add('show');
        updateProgress(100);
        
        // Display harvested credentials
        displayHarvestedCredentials();
    }
}

// Display harvested credentials
function displayHarvestedCredentials() {
    const monitorDiv = document.getElementById('url-monitor-display');
    let html = '<div class="harvested-credentials">';
    
    const uniqueCredentials = Array.from(new Set(credentialsFound.map(c => JSON.stringify(c))))
        .map(c => JSON.parse(c));
    
    uniqueCredentials.forEach((cred, index) => {
        html += `
            <div class="credential-card">
                <div class="cred-header">Credential Set #${index + 1}</div>
                ${Object.entries(cred).map(([key, value]) => `
                    <div class="cred-field">
                        <span class="field-name">${key}:</span>
                        <span class="field-value">${value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    });
    
    html += '</div>';
    monitorDiv.innerHTML = html;
}

// Update progress
function updateProgress(percentage) {
    labCommon.updateProgress(percentage);
}

// Live URL monitoring simulation
function startUrlMonitoring() {
    const monitorDiv = document.getElementById('url-monitor-display');
    const urls = [
        'https://app.com/login',
        'https://app.com/auth?user=demo',
        'https://app.com/verify?user=test&pass=Test123!',
        'https://app.com/dashboard',
        'https://app.com/api?token=abc123xyz',
    ];
    
    let index = 0;
    
    const addUrl = () => {
        if (index < urls.length) {
            const urlDiv = document.createElement('div');
            urlDiv.className = 'monitored-url';
            urlDiv.innerHTML = highlightSensitiveData(urls[index]);
            urlDiv.style.animation = 'slide-in-left 0.3s ease';
            
            monitorDiv.insertBefore(urlDiv, monitorDiv.firstChild);
            
            // Keep only last 5
            while (monitorDiv.children.length > 5) {
                monitorDiv.removeChild(monitorDiv.lastChild);
            }
            
            index++;
        } else {
            index = 0;
        }
    };
    
    // Initial display
    monitorDiv.innerHTML = '<div class="monitor-waiting">Monitoring network traffic...</div>';
    
    // Start monitoring after delay
    setTimeout(() => {
        monitorDiv.innerHTML = '';
        setInterval(addUrl, 2000);
    }, 1000);
}

// Add CSS for Lab 3
const lab3Styles = document.createElement('style');
lab3Styles.textContent = `
    .results-box {
        margin-top: 1rem;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #333;
        border-radius: 5px;
        padding: 1rem;
        min-height: 100px;
    }
    
    .loading {
        color: var(--primary-yellow);
        text-align: center;
        animation: pulse 1s ease-in-out infinite;
    }
    
    .history-entry, .log-entry, .referer-entry {
        margin: 0.5rem 0;
        padding: 0.5rem;
        background: rgba(0, 255, 255, 0.05);
        border-left: 2px solid var(--primary-cyan);
        font-family: 'Source Code Pro', monospace;
        font-size: 0.9rem;
    }
    
    .entry-time {
        color: #666;
        font-size: 0.8rem;
    }
    
    .entry-title {
        color: var(--primary-cyan);
        margin: 0.2rem 0;
    }
    
    .entry-url {
        word-break: break-all;
    }
    
    .sensitive {
        background: rgba(255, 0, 0, 0.3);
        color: #ff6666;
        padding: 0 4px;
        border-radius: 3px;
        font-weight: 700;
    }
    
    .sensitive-user {
        background: rgba(255, 255, 0, 0.2);
        color: var(--primary-yellow);
        padding: 0 4px;
        border-radius: 3px;
    }
    
    .referer-from, .referer-to {
        margin: 0.2rem 0;
    }
    
    .referer-leaked {
        color: #ff6666;
        font-weight: 700;
    }
    
    .leaked-data {
        background: rgba(255, 0, 0, 0.2);
        padding: 2px 6px;
        border-radius: 3px;
    }
    
    .social-engineering-demo {
        background: rgba(255, 0, 255, 0.1);
        border: 1px solid var(--primary-magenta);
        border-radius: 5px;
        padding: 1rem;
        margin: 1rem 0;
    }
    
    .fake-link {
        background: #0a0a0a;
        padding: 1rem;
        border-radius: 5px;
        font-family: 'Source Code Pro', monospace;
        font-size: 0.85rem;
        word-break: break-all;
        margin: 1rem 0;
    }
    
    .fake-link .highlight {
        background: rgba(255, 0, 0, 0.3);
        color: #ff6666;
    }
    
    .cyber-btn.small {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
    
    .url-monitor {
        margin-top: 2rem;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid var(--primary-cyan);
        border-radius: 10px;
        padding: 1.5rem;
    }
    
    .url-monitor h3 {
        color: #ff3333;
        margin-bottom: 1rem;
        animation: pulse 2s ease-in-out infinite;
    }
    
    #url-monitor-display {
        min-height: 150px;
        max-height: 300px;
        overflow-y: auto;
    }
    
    .monitored-url {
        padding: 0.5rem;
        margin: 0.2rem 0;
        background: rgba(255, 255, 255, 0.05);
        border-left: 2px solid rgba(255, 0, 0, 0.5);
        font-family: 'Source Code Pro', monospace;
        font-size: 0.85rem;
    }
    
    .monitor-waiting {
        text-align: center;
        color: #666;
        padding: 2rem;
    }
    
    .harvested-credentials {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .credential-card {
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.5);
        border-radius: 5px;
        padding: 1rem;
        animation: pulse-glow 2s ease-in-out infinite;
    }
    
    .cred-header {
        color: #ff3333;
        font-weight: 700;
        margin-bottom: 0.5rem;
        font-family: 'Orbitron', monospace;
    }
    
    .cred-field {
        margin: 0.3rem 0;
        font-size: 0.9rem;
    }
    
    .field-name {
        color: #ff6666;
        font-weight: 700;
    }
    
    .field-value {
        color: var(--primary-yellow);
        font-family: 'Source Code Pro', monospace;
    }
    
    .threat-bar.medium {
        color: #ff9900;
    }
    
    .threat-bar.medium::after {
        width: 60%;
        background: linear-gradient(90deg, #ff6600, #ff9900);
    }
    
    .threat-text.medium {
        color: #ff9900;
    }
    
    .vulnerability-list {
        list-style: none;
        padding: 0;
        margin: 1rem 0;
    }
    
    .vulnerability-list li {
        padding: 0.5rem 0;
        padding-left: 1.5rem;
        position: relative;
    }
    
    .vulnerability-list li::before {
        content: "⚠️";
        position: absolute;
        left: 0;
    }
    
    .protection-list {
        display: grid;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .protection-item {
        background: rgba(0, 255, 0, 0.05);
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 5px;
        padding: 1rem;
    }
    
    .protection-item .icon {
        font-size: 1.5rem;
        margin-right: 0.5rem;
    }
    
    .protection-item strong {
        color: var(--primary-cyan);
    }
    
    .protection-item code {
        display: block;
        margin-top: 0.5rem;
        background: rgba(0, 0, 0, 0.5);
        padding: 0.5rem;
        border-radius: 3px;
        font-family: 'Source Code Pro', monospace;
        font-size: 0.85rem;
    }
`;
document.head.appendChild(lab3Styles);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    startUrlMonitoring();
}); 