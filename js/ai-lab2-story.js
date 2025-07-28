// أستوديو القصص - المختبر الثاني
// نظام السيناريوهات التفاعلي

let currentStep = 1;
let selectedGenre = '';
let selectedScenario = '';
let selectedElements = {
    character: '',
    location: '',
    twist: ''
};

// عناصر القصة حسب النوع
const storyElements = {
    adventure: {
        characters: ['المستكشف الجريء', 'الكابتن الشجاع', 'الباحثة الذكية', 'الدليل المحلي', 'عالم الآثار', 'المغامر المخضرم'],
        locations: ['الصحراء الكبرى', 'الجبال المتجمدة', 'الغابة الكثيفة', 'الجزيرة النائية', 'الكهف العميق', 'النهر السري'],
        twists: ['اكتشاف خريطة سرية', 'ظهور عدو قديم', 'عاصفة مفاجئة', 'سقوط في فخ', 'لقاء مخلوق غريب', 'اكتشاف كنز مزيف']
    },
    scifi: {
        characters: ['رائد الفضاء', 'العالم المبدع', 'الذكاء الاصطناعي', 'قائد السفينة', 'الكائن الفضائي', 'المهندس التقني'],
        locations: ['محطة الفضاء', 'كوكب المريخ', 'السفينة الفضائية', 'المختبر السري', 'البوابة الزمنية', 'المدينة المستقبلية'],
        twists: ['خلل في النظام', 'رسالة من المستقبل', 'اكتشاف حياة فضائية', 'انقطاع الاتصال', 'تمرد الروبوتات', 'انحراف في الزمكان']
    },
    fantasy: {
        characters: ['الساحر الحكيم', 'الأميرة الشجاعة', 'الفارس النبيل', 'الجنية السحرية', 'التنين الودود', 'الساحرة الغامضة'],
        locations: ['القلعة المسحورة', 'الغابة الخيالية', 'جبل التنانين', 'بحيرة السحر', 'مملكة الجن', 'وادي الأحلام'],
        twists: ['كسر التعويذة', 'ظهور ساحر شرير', 'اكتشاف قوة خفية', 'خيانة صديق', 'لعنة قديمة', 'نبوءة محيرة']
    },
    mystery: {
        characters: ['المحقق الذكي', 'الشاهد الغامض', 'المشتبه به', 'الضحية المجهولة', 'الخبير الجنائي', 'المحامي المحنك'],
        locations: ['القصر المهجور', 'المكتبة القديمة', 'مسرح الجريمة', 'المتحف السري', 'الفندق الفاخر', 'المقبرة المظلمة'],
        twists: ['اكتشاف أدلة جديدة', 'ظهور شاهد مفاجئ', 'كشف هوية القاتل', 'العثور على رسالة سرية', 'انقلاب في القضية', 'اعتراف غير متوقع']
    },
    historical: {
        characters: ['الفارس الشجاع', 'الملكة الحكيمة', 'التاجر المسافر', 'الراهب العالم', 'القائد العسكري', 'الحرفي الماهر'],
        locations: ['القلعة الحجرية', 'السوق التجاري', 'ساحة المعركة', 'الدير القديم', 'القصر الملكي', 'القرية الريفية'],
        twists: ['إعلان الحرب', 'اكتشاف مؤامرة', 'وصول رسول مهم', 'تغيير في الحكم', 'كارثة طبيعية', 'تحالف غير متوقع']
    },
    comedy: {
        characters: ['الكوميدي المحبوب', 'الجار الفضولي', 'الطباخ الماهر', 'المعلم الصبور', 'الطفل الذكي', 'الجدة المرحة'],
        locations: ['المطبخ الفوضوي', 'المدرسة المرحة', 'حديقة الحيوان', 'الملعب المزدحم', 'السوق الشعبي', 'البيت العائلي'],
        twists: ['موقف محرج', 'سوء فهم مضحك', 'مفاجأة عائلية', 'خطأ كوميدي', 'لقاء غير متوقع', 'حل إبداعي مضحك']
    }
};

// تهيئة المختبر
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing story studio...');
    initializeStoryStudio();
});

