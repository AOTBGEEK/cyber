# CyberNet Academy - Cybersecurity Workshop

An interactive, cyberpunk-themed cybersecurity and AI workshop website designed for live presentations and educational purposes.

## 🚀 Getting Started

Simply open `index.html` in a modern web browser (Chrome, Firefox, Safari, or Edge recommended).

```bash
# Navigate to the project directory
cd cybersecurity-workshop

# Open in your default browser (macOS)
open index.html

# Or use a simple HTTP server for better performance
python3 -m http.server 8000
# Then navigate to http://localhost:8000
```

## 🎮 Features

### Landing Page
- Two main portals: Cybersecurity and Artificial Intelligence
- Stunning cyberpunk animations and effects
- Keyboard shortcuts (press 1 or 2 to navigate)

### Cybersecurity Section

#### Interactive Timeline
Learn about key cybersecurity concepts through an animated, scrollable timeline:
- Types of hackers (Black Hat, White Hat, Gray Hat)
- Red Team vs Blue Team operations
- MITRE ATT&CK Framework
- OWASP Top 10 vulnerabilities
- Secure application design
- Bug bounty programs
- System architecture (Cloud vs On-Prem)
- Common misconfigurations
- Career paths in cybersecurity
- Hacker mindset development

#### 7 Cyber Labs
Interactive hands-on labs with both Hacker View and Developer View:

1. **Lab 1: IDOR - Role Change** ✅ (Fully Implemented)
   - Exploit Insecure Direct Object References
   - Interactive demo: Try user IDs 0, 1, or 1001
   - Real-time attack visualization

2. **Lab 2: Brute Force** ✅ (Fully Implemented)
   - Password cracking simulation
   - Multiple attack methods: Dictionary, Common, Pattern-based
   - Live attempt visualization

3. **Lab 3: Password in URL** ✅ (Fully Implemented)
   - URL exposure vulnerability demonstration
   - Browser history, server logs, and referer exploitation
   - Credential harvesting simulation

4. **Lab 4: Fake Login Page** ✅ (Fully Implemented)
   - Phishing attack simulation
   - Clone website, create fake domains
   - Harvest credentials in real-time

5. **Lab 5: Accessing Camera** ✅ (Fully Implemented)
   - Device permission exploitation
   - Camera and microphone access simulation
   - Privacy protection mechanisms

6. **Lab 6: Fake Payment Page** ✅ (Fully Implemented)
   - Financial fraud simulation
   - Credit card skimming techniques
   - PCI DSS compliance guidelines

7. **Lab 7: Account Protection with OTP** ✅ (Fully Implemented)
   - Two-factor authentication implementation
   - OTP bypass techniques and prevention
   - Hardware token security

## 🎨 Design Features

- **Cyberpunk Aesthetic**: Neon colors, glowing effects, futuristic fonts
- **Smooth Animations**: Scroll effects, hover states, transitions
- **Interactive Elements**: Click, type, and explore
- **Responsive Design**: Works on desktop and mobile devices
- **Live Demo Ready**: Perfect for presentations and workshops

## 🔧 Technical Stack

- **Pure HTML/CSS/JavaScript**: No build tools required
- **Modern CSS Features**: Grid, Flexbox, CSS Variables, Animations
- **Canvas Visualizations**: Real-time attack demonstrations
- **Google Fonts**: Orbitron, Rajdhani, Source Code Pro

## 📁 Project Structure

```
cybersecurity-workshop/
├── index.html              # Landing page
├── cyber-home.html         # Cybersecurity home page
├── css/
│   ├── styles.css         # Main styles
│   ├── animations.css     # Animation keyframes
│   ├── cyber-home.css     # Timeline and lab cards
│   └── labs.css           # Lab page styles
├── js/
│   ├── landing.js         # Landing page interactions
│   ├── cyber-home.js      # Timeline and lab navigation
│   ├── lab-common.js      # Common lab functionality
│   └── lab1-idor.js       # Lab 1 specific code
└── labs/
    └── lab1-idor.html     # Lab 1 implementation
```

## 🎯 Usage Tips

### For Presenters
1. Use fullscreen mode (F11) for maximum impact
2. Navigate with keyboard shortcuts (1, 2 for view switching)
3. The timer tracks session duration automatically
4. Demonstrate both hacker and developer perspectives

### For Students
1. Start with the timeline to understand concepts
2. Try the interactive labs in order
3. In Lab 1, experiment with different user IDs (hint: try 0 or 1)
4. Switch between Hacker View and Developer View to see both sides

## 🔒 Quick Lab Guides

### Lab 1: IDOR - Role Change
1. In Hacker View, try these user IDs:
   - `1001` - Normal user
   - `1000` - Moderator
   - `1` - Admin (SUCCESS!)
   - `0` - System (CRITICAL ACCESS!)

### Lab 2: Brute Force
1. Select attack method (Dictionary/Common/Pattern)
2. Click "START ATTACK"
3. Watch as passwords are tried (Success: `Admin@123`)
4. Switch to Developer View for protection methods

### Lab 3: Password in URL
1. Click "Check Browser History" - see exposed passwords
2. Click "Analyze Server Logs" - find credentials in logs
3. Click "Check Referer Headers" - see leaked data
4. Observe the Live URL Monitor

### Lab 4: Fake Login Page
1. Click "Clone Login Page"
2. Select a phishing domain (e.g., `techc0rp-portal.com`)
3. Click "Deploy Fake Site"
4. Click "Send Phishing Email"
5. Watch credentials being harvested

### Lab 5: Accessing Camera
1. Click "Allow Camera Access" on the fake app
2. Click "Request All Permissions"
3. Click "Start Surveillance" to begin monitoring
4. Use "Capture Frame" and "Monitor Audio" buttons
5. Observe data exfiltration in real-time

### Lab 6: Fake Payment Page
1. Select a site template (Electronics/Fashion/Books)
2. Click "Deploy Payment System"
3. Click "Generate Fake Certificate"
4. Fill out the fake payment form and submit
5. Watch credit card data being harvested

### Lab 7: Account Protection with OTP
1. Click "Attempt Login" with provided credentials
2. Observe the 2FA challenge and OTP generator
3. Try different bypass techniques (all will fail with TOTP)
4. Enter the current OTP code to successfully authenticate
5. Learn about secure 2FA implementation

## 🚧 Future Enhancements

- Complete implementation of Labs 2-7
- Add sound effects and background music
- Create AI section content
- Add more interactive visualizations
- Include CTF challenges
- Add progress tracking and certificates

## 🎓 Educational Value

This workshop teaches:
- Real-world vulnerability exploitation
- Secure coding practices
- Security mindset development
- Both offensive and defensive perspectives
- Industry-standard frameworks and tools

## 📝 License

Created for educational purposes. Feel free to use and modify for your cybersecurity workshops and training sessions.

---

**Remember**: This is for educational purposes only. Always practice ethical hacking and obtain proper authorization before testing security on any system.

🔐 Stay secure, think like a hacker, code like a defender! 🛡️ 