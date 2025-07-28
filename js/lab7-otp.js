// Lab 7 - OTP/2FA Security Functionality

let currentOTP = '000000';
let otpTimer = 30;
let otpInterval = null;
let loginAttempted = false;
let bypassAttempts = {
    sms: 0,
    sim: 0,
    brute: 0,
    social: 0
};

// Attempt initial login
function attemptLogin() {
    const responseDiv = document.getElementById('login-response');
    responseDiv.innerHTML = '<div class="loading">جاري مصادقة بيانات الاعتماد...</div>';
    
    setTimeout(() => {
        responseDiv.innerHTML = `
            <div class="auth-response success">
                <div class="response-header">
                    <span class="icon">✓</span>
                    <span>بيانات الاعتماد صحيحة</span>
                </div>
                <div class="response-body">
                    <p>تم قبول اسم المستخدم وكلمة المرور.</p>
                    <p class="challenge-notice">🔐 المصادقة الثنائية مطلوبة</p>
                    <div class="challenge-details">
                        <p>يرجى إدخال الرمز المكون من 6 أرقام من تطبيق المصادقة الخاص بك:</p>
                        <div class="otp-input-group">
                            <input type="text" id="otp-input" placeholder="000000" maxlength="6">
                            <button onclick="submitOTP()" class="verify-btn">تحقق</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        loginAttempted = true;
        updateProgress(25);
        
        // Start OTP analyzer
        startOTPAnalyzer();
        
        // Start OTP generator
        startOTPGenerator();
        
    }, 1500);
}

// Submit OTP code
function submitOTP() {
    const otpInput = document.getElementById('otp-input');
    const enteredOTP = otpInput.value;
    
    if (enteredOTP.length !== 6) {
        alert('يرجى إدخال رمز مكون من 6 أرقام');
        return;
    }
    
    const responseDiv = document.getElementById('login-response');
    
    if (enteredOTP === currentOTP) {
        responseDiv.innerHTML = `
            <div class="auth-response success">
                <div class="response-header">
                    <span class="icon">🎯</span>
                    <span>تم التحقق من المصادقة الثنائية بنجاح</span>
                </div>
                <div class="response-body">
                    <p>✅ تم منح الوصول</p>
                    <p>مرحباً بك في النظام الآمن!</p>
                </div>
            </div>
        `;
        
        document.getElementById('success-indicator').classList.add('show');
        updateProgress(100);
        
    } else {
        responseDiv.innerHTML = `
            <div class="auth-response error">
                <div class="response-header">
                    <span class="icon">❌</span>
                    <span>فشل التحقق من المصادقة الثنائية</span>
                </div>
                <div class="response-body">
                    <p>رمز المصادقة غير صحيح. يرجى المحاولة مرة أخرى.</p>
                    <div class="challenge-details">
                        <div class="otp-input-group">
                            <input type="text" id="otp-input" placeholder="000000" maxlength="6">
                            <button onclick="submitOTP()" class="verify-btn">تحقق</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Start OTP analyzer
function startOTPAnalyzer() {
    const analyzerDiv = document.getElementById('otp-analyzer');
    
    analyzerDiv.innerHTML = `
        <div class="analyzer-content">
            <div class="analyzer-header">
                <span class="icon">🔍</span>
                <span>تم اكتشاف تحدي المصادقة الثنائية</span>
            </div>
            <div class="challenge-info">
                <div class="info-item">
                    <span class="label">الطريقة:</span>
                    <span class="value">TOTP (كلمة مرور لمرة واحدة قائمة على الوقت)</span>
                </div>
                <div class="info-item">
                    <span class="label">الخوارزمية:</span>
                    <span class="value">HMAC-SHA1</span>
                </div>
                <div class="info-item">
                    <span class="label">الأرقام:</span>
                    <span class="value">6</span>
                </div>
                <div class="info-item">
                    <span class="label">الفترة:</span>
                    <span class="value">30 ثانية</span>
                </div>
                <div class="info-item">
                    <span class="label">الرموز الممكنة:</span>
                    <span class="value">1,000,000 (10^6)</span>
                </div>
            </div>
            <div class="vulnerability-assessment">
                <h5>تقييم الثغرات:</h5>
                <div class="vuln-item">
                    <span class="vuln-type">القوة الغاشمة:</span>
                    <span class="vuln-risk low">خطر منخفض جداً</span>
                </div>
                <div class="vuln-item">
                    <span class="vuln-type">اعتراض SMS:</span>
                    <span class="vuln-risk high">غير متاح (TOTP)</span>
                </div>
                <div class="vuln-item">
                    <span class="vuln-type">الهندسة الاجتماعية:</span>
                    <span class="vuln-risk medium">خطر متوسط</span>
                </div>
            </div>
        </div>
    `;
}

// Start OTP generator
function startOTPGenerator() {
    generateNewOTP();
    
    otpInterval = setInterval(() => {
        otpTimer--;
        
        if (otpTimer <= 0) {
            generateNewOTP();
            otpTimer = 30;
        }
        
        updateOTPDisplay();
    }, 1000);
}

// Generate new OTP
function generateNewOTP() {
    currentOTP = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

// Update OTP display
function updateOTPDisplay() {
    const otpDisplay = document.getElementById('current-otp');
    const timerText = document.getElementById('timer-text');
    const timerBar = document.getElementById('timer-bar');
    
    if (otpDisplay) {
        otpDisplay.textContent = currentOTP;
    }
    
    if (timerText) {
        timerText.textContent = `${otpTimer}s`;
    }
    
    if (timerBar) {
        const progress = (otpTimer / 30) * 100;
        timerBar.style.width = `${progress}%`;
        
        // Change color as time runs out
        if (otpTimer <= 5) {
            timerBar.style.background = '#ff3333';
        } else if (otpTimer <= 10) {
            timerBar.style.background = '#ff9900';
        } else {
            timerBar.style.background = '#00ff00';
        }
    }
}

// Bypass attempt functions
function attemptSMSInterception() {
    if (!loginAttempted) {
        alert('يرجى محاولة تسجيل الدخول أولاً!');
        return;
    }
    
    bypassAttempts.sms++;
    showBypassResult('sms', 'اعتراض SMS', 
        'فشل: الهدف يستخدم تطبيق مصادقة TOTP، وليس المصادقة الثنائية القائمة على SMS', false);
}

function attemptSIMSwap() {
    if (!loginAttempted) {
        alert('يرجى محاولة تسجيل الدخول أولاً!');
        return;
    }
    
    bypassAttempts.sim++;
    const success = Math.random() < 0.15; // 15% success rate
    
    showBypassResult('sim', 'هجوم تبديل SIM', 
        success ? 
        'نجح: تم إكمال تبديل SIM، لكن الهدف يستخدم المصادقة الثنائية القائمة على التطبيق' : 
        'فشل: منع أمان المشغل تبديل SIM', 
        false); // Always false for TOTP
}

function attemptBruteForce() {
    if (!loginAttempted) {
        alert('يرجى محاولة تسجيل الدخول أولاً!');
        return;
    }
    
    bypassAttempts.brute++;
    
    const resultsDiv = document.getElementById('bypass-results');
    resultsDiv.innerHTML = `
        <div class="bypass-result">
            <div class="result-header">
                <span class="icon">🔢</span>
                <span>هجوم القوة الغاشمة OTP</span>
            </div>
            <div class="brute-force-sim">
                <div class="brute-progress">
                    <div class="progress-text">جاري محاولة الرموز...</div>
                    <div class="attempt-counter">المحاولات: <span id="attempt-counter">0</span></div>
                    <div class="current-attempt">جاري المحاولة: <span id="current-attempt">000000</span></div>
                </div>
            </div>
        </div>
    `;
    
    // Simulate brute force
    let attempts = 0;
    const maxAttempts = 100; // Simulate only first 100 attempts
    
    const bruteInterval = setInterval(() => {
        attempts++;
        const randomCode = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        
        document.getElementById('attempt-counter').textContent = attempts;
        document.getElementById('current-attempt').textContent = randomCode;
        
        if (attempts >= maxAttempts) {
            clearInterval(bruteInterval);
            
            resultsDiv.innerHTML = `
                <div class="bypass-result failed">
                    <div class="result-header">
                        <span class="icon">❌</span>
                        <span>فشل القوة الغاشمة</span>
                    </div>
                    <div class="result-body">
                        <p>فشل بعد ${maxAttempts} محاولة</p>
                        <p>الوقت المقدر للنجاح: <strong>13.9 ساعة</strong></p>
                        <p>سيتم قفل الحساب بعد 3-5 محاولات فاشلة</p>
                    </div>
                </div>
            `;
        }
    }, 50);
    
    updateProgress(60);
}

function attemptSocialEngineering() {
    if (!loginAttempted) {
        alert('يرجى محاولة تسجيل الدخول أولاً!');
        return;
    }
    
    bypassAttempts.social++;
    const success = Math.random() < 0.25; // 25% success rate
    
    showBypassResult('social', 'الهندسة الاجتماعية', 
        success ? 
        'نجح جزئياً: تم إقناع المستخدم بمشاركة الرمز، لكنه انتهت صلاحيته قبل الاستخدام' : 
        'فشل: تم تدريب المستخدم على التعرف على محاولات الهندسة الاجتماعية', 
        false);
}

// Show bypass result
function showBypassResult(type, method, message, success) {
    const resultsDiv = document.getElementById('bypass-results');
    
    resultsDiv.innerHTML = `
        <div class="bypass-result ${success ? 'success' : 'failed'}">
            <div class="result-header">
                <span class="icon">${success ? '✅' : '❌'}</span>
                <span>${method}</span>
            </div>
            <div class="result-body">
                <p>${message}</p>
                <div class="attempt-info">
                    المحاولة رقم ${bypassAttempts[type]} - ${success ? 'نجح' : 'فشل'}
                </div>
            </div>
        </div>
    `;
    
    // Update success rates
    updateSuccessRates();
    
    if (success) {
        updateProgress(100);
        document.getElementById('success-indicator').classList.add('show');
    } else {
        updateProgress(75);
    }
}

// Update success rate display
function updateSuccessRates() {
    // These are realistic success rates for different attack types
    document.getElementById('sms-success').textContent = '0%'; // TOTP not vulnerable
    document.getElementById('sim-success').textContent = '15%';
    document.getElementById('brute-success').textContent = '0.001%';
    document.getElementById('social-success').textContent = '25%';
}

// Update progress bar
function updateProgress(percentage) {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    // Update step indicators
    const steps = document.querySelectorAll('.step-indicator');
    if (percentage >= 25) steps[0].classList.add('completed');
    if (percentage >= 50) steps[1].classList.add('completed');
    if (percentage >= 75) steps[2].classList.add('completed');
    if (percentage >= 100) steps[3].classList.add('completed');
}

// Add CSS for Lab 7
const lab7Styles = document.createElement('style');
lab7Styles.textContent = `
    .threat-bar.low::after {
        width: 30%;
        background: linear-gradient(90deg, #00ff00, #66ff66);
    }
    
    .threat-text.low {
        color: #00ff00;
    }
    
    .login-simulator {
        margin: 1rem 0;
    }
    
    .login-form {
        background: rgba(0, 0, 0, 0.8);
        padding: 1.5rem;
        border-radius: 10px;
        border: 1px solid #333;
        margin-bottom: 1rem;
    }
    
    .login-form input {
        width: 100%;
        padding: 0.8rem;
        margin-bottom: 1rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid #666;
        color: var(--primary-cyan);
        font-family: 'Source Code Pro', monospace;
        border-radius: 5px;
    }
    
    .response-area {
        min-height: 100px;
    }
    
    .auth-response {
        background: rgba(0, 0, 0, 0.8);
        border-radius: 10px;
        padding: 1.5rem;
        border: 1px solid #333;
    }
    
    .auth-response.success {
        border-color: #00ff00;
        background: rgba(0, 255, 0, 0.05);
    }
    
    .auth-response.error {
        border-color: #ff3333;
        background: rgba(255, 0, 0, 0.05);
    }
    
    .response-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        font-family: 'Orbitron', monospace;
        font-weight: 700;
    }
    
    .auth-response.success .response-header {
        color: #00ff00;
    }
    
    .auth-response.error .response-header {
        color: #ff3333;
    }
    
    .challenge-notice {
        color: var(--primary-yellow);
        font-weight: 700;
        margin: 1rem 0;
        font-family: 'Orbitron', monospace;
    }
    
    .challenge-details {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 5px;
        margin-top: 1rem;
    }
    
    .otp-input-group {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .otp-input-group input {
        flex: 1;
        padding: 0.8rem;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid var(--primary-cyan);
        color: var(--primary-cyan);
        font-family: 'Source Code Pro', monospace;
        font-size: 1.2rem;
        text-align: center;
        border-radius: 5px;
    }
    
    .verify-btn {
        padding: 0.8rem 1.5rem;
        background: var(--primary-cyan);
        color: var(--dark-bg);
        border: none;
        border-radius: 5px;
        font-family: 'Orbitron', monospace;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .verify-btn:hover {
        background: #00cccc;
        transform: translateY(-2px);
    }
    
    .analyzer-content {
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid var(--primary-cyan);
        border-radius: 10px;
        padding: 1.5rem;
    }
    
    .analyzer-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        color: var(--primary-cyan);
        font-family: 'Orbitron', monospace;
        font-weight: 700;
    }
    
    .challenge-info {
        margin-bottom: 1.5rem;
    }
    
    .info-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .info-item .label {
        color: #999;
    }
    
    .info-item .value {
        color: var(--primary-cyan);
        font-family: 'Source Code Pro', monospace;
    }
    
    .vulnerability-assessment h5 {
        color: var(--primary-yellow);
        margin-bottom: 0.8rem;
        font-family: 'Orbitron', monospace;
    }
    
    .vuln-item {
        display: flex;
        justify-content: space-between;
        padding: 0.3rem 0;
    }
    
    .vuln-type {
        color: #ccc;
    }
    
    .vuln-risk.low {
        color: #00ff00;
    }
    
    .vuln-risk.medium {
        color: #ff9900;
    }
    
    .vuln-risk.high {
        color: #ff3333;
    }
    
    .bypass-methods {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .method-btn {
        padding: 1rem;
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.5);
        color: #ff6666;
        font-family: 'Rajdhani', sans-serif;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 8px;
    }
    
    .method-btn:hover {
        background: rgba(255, 0, 0, 0.2);
        transform: translateY(-3px);
    }
    
    .bypass-results {
        margin-top: 1rem;
        min-height: 100px;
    }
    
    .bypass-result {
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #333;
        border-radius: 10px;
        padding: 1.5rem;
    }
    
    .bypass-result.success {
        border-color: #00ff00;
        background: rgba(0, 255, 0, 0.05);
    }
    
    .bypass-result.failed {
        border-color: #ff3333;
        background: rgba(255, 0, 0, 0.05);
    }
    
    .result-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        font-family: 'Orbitron', monospace;
        font-weight: 700;
    }
    
    .bypass-result.success .result-header {
        color: #00ff00;
    }
    
    .bypass-result.failed .result-header {
        color: #ff3333;
    }
    
    .attempt-info {
        margin-top: 1rem;
        font-family: 'Source Code Pro', monospace;
        font-size: 0.9rem;
        color: #666;
    }
    
    .brute-force-sim {
        font-family: 'Source Code Pro', monospace;
    }
    
    .brute-progress {
        background: rgba(0, 0, 0, 0.5);
        padding: 1rem;
        border-radius: 5px;
    }
    
    .progress-text {
        color: var(--primary-yellow);
        margin-bottom: 0.5rem;
    }
    
    .attempt-counter, .current-attempt {
        margin: 0.3rem 0;
        color: var(--primary-cyan);
    }
    
    .attack-stats {
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #333;
        border-radius: 10px;
        padding: 1.5rem;
        margin: 1rem 0;
    }
    
    .stat-item {
        display: flex;
        justify-content: space-between;
        padding: 0.8rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .stat-item:last-child {
        border-bottom: none;
    }
    
    .stat-label {
        color: #ccc;
        font-family: 'Rajdhani', sans-serif;
    }
    
    .stat-value {
        color: var(--primary-cyan);
        font-family: 'Orbitron', monospace;
        font-weight: 700;
    }
    
    .otp-simulator {
        background: rgba(0, 0, 0, 0.8);
        border: 2px solid var(--primary-cyan);
        border-radius: 15px;
        padding: 2rem;
        margin: 2rem 0;
        text-align: center;
    }
    
    .otp-simulator h3 {
        color: var(--primary-cyan);
        margin-bottom: 1.5rem;
        font-family: 'Orbitron', monospace;
    }
    
    .otp-display {
        background: rgba(0, 255, 255, 0.05);
        border: 1px solid rgba(0, 255, 255, 0.3);
        border-radius: 10px;
        padding: 2rem;
        max-width: 300px;
        margin: 0 auto;
    }
    
    .otp-code {
        font-family: 'Source Code Pro', monospace;
        font-size: 3rem;
        font-weight: 700;
        color: var(--primary-cyan);
        text-shadow: 0 0 20px currentColor;
        margin-bottom: 1rem;
        letter-spacing: 0.2em;
    }
    
    .otp-timer {
        margin: 1rem 0;
        position: relative;
    }
    
    .timer-bar {
        height: 8px;
        background: #00ff00;
        border-radius: 4px;
        transition: all 0.3s ease;
        margin-bottom: 0.5rem;
    }
    
    #timer-text {
        color: #ccc;
        font-family: 'Orbitron', monospace;
    }
    
    .otp-type {
        color: #999;
        font-size: 0.9rem;
        font-family: 'Source Code Pro', monospace;
    }
    
    .vulnerability-types {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .vuln-card {
        background: rgba(255, 0, 0, 0.05);
        border: 1px solid rgba(255, 0, 0, 0.3);
        border-radius: 10px;
        padding: 1.5rem;
    }
    
    .vuln-card h5 {
        color: #ff6666;
        margin-bottom: 0.8rem;
        font-family: 'Orbitron', monospace;
    }
    
    .vuln-card ul {
        list-style: none;
        padding: 0;
    }
    
    .vuln-card li {
        padding: 0.3rem 0;
        color: #ccc;
        font-size: 0.9rem;
    }
    
    .vuln-card li::before {
        content: "⚠️ ";
        margin-right: 0.5rem;
    }
    
    .types-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .type-card {
        border-radius: 10px;
        padding: 1.5rem;
        position: relative;
    }
    
    .type-card.best {
        background: rgba(0, 255, 0, 0.05);
        border: 1px solid rgba(0, 255, 0, 0.5);
    }
    
    .type-card.good {
        background: rgba(0, 255, 255, 0.05);
        border: 1px solid rgba(0, 255, 255, 0.5);
    }
    
    .type-card.okay {
        background: rgba(255, 255, 0, 0.05);
        border: 1px solid rgba(255, 255, 0, 0.5);
    }
    
    .type-card.weak {
        background: rgba(255, 0, 0, 0.05);
        border: 1px solid rgba(255, 0, 0, 0.5);
    }
    
    .type-card h5 {
        margin-bottom: 0.8rem;
        font-family: 'Orbitron', monospace;
    }
    
    .type-card.best h5 { color: #00ff00; }
    .type-card.good h5 { color: #00ffff; }
    .type-card.okay h5 { color: #ffff00; }
    .type-card.weak h5 { color: #ff6666; }
    
    .type-card ul {
        list-style: none;
        padding: 0;
        margin-bottom: 1rem;
    }
    
    .type-card li {
        padding: 0.3rem 0;
        color: #ccc;
        font-size: 0.9rem;
    }
    
    .type-card li::before {
        content: "• ";
        color: inherit;
        font-weight: 700;
    }
    
    .security-rating {Left
        position: absolute;
        top: 1rem;
        Left: 1rem;
        background: rgba(0, 0, 0, 0.8);
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-family: 'Orbitron', monospace;
        font-weight: 700;
    }
    
    .practices-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .practice-section {
        background: rgba(0, 255, 255, 0.05);
        border: 1px solid rgba(0, 255, 255, 0.3);
        border-radius: 10px;
        padding: 1.5rem;
    }
    
    .practice-section h5 {
        color: var(--primary-cyan);
        margin-bottom: 0.8rem;
        font-family: 'Orbitron', monospace;
    }
    
    .practice-section ul {
        list-style: none;
        padding: 0;
    }
    
    .practice-section li {
        padding: 0.3rem 0;
        color: #ccc;
        font-size: 0.9rem;
    }
    
    .practice-section li::before {
        content: "✓ ";
        color: #00ff00;
        font-weight: 700;
    }
    
    .recovery-methods {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .recovery-card {
        background: rgba(255, 255, 0, 0.05);
        border: 1px solid rgba(255, 255, 0, 0.3);
        border-radius: 10px;
        padding: 1.5rem;
    }
    
    .recovery-card h5 {
        color: var(--primary-yellow);
        margin-bottom: 0.8rem;
        font-family: 'Orbitron', monospace;
    }
    
    .implementation-note {
        background: rgba(0, 0, 0, 0.5);
        padding: 0.8rem;
        border-radius: 5px;
        margin-top: 0.8rem;
        font-family: 'Source Code Pro', monospace;
        font-size: 0.85rem;
        color: #999;
        border-left: 3px solid var(--primary-yellow);
    }
`;
document.head.appendChild(lab7Styles);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateSuccessRates();
}); 