// تهيئة أستوديو القصص
function initializeStoryStudio() {
    hideAllSections();
    setupEventListeners();
    updateLabProgress(0);
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // Genre selection
    document.querySelectorAll('.genre-card').forEach(card => {
        card.addEventListener('click', () => {
            selectGenre(card.dataset.genre);
        });
    });

    // Scenario selection - using event delegation
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('scenario-card') || e.target.closest('.scenario-card')) {
            const card = e.target.closest('.scenario-card') || e.target;
            if (card.dataset.scenario) {
                selectScenario(card.dataset.scenario);
            }
        }
    });

    // Element selection - using event delegation  
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('element-card') || e.target.closest('.element-card')) {
            const card = e.target.closest('.element-card') || e.target;
            if (card.dataset.type && card.dataset.value) {
                selectElement(card.dataset.type, card.dataset.value);
            }
        }
    });

    // Generate button - multiple ways to ensure it works
    const generateBtn = document.getElementById('generateStoryBtn');
    if (generateBtn) {
        console.log('Setting up generate button listeners...');
        generateBtn.addEventListener('click', function(e) {
            console.log('Generate button clicked!');
            if (!generateBtn.disabled && !generateBtn.classList.contains('disabled')) {
                console.log('Button is enabled, calling generateStory...');
                generateStory();
            } else {
                console.log('Button is disabled, ignoring click');
                e.preventDefault();
                e.stopPropagation();
            }
        });
        
        // Also ensure onclick attribute works
        generateBtn.onclick = function(e) {
            console.log('Generate button onclick triggered!');
            if (!generateBtn.disabled && !generateBtn.classList.contains('disabled')) {
                console.log('Button is enabled via onclick, calling generateStory...');
                generateStory();
            } else {
                console.log('Button is disabled via onclick, ignoring click');
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };
    } else {
        console.log('Generate button not found during setup!');
    }
}

