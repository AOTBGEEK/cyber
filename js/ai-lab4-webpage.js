// مختبر تطوير الويب بالذكاء الاصطناعي - نظام الاختيار التفاعلي

let currentStep = 1;
let selectedProject = '';
let selectedIndustry = '';
let selectedStyle = '';
let selectedFeatures = [];

// بيانات المجالات حسب نوع المشروع
const industryData = {
    portfolio: [
        { id: 'designer', icon: '🎨', title: 'مصمم جرافيك', desc: 'محفظة للمصممين والفنانين البصريين' },
        { id: 'developer', icon: '💻', title: 'مطور برمجيات', desc: 'محفظة للمبرمجين والمطورين' },
        { id: 'photographer', icon: '📸', title: 'مصور فوتوغرافي', desc: 'معرض للأعمال الفوتوغرافية' },
        { id: 'writer', icon: '✍️', title: 'كاتب ومحرر', desc: 'محفظة للكتاب والمحررين' },
        { id: 'architect', icon: '🏗️', title: 'مهندس معماري', desc: 'عرض المشاريع المعمارية' },
        { id: 'artist', icon: '🎭', title: 'فنان تشكيلي', desc: 'معرض للأعمال الفنية' }
    ],
    business: [
        { id: 'consulting', icon: '💼', title: 'شركة استشارات', desc: 'خدمات استشارية احترافية' },
        { id: 'technology', icon: '⚡', title: 'شركة تقنية', desc: 'حلول تقنية مبتكرة' },
        { id: 'marketing', icon: '📈', title: 'وكالة تسويق', desc: 'خدمات التسويق الرقمي' },
        { id: 'legal', icon: '⚖️', title: 'مكتب محاماة', desc: 'خدمات قانونية متخصصة' },
        { id: 'healthcare', icon: '🏥', title: 'مركز طبي', desc: 'خدمات الرعاية الصحية' },
        { id: 'education', icon: '🎓', title: 'مؤسسة تعليمية', desc: 'برامج ودورات تعليمية' }
    ],
    ecommerce: [
        { id: 'fashion', icon: '👗', title: 'متجر أزياء', desc: 'ملابس وإكسسوارات عصرية' },
        { id: 'electronics', icon: '📱', title: 'متجر إلكترونيات', desc: 'أجهزة وتقنيات حديثة' },
        { id: 'books', icon: '📚', title: 'مكتبة إلكترونية', desc: 'كتب ومواد تعليمية' },
        { id: 'handmade', icon: '🎨', title: 'منتجات يدوية', desc: 'حرف وأعمال فنية' },
        { id: 'sports', icon: '⚽', title: 'معدات رياضية', desc: 'أدوات ولوازم رياضية' },
        { id: 'beauty', icon: '💄', title: 'منتجات تجميل', desc: 'مستحضرات العناية والجمال' }
    ],
    blog: [
        { id: 'tech', icon: '💻', title: 'مدونة تقنية', desc: 'أخبار ومقالات تقنية' },
        { id: 'travel', icon: '✈️', title: 'مدونة سفر', desc: 'تجارب ونصائح السفر' },
        { id: 'food', icon: '🍳', title: 'مدونة طبخ', desc: 'وصفات وأسرار الطبخ' },
        { id: 'lifestyle', icon: '🌟', title: 'مدونة نمط حياة', desc: 'نصائح وإلهام يومي' },
        { id: 'business', icon: '📊', title: 'مدونة أعمال', desc: 'نصائح ريادة الأعمال' },
        { id: 'personal', icon: '📝', title: 'مدونة شخصية', desc: 'أفكار وتجارب شخصية' }
    ],
    restaurant: [
        { id: 'fine-dining', icon: '🍽️', title: 'مطعم راقي', desc: 'تجربة طعام فاخرة' },
        { id: 'casual', icon: '🍔', title: 'مطعم عائلي', desc: 'أجواء مريحة وودية' },
        { id: 'fastfood', icon: '🍕', title: 'وجبات سريعة', desc: 'خدمة سريعة ومريحة' },
        { id: 'cafe', icon: '☕', title: 'مقهى', desc: 'قهوة ومشروبات مميزة' },
        { id: 'delivery', icon: '🚚', title: 'توصيل طعام', desc: 'خدمة توصيل للمنازل' },
        { id: 'ethnic', icon: '🌶️', title: 'مطعم تراثي', desc: 'أطباق تراثية أصيلة' }
    ],
    creative: [
        { id: 'agency', icon: '🎨', title: 'وكالة إبداعية', desc: 'تصاميم وحلول إبداعية' },
        { id: 'studio', icon: '🎬', title: 'استوديو فني', desc: 'إنتاج محتوى إبداعي' },
        { id: 'gallery', icon: '🖼️', title: 'معرض فني', desc: 'عرض الأعمال الفنية' },
        { id: 'music', icon: '🎵', title: 'استوديو موسيقي', desc: 'إنتاج وتسجيل موسيقي' },
        { id: 'event', icon: '🎪', title: 'تنظيم فعاليات', desc: 'تخطيط وتنظيم الأحداث' },
        { id: 'media', icon: '📺', title: 'إنتاج إعلامي', desc: 'محتوى إعلامي متنوع' }
    ]
};

