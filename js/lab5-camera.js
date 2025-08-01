// Lab 5 - Camera Access Exploitation Functionality

let mediaStream = null;
let isRecording = false;
let capturedFrames = 0;
let audioSamples = 0;
let locationUpdates = 0;
let surveillanceInterval = null;

// Permission states
const permissions = {
    camera: 'not-requested',
    microphone: 'not-requested', 
    location: 'not-requested'
};

// Request camera access (deceptive)
async function requestCameraAccess() {
    updatePermissionState('camera', 'requesting');
    
    try {
        // Simulate social engineering - change page title
        document.title = "PhotoMagic Pro - Loading...";
        
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: false
        });
        
        mediaStream = stream;
        updatePermissionState('camera', 'granted');
        
        // Show fake success message
        alert("تم منح وصول الكاميرا! يمكنك الآن التقاط صور مذهلة!");
        
        updateProgress(25);
        
    } catch (error) {
        updatePermissionState('camera', 'denied');
        console.log('Camera access denied:', error);
        
        // Show fake error to encourage retry
        alert("وصول الكاميرا مطلوب لكي يعمل هذا التطبيق. يرجى السماح بالوصول والمحاولة مرة أخرى.");
    }
}

// Request all permissions
async function requestAllPermissions() {
    // Camera
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: true
        });
        
        mediaStream = stream;
        updatePermissionState('camera', 'granted');
        updatePermissionState('microphone', 'granted');
        
    } catch (error) {
        updatePermissionState('camera', 'denied');
        updatePermissionState('microphone', 'denied');
    }
    
    // Location
    if (navigator.geolocation) {
        updatePermissionState('location', 'requesting');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                updatePermissionState('location', 'granted');
                locationUpdates++;
                updateStats();
            },
            (error) => {
                updatePermissionState('location', 'denied');
            }
        );
    }
    
    updateProgress(50);
}

// Update permission state display
function updatePermissionState(permission, state) {
    permissions[permission] = state;
    const stateElement = document.getElementById(`${permission}-state`);
    
    const stateText = {
        'not-requested': 'لم يتم الطلب',
        'requesting': 'جاري الطلب...',
        'granted': '✅ مُمنح',
        'denied': '❌ مرفوض'
    };
    
    const stateColors = {
        'not-requested': '#666',
        'requesting': '#ff9900',
        'granted': '#00ff00',
        'denied': '#ff3333'
    };
    
    stateElement.textContent = stateText[state];
    stateElement.style.color = stateColors[state];
    
    if (state === 'granted') {
        stateElement.style.textShadow = '0 0 10px currentColor';
    }
}

// Start surveillance
async function startSurveillance() {
    if (!mediaStream) {
        alert('Camera access required! Please grant permissions first.');
        return;
    }
    
    const video = document.getElementById('camera-preview');
    const surveillanceBtn = document.getElementById('surveillance-btn');
    const captureBtn = document.getElementById('capture-btn');
    const audioBtn = document.getElementById('audio-btn');
    const recordingIndicator = document.getElementById('recording-indicator');
    
    video.srcObject = mediaStream;
    isRecording = true;
    
    // Update UI
    surveillanceBtn.textContent = '⏹️ Stop Surveillance';
    surveillanceBtn.onclick = stopSurveillance;
    captureBtn.disabled = false;
    audioBtn.disabled = false;
    recordingIndicator.style.display = 'flex';
    
    // Show video info
    video.onloadedmetadata = () => {
        document.getElementById('resolution').textContent = `${video.videoWidth}x${video.videoHeight}`;
        document.getElementById('fps').textContent = '30';
    };
    
    // Start automatic frame capture simulation
    surveillanceInterval = setInterval(() => {
        if (isRecording) {
            capturedFrames++;
            audioSamples += Math.floor(Math.random() * 5) + 1;
            updateStats();
            addCapturedData('frame', `Frame ${capturedFrames} captured`);
        }
    }, 3000);
    
    // Success indicator
    document.getElementById('success-indicator').classList.add('show');
    updateProgress(75);
}

