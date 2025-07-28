// AI Lab 5: AI vs Search - JavaScript Logic
class SearchComparator {
    constructor() {
        this.comparisonCount = 0;
        this.currentComparison = null;
        this.searchHistory = [];
        this.achievements = [
            { id: 'first_search', title: 'First Comparison', desc: 'Made your first search comparison!', unlocked: false },
            { id: 'query_explorer', title: 'Query Explorer', desc: 'Tried 5 different types of questions!', unlocked: false },
            { id: 'speed_analyst', title: 'Speed Analyst', desc: 'Analyzed search speed differences!', unlocked: false },
            { id: 'insight_master', title: 'Insight Master', desc: 'Discovered key differences between AI and search!', unlocked: false },
            { id: 'search_expert', title: 'Search Expert', desc: 'Completed 10 comparisons!', unlocked: false }
        ];
        
        this.init();
    }

    init() {
        this.initializeDataStreams();
        this.setupEventListeners();
        this.startLabTimer();
        this.updateProgress(0);
    }

    initializeDataStreams() {
        // Create animated data streams in background
        const streams = document.querySelector('.data-streams');
        for (let i = 0; i < 8; i++) {
            const stream = document.createElement('div');
            stream.className = 'data-stream';
            stream.style.left = `${Math.random() * 100}%`;
            stream.style.animationDelay = `${Math.random() * 3}s`;
            stream.style.animationDuration = `${3 + Math.random() * 2}s`;
            streams.appendChild(stream);
        }

        // Create AI particles
        const particles = document.querySelector('.ai-particles');
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'ai-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 4}s`;
            particles.appendChild(particle);
        }
    }

    setupEventListeners() {
        const queryInput = document.getElementById('queryInput');
        const charCount = document.getElementById('charCount');
        const compareBtn = document.getElementById('compareBtn');
        const questionBtns = document.querySelectorAll('.quick-btn');

        // Query input handling
        queryInput.addEventListener('input', (e) => {
            const length = e.target.value.length;
            charCount.textContent = length;
            compareBtn.disabled = length < 5;
            
            // Auto-resize textarea
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        });

        // Quick question buttons
        questionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                queryInput.value = btn.dataset.query;
                queryInput.dispatchEvent(new Event('input'));
                this.animateButton(btn);
            });
        });

        // Compare button
        compareBtn.addEventListener('click', () => this.performComparison());

        // Action buttons
        document.getElementById('newSearchBtn')?.addEventListener('click', () => this.resetForNewSearch());
        document.getElementById('shareResultsBtn')?.addEventListener('click', () => this.shareResults());
        document.getElementById('saveComparisonBtn')?.addEventListener('click', () => this.saveComparison());
    }

    animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    async performComparison() {
        const query = document.getElementById('queryInput').value.trim();
        const includeImages = document.getElementById('includeImages').checked;
        const includeNews = document.getElementById('includeNews').checked;
        const detailedAnalysis = document.getElementById('detailedAnalysis').checked;

        if (query.length < 5) {
            this.showNotification('Please enter a more detailed question', 'error');
            return;
        }

        // Show AI thinking
        this.showAIThinking(true);
        
        // Hide previous results
        document.getElementById('resultsComparison').style.display = 'none';

        try {
            // Simulate search process
            await this.simulateSearch();
            
            // Generate comparison results
            const comparison = await this.generateComparison(query, { includeImages, includeNews, detailedAnalysis });
            
            // Display results
            this.displayComparison(comparison);
            
            // Update progress and achievements
            this.comparisonCount++;
            this.updateProgress(Math.min(this.comparisonCount * 10, 100));
            this.checkAchievements(query);
            
            // Add to history
            this.addToHistory(comparison);
            
            this.showNotification('Comparison completed! 🎉', 'success');
            
        } catch (error) {
            this.showNotification('Comparison failed. Please try again.', 'error');
        } finally {
            this.showAIThinking(false);
        }
    }

    showAIThinking(show) {
        document.getElementById('aiThinking').style.display = show ? 'block' : 'none';
    }

    async simulateSearch() {
        const steps = ['step1', 'step2', 'step3', 'step4'];
        const progressBar = document.getElementById('searchProgress');
        
        for (let i = 0; i < steps.length; i++) {
            // Highlight current step
            document.getElementById(steps[i]).style.color = '#00ff88';
            
            // Update progress
            progressBar.style.width = `${(i + 1) * 25}%`;
            
            // Wait for step completion
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));
            
            // Mark step as complete
            document.getElementById(steps[i]).style.color = '#4a9eff';
        }
    }

    async generateComparison(query, options) {
        const comparison = {
            query: query,
            timestamp: new Date().toISOString(),
            options: options,
            googleResults: this.generateGoogleResults(query, options),
            chatgptResponse: this.generateChatGPTResponse(query, options),
            analysis: this.generateAnalysis(query),
            insights: this.generateInsights(query, options)
        };
        
        this.currentComparison = comparison;
        return comparison;
    }

    generateGoogleResults(query, options) {
        const baseResults = this.getBaseGoogleResults(query);
        const searchTime = (Math.random() * 0.5 + 0.1).toFixed(2);
        const resultCount = Math.floor(Math.random() * 1000000) + 50000;

        let results = [...baseResults];

        // Add news results if enabled
        if (options.includeNews) {
            results.unshift({
                type: 'news',
                title: `Latest: ${query} - Breaking News`,
                url: 'https://news.example.com/latest',
                snippet: 'Recent developments and breaking news related to your search query...',
                source: 'Tech News Today',
                time: '2 hours ago'
            });
        }

        // Add image results if enabled
        if (options.includeImages) {
            results.push({
                type: 'images',
                title: 'Images',
                images: [
                    { url: '#', alt: 'Related image 1' },
                    { url: '#', alt: 'Related image 2' },
                    { url: '#', alt: 'Related image 3' },
                    { url: '#', alt: 'Related image 4' }
                ]
            });
        }

        return {
            results: results,
            searchTime: searchTime,
            resultCount: resultCount.toLocaleString()
        };
    }

    getBaseGoogleResults(query) {
        const queryLower = query.toLowerCase();
        
        if (queryLower.includes('artificial intelligence') || queryLower.includes('ai')) {
            return [
                {
                    type: 'result',
                    title: 'Artificial Intelligence - Wikipedia',
                    url: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
                    snippet: 'Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals...',
                    source: 'Wikipedia'
                },
                {
                    type: 'result',
                    title: 'What is Artificial Intelligence (AI)? | IBM',
                    url: 'https://www.ibm.com/cloud/learn/what-is-artificial-intelligence',
                    snippet: 'Artificial intelligence leverages computers and machines to mimic the problem-solving and decision-making capabilities of the human mind...',
                    source: 'IBM'
                },
                {
                    type: 'result',
                    title: 'AI News - Latest Artificial Intelligence News and Updates',
                    url: 'https://www.artificialintelligence-news.com/',
                    snippet: 'Stay updated with the latest news, trends, and developments in artificial intelligence technology...',
                    source: 'AI News'
                }
            ];
        } else if (queryLower.includes('programming') || queryLower.includes('coding')) {
            return [
                {
                    type: 'result',
                    title: 'Learn to Code - for Free | Codecademy',
                    url: 'https://www.codecademy.com/',
                    snippet: 'Learn the technical skills to get the job you want. Join over 50 million people choosing Codecademy to start a new career...',
                    source: 'Codecademy'
                },
                {
                    type: 'result',
                    title: 'freeCodeCamp.org',
                    url: 'https://www.freecodecamp.org/',
                    snippet: 'Learn to code — for free. Build projects. Earn certifications. Since 2014, more than 400,000 people have gotten developer jobs...',
                    source: 'freeCodeCamp'
                },
                {
                    type: 'result',
                    title: 'Programming - MDN Web Docs',
                    url: 'https://developer.mozilla.org/en-US/docs/Learn',
                    snippet: 'Welcome to the MDN learning area. This set of articles aims to guide complete beginners to web development...',
                    source: 'Mozilla Developer Network'
                }
            ];
        } else if (queryLower.includes('cybersecurity') || queryLower.includes('security')) {
            return [
                {
                    type: 'result',
                    title: 'Cybersecurity Best Practices | CISA',
                    url: 'https://www.cisa.gov/cybersecurity-best-practices',
                    snippet: 'Cybersecurity best practices and guidelines from the Cybersecurity and Infrastructure Security Agency...',
                    source: 'CISA.gov'
                },
                {
                    type: 'result',
                    title: 'What is Cybersecurity? | IBM Security',
                    url: 'https://www.ibm.com/security/cybersecurity',
                    snippet: 'Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks...',
                    source: 'IBM Security'
                },
                {
                    type: 'result',
                    title: 'Cybersecurity Framework | NIST',
                    url: 'https://www.nist.gov/cyberframework',
                    snippet: 'The NIST Cybersecurity Framework provides a policy framework of computer security guidance...',
                    source: 'NIST'
                }
            ];
        } else {
            // Generic results
            return [
                {
                    type: 'result',
                    title: `${query} - Complete Guide`,
                    url: 'https://example.com/guide',
                    snippet: `Comprehensive information and resources about ${query}. Learn everything you need to know...`,
                    source: 'Expert Guide'
                },
                {
                    type: 'result',
                    title: `Understanding ${query}: A Beginner's Overview`,
                    url: 'https://example.com/overview',
                    snippet: `An in-depth look at ${query}, covering the basics and advanced concepts for beginners and experts alike...`,
                    source: 'Learning Hub'
                },
                {
                    type: 'result',
                    title: `${query} - Latest News and Updates`,
                    url: 'https://example.com/news',
                    snippet: `Stay up to date with the latest developments, trends, and news related to ${query}...`,
                    source: 'News Portal'
                }
            ];
        }
    }

    generateChatGPTResponse(query, options) {
        const responseTime = (Math.random() * 2 + 1).toFixed(2);
        const queryLower = query.toLowerCase();
        
        let response = '';
        
        if (queryLower.includes('artificial intelligence') || queryLower.includes('ai')) {
            response = `Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. Here's a comprehensive overview:

**What is AI?**
AI is a broad field of computer science focused on creating systems capable of performing tasks that typically require human intelligence, such as:
- Learning and reasoning
- Problem-solving
- Perception and pattern recognition
- Language understanding
- Decision-making

**Types of AI:**
1. **Narrow AI** (Weak AI) - Designed for specific tasks (like Siri, recommendation systems)
2. **General AI** (Strong AI) - Hypothetical AI with human-level intelligence across all domains
3. **Superintelligence** - AI that surpasses human intelligence (theoretical)

**How AI Works:**
AI systems use various techniques including:
- Machine Learning: Algorithms that improve through experience
- Deep Learning: Neural networks inspired by the human brain
- Natural Language Processing: Understanding and generating human language
- Computer Vision: Interpreting visual information

**Current Applications:**
- Virtual assistants (ChatGPT, Siri, Alexa)
- Recommendation systems (Netflix, Amazon)
- Autonomous vehicles
- Medical diagnosis
- Financial fraud detection
- Image and speech recognition

**Future Implications:**
AI is transforming industries and creating new possibilities while also raising important questions about ethics, job displacement, and the need for responsible development.

Would you like me to elaborate on any specific aspect of AI?`;
        } else if (queryLower.includes('programming') || queryLower.includes('coding')) {
            response = `Learning programming as a beginner is an exciting journey! Here's a structured approach to get you started:

**1. Choose Your First Language:**
- **Python**: Great for beginners, readable syntax, versatile
- **JavaScript**: Essential for web development, immediate visual results
- **Java**: Widely used, good for understanding programming concepts
- **C++**: More challenging but teaches fundamental concepts

**2. Start with the Basics:**
- Variables and data types
- Control structures (if/else, loops)
- Functions and methods
- Basic data structures (arrays, lists)

**3. Learning Resources:**
- **Free Platforms**: freeCodeCamp, Codecademy, Khan Academy
- **Interactive**: Repl.it, CodePen for practice
- **Books**: "Automate the Boring Stuff with Python", "Eloquent JavaScript"
- **Videos**: YouTube tutorials, Coursera, edX

**4. Practice Projects:**
- Start small: calculator, to-do list, simple games
- Build gradually: web pages, small applications
- Join coding challenges: HackerRank, LeetCode

**5. Learning Path (Recommended):**
Week 1-2: Basic syntax and concepts
Week 3-4: Control flow and functions
Week 5-6: Data structures and algorithms
Week 7-8: First project
Month 2+: Specialized areas (web dev, data science, etc.)

**6. Tips for Success:**
- Practice daily, even if just 30 minutes
- Don't just watch tutorials - code along
- Join programming communities (Reddit, Discord, Stack Overflow)
- Don't be afraid to make mistakes - they're part of learning!

**Common Beginner Mistakes to Avoid:**
- Trying to learn too many languages at once
- Focusing only on theory without practice
- Getting discouraged by complex projects too early

Remember: Programming is a skill that improves with practice. Start small, be consistent, and gradually take on more challenging projects!`;
        } else if (queryLower.includes('cybersecurity') || queryLower.includes('security')) {
            response = `Cybersecurity is crucial in today's digital world. Here are the best practices for businesses:

**Essential Security Measures:**

**1. Access Control & Authentication:**
- Implement multi-factor authentication (MFA) for all accounts
- Use strong, unique passwords with a password manager
- Apply principle of least privilege - users get minimum necessary access
- Regular access reviews and deactivation of unused accounts

**2. Network Security:**
- Use firewalls to control network traffic
- Implement network segmentation to isolate critical systems
- Regular network monitoring for suspicious activity
- Secure Wi-Fi with WPA3 encryption

**3. Data Protection:**
- Encrypt sensitive data both at rest and in transit
- Regular automated backups with offline storage
- Data classification and handling procedures
- Secure data disposal methods

**4. Employee Training:**
- Regular cybersecurity awareness training
- Phishing simulation exercises
- Clear security policies and procedures
- Incident reporting protocols

**5. System Management:**
- Keep all software and systems updated
- Use endpoint detection and response (EDR) tools
- Regular security audits and vulnerability assessments
- Implement patch management procedures

**6. Incident Response:**
- Develop and test incident response plans
- Establish communication protocols
- Regular backup testing and recovery procedures
- Legal and regulatory compliance considerations

**Industry-Specific Considerations:**
- Healthcare: HIPAA compliance, patient data protection
- Finance: PCI DSS for payment data, regulatory requirements
- Retail: Customer data protection, POS security
- Manufacturing: Industrial control system security

**Emerging Threats to Watch:**
- Ransomware attacks
- Supply chain vulnerabilities
- Cloud security misconfigurations
- IoT device vulnerabilities
- AI-powered attacks

**Budget-Friendly Security Tips for Small Businesses:**
- Use free security tools (Windows Defender, open-source solutions)
- Cloud-based security services
- Cyber insurance consideration
- Partnership with managed security service providers

Remember: Cybersecurity is not a one-time setup but an ongoing process that requires regular attention and updates!`;
        } else {
            // Generic response based on query
            response = `Thank you for your question about "${query}". Let me provide you with a comprehensive overview:

**Understanding ${query}:**

Based on your query, I can offer insights and information to help you better understand this topic. Here's what I can share:

**Key Points:**
• This is a complex and multifaceted subject that requires careful consideration
• There are various perspectives and approaches to understanding this topic
• Current research and developments continue to evolve our understanding
• Practical applications and real-world implications are important to consider

**Different Approaches:**
1. **Theoretical Perspective**: Understanding the fundamental concepts and principles
2. **Practical Application**: How this applies in real-world scenarios
3. **Historical Context**: How this has developed over time
4. **Future Implications**: What this means going forward

**Why This Matters:**
This topic is relevant because it impacts various aspects of our daily lives, work, and society. Understanding it can help you make better decisions and stay informed about important developments.

**Next Steps:**
- Consider what specific aspect interests you most
- Look for reputable sources for deeper learning
- Think about how this applies to your personal or professional situation
- Stay updated on new developments in this area

Would you like me to focus on any particular aspect of ${query}? I can provide more detailed information on specific areas that interest you most.`;
        }

        return {
            response: response,
            responseTime: responseTime,
            wordCount: response.split(' ').length,
            type: 'conversational'
        };
    }

    generateAnalysis(query) {
        const queryLower = query.toLowerCase();
        
        return {
            speed: {
                google: (Math.random() * 0.5 + 0.1).toFixed(2),
                chatgpt: (Math.random() * 2 + 1).toFixed(2),
                winner: 'google'
            },
            contentType: {
                google: 'Multiple sources, links, structured results',
                chatgpt: 'Single comprehensive response, conversational'
            },
            useCase: {
                google: queryLower.includes('news') || queryLower.includes('current') ? 
                    'Current information, multiple perspectives, fact-checking' : 
                    'Research, multiple sources, current information',
                chatgpt: queryLower.includes('explain') || queryLower.includes('how') ? 
                    'Explanations, tutorials, step-by-step guidance' : 
                    'Summaries, explanations, creative tasks'
            },
            accuracy: {
                google: 'High for current events, varies by source quality',
                chatgpt: 'Good for general knowledge, may lack recent updates'
            }
        };
    }

    generateInsights(query, options) {
        const insights = [
            '🔍 Google excels at finding current, real-time information from multiple sources',
            '🤖 ChatGPT provides comprehensive explanations and can break down complex topics',
            '⚡ Search engines are typically faster for quick fact-finding',
            '💬 AI assistants are better for conversational, step-by-step explanations',
            '📊 Google shows multiple perspectives, while ChatGPT gives unified responses',
            '🔄 Search results change frequently, AI responses are more consistent',
            '🎯 Use Google for "what's happening now", use ChatGPT for "help me understand"'
        ];

        const queryLower = query.toLowerCase();
        
        // Add query-specific insights
        if (queryLower.includes('programming') || queryLower.includes('coding')) {
            insights.push('💻 For programming: Google for specific error solutions, ChatGPT for concept explanations');
        }
        
        if (queryLower.includes('news') || queryLower.includes('current')) {
            insights.push('📰 For current events: Google provides real-time updates, ChatGPT may have outdated information');
        }
        
        if (queryLower.includes('how to') || queryLower.includes('tutorial')) {
            insights.push('📚 For tutorials: ChatGPT excels at step-by-step guidance, Google offers video tutorials');
        }

        // Shuffle and return random selection
        return insights.sort(() => Math.random() - 0.5).slice(0, 5);
    }

    displayComparison(comparison) {
        // Display Google results
        this.displayGoogleResults(comparison.googleResults);
        
        // Display ChatGPT response
        this.displayChatGPTResponse(comparison.chatgptResponse);
        
        // Display analysis
        this.displayAnalysis(comparison.analysis);
        
        // Display insights
        this.displayInsights(comparison.insights);
        
        // Show results section
        document.getElementById('resultsComparison').style.display = 'block';
        document.getElementById('resultsComparison').scrollIntoView({ behavior: 'smooth' });
    }

    displayGoogleResults(googleResults) {
        const container = document.getElementById('googleResults');
        const stats = document.getElementById('googleStats');
        
        // Update stats
        stats.innerHTML = `
            <span class="result-count">${googleResults.resultCount} results</span>
            <span class="search-time">${googleResults.searchTime} seconds</span>
        `;
        
        // Display results
        container.innerHTML = googleResults.results.map(result => {
            if (result.type === 'news') {
                return `
                    <div class="search-result news-result">
                        <div class="result-header">
                            <span class="result-type">📰 News</span>
                            <span class="result-time">${result.time}</span>
                        </div>
                        <h4 class="result-title">${result.title}</h4>
                        <p class="result-snippet">${result.snippet}</p>
                        <div class="result-source">${result.source}</div>
                    </div>
                `;
            } else if (result.type === 'images') {
                return `
                    <div class="search-result images-result">
                        <div class="result-header">
                            <span class="result-type">🖼️ Images</span>
                        </div>
                        <div class="image-grid">
                            ${result.images.map(img => `
                                <div class="image-placeholder" title="${img.alt}">🖼️</div>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="search-result">
                        <h4 class="result-title">${result.title}</h4>
                        <div class="result-url">${result.url}</div>
                        <p class="result-snippet">${result.snippet}</p>
                        <div class="result-source">${result.source}</div>
                    </div>
                `;
            }
        }).join('');
    }

    displayChatGPTResponse(chatgptResponse) {
        const container = document.getElementById('chatgptResponse');
        const stats = document.getElementById('chatgptStats');
        
        // Update stats
        stats.innerHTML = `
            <span class="response-type">${chatgptResponse.type} • ${chatgptResponse.wordCount} words</span>
            <span class="response-time">${chatgptResponse.responseTime} seconds</span>
        `;
        
        // Display response with formatting
        const formattedResponse = this.formatChatGPTResponse(chatgptResponse.response);
        container.innerHTML = `
            <div class="ai-response-content">
                ${formattedResponse}
            </div>
        `;
    }

    formatChatGPTResponse(response) {
        // Convert markdown-like formatting to HTML
        return response
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
            .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
            .replace(/(<li>.*<\/li>)/gs, '<ol>$1</ol>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.*)$/gm, '<p>$1</p>')
            .replace(/<p><\/p>/g, '')
            .replace(/<p>(<[uo]l>)/g, '$1')
            .replace(/(<\/[uo]l>)<\/p>/g, '$1');
    }

    displayAnalysis(analysis) {
        // Speed comparison
        const googleSpeed = parseFloat(analysis.speed.google);
        const chatgptSpeed = parseFloat(analysis.speed.chatgpt);
        const maxSpeed = Math.max(googleSpeed, chatgptSpeed);
        
        document.getElementById('googleSpeedFill').style.width = `${(googleSpeed / maxSpeed) * 100}%`;
        document.getElementById('chatgptSpeedFill').style.width = `${(chatgptSpeed / maxSpeed) * 100}%`;
        document.getElementById('googleSpeedValue').textContent = `${analysis.speed.google}s`;
        document.getElementById('chatgptSpeedValue').textContent = `${analysis.speed.chatgpt}s`;
        
        // Content type
        document.getElementById('googleContentType').textContent = analysis.contentType.google;
        document.getElementById('chatgptContentType').textContent = analysis.contentType.chatgpt;
        
        // Use cases
        document.getElementById('googleUseCase').textContent = analysis.useCase.google;
        document.getElementById('chatgptUseCase').textContent = analysis.useCase.chatgpt;
    }

    displayInsights(insights) {
        const container = document.getElementById('insightsList');
        container.innerHTML = insights.map(insight => `
            <div class="insight-item">${insight}</div>
        `).join('');
    }

    resetForNewSearch() {
        document.getElementById('queryInput').value = '';
        document.getElementById('charCount').textContent = '0';
        document.getElementById('compareBtn').disabled = true;
        document.getElementById('resultsComparison').style.display = 'none';
        
        // Scroll to top
        document.querySelector('.query-section').scrollIntoView({ behavior: 'smooth' });
    }

    shareResults() {
        if (!this.currentComparison) return;
        
        const shareText = `I compared "${this.currentComparison.query}" on Google vs ChatGPT!\n\nGoogle: ${this.currentComparison.googleResults.resultCount} results in ${this.currentComparison.googleResults.searchTime}s\nChatGPT: ${this.currentComparison.chatgptResponse.wordCount} words in ${this.currentComparison.chatgptResponse.responseTime}s\n\nTry it yourself at Engineers Kids AI Lab!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'AI vs Search Comparison',
                text: shareText
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Results copied to clipboard!', 'success');
            });
        }
    }

    saveComparison() {
        if (!this.currentComparison) return;
        
        const data = JSON.stringify(this.currentComparison, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `comparison-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Comparison saved!', 'success');
    }

    addToHistory(comparison) {
        this.searchHistory.unshift({
            ...comparison,
            id: Date.now()
        });

        // Keep only last 10 searches
        if (this.searchHistory.length > 10) {
            this.searchHistory = this.searchHistory.slice(0, 10);
        }

        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyContainer = document.getElementById('searchHistory');
        const historyList = document.getElementById('historyList');

        if (this.searchHistory.length === 0) {
            historyContainer.style.display = 'none';
            return;
        }

        historyList.innerHTML = this.searchHistory.map(item => `
            <div class="history-item" onclick="searchComparator.loadFromHistory(${item.id})">
                <div class="history-query">${item.query}</div>
                <div class="history-details">
                    <span class="history-time">${new Date(item.timestamp).toLocaleTimeString()}</span>
                    <span class="history-results">Google: ${item.googleResults.searchTime}s | ChatGPT: ${item.chatgptResponse.responseTime}s</span>
                </div>
            </div>
        `).join('');

        historyContainer.style.display = 'block';
    }

    loadFromHistory(id) {
        const item = this.searchHistory.find(h => h.id === id);
        if (item) {
            this.currentComparison = item;
            document.getElementById('queryInput').value = item.query;
            this.displayComparison(item);
        }
    }

    checkAchievements(query) {
        // First search
        if (this.comparisonCount === 1) {
            this.unlockAchievement('first_search');
        }

        // Query variety
        const uniqueQueries = new Set(this.searchHistory.map(h => h.query.toLowerCase()));
        if (uniqueQueries.size >= 5) {
            this.unlockAchievement('query_explorer');
        }

        // Speed analysis
        if (this.currentComparison && (
            parseFloat(this.currentComparison.analysis.speed.google) < 0.3 ||
            parseFloat(this.currentComparison.analysis.speed.chatgpt) < 1.5
        )) {
            this.unlockAchievement('speed_analyst');
        }

        // Insights master
        if (this.comparisonCount >= 3) {
            this.unlockAchievement('insight_master');
        }

        // Search expert
        if (this.comparisonCount >= 10) {
            this.unlockAchievement('search_expert');
        }
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.showAchievement(achievement);
        }
    }

    showAchievement(achievement) {
        const notification = document.getElementById('achievementNotification');
        const title = notification.querySelector('.achievement-title');
        const desc = notification.querySelector('.achievement-desc');

        title.textContent = achievement.title;
        desc.textContent = achievement.desc;

        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff6b9d' : '#4a9eff'};
            color: #000; padding: 12px 20px; border-radius: 5px;
            font-family: 'Orbitron', monospace; font-weight: bold;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateProgress(percentage) {
        const progressBar = document.getElementById('labProgress');
        const progressText = document.getElementById('progressText');
        const progressPercent = document.getElementById('progressPercent');

        progressBar.style.width = `${percentage}%`;
        progressPercent.textContent = `${percentage}%`;

        if (percentage === 0) {
            progressText.textContent = 'Ready to compare AI vs Search';
        } else if (percentage < 25) {
            progressText.textContent = 'Getting started with comparisons';
        } else if (percentage < 50) {
            progressText.textContent = 'Exploring search differences';
        } else if (percentage < 75) {
            progressText.textContent = 'Mastering comparison analysis';
        } else {
            progressText.textContent = 'Search comparison expert!';
        }
    }

    startLabTimer() {
        const timer = document.getElementById('labTimer');
        let seconds = 0;
        
        setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }
}

// Dynamic CSS for Lab 5 specific styles
const lab5Styles = `
.comparison-interface {
    margin: 30px 0;
}

.query-section {
    background: rgba(26, 26, 46, 0.6);
    border: 1px solid #00ff88;
    border-radius: 15px;
    padding: 25px;
    backdrop-filter: blur(10px);
}

.query-container {
    position: relative;
    margin-bottom: 20px;
}

.query-container textarea {
    width: 100%;
    min-height: 100px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid #4a9eff;
    border-radius: 8px;
    padding: 15px;
    color: #ffffff;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1em;
    resize: vertical;
    transition: all 0.3s ease;
}

.query-container textarea:focus {
    outline: none;
    border-color: #00ff88;
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
}

.char-count {
    position: absolute;
    bottom: 5px;
    right: 10px;
    font-size: 0.8em;
    color: #4a9eff;
}

.quick-questions h4 {
    color: #4a9eff;
    margin-bottom: 15px;
    font-size: 1.1em;
}

.question-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.question-btn {
    background: rgba(74, 158, 255, 0.2);
    border: 1px solid #4a9eff;
    color: #4a9eff;
    padding: 8px 12px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.9em;
    transition: all 0.3s ease;
}

.question-btn:hover {
    background: rgba(74, 158, 255, 0.4);
    transform: translateY(-2px);
}

.search-options {
    margin: 20px 0;
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.option-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ffffff;
    font-size: 0.9em;
    cursor: pointer;
}

.compare-btn {
    background: linear-gradient(45deg, #00ff88, #4a9eff);
    border: none;
    padding: 15px 25px;
    border-radius: 8px;
    color: #000;
    font-family: 'Orbitron', monospace;
    font-weight: bold;
    font-size: 1.1em;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
}

.compare-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 136, 0.4);
}

.compare-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.search-progress {
    margin-top: 20px;
}

.progress-bar {
    background: rgba(0, 0, 0, 0.5);
    height: 6px;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 15px;
}

.progress-fill {
    background: linear-gradient(90deg, #00ff88, #4a9eff);
    height: 100%;
    width: 0%;
    transition: width 0.3s ease;
}

.progress-steps {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.step {
    color: #666;
    font-size: 0.9em;
    transition: color 0.3s ease;
}

.comparison-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
}

.result-panel {
    background: rgba(26, 26, 46, 0.6);
    border-radius: 15px;
    overflow: hidden;
    backdrop-filter: blur(10px);
}

.google-panel {
    border: 1px solid #4285f4;
}

.chatgpt-panel {
    border: 1px solid #00ff88;
}

.panel-header {
    padding: 15px 20px;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-engine-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
}

.google-panel .engine-name {
    color: #4285f4;
}

.chatgpt-panel .engine-name {
    color: #00ff88;
}

.result-stats {
    font-size: 0.8em;
    color: #888;
    display: flex;
    flex-direction: column;
    text-align: right;
}

.search-results, .ai-response {
    padding: 20px;
    max-height: 500px;
    overflow-y: auto;
}

.search-result {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-result:last-child {
    border-bottom: none;
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.result-type {
    font-size: 0.8em;
    color: #4a9eff;
    font-weight: bold;
}

.result-time {
    font-size: 0.8em;
    color: #888;
}

.result-title {
    color: #4285f4;
    margin-bottom: 5px;
    font-size: 1.1em;
}

.chatgpt-panel .result-title {
    color: #00ff88;
}

.result-url {
    color: #888;
    font-size: 0.8em;
    margin-bottom: 8px;
}

.result-snippet {
    color: #ccc;
    line-height: 1.4;
    margin-bottom: 8px;
}

.result-source {
    color: #4a9eff;
    font-size: 0.8em;
}

.news-result {
    background: rgba(255, 193, 7, 0.1);
    border-left: 3px solid #ffc107;
    padding-left: 15px;
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.image-placeholder {
    aspect-ratio: 1;
    background: rgba(74, 158, 255, 0.2);
    border: 1px solid #4a9eff;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
}

.ai-response-content {
    color: #ffffff;
    line-height: 1.6;
}

.ai-response-content h3 {
    color: #00ff88;
    margin: 20px 0 10px 0;
}

.ai-response-content ul, .ai-response-content ol {
    margin: 10px 0 10px 20px;
}

.ai-response-content li {
    margin: 5px 0;
}

.ai-response-content strong {
    color: #4a9eff;
}

.comparison-analysis {
    background: rgba(26, 26, 46, 0.6);
    border: 1px solid #00ff88;
    border-radius: 15px;
    padding: 25px;
    backdrop-filter: blur(10px);
    margin-bottom: 20px;
}

.analysis-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.analysis-card {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: 20px;
    border: 1px solid rgba(74, 158, 255, 0.3);
}

.analysis-card.full-width {
    grid-column: 1 / -1;
}

.analysis-card h4 {
    color: #00ff88;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.speed-comparison {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.speed-bar {
    display: flex;
    align-items: center;
    gap: 10px;
}

.speed-label {
    width: 70px;
    font-weight: bold;
}

.speed-meter {
    flex: 1;
    height: 8px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    overflow: hidden;
}

.speed-fill {
    height: 100%;
    transition: width 0.5s ease;
}

.google-speed .speed-fill {
    background: #4285f4;
}

.chatgpt-speed .speed-fill {
    background: #00ff88;
}

.speed-value {
    width: 50px;
    text-align: right;
    font-family: 'Source Code Pro', monospace;
    color: #4a9eff;
}

.content-comparison, .use-case-comparison {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.content-item, .use-case-item {
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.content-item:last-child, .use-case-item:last-child {
    border-bottom: none;
}

.insights-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.insight-item {
    background: rgba(0, 255, 136, 0.1);
    border-left: 3px solid #00ff88;
    padding: 12px 15px;
    border-radius: 5px;
    font-size: 0.9em;
}

.action-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin: 20px 0;
}

.action-btn {
    background: rgba(74, 158, 255, 0.2);
    border: 1px solid #4a9eff;
    color: #4a9eff;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.action-btn:hover {
    background: rgba(74, 158, 255, 0.4);
    transform: translateY(-2px);
}

.search-history h4 {
    color: #00ff88;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.history-item {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #4a9eff;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.history-item:hover {
    background: rgba(74, 158, 255, 0.1);
    transform: translateY(-2px);
}

.history-query {
    color: #ffffff;
    font-weight: bold;
    margin-bottom: 5px;
}

.history-details {
    display: flex;
    justify-content: space-between;
    font-size: 0.8em;
    color: #888;
}

.history-time {
    color: #00ff88;
}

.history-results {
    color: #4a9eff;
}

@media (max-width: 1024px) {
    .comparison-grid {
        grid-template-columns: 1fr;
    }
    
    .question-buttons {
        flex-direction: column;
    }
    
    .search-options {
        flex-direction: column;
        gap: 10px;
    }
    
    .action-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .analysis-grid {
        grid-template-columns: 1fr;
    }
}
`;

// Add the styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = lab5Styles;
document.head.appendChild(styleSheet);

// Initialize the search comparator
const searchComparator = new SearchComparator(); 