// تهيئة المختبر
document.addEventListener('DOMContentLoaded', () => {
    initializeWebsiteBuilder();
});

// تهيئة منشئ المواقع
function initializeWebsiteBuilder() {
    setupEventListeners();
    updateProgress(0, 'اختر نوع المشروع للبدء');
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // اختيار نوع المشروع
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            selectProject(card.dataset.project);
        });
    });

    // استخدام event delegation للعناصر المُنشأة ديناميكيًا
    document.addEventListener('click', (e) => {
        // اختيار المجال
        if (e.target.classList.contains('industry-card') || e.target.closest('.industry-card')) {
            const card = e.target.closest('.industry-card') || e.target;
            if (card.dataset.industry) {
                selectIndustry(card.dataset.industry);
            }
        }

        // اختيار الأسلوب
        if (e.target.classList.contains('style-card') || e.target.closest('.style-card')) {
            const card = e.target.closest('.style-card') || e.target;
            if (card.dataset.style) {
                selectStyle(card.dataset.style);
            }
        }

        // اختيار الميزات
        if (e.target.classList.contains('feature-card') || e.target.closest('.feature-card')) {
            const card = e.target.closest('.feature-card') || e.target;
            if (card.dataset.feature) {
                toggleFeature(card.dataset.feature, card);
            }
        }

        // تبديل تبويبات الكود
        if (e.target.classList.contains('code-tab')) {
            switchTab(e.target.dataset.tab);
        }
    });

    // زر الإنشاء
    const generateBtn = document.getElementById('generateWebsiteBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateWebsite);
    }

    // أزرار التحكم
    const copyPromptBtn = document.getElementById('copyPrompt');
    if (copyPromptBtn) {
        copyPromptBtn.addEventListener('click', copyWebPrompt);
    }

    const newWebsiteBtn = document.getElementById('newWebsiteBtn');
    if (newWebsiteBtn) {
        newWebsiteBtn.addEventListener('click', resetWebsiteBuilder);
    }
}

