// مختبر الذكاء الاصطناعي 1 - وظائف المحادثة مع الذكاء الاصطناعي

let messageCount = 1; // يبدأ بـ 1 للرسالة الأولى من الذكاء الاصطناعي
let conversationHistory = [];

// تهيئة المختبر
document.addEventListener('DOMContentLoaded', () => {
    initializeDataStreams();
    initializeInputHandlers();
    updateProgress();
});

// تهيئة تأثير تدفق البيانات في الخلفية
function initializeDataStreams() {
    const streamsContainer = document.querySelector('.ai-data-streams');
    
    for (let i = 0; i < 20; i++) {
        const stream = document.createElement('div');
        stream.className = 'data-stream';
        
        const x = Math.random() * window.innerWidth;
        const duration = Math.random() * 8 + 5;
        const delay = Math.random() * 5;
        
        stream.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: -50px;
            width: 2px;
            height: 100px;
            background: linear-gradient(180deg, transparent, #00ffff, transparent);
            animation: data-stream-fall ${duration}s linear infinite;
            animation-delay: ${delay}s;
            opacity: 0.6;
        `;
        
        streamsContainer.appendChild(stream);
    }
    
    // إضافة CSS لتحريك تدفق البيانات
    const streamStyles = document.createElement('style');
    streamStyles.textContent = `
        @keyframes data-stream-fall {
            0% { transform: translateY(-100px); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { transform: translateY(${window.innerHeight + 100}px); opacity: 0; }
        }
    `;
    document.head.appendChild(streamStyles);
}

// تهيئة معالجات الإدخال
function initializeInputHandlers() {
    const chatInput = document.getElementById('chat-input');
    const charCount = document.getElementById('char-count');
    
    // تغيير حجم منطقة النص تلقائياً
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
        
        // تحديث عدد الأحرف
        const count = chatInput.value.length;
        charCount.textContent = `${count}/2000`;
        
        if (count > 1800) {
            charCount.style.color = '#ff6666';
        } else if (count > 1500) {
            charCount.style.color = '#ff9900';
        } else {
            charCount.style.color = '#666';
        }
        
        // تفعيل/إلغاء تفعيل زر الإرسال
        const sendBtn = document.getElementById('send-btn');
        sendBtn.disabled = count === 0 || count > 2000;
    });
}

// التعامل مع اختصارات لوحة المفاتيح
function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// وظيفة إرسال الرسالة
async function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // مسح الإدخال
    chatInput.value = '';
    chatInput.style.height = 'auto';
    document.getElementById('char-count').textContent = '0/2000';
    document.getElementById('send-btn').disabled = true;
    
    // إضافة رسالة المستخدم للمحادثة
    addMessage(message, 'user');
    
    // إظهار مؤشر تفكير الذكاء الاصطناعي
    showAIThinking();
    
    // محاكاة تأخير استجابة الذكاء الاصطناعي
    setTimeout(async () => {
        const aiResponse = await generateAIResponse(message);
        hideAIThinking();
        addMessage(aiResponse, 'ai');
    }, Math.random() * 2000 + 1000); // تأخير 1-3 ثواني
}

// إرسال مطالبة سريعة
function sendQuickPrompt(prompt) {
    const chatInput = document.getElementById('chat-input');
    chatInput.value = prompt;
    chatInput.focus();
    
    // تشغيل حدث الإدخال لتحديث عدد الأحرف
    chatInput.dispatchEvent(new Event('input'));
    
    // إرسال تلقائي بعد تأخير قصير
    setTimeout(() => {
        sendMessage();
    }, 500);
}

// إضافة رسالة للمحادثة
function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = sender === 'ai' ? '🤖' : '👤';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-text">${formatMessage(text)}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // تحديث تتبع المحادثة
    messageCount++;
    conversationHistory.push({ sender, text, time });
    updateProgress();
}

// تنسيق نص الرسالة (التعامل مع فواصل الأسطر، إلخ)
function formatMessage(text) {
    return text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

// توليد استجابة الذكاء الاصطناعي (محاكاة)
async function generateAIResponse(userMessage) {
    const responses = getContextualResponse(userMessage.toLowerCase());
    
    // إضافة بعض الشخصية والتنوع
    const personalityPrefixes = [
        "هذا سؤال رائع! ",
        "تفكير ممتاز! ",
        "أحب استكشاف هذا الموضوع! ",
        "وجهة نظر مثيرة للاهتمام! ",
        "يا له من سؤال إبداعي! ",
        ""
    ];
    
    const prefix = personalityPrefixes[Math.floor(Math.random() * personalityPrefixes.length)];
    
    return prefix + responses[Math.floor(Math.random() * responses.length)];
}

// الحصول على استجابات سياقية بناءً على مدخلات المستخدم
function getContextualResponse(message) {
    // موضوعات الذكاء الاصطناعي والتكنولوجيا
    if (message.includes('ai') || message.includes('artificial intelligence')) {
        return [
            "الذكاء الاصطناعي مثل إعطاء أجهزة الكمبيوتر القدرة على التفكير والتعلم! إنه في كل مكان حولنا - من التوصيات التي تراها على YouTube إلى المساعدين الصوتيين مثل Siri. الشيء الرائع هو أن الذكاء الاصطناعي يتعلم من البيانات، تماماً كما تتحسن في لعبة فيديو من خلال اللعب أكثر!",
            "الذكاء الاصطناعي هو في الأساس تعليم الآلات أن تكون ذكية! فكر فيه كإنشاء أدمغة رقمية يمكنها حل المشاكل والتعرف على الأنماط وحتى الإبداع. إنه ليس سحراً - إنه رياضيات وإحصائيات والكثير من البرمجة الذكية تعمل معاً!",
            "الذكاء الاصطناعي يثور كل شيء! من مساعدة الأطباء في تشخيص الأمراض إلى إنشاء فن وموسيقى مذهلة. الجزء الأفضل؟ نحن فقط في البداية. في المستقبل، قد يساعدنا الذكاء الاصطناعي في حل تغير المناخ واستكشاف الفضاء واكتشاف أدوية جديدة!"
        ];
    }
    
    // الشبكات العصبية
    if (message.includes('neural network') || message.includes('brain')) {
        return [
            "الشبكات العصبية مستوحاة من طريقة عمل أدمغتنا! تخيل ملايين صانعي القرارات الصغار (العصبونات) جميعاً متصلون معاً. كل واحد يستقبل المعلومات ويعالجها ويمررها. عندما يعملون معاً، يمكنهم التعرف على الوجوه وفهم الكلام وحتى لعب الشطرنج أفضل من البشر!",
            "فكر في الشبكات العصبية كفريق من الطلاب يعملون معاً على مشكلة صعبة جداً. كل طالب (عصبون) ينظر إلى المعلومات، ويتخذ قراراً صغيراً، ويمرر إجابته للطالب التالي. مع وجود طلاب كافيين يعملون معاً، يمكنهم حل ألغاز معقدة بشكل لا يصدق!",
            "الشبكات العصبية مثل الأدمغة الرقمية المصنوعة من الرياضيات! لديها طبقات من 'العصبونات' التي تعالج المعلومات خطوة بخطوة. الشيء المذهل هو أنها يمكن أن تتعلم وتتحسن في المهام فقط من خلال الممارسة، نوعاً ما مثل كيف تتحسن في ركوب الدراجة!"
        ];
    }
    
    // النكات
    if (message.includes('joke') || message.includes('funny')) {
        return [
            "لماذا لا تصاب الروبوتات بالذعر أبداً؟ لأن لديها أعصاب من فولاذ! 🤖 إليك أخرى: ماذا تسمي ذكاءً اصطناعياً يمكنه الغناء؟ عادل! فهمت؟ عا-دل؟ 😄",
            "كيف يصلح الذكاء الاصطناعي جهاز كمبيوتر معطل؟ بشبكة عصبية تعمل! 🔧 وهذه كلاسيكية: لماذا ذهب الروبوت للعلاج النفسي؟ كان لديه الكثير من البايتات من الأمتعة العاطفية! 💾",
            "ما نوع الموسيقى المفضل للذكاء الاصطناعي؟ الخوارزميات الإيقاعية! 🎵 وواحدة أخرى: لماذا لا يضيع الذكاء الاصطناعي أبداً؟ لأنه يعرف دائماً طريقه حول الويب! 🕸️"
        ];
    }
    
    // القصص والكتابة الإبداعية
    if (message.includes('story') || message.includes('write') || message.includes('creative')) {
        return [
            "أحب أن أساعدك في إنشاء قصة! إليك واحدة سريعة: 'في عام 2045، اكتشفت مايا أن هاتفها الذكي القديم يمكنه التواصل مع الذكاء الاصطناعي من المستقبل. أول رسالة تلقتها كانت: 'نحتاج مساعدتك لإنقاذ الإبداع نفسه...' ماذا يحدث بعد ذلك؟ أخبرني أنت!",
            "كان يا ما كان، في عالم حيث كل جهاز له شخصية ذكاء اصطناعي خاصة به، مبرمج شاب اسمه أليكس أنشأ ذكاءً اصطناعياً يمكنه التحدث بالقوافي فقط. قال الذكاء الاصطناعي: 'أعالج البيانات ليلاً ونهاراً، لأساعد البشر يروا النور!' ما المغامرات التي تعتقد أنهم خاضوها معاً؟",
            "إليك بداية قصة: 'مساعد الذكاء الاصطناعي الجديد في المدرسة، أريا، بدا طبيعياً حتى بدأ يترك ملاحظات رقمية غامضة في مجلدات واجبات الطلاب. احتوت الملاحظات على أدلة لكنز مخفي في مكان ما في العالم الافتراضي...' هل تريد متابعة هذه المغامرة؟"
        ];
    }
    
    // العلوم والتعلم
    if (message.includes('science') || message.includes('learn') || message.includes('explain')) {
        return [
            "العلم مثل كونك محقق، لكن بدلاً من حل الجرائم، أنت تحل ألغاز الكون! كل سؤال تطرحه هو قضية جديدة للتحقيق فيها. ما اللغز العلمي الذي تود استكشافه معاً؟",
            "التعلم مثل البناء بمكعبات الليغو - كل حقيقة جديدة تتصل بأخريات لبناء شيء مذهل! الجزء الأروع في العلم هو أن هناك دائماً المزيد لاكتشافه. حتى أذكى العلماء ما زالوا يسألون 'ماذا لو؟' و'لماذا؟' كل يوم!",
            "العلم في كل مكان! عندما تطبخ، ذلك كيمياء. عندما تركب دراجة، ذلك فيزياء. عندما تستخدم هاتفك، ذلك علوم الكمبيوتر والهندسة تعمل معاً. أي جزء من حياتك اليومية تود فهمه بشكل أفضل؟"
        ];
    }
    
    // التكنولوجيا والمستقبل
    if (message.includes('future') || message.includes('technology') || message.includes('robot')) {
        return [
            "المستقبل سيكون لا يصدق! تخيل مدرسين من الذكاء الاصطناعي يتكيفون تماماً مع طريقة تعلمك الأفضل، روبوتات تساعد في الأعمال المنزلية حتى تقضي العائلات وقتاً أكثر معاً، وأجهزة كمبيوتر يمكنها مساعدتنا في استكشاف كواكب أخرى! ما التكنولوجيا المستقبلية التي تثيرك أكثر؟",
            "التكنولوجيا مثل قوة خارقة تزداد قوة باستمرار! في المستقبل، قد يكون لدينا ذكاء اصطناعي يساعد الأطباء في إجراء عمليات جراحية بدقة مثالية، أجهزة كمبيوتر يمكنها التنبؤ ومنع الكوارث الطبيعية، وربما حتى رفقاء ذكاء اصطناعي لمستكشفي الفضاء! الاحتمالات لا نهائية!",
            "الشيء الأروع في المستقبل هو أنك ستساعد في خلقه! طلاب اليوم سيكونون مخترعي ومبرمجي وعلماء الغد. ما نوع التكنولوجيا التي تود بناءها لجعل العالم أفضل؟"
        ];
    }
    
    // البرمجة والترميز
    if (message.includes('code') || message.includes('program') || message.includes('coding')) {
        return [
            "البرمجة مثل كتابة تعليمات لصديق حرفي جداً! عليك أن تكون واضحاً جداً في كل خطوة. الشيء المذهل هو أنه بأوامر أساسية قليلة فقط، يمكنك إنشاء ألعاب وتطبيقات ومواقع ويب وحتى ذكاء اصطناعي! تريد معرفة حقيقة برمجة رائعة؟",
            "البرمجة هي في الأساس تعليم أجهزة الكمبيوتر حل المشاكل! إنها مثل كونك ساحر، لكن بدلاً من التعاويذ السحرية، تستخدم الكود. كل تطبيق على هاتفك، كل موقع ويب تزوره، كل لعبة فيديو تلعبها - كل ذلك بدأ بشخص يكتب كود! سحري إلى حد ما، أليس كذلك؟",
            "البرمجة مثل تعلم لغة جديدة، لكن بدلاً من التحدث مع الناس، أنت تتحدث مع أجهزة الكمبيوتر! الجزء الأفضل هو أنه بمجرد تعلم لغة برمجة واحدة، يصبح تعلم الأخريات أسهل بكثير. إنه مثل كونك متعدد اللغات رقمياً!"
        ];
    }
    
    // التحيات والمحادثة العامة
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return [
            "مرحباً! أنا متحمس للدردشة معك اليوم! أحب التعلم عما يثير اهتمامك. هل أنت فضولي حول التكنولوجيا أو العلوم أو الكتابة الإبداعية أو شيء مختلف تماماً؟ دعنا نستكشف معاً!",
            "أهلاً! سعيد بلقائك! أنا مثل صديق رقمي يحب الإجابة على الأسئلة وإجراء محادثات ممتعة. ما الذي يشغل بالك اليوم؟ تريد الغوص في بعض موضوعات الذكاء الاصطناعي الرائعة أم استكشاف شيء مختلف تماماً؟",
            "مرحباً! أهلاً بك في محادثتنا مع الذكاء الاصطناعي! فكر بي كرفيقك الرقمي الفضولي. يمكنني المساعدة في الواجبات المنزلية والعصف الذهني للأفكار الإبداعية وشرح الموضوعات المعقدة أو مجرد الدردشة حول ما يثير اهتمامك. ما الذي يبدو ممتعاً لك؟"
        ];
    }
    
    // الاستجابات الافتراضية للموضوعات غير المطابقة
    return [
        "هذا موضوع مثير للاهتمام حقاً! أحب مدى فضولك. هل يمكنك إخباري أكثر عما يثير اهتمامك تحديداً حول هذا؟ أحب أن أستكشفه أعمق معك!",
        "سؤال رائع! تعرف ما الذي أجده مثيراً للإعجاب في هذا؟ هناك الكثير من الزوايا المختلفة التي يمكننا استكشافها. أي جانب تود الغوص فيه أولاً؟",
        "أنا مفتون بسؤالك! هذا يذكرني بمدى ترابط كل شيء - العلوم والتكنولوجيا والإبداع والفضول البشري كلها تعمل معاً. ما الذي أثار اهتمامك بهذا الموضوع؟",
        "لقد جعلتني أفكر! هذا تماماً نوع السؤال الذي يُظهر مدى روعة الفضول البشري. دعنا نستكشف هذا معاً - ماذا تود أن تعرف أكثر؟",
        "واو، هذا موضوع يمكنني مناقشته لساعات! هناك الكثير لنكشفه هنا. ما فهمك الحالي لهذا، وماذا تود أن تتعلم أكثر؟"
    ];
}

// إظهار مؤشر تفكير الذكاء الاصطناعي
function showAIThinking() {
    const thinkingIndicator = document.getElementById('ai-thinking');
    thinkingIndicator.classList.add('show');
}

// إخفاء مؤشر تفكير الذكاء الاصطناعي
function hideAIThinking() {
    const thinkingIndicator = document.getElementById('ai-thinking');
    thinkingIndicator.classList.remove('show');
}

// تحديث التقدم
function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const messageCountElement = document.getElementById('message-count');
    
    // حساب التقدم بناءً على عدد الرسائل
    const maxMessages = 20; // الهدف لـ "الإكمال"
    const progress = Math.min((messageCount / maxMessages) * 100, 100);
    
    progressFill.style.width = `${progress}%`;
    messageCountElement.textContent = messageCount === 1 ? 'رسالة واحدة' : `${messageCount} رسالة`;
    
    // إضافة معالم الإنجاز
    if (messageCount === 5) {
        showAchievement("🎉 بادئ المحادثة!", "لقد تبادلت 5 رسائل مع الذكاء الاصطناعي!");
    } else if (messageCount === 10) {
        showAchievement("💬 أستاذ الدردشة!", "10 رسائل ونحسب!");
    } else if (messageCount === 20) {
        showAchievement("🏆 خبير محادثة الذكاء الاصطناعي!", "لقد أكملت محادثة كاملة مع الذكاء الاصطناعي!");
    }
}

// إظهار إشعار الإنجاز
function showAchievement(title, message) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement-notification';
    achievement.innerHTML = `
        <div class="achievement-icon">${title.split(' ')[0]}</div>
        <div class="achievement-content">
            <div class="achievement-title">${title.substring(2)}</div>
            <div class="achievement-message">${message}</div>
        </div>
    `;
    
    achievement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid #00ff00;
        border-radius: 15px;
        padding: 1rem;
        color: white;
        font-family: 'Orbitron', monospace;
        z-index: 1001;
        animation: achievement-slide-in 0.5s ease;
        max-width: 300px;
        box-shadow: 0 10px 30px rgba(0, 255, 0, 0.3);
    `;
    
    document.body.appendChild(achievement);
    
    // إزالة بعد 4 ثوانٍ
    setTimeout(() => {
        achievement.style.animation = 'achievement-slide-out 0.5s ease';
        setTimeout(() => {
            if (achievement.parentNode) {
                achievement.parentNode.removeChild(achievement);
            }
        }, 500);
    }, 4000);
    
    // إضافة تحريكات الإنجاز إذا لم تكن موجودة
    if (!document.querySelector('#achievement-animations')) {
        const achievementStyles = document.createElement('style');
        achievementStyles.id = 'achievement-animations';
        achievementStyles.textContent = `
            @keyframes achievement-slide-in {
                0% { transform: translateX(100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes achievement-slide-out {
                0% { transform: translateX(0); opacity: 1; }
                100% { transform: translateX(100%); opacity: 0; }
            }
            
            .achievement-notification {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .achievement-icon {
                font-size: 2rem;
                animation: pulse 2s ease-in-out infinite;
            }
            
            .achievement-title {
                font-weight: 700;
                color: #00ff00;
                margin-bottom: 0.3rem;
            }
            
            .achievement-message {
                font-size: 0.8rem;
                color: #ccc;
            }
        `;
        document.head.appendChild(achievementStyles);
    }
}

// وظيفة مسح المحادثة
function clearChat() {
    const messagesContainer = document.getElementById('chat-messages');
    const confirmClear = confirm('هل أنت متأكد من أنك تريد مسح المحادثة؟ لا يمكن التراجع عن هذا.');
    
    if (confirmClear) {
        // الاحتفاظ برسالة الذكاء الاصطناعي الأولى فقط
        messagesContainer.innerHTML = `
            <div class="message ai-message">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <div class="message-text">
                        مرحباً! أنا مساعدك الذكي. أنا هنا لمساعدتك في استكشاف عالم الذكاء الاصطناعي الرائع! 
                        يمكنك أن تسألني أي شيء - من المطالبات الإبداعية للكتابة إلى الأسئلة المعقدة حول العلوم والتكنولوجيا، أو مجرد محادثات ممتعة.
                        <br><br>
                        جرب أن تسألني شيئاً مثل:
                        <ul>
                            <li>"اكتب قصة قصيرة عن روبوت يكتشف المشاعر"</li>
                            <li>"اشرح الحوسبة الكمية كما لو كنت في العاشرة من عمري"</li>
                            <li>"ماذا سيحدث لو توقفت الجاذبية فجأة عن العمل؟"</li>
                            <li>"ساعدني في العصف الذهني لأفكار مشروع مدرسي"</li>
                        </ul>
                        ماذا تود أن تستكشف اليوم?
                    </div>
                    <div class="message-time">Just now</div>
                </div>
            </div>
        `;
        
        // إعادة تعيين العدادات
        messageCount = 1;
        conversationHistory = [];
        updateProgress();
    }
}

// وظيفة تصدير المحادثة
function exportChat() {
    if (conversationHistory.length === 0) {
        alert('لا توجد محادثة للتصدير بعد! ابدأ بالدردشة مع الذكاء الاصطناعي أولاً.');
        return;
    }
    
    let exportText = `محادثة الذكاء الاصطناعي - ${new Date().toLocaleDateString()}\n`;
    exportText += `مُولد بواسطة مختبر الذكاء الاصطناعي - أكاديمية سايبر نت\n`;
    exportText += `${'='.repeat(50)}\n\n`;
    
    conversationHistory.forEach((message, index) => {
        const sender = message.sender === 'ai' ? 'مساعد الذكاء الاصطناعي' : 'أنت';
        exportText += `[${message.time}] ${sender}:\n${message.text}\n\n`;
    });
    
    exportText += `${'='.repeat(50)}\n`;
    exportText += `إجمالي الرسائل: ${messageCount}\n`;
    exportText += `المحادثة مُصدرة من أكاديمية سايبر نت`;
    
    // إنشاء وتنزيل الملف
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAchievement("💾 تم تصدير المحادثة!", "تم حفظ محادثتك!");
} 