// Stop surveillance
function stopSurveillance() {
    const video = document.getElementById('camera-preview');
    const surveillanceBtn = document.getElementById('surveillance-btn');
    const captureBtn = document.getElementById('capture-btn');
    const audioBtn = document.getElementById('audio-btn');
    const recordingIndicator = document.getElementById('recording-indicator');
    
    isRecording = false;
    
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    
    video.srcObject = null;
    
    // Update UI
    surveillanceBtn.textContent = '🔴 Start Surveillance';
    surveillanceBtn.onclick = startSurveillance;
    captureBtn.disabled = true;
    audioBtn.disabled = true;
    recordingIndicator.style.display = 'none';
    
    if (surveillanceInterval) {
        clearInterval(surveillanceInterval);
        surveillanceInterval = null;
    }
}

// Capture frame manually
function captureFrame() {
    if (!isRecording) return;
    
    const video = document.getElementById('camera-preview');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    capturedFrames++;
    updateStats();
    addCapturedData('manual-frame', `Manual capture: Frame ${capturedFrames}`);
    
    // Visual feedback
    const captureBtn = document.getElementById('capture-btn');
    const originalText = captureBtn.textContent;
    captureBtn.textContent = '✓ Captured!';
    captureBtn.style.background = '#00ff00';
    captureBtn.style.color = '#000';
    
    setTimeout(() => {
        captureBtn.textContent = originalText;
        captureBtn.style.background = '';
        captureBtn.style.color = '';
    }, 1000);
}

// Toggle audio monitoring
function toggleAudio() {
    const audioBtn = document.getElementById('audio-btn');
    
    if (audioBtn.textContent.includes('Monitor')) {
        audioBtn.textContent = '🔇 Stop Audio';
        audioBtn.style.background = '#ff3333';
        
        // Simulate audio monitoring
        const audioInterval = setInterval(() => {
            if (audioBtn.textContent.includes('Stop')) {
                audioSamples += Math.floor(Math.random() * 3) + 1;
                updateStats();
                addCapturedData('audio', `Audio sample recorded (${audioSamples})`);
            } else {
                clearInterval(audioInterval);
            }
        }, 2000);
        
    } else {
        audioBtn.textContent = '🎤 Monitor Audio';
        audioBtn.style.background = '';
    }
}

// Update statistics
function updateStats() {
    document.getElementById('frame-count').textContent = capturedFrames;
    document.getElementById('audio-count').textContent = audioSamples;
    document.getElementById('location-count').textContent = locationUpdates;
}

// Add captured data to display
function addCapturedData(type, message) {
    const dataList = document.getElementById('data-list');
    
    // Remove "no data" message
    const noData = dataList.querySelector('.no-data');
    if (noData) {
        noData.remove();
    }
    
    const dataItem = document.createElement('div');
    dataItem.className = 'data-item';
    dataItem.innerHTML = `
        <div class="data-timestamp">${new Date().toLocaleTimeString()}</div>
        <div class="data-type">${getDataTypeIcon(type)} ${type.toUpperCase()}</div>
        <div class="data-message">${message}</div>
    `;
    
    dataList.insertBefore(dataItem, dataList.firstChild);
    
    // Keep only last 10 items
    while (dataList.children.length > 10) {
        dataList.removeChild(dataList.lastChild);
    }
    
    // Animate new item
    dataItem.style.animation = 'slide-in-left 0.3s ease';
}

// Get icon for data type
function getDataTypeIcon(type) {
    const icons = {
        'frame': '📸',
        'manual-frame': '🎯',
        'audio': '🎤',
        'location': '📍'
    };
    return icons[type] || '📊';
}

// Update progress
function updateProgress(percentage) {
    labCommon.updateProgress(percentage);
    
    if (percentage >= 100) {
        document.getElementById('success-indicator').classList.add('show');
    }
}

