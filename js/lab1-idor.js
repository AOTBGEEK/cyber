// Lab 1 - IDOR Specific Functionality

// Simulated user database
const users = {
    '0': { name: 'النظام', role: 'system', access: 'وصول كامل للنظام', secret: 'مصنف' },
    '1': { name: 'المدير', role: 'admin', access: 'وصول لوحة الإدارة', secret: 'مفاتيح API المدير' },
    '1000': { name: 'أحمد محمد', role: 'moderator', access: 'وصول المشرف', secret: 'أدوات الإشراف' },
    '1001': { name: 'فاطمة علي', role: 'user', access: 'وصول المستخدم العادي', secret: 'البيانات الشخصية' },
    '1002': { name: 'محمد حسن', role: 'user', access: 'وصول المستخدم العادي', secret: 'البيانات الشخصية' },
    '999': { name: 'حساب الاختبار', role: 'test', access: 'بيئة الاختبار', secret: 'بيانات الاختبار' }
};

// Try User ID Function
function tryUserID() {
    const input = document.getElementById('user-id-input');
    const responseDisplay = document.getElementById('response-display');
    const successIndicator = document.getElementById('success-indicator');
    
    const userId = input.value.trim();
    
    // Add loading effect
    responseDisplay.innerHTML = '<pre style="color: #ffff00;">جاري الوصول لقاعدة البيانات...</pre>';
    
    setTimeout(() => {
        if (users[userId]) {
            const user = users[userId];
            let responseColor = '#00ff00';
            let responseText = '';
            
            if (user.role === 'admin' || user.role === 'system') {
                responseColor = '#ff0000';
                responseText = `🚨 تم اكتشاف وصول حرج! 🚨\n\n`;
                successIndicator.classList.add('show');
                labCommon.updateProgress(100);
                
                // Add dramatic effect
                document.body.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 500);
            }
            
            responseText += `معرف المستخدم: ${userId}\n`;
            responseText += `الاسم: ${user.name}\n`;
            responseText += `الدور: ${user.role.toUpperCase()}\n`;
            responseText += `مستوى الوصول: ${user.access}\n`;
            responseText += `البيانات السرية: ${user.secret}\n`;
            
            if (user.role === 'admin') {
                responseText += '\n⚠️ تحذير: تم كشف صلاحيات المدير!\n';
                responseText += 'لديك الآن وصول إلى:\n';
                responseText += '- إدارة المستخدمين\n';
                responseText += '- إعدادات النظام\n';
                responseText += '- وصول قاعدة البيانات\n';
                responseText += '- مفاتيح API\n';
            }
            
            responseDisplay.innerHTML = `<pre style="color: ${responseColor};">${responseText}</pre>`;
            
            // Log the attempt
            logAttempt(userId, user.role);
            
        } else {
            responseDisplay.innerHTML = `<pre style="color: #ff6666;">خطأ 404: لم يتم العثور على معرف المستخدم ${userId}\nجرب معرف آخر...</pre>`;
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
        "💡 تلميح: حسابات المدير غالباً لها أرقام معرف منخفضة",
        "💡 تلميح: جرب المعرف 0 أو 1",
        "💡 تلميح: حسابات النظام قد تستخدم معرفات خاصة",
        "💡 تلميح: عدّد بالتسلسل من 0"
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
    q1: 'b', // ثغرة تسمح بالوصول لموارد غير مصرح بها عبر تغيير المعرفات
    q2: 'b', // بتغيير المعرفات في عناوين URL والمعاملات
    q3: 'b', // التحقق من صلاحيات المستخدم لكل طلب
    q4: 'b', // لأنها غير قابلة للتنبؤ وصعبة التخمين
    q5: 'b'  // تسجيل المحاولة ومراقبة النشاط المشبوه
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
        resultMessage.innerHTML = '<span class="success">🎉 ممتاز! لقد أجبت على جميع الأسئلة بشكل صحيح!</span><br><br><span class="flag">🚩 رمز الفلاق: <code>CYBER_IDOR_FLAG</code></span>';
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
            <p>لقد أتقنت معرفة ثغرات IDOR!</p>
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
window.tryUserID = tryUserID; 