// اختيار النوع
function selectGenre(genre) {
    selectedGenre = genre;
    
    // Update UI
    document.querySelectorAll('.genre-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-genre="${genre}"]`).classList.add('selected');
    
    // Show scenarios for this genre
    showScenarios(genre);
    
    // Update progress
    updateLabProgress(25);
    updateProgressText('اختر السيناريو المفضل');
}

// إظهار السيناريوهات
function showScenarios(genre) {
    // Hide all scenarios
    document.querySelectorAll('.story-scenarios').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show scenarios for selected genre
    const targetScenarios = document.getElementById(`${genre}-scenarios`);
    if (targetScenarios) {
        targetScenarios.classList.add('active');
        
        // Scroll to scenarios
        setTimeout(() => {
            targetScenarios.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    }
}

// اختيار السيناريو
function selectScenario(scenario) {
    selectedScenario = scenario;
    
    // Update UI
    document.querySelectorAll('.scenario-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-scenario="${scenario}"]`).classList.add('selected');
    
    // Show elements selection
    showElementsSelection();
    
    // Update progress
    updateLabProgress(50);
    updateProgressText('اختر عناصر القصة');
}

// إظهار اختيار العناصر
function showElementsSelection() {
    const elementsSection = document.getElementById('elementsSelection');
    if (elementsSection) {
        elementsSection.style.display = 'block';
        loadElements();
        
        // Scroll to elements
        setTimeout(() => {
            elementsSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    }
}

// تحميل العناصر
function loadElements() {
    if (!selectedGenre || !storyElements[selectedGenre]) {
        console.log('No genre selected or elements not found for genre:', selectedGenre);
        return;
    }
    
    const elements = storyElements[selectedGenre];
    console.log('Loading elements for genre:', selectedGenre, elements);
    
    // Load characters
    const charactersGrid = document.getElementById('charactersGrid');
    if (charactersGrid) {
        charactersGrid.innerHTML = elements.characters.map(char => `
            <div class="element-card" data-type="character" data-value="${char}">
                ${char}
            </div>
        `).join('');
        console.log('Characters loaded:', elements.characters.length);
    } else {
        console.log('Characters grid not found!');
    }
    
    // Load locations
    const locationsGrid = document.getElementById('locationsGrid');
    if (locationsGrid) {
        locationsGrid.innerHTML = elements.locations.map(loc => `
            <div class="element-card" data-type="location" data-value="${loc}">
                ${loc}
            </div>
        `).join('');
        console.log('Locations loaded:', elements.locations.length);
    } else {
        console.log('Locations grid not found!');
    }
    
    // Load twists
    const twistsGrid = document.getElementById('twistsGrid');
    if (twistsGrid) {
        twistsGrid.innerHTML = elements.twists.map(twist => `
            <div class="element-card" data-type="twist" data-value="${twist}">
                ${twist}
            </div>
        `).join('');
        console.log('Twists loaded:', elements.twists.length);
    } else {
        console.log('Twists grid not found!');
    }
}

// اختيار عنصر
function selectElement(type, value) {
    selectedElements[type] = value;
    console.log('Element selected:', type, value);
    console.log('Current selections:', selectedElements);
    
    // Update UI
    document.querySelectorAll(`[data-type="${type}"]`).forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-type="${type}"][data-value="${value}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        console.log('Card selected successfully:', selectedCard);
    } else {
        console.log('Card not found for:', type, value);
    }
    
    // Check if all elements are selected
    checkAllElementsSelected();
}

// فحص اختيار جميع العناصر
function checkAllElementsSelected() {
    const allSelected = selectedElements.character && 
                      selectedElements.location && 
                      selectedElements.twist;
    
    console.log('Checking selections:');
    console.log('- Character:', selectedElements.character ? '✓' : '✗');
    console.log('- Location:', selectedElements.location ? '✓' : '✗');
    console.log('- Twist:', selectedElements.twist ? '✓' : '✗');
    console.log('- All selected:', allSelected);
    
    const generateBtn = document.getElementById('generateStoryBtn');
    console.log('Generate button found:', !!generateBtn);
    
    if (generateBtn) {
        if (allSelected) {
            console.log('Enabling button...');
            generateBtn.disabled = false;
            generateBtn.style.opacity = '1';
            generateBtn.style.cursor = 'pointer';
            generateBtn.style.backgroundColor = '';
            generateBtn.classList.remove('disabled');
            updateLabProgress(75);
            updateProgressText('جاهز لإنشاء القصة - اضغط الزر!');
        } else {
            console.log('Disabling button...');
            generateBtn.disabled = true;
            generateBtn.style.opacity = '0.5';
            generateBtn.style.cursor = 'not-allowed';
            generateBtn.classList.add('disabled');
        }
    } else {
        console.log('Generate button not found!');
    }
}

// إنشاء القصة
function generateStory() {
    console.log('generateStory function called!');
    console.log('Checking requirements...');
    console.log('- selectedGenre:', selectedGenre);
    console.log('- selectedScenario:', selectedScenario);
    console.log('- selectedElements:', selectedElements);
    
    if (!selectedGenre || !selectedScenario || !selectedElements.character || !selectedElements.location || !selectedElements.twist) {
        console.log('Missing requirements, showing alert...');
        alert('يرجى إكمال جميع الخطوات أولاً!');
        return;
    }
    
    console.log('All requirements met, generating story...');
    
    // Show thinking indicator
    showAIThinking();
    
    setTimeout(() => {
        const prompt = buildStoryPrompt();
        const preview = generateStoryPreview();
        
        displayGeneratedStory(prompt, preview);
        hideAIThinking();
        showStoryDisplay();
        updateLabProgress(100);
        updateProgressText('تم إنشاء القصة بنجاح!');
    }, 2000);
}

// بناء النص المُنشأ
function buildStoryPrompt() {
    const genreNames = {
        adventure: 'adventure',
        scifi: 'science fiction',
        fantasy: 'fantasy',
        mystery: 'mystery',
        historical: 'historical fiction',
        comedy: 'comedy'
    };
    
    let prompt = `Create a ${genreNames[selectedGenre]} story. `;
    prompt += `Main character: ${selectedElements.character}. `;
    prompt += `Setting: ${selectedElements.location}. `;
    prompt += `Include this plot element: ${selectedElements.twist}. `;
    prompt += `Write it as an engaging narrative with rich descriptions and dialogue. `;
    prompt += `Make it suitable for the ${genreNames[selectedGenre]} genre with appropriate tone and atmosphere.`;
    
    return prompt;
}

// إنشاء معاينة القصة
function generateStoryPreview() {
    const scenarioDescriptions = {
        'treasure-hunt': 'رحلة مثيرة للبحث عن كنز مفقود',
        'desert-expedition': 'مغامرة صعبة عبر الصحراء',
        'space-mission': 'مهمة فضائية خطيرة',
        'ai-rebellion': 'صراع مع الذكاء الاصطناعي',
        'wizard-quest': 'رحلة ساحر عبر عوالم سحرية',
        'dragon-friendship': 'صداقة غير متوقعة مع تنين',
        'mansion-mystery': 'لغز قتل في قصر قديم',
        'missing-author': 'البحث عن مؤلف مختفي',
        'silk-road': 'رحلة تجارية عبر طريق الحرير',
        'crusades-era': 'قصة من زمن الحروب الصليبية',
        'clumsy-superhero': 'بطل خارق أخرق ومضحك',
        'talking-pets': 'حيوانات أليفة تتكلم'
    };
    
    const description = scenarioDescriptions[selectedScenario] || 'قصة مشوقة';
    
    return `قصة ${getGenreTitle(selectedGenre)} تحكي عن ${description}. ` +
           `البطل هو ${selectedElements.character} في ${selectedElements.location}، ` +
           `وتتضمن القصة ${selectedElements.twist}.`;
}

// عرض القصة المُنشأة
function displayGeneratedStory(prompt, preview) {
    const storyPreviewText = document.getElementById('storyPreviewText');
    const generatedPrompt = document.getElementById('generatedStoryPrompt');
    
    if (storyPreviewText) {
        storyPreviewText.textContent = preview;
    }
    
    if (generatedPrompt) {
        generatedPrompt.innerHTML = `
            <h4>النص المُنشأ لـ ChatGPT:</h4>
            <div class="prompt-text" id="promptText">${prompt}</div>
        `;
    }
}

// إظهار عرض القصة
function showStoryDisplay() {
    const storyDisplay = document.getElementById('storyDisplay');
    if (storyDisplay) {
        storyDisplay.style.display = 'block';
        storyDisplay.scrollIntoView({ behavior: 'smooth' });
    }
}

// نسخ النص
function copyStoryPrompt() {
    const promptText = document.getElementById('promptText');
    if (promptText) {
        navigator.clipboard.writeText(promptText.textContent).then(() => {
            showNotification('✅ تم نسخ النص بنجاح!');
        });
    }
}

// إعادة تعيين القصة
function resetStory() {
    // Reset variables
    selectedGenre = '';
    selectedScenario = '';
    selectedElements = { character: '', location: '', twist: '' };
    
    // Reset UI
    document.querySelectorAll('.genre-card, .scenario-card, .element-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Hide sections
    hideAllSections();
    
    // Reset progress
    updateLabProgress(0);
    updateProgressText('اختر نوع القصة للبدء');
}

// إخفاء جميع الأقسام
function hideAllSections() {
    document.querySelectorAll('.story-scenarios').forEach(section => {
        section.classList.remove('active');
    });
    
    const elementsSection = document.getElementById('elementsSelection');
    if (elementsSection) {
        elementsSection.style.display = 'none';
    }
    
    const storyDisplay = document.getElementById('storyDisplay');
    if (storyDisplay) {
        storyDisplay.style.display = 'none';
    }
    
    const generateBtn = document.getElementById('generateStoryBtn');
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.style.opacity = '0.5';
    }
}

// تحديث تقدم المختبر
function updateLabProgress(progress) {
    const progressFill = document.getElementById('labProgress');
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
}

// تحديث نص التقدم
function updateProgressText(text) {
    const progressText = document.getElementById('progressText');
    if (progressText) {
        progressText.textContent = text;
    }
}

// الحصول على عنوان النوع
function getGenreTitle(genre) {
    const titles = {
        adventure: 'مغامرة',
        scifi: 'خيال علمي', 
        fantasy: 'خيال',
        mystery: 'غموض',
        historical: 'تاريخي',
        comedy: 'كوميدي'
    };
    return titles[genre] || genre;
}

// إظهار/إخفاء مؤشر التفكير
function showAIThinking() {
    const thinking = document.getElementById('aiThinking');
    if (thinking) {
        thinking.style.display = 'block';
    }
}

function hideAIThinking() {
    const thinking = document.getElementById('aiThinking');
    if (thinking) {
        thinking.style.display = 'none';
    }
}

// عرض إشعار
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 255, 195, 0.9);
        color: #000;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 1000;
        animation: notificationSlide 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// إضافة CSS للرسوم المتحركة
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes notificationSlide {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .element-card {
        background: rgba(0, 255, 195, 0.1);
        border: 1px solid rgba(0, 255, 195, 0.3);
        border-radius: 8px;
        padding: 10px 15px;
        margin: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-block;
        font-size: 0.9rem;
        color: #fff;
    }
    
    .element-card:hover {
        background: rgba(0, 255, 195, 0.2);
        border-color: #00ffc3;
        transform: translateY(-2px);
    }
    
    .element-card.selected {
        background: linear-gradient(135deg, rgba(0, 255, 195, 0.3), rgba(138, 43, 226, 0.3));
        border-color: #00ffc3;
        box-shadow: 0 0 15px rgba(0, 255, 195, 0.5);
    }
    
    .elements-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 10px 0;
    }
    
    .scenario-card.selected {
        background: linear-gradient(135deg, rgba(0, 255, 195, 0.3), rgba(138, 43, 226, 0.3));
        border-color: #00ffc3;
        box-shadow: 0 0 20px rgba(0, 255, 195, 0.5);
    }
    
    .generated-story-display {
        display: none;
        margin-top: 30px;
        padding: 25px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(0, 255, 195, 0.3);
        border-radius: 15px;
        animation: fadeInUp 0.5s ease;
    }
    
    .story-preview {
        background: rgba(0, 255, 195, 0.1);
        border: 1px solid rgba(0, 255, 195, 0.3);
        border-radius: 10px;
        padding: 20px;
        margin: 15px 0;
    }
    
    .story-prompt {
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(0, 255, 195, 0.3);
        border-radius: 10px;
        padding: 20px;
        margin: 15px 0;
    }
    
    .prompt-text {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(0, 255, 195, 0.2);
        border-radius: 8px;
        padding: 15px;
        margin: 10px 0;
        font-family: 'Source Code Pro', monospace;
        color: #fff;
        line-height: 1.6;
        direction: ltr;
        text-align: left;
    }
    
    .action-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 20px;
        flex-wrap: wrap;
    }
    
    .copy-btn, .new-story-btn {
        background: linear-gradient(135deg, #00ffc3, #8a2be2);
        border: none;
        border-radius: 10px;
        padding: 12px 25px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
    }
    
    .copy-btn:hover, .new-story-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(0, 255, 195, 0.4);
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(styleSheet);

// إضافة CSS إضافي للزر
const buttonStyles = document.createElement('style');
buttonStyles.textContent = `
    .continue-btn {
        transition: all 0.3s ease !important;
    }
    
    .continue-btn:disabled,
    .continue-btn.disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
        background: #666 !important;
        pointer-events: none !important;
    }
    
    .continue-btn:not(:disabled):not(.disabled) {
        opacity: 1 !important;
        cursor: pointer !important;
        background: linear-gradient(45deg, #00ffc3, #8a2be2) !important;
        pointer-events: all !important;
    }
    
    .continue-btn:not(:disabled):not(.disabled):hover {
        transform: translateY(-3px) !important;
        box-shadow: 0 8px 25px rgba(0, 255, 195, 0.4) !important;
    }
    
    /* Element cards styling */
    .element-card {
        background: rgba(0, 255, 195, 0.1);
        border: 1px solid rgba(0, 255, 195, 0.3);
        border-radius: 8px;
        padding: 10px 15px;
        margin: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-block;
        font-size: 0.9rem;
        color: #fff;
    }
    
    .element-card:hover {
        background: rgba(0, 255, 195, 0.2);
        border-color: #00ffc3;
        transform: translateY(-2px);
    }
    
    .element-card.selected {
        background: linear-gradient(135deg, rgba(0, 255, 195, 0.3), rgba(138, 43, 226, 0.3));
        border-color: #00ffc3;
        box-shadow: 0 0 15px rgba(0, 255, 195, 0.5);
    }
    
    .elements-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 10px 0;
    }
`;
document.head.appendChild(buttonStyles);