// اختيار نوع المشروع
function selectProject(project) {
    selectedProject = project;
    
    // تحديث الواجهة
    document.querySelectorAll('.project-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-project="${project}"]`).classList.add('selected');
    
    // عرض خيارات المجال
    showIndustryOptions(project);
    
    // تحديث التقدم
    updateProgress(25, 'اختر المجال أو الفكرة');
    
    // التمرير للخطوة التالية
    setTimeout(() => {
        document.getElementById('industryStep').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 100);
}

// عرض خيارات المجال
function showIndustryOptions(project) {
    const industriesGrid = document.getElementById('industriesGrid');
    const industryStep = document.getElementById('industryStep');
    
    // تنظيف الشبكة
    industriesGrid.innerHTML = '';
    
    // إضافة خيارات المجال
    if (industryData[project]) {
        industryData[project].forEach(industry => {
            const industryCard = document.createElement('div');
            industryCard.className = 'industry-card';
            industryCard.dataset.industry = industry.id;
            industryCard.innerHTML = `
                <span class="industry-icon">${industry.icon}</span>
                <div class="industry-title">${industry.title}</div>
                <div class="industry-description">${industry.desc}</div>
            `;
            industriesGrid.appendChild(industryCard);
        });
    }
    
    // إظهار الخطوة
    industryStep.style.display = 'block';
}

// اختيار المجال
function selectIndustry(industry) {
    selectedIndustry = industry;
    
    // تحديث الواجهة
    document.querySelectorAll('.industry-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-industry="${industry}"]`).classList.add('selected');
    
    // إظهار خيارات الأسلوب
    showStyleOptions();
    
    // تحديث التقدم
    updateProgress(50, 'اختر أسلوب التصميم');
    
    // التمرير للخطوة التالية
    setTimeout(() => {
        document.getElementById('styleStep').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 100);
}

// عرض خيارات الأسلوب
function showStyleOptions() {
    const styleStep = document.getElementById('styleStep');
    styleStep.style.display = 'block';
}

// اختيار الأسلوب
function selectStyle(style) {
    selectedStyle = style;
    
    // تحديث الواجهة
    document.querySelectorAll('.style-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-style="${style}"]`).classList.add('selected');
    
    // إظهار خيارات الميزات
    showFeatureOptions();
    
    // تحديث التقدم
    updateProgress(75, 'اختر الميزات المطلوبة');
    
    // التمرير للخطوة التالية
    setTimeout(() => {
        document.getElementById('featuresStep').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 100);
}

// عرض خيارات الميزات
function showFeatureOptions() {
    const featuresStep = document.getElementById('featuresStep');
    featuresStep.style.display = 'block';
    
    // تمكين زر الإنشاء (يمكن المتابعة بدون اختيار ميزات)
    updateGenerateButton();
}

// تبديل الميزة
function toggleFeature(feature, cardElement) {
    if (selectedFeatures.includes(feature)) {
        selectedFeatures = selectedFeatures.filter(f => f !== feature);
        cardElement.classList.remove('selected');
    } else {
        selectedFeatures.push(feature);
        cardElement.classList.add('selected');
    }
    
    updateGenerateButton();
}

// تحديث زر الإنشاء
function updateGenerateButton() {
    const generateBtn = document.getElementById('generateWebsiteBtn');
    const hasBasicSelections = selectedProject && selectedIndustry && selectedStyle;
    
    if (generateBtn) {
        generateBtn.disabled = !hasBasicSelections;
        generateBtn.style.opacity = hasBasicSelections ? '1' : '0.5';
        generateBtn.style.cursor = hasBasicSelections ? 'pointer' : 'not-allowed';
        
        if (hasBasicSelections) {
            updateProgress(90, 'جاهز لإنشاء الموقع - اضغط الزر!');
        }
    }
}

// إنشاء الموقع
function generateWebsite() {
    if (!selectedProject || !selectedIndustry || !selectedStyle) {
        alert('يرجى إكمال جميع الخطوات أولاً!');
        return;
    }
    
    // إظهار مؤشر التفكير
    showAIThinking();
    
    setTimeout(() => {
        const prompt = buildWebsitePrompt();
        const explanation = generateExplanation();
        const htmlCode = generateBasicHTML();
        
        displayGeneratedWebsite(prompt, explanation, htmlCode);
        hideAIThinking();
        showWebsiteDisplay();
        updateProgress(100, 'تم إنشاء الموقع بنجاح!');
    }, 2500);
}

// بناء نص الموقع
function buildWebsitePrompt() {
    const projectNames = {
        portfolio: 'portfolio website',
        business: 'business website',
        ecommerce: 'e-commerce website',
        blog: 'blog website',
        restaurant: 'restaurant website',
        creative: 'creative agency website'
    };

    const industryDetails = getIndustryDetails(selectedProject, selectedIndustry);
    const styleDetails = getStyleDetails(selectedStyle);
    
    let prompt = `Create a modern ${projectNames[selectedProject]} for ${industryDetails.name}. `;
    prompt += `Design style: ${styleDetails.name} - ${styleDetails.description}. `;
    
    if (selectedFeatures.length > 0) {
        const featureNames = {
            hero: 'hero section with compelling headline',
            gallery: 'image gallery or portfolio showcase',
            contact: 'contact form with validation',
            testimonials: 'testimonials or reviews section',
            services: 'services or features section',
            animation: 'smooth animations and interactions'
        };
        
        const features = selectedFeatures.map(f => featureNames[f]).join(', ');
        prompt += `Include these features: ${features}. `;
    }
    
    prompt += `Make it responsive, professional, and user-friendly. `;
    prompt += `Use modern web technologies (HTML5, CSS3, JavaScript). `;
    prompt += `Ensure good performance and accessibility. `;
    prompt += industryDetails.specifics;
    
    return prompt;
}

// الحصول على تفاصيل المجال
function getIndustryDetails(project, industry) {
    const industries = industryData[project];
    const industryInfo = industries?.find(i => i.id === industry) || {};
    
    const specifics = {
        portfolio: {
            designer: 'Focus on visual aesthetics and creative showcase.',
            developer: 'Include code examples and technical skills.',
            photographer: 'Emphasize visual gallery and image quality.',
            writer: 'Highlight writing samples and blog integration.',
            architect: 'Showcase architectural projects and blueprints.',
            artist: 'Create artistic gallery with creative layouts.'
        },
        business: {
            consulting: 'Professional appearance with service packages.',
            technology: 'Modern tech design with innovation focus.',
            marketing: 'Results-driven design with case studies.',
            legal: 'Trustworthy design with professional credentials.',
            healthcare: 'Clean, trustworthy design with appointment booking.',
            education: 'Educational layout with course information.'
        },
        ecommerce: {
            fashion: 'Trendy design with product filters and shopping cart.',
            electronics: 'Tech-focused design with product comparisons.',
            books: 'Library-style design with search and categories.',
            handmade: 'Artisanal design highlighting craftsmanship.',
            sports: 'Dynamic design with product categories.',
            beauty: 'Elegant design with product recommendations.'
        },
        restaurant: {
            'fine-dining': 'Elegant design with menu showcase and reservations.',
            casual: 'Warm, inviting design with family-friendly elements.',
            fastfood: 'Quick navigation with online ordering system.',
            cafe: 'Cozy design with menu and location information.',
            delivery: 'Order-focused design with delivery tracking.',
            ethnic: 'Cultural design reflecting traditional cuisine.'
        }
    };
    
    return {
        name: industryInfo.title || 'business',
        specifics: specifics[project]?.[industry] || 'Create a professional and engaging design.'
    };
}

// الحصول على تفاصيل الأسلوب
function getStyleDetails(style) {
    const styles = {
        modern: { name: 'Modern Clean', description: 'minimalist design with clean lines and lots of white space' },
        creative: { name: 'Creative Colorful', description: 'bold design with vibrant colors and creative layouts' },
        professional: { name: 'Professional Classic', description: 'elegant business design with professional appearance' },
        dark: { name: 'Dark Theme', description: 'dark background with light text and neon accents' },
        retro: { name: 'Retro Vintage', description: 'vintage design with retro colors and classic typography' },
        futuristic: { name: 'Futuristic Tech', description: 'cyberpunk design with neon colors and tech elements' }
    };
    
    return styles[style] || styles.modern;
}

// توليد الشرح
function generateExplanation() {
    const projectTitles = {
        portfolio: 'محفظة أعمال',
        business: 'موقع شركة',
        ecommerce: 'متجر إلكتروني',
        blog: 'مدونة',
        restaurant: 'موقع مطعم',
        creative: 'موقع إبداعي'
    };

    const styleTitles = {
        modern: 'عصري ونظيف',
        creative: 'إبداعي وملون',
        professional: 'مهني وكلاسيكي',
        dark: 'داكن وغامض',
        retro: 'ريترو وعتيق',
        futuristic: 'مستقبلي وتقني'
    };
    
    const industryDetails = getIndustryDetails(selectedProject, selectedIndustry);
    
    return {
        analysis: `تم تحليل اختياراتك لإنشاء ${projectTitles[selectedProject]} متخصص في ${industryDetails.name}. اخترت الأسلوب ${styleTitles[selectedStyle]} لإعطاء الموقع شخصية مميزة وجذابة للزوار المستهدفين.`,
        features: selectedFeatures.length > 0 ? selectedFeatures : ['hero', 'contact'],
        design: `التصميم ${styleTitles[selectedStyle]} يناسب طبيعة ${industryDetails.name} ويخلق تجربة مستخدم مثالية`
    };
}

// توليد HTML أساسي
function generateBasicHTML() {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>موقع ${getIndustryDetails(selectedProject, selectedIndustry).name}</title>
    <style>
        /* تصميم أساسي ${getStyleDetails(selectedStyle).name} */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        header { background: #333; color: white; padding: 1rem 0; }
        nav ul { list-style: none; display: flex; gap: 2rem; }
        nav a { color: white; text-decoration: none; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; padding: 4rem 0; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; margin-bottom: 2rem; }
        .btn { background: #00d4ff; color: white; padding: 1rem 2rem; 
               border: none; border-radius: 5px; cursor: pointer; }
        .section { padding: 4rem 0; }
        footer { background: #333; color: white; padding: 2rem 0; text-align: center; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <ul>
                    <li><a href="#home">الرئيسية</a></li>
                    <li><a href="#about">عن</a></li>
                    <li><a href="#services">الخدمات</a></li>
                    <li><a href="#contact">التواصل</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <section class="hero">
        <div class="container">
            <h1>مرحباً بك في موقعنا</h1>
            <p>نقدم أفضل الخدمات في مجال ${getIndustryDetails(selectedProject, selectedIndustry).name}</p>
            <button class="btn">ابدأ الآن</button>
        </div>
    </section>
    
    <section class="section">
        <div class="container">
            <h2>خدماتنا</h2>
            <p>نحن متخصصون في تقديم حلول مبتكرة ومتميزة.</p>
        </div>
    </section>
    
    <footer>
        <div class="container">
            <p>&copy; 2024 جميع الحقوق محفوظة</p>
        </div>
    </footer>
</body>
</html>`;
}

// عرض الموقع المُنشأ
function displayGeneratedWebsite(prompt, explanation, htmlCode) {
    // عرض النص المُنشأ
    const promptElement = document.getElementById('generatedWebPrompt');
    if (promptElement) {
        promptElement.innerHTML = `
            <div class="prompt-content">
                <p>${prompt}</p>
            </div>
        `;
    }
    
    // عرض الشرح
    const explanationElement = document.getElementById('aiExplanation');
    if (explanationElement) {
        explanationElement.innerHTML = `<p>${explanation.analysis}</p>`;
    }
    
    const featuresElement = document.getElementById('addedFeatures');
    if (featuresElement) {
        const featureNames = {
            hero: 'قسم البطل',
            gallery: 'معرض الصور',
            contact: 'نموذج التواصل',
            testimonials: 'آراء العملاء',
            services: 'قسم الخدمات',
            animation: 'التأثيرات الحركية'
        };
        
        featuresElement.innerHTML = explanation.features.map(feature => 
            `<div class="feature-tag">${featureNames[feature] || feature}</div>`
        ).join('');
    }
    
    const designElement = document.getElementById('designChoices');
    if (designElement) {
        designElement.innerHTML = `<p>${explanation.design}</p>`;
    }
    
    // عرض الكود
    const htmlCodeElement = document.getElementById('htmlCode');
    if (htmlCodeElement) {
        htmlCodeElement.textContent = htmlCode;
    }
    
    // معاينة الموقع
    const previewFrame = document.getElementById('previewFrame');
    if (previewFrame) {
        previewFrame.srcdoc = htmlCode;
    }
}

// إظهار عرض الموقع
function showWebsiteDisplay() {
    const websiteDisplay = document.getElementById('websiteDisplay');
    if (websiteDisplay) {
        websiteDisplay.style.display = 'block';
        websiteDisplay.scrollIntoView({ behavior: 'smooth' });
    }
}

// تبديل التبويبات
function switchTab(tab) {
    // تحديث أزرار التبويبات
    document.querySelectorAll('.code-tab').forEach(t => {
        t.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // إظهار المحتوى المناسب
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    const panels = {
        prompt: 'promptPanel',
        html: 'htmlPanel',
        explanation: 'explanationPanel'
    };
    
    const targetPanel = document.getElementById(panels[tab]);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
}

// نسخ النص
function copyWebPrompt() {
    const promptElement = document.getElementById('generatedWebPrompt');
    if (promptElement) {
        const promptText = promptElement.textContent;
        navigator.clipboard.writeText(promptText).then(() => {
            showNotification('✅ تم نسخ النص بنجاح!');
        }).catch(() => {
            showNotification('❌ فشل في نسخ النص');
        });
    }
}

// إعادة تعيين منشئ المواقع
function resetWebsiteBuilder() {
    // إعادة تعيين المتغيرات
    selectedProject = '';
    selectedIndustry = '';
    selectedStyle = '';
    selectedFeatures = [];
    
    // إعادة تعيين الواجهة
    document.querySelectorAll('.project-card, .industry-card, .style-card, .feature-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // إخفاء الخطوات
    document.getElementById('industryStep').style.display = 'none';
    document.getElementById('styleStep').style.display = 'none';
    document.getElementById('featuresStep').style.display = 'none';
    document.getElementById('websiteDisplay').style.display = 'none';
    
    // إعادة تعيين التقدم
    updateProgress(0, 'اختر نوع المشروع للبدء');
    
    // التمرير للأعلى
    document.querySelector('.website-builder').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// تحديث التقدم
function updateProgress(progress, text) {
    const progressFill = document.getElementById('labProgress');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
        progressText.textContent = text;
    }
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
        background: rgba(0, 212, 255, 0.9);
        color: #000;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// إضافة CSS للتحريكات
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .builder-step {
        margin-bottom: 40px;
        padding: 25px;
        background: rgba(0, 212, 255, 0.05);
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 15px;
        animation: fadeInUp 0.6s ease-out;
    }
    
    .step-title {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
        font-size: 1.4em;
        color: #00d4ff;
    }
    
    .step-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #00d4ff, #0080ff);
        border-radius: 50%;
        font-weight: bold;
        color: #000;
    }
    
    .projects-grid, .industries-grid, .styles-grid, .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .project-card, .industry-card, .style-card, .feature-card {
        padding: 20px;
        background: rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(0, 212, 255, 0.3);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }
    
    .project-card:hover, .industry-card:hover, .style-card:hover, .feature-card:hover {
        border-color: #00d4ff;
        background: rgba(0, 212, 255, 0.1);
        transform: translateY(-3px);
    }
    
    .project-card.selected, .industry-card.selected, .style-card.selected, .feature-card.selected {
        border-color: #00ff88;
        background: rgba(0, 255, 136, 0.15);
        box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
    }
    
    .project-icon, .industry-icon, .style-icon, .feature-icon {
        font-size: 2.5em;
        margin-bottom: 10px;
        display: block;
    }
    
    .project-title, .industry-title, .style-title, .feature-title {
        font-size: 1.2em;
        font-weight: bold;
        color: #00d4ff;
        margin-bottom: 8px;
    }
    
    .project-description, .industry-description, .style-description, .feature-description {
        font-size: 0.9em;
        color: #ccc;
        line-height: 1.4;
    }
    
    .generate-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        padding: 20px;
        background: linear-gradient(135deg, #00ff88, #00d4ff);
        border: none;
        border-radius: 12px;
        color: #000;
        font-size: 1.2em;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 30px;
    }
    
    .generate-btn:hover:not(:disabled) {
        background: linear-gradient(135deg, #00d4ff, #00ff88);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4);
    }
    
    .generate-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }
    
    .generated-website {
        margin-top: 40px;
        padding: 30px;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 15px;
        animation: fadeInUp 0.6s ease-out;
    }
    
    .website-preview {
        margin-bottom: 30px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 12px;
        overflow: hidden;
    }
    
    .preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        background: rgba(0, 212, 255, 0.1);
        border-bottom: 1px solid rgba(0, 212, 255, 0.3);
    }
    
    .preview-title {
        font-weight: bold;
        color: #00d4ff;
    }
    
    .preview-controls {
        display: flex;
        gap: 10px;
    }
    
    .control-btn {
        padding: 8px 15px;
        background: rgba(0, 212, 255, 0.2);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 6px;
        color: #00d4ff;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9em;
    }
    
    .control-btn:hover {
        background: rgba(0, 212, 255, 0.3);
        border-color: #00d4ff;
    }
    
    .webpage-frame {
        width: 100%;
        height: 400px;
        border: none;
        background: white;
    }
    
    .code-tabs {
        display: flex;
        gap: 5px;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(0, 212, 255, 0.3);
    }
    
    .code-tab {
        padding: 12px 20px;
        background: rgba(0, 0, 0, 0.3);
        border: none;
        border-radius: 8px 8px 0 0;
        color: #ccc;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .code-tab:hover {
        background: rgba(0, 212, 255, 0.1);
        color: #00d4ff;
    }
    
    .code-tab.active {
        background: rgba(0, 212, 255, 0.2);
        color: #00d4ff;
        border-bottom: 2px solid #00d4ff;
    }
    
    .tab-panel {
        display: none;
    }
    
    .tab-panel.active {
        display: block;
    }
    
    .prompt-display, .code-display, .explanation-display {
        padding: 20px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
    }
    
    .generated-prompt {
        background: rgba(0, 0, 0, 0.5);
        padding: 20px;
        border-radius: 8px;
        font-family: 'Source Code Pro', monospace;
        line-height: 1.6;
        margin: 15px 0;
        direction: ltr;
        text-align: left;
        color: #fff;
    }
    
    .prompt-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 20px;
        flex-wrap: wrap;
    }
    
    .action-btn {
        padding: 10px 20px;
        background: rgba(0, 212, 255, 0.1);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 6px;
        color: #00d4ff;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
    }
    
    .action-btn:hover {
        background: rgba(0, 212, 255, 0.2);
        border-color: #00d4ff;
    }
    
    .external-link {
        background: rgba(0, 255, 136, 0.1);
        border-color: rgba(0, 255, 136, 0.3);
        color: #00ff88;
    }
    
    .external-link:hover {
        background: rgba(0, 255, 136, 0.2);
        border-color: #00ff88;
    }
    
    .code-block {
        background: rgba(0, 0, 0, 0.5);
        padding: 20px;
        border-radius: 8px;
        font-family: 'Source Code Pro', monospace;
        line-height: 1.4;
        overflow-x: auto;
        margin: 15px 0;
        color: #fff;
        direction: ltr;
        text-align: left;
    }
    
    .feature-tag {
        display: inline-block;
        background: rgba(0, 255, 136, 0.2);
        color: #00ff88;
        padding: 5px 10px;
        border-radius: 15px;
        margin: 2px;
        font-size: 0.9em;
    }
    
    .website-actions {
        display: flex;
        justify-content: center;
        margin: 30px 0;
    }
    
    .new-website-btn {
        padding: 15px 30px;
        background: linear-gradient(135deg, #00ff88, #00d4ff);
        border: none;
        border-radius: 10px;
        color: #000;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .new-website-btn:hover {
        background: linear-gradient(135deg, #00d4ff, #00ff88);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 212, 255, 0.3);
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