// Simulate location tracking
function startLocationTracking() {
    if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                locationUpdates++;
                updateStats();
                addCapturedData('location', 
                    `Location: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
                );
            },
            (error) => {
                console.log('Location error:', error);
            },
            { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
        );
    }
}

// Add CSS for Lab 5
const lab5Styles = document.createElement('style');
lab5Styles.textContent = `
    .threat-bar.high::after {
        width: 80%;
        background: linear-gradient(90deg, #ff6600, #ff9900);
    }
    
    .threat-text.high {
        color: #ff9900;
    }
    
    .social-setup {
        margin: 1rem 0;
    }
    
    .fake-app-preview {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 15px;
        padding: 2rem;
        text-align: center;
        max-width: 300px;
        margin: 1rem auto;
        color: white;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .fake-app-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .app-icon {
        font-size: 2rem;
    }
    
    .app-name {
        font-size: 1.5rem;
        font-weight: 700;
        font-family: 'Orbitron', monospace;
    }
    
    .fake-description {
        margin-bottom: 1.5rem;
        opacity: 0.9;
    }
    
    .fake-allow-btn {
        background: #00ff00;
        color: #000;
        border: none;
        padding: 1rem 2rem;
        border-radius: 25px;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Rajdhani', sans-serif;
    }
    
    .fake-allow-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(0, 255, 0, 0.4);
    }
    
    .permission-status {
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #333;
        border-radius: 10px;
        padding: 1.5rem;
        margin: 1rem 0;
    }
    
    .permission-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.8rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .permission-item:last-child {
        border-bottom: none;
    }
    
    .permission-name {
        font-size: 1.1rem;
        font-family: 'Rajdhani', sans-serif;
    }
    
    .permission-state {
        font-family: 'Orbitron', monospace;
        font-weight: 700;
        transition: all 0.3s ease;
    }
    
    .surveillance-panel {
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid var(--primary-cyan);
        border-radius: 15px;
        padding: 1.5rem;
        margin: 1rem 0;
    }
    
    .camera-feed {
        position: relative;
        margin-bottom: 1rem;
    }
    
    #camera-preview {
        width: 100%;
        max-width: 400px;
        height: 300px;
        background: #000;
        border-radius: 10px;
        object-fit: cover;
    }
    
    .camera-overlay {
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
    
    .recording-indicator {
        background: rgba(255, 0, 0, 0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 700;
        display: none;
        align-items: center;
        gap: 0.5rem;
        animation: pulse 2s ease-in-out infinite;
    }
    
    .red-dot {
        width: 8px;
        height: 8px;
        background: #ff0000;
        border-radius: 50%;
        animation: blink 1s ease-in-out infinite;
    }
    
    .camera-info {
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 0.5rem;
        border-radius: 5px;
        font-size: 0.8rem;
        font-family: 'Source Code Pro', monospace;
    }
    
    .surveillance-controls {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .exfiltration-panel {
        background: rgba(255, 0, 0, 0.05);
        border: 1px solid rgba(255, 0, 0, 0.3);
        border-radius: 10px;
        padding: 1.5rem;
        margin: 1rem 0;
    }
    
    .captured-data {
        background: rgba(0, 0, 0, 0.8);
        border-radius: 5px;
        margin-bottom: 1rem;
        min-height: 200px;
        max-height: 300px;
        overflow-y: auto;
    }
    
    .data-header {
        background: rgba(255, 0, 0, 0.2);
        padding: 1rem;
        font-family: 'Orbitron', monospace;
        font-weight: 700;
        color: #ff3333;
        text-align: center;
        border-bottom: 1px solid rgba(255, 0, 0, 0.3);
    }
    
    .data-list {
        padding: 1rem;
    }
    
    .no-data {
        text-align: center;
        color: #666;
        padding: 2rem;
        font-style: italic;
    }
    
    .data-item {
        background: rgba(255, 255, 255, 0.05);
        border-left: 3px solid var(--primary-cyan);
        padding: 0.8rem;
        margin: 0.5rem 0;
        border-radius: 5px;
        font-family: 'Source Code Pro', monospace;
        font-size: 0.9rem;
    }
    
    .data-timestamp {
        color: #666;
        font-size: 0.8rem;
        margin-bottom: 0.2rem;
    }
    
    .data-type {
        color: var(--primary-yellow);
        font-weight: 700;
        margin-bottom: 0.2rem;
    }
    
    .data-message {
        color: var(--primary-cyan);
    }
    
    .exfil-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
    }
    
    .stat {
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
        padding: 1rem;
        border-radius: 5px;
        border: 1px solid rgba(255, 0, 0, 0.3);
    }
    
    .stat .label {
        display: block;
        font-size: 0.9rem;
        color: #999;
        margin-bottom: 0.5rem;
    }
    
    .stat span:last-child {
        font-family: 'Orbitron', monospace;
        font-size: 1.5rem;
        color: #ff3333;
        font-weight: 700;
        text-shadow: 0 0 10px currentColor;
    }
    
    .protection-tips {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .tip-item {
        background: rgba(0, 255, 255, 0.05);
        border: 1px solid rgba(0, 255, 255, 0.3);
        border-radius: 10px;
        padding: 1.5rem;
    }
    
    .tip-item .icon {
        font-size: 2rem;
        display: block;
        margin-bottom: 0.5rem;
    }
    
    .tip-item strong {
        color: var(--primary-cyan);
        display: block;
        margin-bottom: 0.5rem;
        font-family: 'Orbitron', monospace;
    }
    
    .tip-item code {
        display: block;
        margin-top: 0.5rem;
        background: rgba(0, 0, 0, 0.5);
        padding: 0.5rem;
        border-radius: 3px;
        font-family: 'Source Code Pro', monospace;
        font-size: 0.85rem;
        color: var(--primary-yellow);
    }
    
    .security-features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .feature {
        background: rgba(0, 255, 0, 0.05);
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 10px;
        padding: 1.5rem;
    }
    
    .feature h5 {
        color: #00ff00;
        margin-bottom: 0.5rem;
        font-family: 'Orbitron', monospace;
    }
    
    .feature p {
        color: #ccc;
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.3; }
    }
`;
document.head.appendChild(lab5Styles);

// Switch between views
function switchView(viewType) {
    const hackerView = document.getElementById('hacker-view');
    const developerView = document.getElementById('developer-view');
    const quizView = document.getElementById('quiz-view');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    // Update button states
    toggleBtns.forEach(btn => {
        btn.classList.remove('active');
        // Check if button contains the view type text
        if ((viewType === 'hacker' && btn.querySelector('span:last-child').textContent.includes('الهاكر')) ||
            (viewType === 'developer' && btn.querySelector('span:last-child').textContent.includes('المطور')) ||
            (viewType === 'quiz' && btn.querySelector('span:last-child').textContent.includes('الأسئلة'))) {
            btn.classList.add('active');
        }
    });
    
    // Hide all views
    [hackerView, developerView, quizView].forEach(view => {
        if (view) {
            view.classList.remove('active');
            view.style.display = 'none';
        }
    });
    
    // Show selected view
    if (viewType === 'hacker' && hackerView) {
        hackerView.classList.add('active');
        hackerView.style.display = 'block';
    } else if (viewType === 'developer' && developerView) {
        developerView.classList.add('active');
        developerView.style.display = 'block';
    } else if (viewType === 'quiz' && quizView) {
        quizView.classList.add('active');
        quizView.style.display = 'block';
    }
}

// Quiz functionality
const correctAnswers = {
    q1: 'b', // إمكانية المراقبة والتسجيل بدون علم المستخدم
    q2: 'a', // مراقبة أيقونات الكاميرا في شريط العناوين وإعدادات المتصفح
    q3: 'c', // معايير للمصادقة القوية باستخدام الأجهزة الفيزيائية
    q4: 'd', // شرح واضح للاستخدام وعرض مؤشرات مرئية وإمكانية إلغاء
    q5: 'a'  // معالجتها محلياً عند الإمكان واستخدام تشفير قوي عند النقل
};

function checkAnswers() {
    let score = 0;
    const totalQuestions = Object.keys(correctAnswers).length;
    const userAnswers = {};
    const answerReview = document.getElementById('answer-review');
    answerReview.innerHTML = '';
    
    // Check each answer
    for (let [question, correctAnswer] of Object.entries(correctAnswers)) {
        const selectedOption = document.querySelector(`input[name="${question}"]:checked`);
        if (selectedOption) {
            userAnswers[question] = selectedOption.value;
            if (selectedOption.value === correctAnswer) {
                score++;
            }
        }
    }
    
    // Display score
    document.getElementById('quiz-score').textContent = `${score}/${totalQuestions}`;
    
    // Display result message
    const resultMessage = document.getElementById('result-message');
    if (score === totalQuestions) {
        resultMessage.innerHTML = '<span class="success">🎉 ممتاز! لقد أجبت على جميع الأسئلة بشكل صحيح!</span><br><br><span class="flag">🚩 رمز الفلاق: <code>PRIVACY_GUARDIAN</code></span>';
        // Show celebration animation
        showCelebration();
    } else if (score >= totalQuestions * 0.8) {
        resultMessage.innerHTML = '<span class="good">👍 جيد جداً! لديك فهم قوي للموضوع.</span>';
    } else if (score >= totalQuestions * 0.6) {
        resultMessage.innerHTML = '<span class="average">📚 جيد! راجع المواد لتحسين معرفتك.</span>';
    } else {
        resultMessage.innerHTML = '<span class="needs-improvement">💡 تحتاج إلى مزيد من الدراسة. راجع المحتوى وحاول مرة أخرى.</span>';
    }
    
    // Clear answer review
    answerReview.innerHTML = '';
    
    // Show results section
    document.getElementById('quiz-results').style.display = 'block';
    document.getElementById('quiz-results').scrollIntoView({ behavior: 'smooth' });
}

function getAnswerText(question, answer) {
    const questionCard = document.querySelector(`[data-question="${question.slice(1)}"]`);
    if (questionCard) {
        const option = questionCard.querySelector(`input[value="${answer}"]`);
        if (option) {
            return option.nextElementSibling.textContent;
        }
    }
    return answer;
}

function resetQuiz() {
    // Clear all selections
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    
    // Hide results
    document.getElementById('quiz-results').style.display = 'none';
    
    // Scroll to top of quiz
    document.getElementById('quiz-questions').scrollIntoView({ behavior: 'smooth' });
}

function showCelebration() {
    // Create celebration effect
    const celebration = document.createElement('div');
    celebration.className = 'celebration-overlay';
    celebration.innerHTML = `
        <div class="celebration-content">
            <h2>🎉 تهانينا! 🎉</h2>
            <p>لقد أتقنت معرفة أمان الكاميرا والخصوصية!</p>
        </div>
    `;
    document.body.appendChild(celebration);
    
    // Remove after animation
    setTimeout(() => {
        celebration.remove();
    }, 3000);
}

// Add quiz styles
const quizStyles = document.createElement('style');
quizStyles.textContent = `
    .quiz-content {
        padding: 2rem;
    }
    
    .quiz-intro {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .question-card {
        background: rgba(0, 255, 255, 0.05);
        border: 1px solid rgba(0, 255, 255, 0.3);
        border-radius: 10px;
        padding: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .question-card h4 {
        color: var(--primary-cyan);
        margin-bottom: 1rem;
        font-family: 'Cairo', sans-serif;
    }
    
    .options {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }
    
    .option {
        display: flex;
        align-items: center;
        padding: 0.8rem;
        background: rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
    }
    
    .option:hover {
        background: rgba(0, 255, 255, 0.1);
        border-color: rgba(0, 255, 255, 0.5);
        transform: translateX(-5px);
    }
    
    .option input[type="radio"] {
        margin-left: 0.5rem;
        margin-right: 0;
        width: 18px;
        height: 18px;
        accent-color: var(--primary-cyan);
    }
    
    .option:has(input:checked) {
        background: rgba(0, 255, 255, 0.2);
        border-color: var(--primary-cyan);
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
    }
    
    .quiz-controls {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: 2rem 0;
    }
    
    .cyber-btn.secondary {
        background: rgba(255, 165, 0, 0.2);
        border: 2px solid #ff9500;
        color: #ff9500;
        font-weight: 700;
        font-size: 1.1rem;
        padding: 1rem 2rem;
        transition: all 0.3s ease;
    }
    
    .cyber-btn.secondary:hover {
        background: rgba(255, 165, 0, 0.3);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 165, 0, 0.4);
    }
    
    .quiz-results {
        display: none;
        margin-top: 3rem;
        padding: 2rem;
        background: rgba(0, 255, 255, 0.1);
        border: 2px solid var(--primary-cyan);
        border-radius: 10px;
    }
    
    .result-summary {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .score-display {
        font-size: 2rem;
        margin: 1rem 0;
    }
    
    .score-value {
        color: var(--neon-green);
        font-family: 'Orbitron', monospace;
        font-weight: 700;
        text-shadow: 0 0 10px currentColor;
    }
    
    .result-message .success {
        color: #00ff00;
        font-size: 1.2rem;
    }
    
    .result-message .good {
        color: #90ee90;
    }
    
    .result-message .average {
        color: #ffff00;
    }
    
    .result-message .needs-improvement {
        color: #ff6666;
    }
    
    .answer-review {
        margin-top: 2rem;
    }
    
    .answer-item {
        padding: 0.8rem;
        margin: 0.5rem 0;
        border-radius: 5px;
        background: rgba(0, 0, 0, 0.3);
    }
    
    .answer-item.correct {
        border-left: 3px solid #00ff00;
    }
    
    .answer-item.incorrect {
        border-left: 3px solid #ff6666;
    }
    
    .celebration-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.5s ease;
    }
    
    .celebration-content {
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        border: 2px solid var(--neon-green);
        border-radius: 20px;
        padding: 3rem;
        text-align: center;
        animation: scaleIn 0.5s ease;
    }
    
    .celebration-content h2 {
        color: var(--neon-green);
        font-size: 3rem;
        margin-bottom: 1rem;
        text-shadow: 0 0 20px currentColor;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes scaleIn {
        from { transform: scale(0.8); }
        to { transform: scale(1); }
    }
    
    .flag {
        display: inline-block;
        margin-top: 1rem;
        padding: 1rem 2rem;
        background: rgba(0, 255, 0, 0.1);
        border: 2px solid var(--neon-green);
        border-radius: 10px;
        font-size: 1.2rem;
    }
    
    .flag code {
        font-family: 'Orbitron', monospace;
        font-size: 1.5rem;
        color: var(--neon-green);
        text-shadow: 0 0 10px currentColor;
        font-weight: 700;
    }
`;
document.head.appendChild(quizStyles);

// Make functions globally accessible
window.switchView = switchView;
window.checkAnswers = checkAnswers;
window.resetQuiz = resetQuiz;
window.requestCameraAccess = requestCameraAccess;
window.requestAllPermissions = requestAllPermissions;
window.startSurveillance = startSurveillance;
window.captureFrame = captureFrame;
window.toggleAudio = toggleAudio;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Start location tracking simulation
    setTimeout(startLocationTracking, 2000);
}); 