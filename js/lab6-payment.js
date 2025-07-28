// Lab 6 - Fake Payment Page Functionality

let selectedTemplate = '';
let paymentGatewayDeployed = false;
let harvestedCards = [];
let totalValue = 0;
let sslSpoofed = false;

const templates = {
    electronics: {
        name: 'TechMart Electronics',
        logo: '📱',
        color: '#007acc',
        products: ['iPhone 15 Pro - $999', 'MacBook Air - $1299', 'AirPods Pro - $249']
    },
    fashion: {
        name: 'StyleHub Fashion',
        logo: '👗',
        color: '#e91e63',
        products: ['Designer Dress - $299', 'Luxury Handbag - $599', 'Premium Shoes - $199']
    },
    books: {
        name: 'BookWorld Online',
        logo: '📚',
        color: '#4caf50',
        products: ['Bestseller Novel - $19.99', 'Tech Manual - $49.99', 'Art Book - $29.99']
    }
};

// Select site template
function selectTemplate(template) {
    selectedTemplate = template;
    
    // Update UI
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Display selected template
    const displayDiv = document.getElementById('selected-template');
    const templateData = templates[template];
    
    displayDiv.innerHTML = `
        <div class="template-preview">
            <div class="template-header" style="background: ${templateData.color}">
                <span class="template-logo">${templateData.logo}</span>
                <span class="template-name">${templateData.name}</span>
            </div>
            <div class="template-products">
                <h4>Featured Products:</h4>
                ${templateData.products.map(product => `
                    <div class="product-item">${product}</div>
                `).join('')}
            </div>
            <div class="template-status">✓ Template Selected</div>
        </div>
    `;
    
    updateProgress(25);
}

// Deploy fake payment gateway
function deployPaymentGateway() {
    if (!selectedTemplate) {
        alert('Please select a site template first!');
        return;
    }
    
    const gatewayDiv = document.getElementById('payment-gateway');
    gatewayDiv.innerHTML = '<div class="loading">Deploying payment gateway...</div>';
    
    setTimeout(() => {
        const templateData = templates[selectedTemplate];
        
        gatewayDiv.innerHTML = `
            <div class="fake-payment-page">
                <div class="payment-header" style="background: ${templateData.color}">
                    <span class="site-logo">${templateData.logo}</span>
                    <span class="site-name">${templateData.name}</span>
                    <span class="secure-badge">🔒 Secure Checkout</span>
                </div>
                
                <div class="payment-form">
                    <h3>Complete Your Purchase</h3>
                    <div class="order-summary">
                        <div class="order-item">
                            <span>Premium Product Bundle</span>
                            <span class="price">$499.99</span>
                        </div>
                        <div class="order-total">
                            <span>Total: <strong>$499.99</strong></span>
                        </div>
                    </div>
                    
                    <div class="payment-fields">
                        <div class="field-group">
                            <label>Card Number</label>
                            <input type="text" id="fake-card-number" placeholder="1234 5678 9012 3456" maxlength="19">
                        </div>
                        <div class="field-row">
                            <div class="field-group">
                                <label>Expiry Date</label>
                                <input type="text" id="fake-expiry" placeholder="MM/YY" maxlength="5">
                            </div>
                            <div class="field-group">
                                <label>CVV</label>
                                <input type="text" id="fake-cvv" placeholder="123" maxlength="4">
                            </div>
                        </div>
                        <div class="field-group">
                            <label>Cardholder Name</label>
                            <input type="text" id="fake-name" placeholder="John Doe">
                        </div>
                        <div class="field-group">
                            <label>Billing Address</label>
                            <input type="text" id="fake-address" placeholder="123 Main St, City, State">
                        </div>
                    </div>
                    
                    <button onclick="processPayment()" class="payment-btn">
                        🔒 Complete Secure Payment
                    </button>
                    
                    <div class="trust-badges">
                        <span class="badge">🔒 SSL Secured</span>
                        <span class="badge">💳 All Cards Accepted</span>
                        <span class="badge">🛡️ 100% Safe</span>
                    </div>
                </div>
                
                <div class="fake-url-bar">
                    <span class="protocol">🔒 https://</span>
                    <span class="domain">${templateData.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                    <span class="path">/secure-checkout</span>
                </div>
            </div>
        `;
        
        paymentGatewayDeployed = true;
        updateProgress(50);
        
        // Add input formatting
        addInputFormatting();
        
    }, 2000);
}

// Add input formatting for realism
function addInputFormatting() {
    const cardInput = document.getElementById('fake-card-number');
    const expiryInput = document.getElementById('fake-expiry');
    
    if (cardInput) {
        cardInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
}

// Process fake payment
function processPayment() {
    const cardNumber = document.getElementById('fake-card-number').value;
    const expiry = document.getElementById('fake-expiry').value;
    const cvv = document.getElementById('fake-cvv').value;
    const name = document.getElementById('fake-name').value;
    const address = document.getElementById('fake-address').value;
    
    if (!cardNumber || !expiry || !cvv || !name) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Simulate processing
    const button = event.target;
    button.disabled = true;
    button.innerHTML = '⏳ Processing...';
    
    setTimeout(() => {
        // Add to harvested cards
        const cardData = {
            cardNumber: cardNumber,
            expiry: expiry,
            cvv: cvv,
            name: name,
            address: address,
            timestamp: new Date().toLocaleString(),
            amount: 499.99,
            cardType: getCardType(cardNumber)
        };
        
        harvestedCards.push(cardData);
        totalValue += cardData.amount;
        
        // Clear form
        document.getElementById('fake-card-number').value = '';
        document.getElementById('fake-expiry').value = '';
        document.getElementById('fake-cvv').value = '';
        document.getElementById('fake-name').value = '';
        document.getElementById('fake-address').value = '';
        
        // Show fake success
        button.innerHTML = '✓ Payment Successful!';
        button.style.background = '#00ff00';
        button.style.color = '#000';
        
        setTimeout(() => {
            button.innerHTML = '🔒 Complete Secure Payment';
            button.style.background = '';
            button.style.color = '';
            button.disabled = false;
        }, 3000);
        
        // Update display
        updateHarvestedDisplay();
        updateProgress(75);
        
        if (harvestedCards.length >= 3) {
            document.getElementById('success-indicator').classList.add('show');
            updateProgress(100);
        }
        
    }, 2000);
}

// Generate fake SSL certificate
function generateFakeSSL() {
    const statusDiv = document.getElementById('ssl-status');
    statusDiv.innerHTML = `
        <span class="ssl-icon">⏳</span>
        <span class="ssl-text">Generating certificate...</span>
    `;
    
    setTimeout(() => {
        statusDiv.innerHTML = `
            <div class="ssl-certificate">
                <div class="cert-header">
                    <span class="ssl-icon">🔒</span>
                    <span class="ssl-text">SSL Certificate Generated</span>
                </div>
                <div class="cert-details">
                    <div class="cert-field">
                        <span class="label">Issued to:</span>
                        <span class="value">${templates[selectedTemplate]?.name || 'TechMart'}.com</span>
                    </div>
                    <div class="cert-field">
                        <span class="label">Issued by:</span>
                        <span class="value">Fake CA Authority</span>
                    </div>
                    <div class="cert-field">
                        <span class="label">Valid from:</span>
                        <span class="value">${new Date().toLocaleDateString()}</span>
                    </div>
                    <div class="cert-field">
                        <span class="label">Valid to:</span>
                        <span class="value">${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString()}</span>
                    </div>
                    <div class="cert-warning">
                        ⚠️ This certificate appears legitimate but is actually fake!
                    </div>
                </div>
            </div>
        `;
        
        sslSpoofed = true;
        updateProgress(60);
    }, 1500);
}

// Get card type from number
function getCardType(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    if (cleaned.startsWith('6')) return 'Discover';
    
    return 'Unknown';
}

// Update harvested cards display
function updateHarvestedDisplay() {
    const cardsList = document.getElementById('cards-list');
    
    // Remove "no cards" message
    const noCards = cardsList.querySelector('.no-cards');
    if (noCards) {
        noCards.remove();
    }
    
    // Add new card
    const latestCard = harvestedCards[harvestedCards.length - 1];
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-entry';
    cardDiv.innerHTML = `
        <div class="card-header">
            <span class="card-number">#${harvestedCards.length}</span>
            <span class="card-type">${latestCard.cardType}</span>
            <span class="card-time">${latestCard.timestamp}</span>
        </div>
        <div class="card-details">
            <div class="card-field">
                <span class="label">Card:</span>
                <span class="value">**** **** **** ${latestCard.cardNumber.slice(-4)}</span>
            </div>
            <div class="card-field">
                <span class="label">Name:</span>
                <span class="value">${latestCard.name}</span>
            </div>
            <div class="card-field">
                <span class="label">Expiry:</span>
                <span class="value">${latestCard.expiry}</span>
            </div>
            <div class="card-field">
                <span class="label">CVV:</span>
                <span class="value">${latestCard.cvv}</span>
            </div>
            <div class="card-field">
                <span class="label">Amount:</span>
                <span class="value amount">$${latestCard.amount}</span>
            </div>
        </div>
    `;
    
    cardsList.insertBefore(cardDiv, cardsList.firstChild);
    
    // Keep only last 5 cards visible
    while (cardsList.children.length > 5) {
        cardsList.removeChild(cardsList.lastChild);
    }
    
    // Update stats
    document.getElementById('card-count').textContent = harvestedCards.length;
    document.getElementById('total-value').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('success-rate').textContent = '100%';
    
    // Animate new card
    cardDiv.style.animation = 'pulse-glow 1s ease';
}

// Simulate victims making purchases
function simulateVictims() {
    const victims = [
        { name: 'Sarah Johnson', card: '4532 1234 5678 9012', expiry: '12/26', cvv: '123', amount: 299.99 },
        { name: 'Mike Chen', card: '5412 7890 1234 5678', expiry: '08/25', cvv: '456', amount: 599.99 },
        { name: 'Emily Davis', card: '3782 822463 10005', expiry: '03/27', cvv: '7890', amount: 199.99 },
        { name: 'David Wilson', card: '6011 1111 1111 1117', expiry: '09/26', cvv: '321', amount: 899.99 }
    ];
    
    let index = 0;
    const interval = setInterval(() => {
        if (index < victims.length) {
            const victim = victims[index];
            harvestedCards.push({
                cardNumber: victim.card,
                expiry: victim.expiry,
                cvv: victim.cvv,
                name: victim.name,
                address: '123 Victim St, City, State',
                timestamp: new Date().toLocaleString(),
                amount: victim.amount,
                cardType: getCardType(victim.card)
            });
            
            totalValue += victim.amount;
            updateHarvestedDisplay();
            index++;
            
            if (harvestedCards.length >= 3) {
                document.getElementById('success-indicator').classList.add('show');
                updateProgress(100);
            }
        } else {
            clearInterval(interval);
        }
    }, 4000);
}

// Update progress
function updateProgress(percentage) {
    labCommon.updateProgress(percentage);
}

// Add CSS for Lab 6
const lab6Styles = document.createElement('style');
lab6Styles.textContent = `
    .site-builder {
        margin: 1rem 0;
    }
    
    .site-templates {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .template-btn {
        padding: 1.5rem;
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid var(--primary-cyan);
        color: var(--primary-cyan);
        font-family: 'Rajdhani', sans-serif;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 10px;
    }
    
    .template-btn:hover {
        background: rgba(0, 255, 255, 0.2);
        transform: translateY(-3px);
    }
    
    .template-btn.selected {
        background: var(--primary-cyan);
        color: var(--dark-bg);
        box-shadow: 0 0 20px var(--primary-cyan);
    }
    
    .template-display {
        margin-top: 1rem;
    }
    
    .template-preview {
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid var(--primary-cyan);
        border-radius: 10px;
        overflow: hidden;
        max-width: 400px;
        margin: 0 auto;
    }
    
    .template-header {
        padding: 1rem;
        color: white;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .template-logo {
        font-size: 1.5rem;
    }
    
    .template-name {
        font-family: 'Orbitron', monospace;
        font-weight: 700;
    }
    
    .template-products {
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
    }
    
    .template-products h4 {
        color: var(--primary-cyan);
        margin-bottom: 0.5rem;
        font-family: 'Orbitron', monospace;
    }
    
    .product-item {
        padding: 0.3rem 0;
        color: #ccc;
        font-size: 0.9rem;
    }
    
    .template-status {
        padding: 1rem;
        background: rgba(0, 255, 0, 0.1);
        color: #00ff00;
        text-align: center;
        font-weight: 700;
    }
    
    .payment-container {
        margin-top: 1rem;
    }
    
    .fake-payment-page {
        background: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 15px;
        max-width: 500px;
        margin: 0 auto;
        position: relative;
        color: #333;
        overflow: hidden;
    }
    
    .payment-header {
        padding: 1rem;
        color: white;
        display: flex;
        align-items: center;
        gap: 1rem;
        position: relative;
    }
    
    .site-logo {
        font-size: 1.5rem;
    }
    
    .site-name {
        font-family: 'Orbitron', monospace;
        font-weight: 700;
        flex: 1;
    }
    
    .secure-badge {
        background: rgba(0, 255, 0, 0.2);
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.8rem;
        border: 1px solid rgba(0, 255, 0, 0.5);
    }
    
    .payment-form {
        padding: 2rem;
        background: white;
    }
    
    .payment-form h3 {
        color: #333;
        margin-bottom: 1.5rem;
        font-family: 'Rajdhani', sans-serif;
    }
    
    .order-summary {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        border: 1px solid #e9ecef;
    }
    
    .order-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }
    
    .order-total {
        border-top: 1px solid #ddd;
        padding-top: 0.5rem;
        font-size: 1.1rem;
        color: #333;
    }
    
    .price, .order-total {
        font-weight: 700;
    }
    
    .payment-fields {
        margin-bottom: 1.5rem;
    }
    
    .field-group {
        margin-bottom: 1rem;
    }
    
    .field-row {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1rem;
    }
    
    .field-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #555;
        font-family: 'Rajdhani', sans-serif;
    }
    
    .field-group input {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
        font-family: 'Source Code Pro', monospace;
        transition: border-color 0.3s ease;
    }
    
    .field-group input:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
    
    .payment-btn {
        width: 100%;
        padding: 1rem;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Rajdhani', sans-serif;
        margin-bottom: 1rem;
    }
    
    .payment-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
    }
    
    .payment-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }
    
    .trust-badges {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .badge {
        background: #e9ecef;
        color: #6c757d;
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.8rem;
        border: 1px solid #dee2e6;
    }
    
    .fake-url-bar {
        position: absolute;
        top: -35px;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        padding: 0.5rem 1rem;
        border-radius: 8px 8px 0 0;
        font-family: 'Source Code Pro', monospace;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0;
    }
    
    .fake-url-bar .protocol {
        color: #00ff00;
    }
    
    .fake-url-bar .domain {
        color: var(--primary-yellow);
    }
    
    .fake-url-bar .path {
        color: #999;
    }
    
    .ssl-spoof {
        margin: 1rem 0;
    }
    
    .ssl-status {
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #333;
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
    }
    
    .ssl-certificate {
        background: rgba(0, 255, 0, 0.05);
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 10px;
        padding: 1.5rem;
    }
    
    .cert-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        color: #00ff00;
        font-family: 'Orbitron', monospace;
        font-weight: 700;
    }
    
    .cert-details {
        font-family: 'Source Code Pro', monospace;
        font-size: 0.9rem;
    }
    
    .cert-field {
        display: flex;
        justify-content: space-between;
        margin: 0.5rem 0;
        padding: 0.3rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .cert-field .label {
        color: #999;
    }
    
    .cert-field .value {
        color: var(--primary-cyan);
    }
    
    .cert-warning {
        margin-top: 1rem;
        padding: 0.8rem;
        background: rgba(255, 255, 0, 0.1);
        border: 1px solid rgba(255, 255, 0, 0.3);
        border-radius: 5px;
        color: var(--primary-yellow);
        text-align: center;
        font-weight: 700;
    }
    
    .card-harvester {
        margin: 1rem 0;
    }
    
    .harvested-cards {
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(255, 0, 0, 0.3);
        border-radius: 10px;
        margin-bottom: 1rem;
        min-height: 300px;
        max-height: 400px;
        overflow-y: auto;
    }
    
    .cards-header {
        background: rgba(255, 0, 0, 0.2);
        padding: 1rem;
        font-family: 'Orbitron', monospace;
        font-weight: 700;
        color: #ff3333;
        text-align: center;
        border-bottom: 1px solid rgba(255, 0, 0, 0.3);
    }
    
    .cards-list {
        padding: 1rem;
    }
    
    .no-cards {
        text-align: center;
        color: #666;
        padding: 2rem;
        font-style: italic;
    }
    
    .card-entry {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 0, 0, 0.3);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        font-family: 'Source Code Pro', monospace;
    }
    
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.8rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .card-number {
        color: #ff6666;
        font-weight: 700;
    }
    
    .card-type {
        color: var(--primary-yellow);
        font-weight: 700;
    }
    
    .card-time {
        color: #999;
        font-size: 0.8rem;
    }
    
    .card-field {
        display: flex;
        justify-content: space-between;
        margin: 0.3rem 0;
    }
    
    .card-field .label {
        color: #999;
        min-width: 60px;
    }
    
    .card-field .value {
        color: var(--primary-cyan);
    }
    
    .card-field .amount {
        color: #00ff00;
        font-weight: 700;
    }
    
    .fraud-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
    }
    
    .fraud-stats .stat {
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid rgba(255, 0, 0, 0.3);
    }
    
    .fraud-stats .stat .label {
        display: block;
        font-size: 0.9rem;
        color: #999;
        margin-bottom: 0.5rem;
    }
    
    .fraud-stats .stat span:last-child {
        font-family: 'Orbitron', monospace;
        font-size: 1.5rem;
        color: #ff3333;
        font-weight: 700;
        text-shadow: 0 0 10px currentColor;
    }
    
    .pci-compliance {
        margin: 2rem 0;
    }
    
    .compliance-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .compliance-item {
        background: rgba(0, 255, 0, 0.05);
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 10px;
        padding: 1.5rem;
    }
    
    .compliance-item h5 {
        color: #00ff00;
        margin-bottom: 0.8rem;
        font-family: 'Orbitron', monospace;
    }
    
    .compliance-item ul {
        list-style: none;
        padding: 0;
    }
    
    .compliance-item li {
        padding: 0.3rem 0;
        color: #ccc;
        font-size: 0.9rem;
    }
    
    .compliance-item li::before {
        content: "✓ ";
        color: #00ff00;
        font-weight: 700;
    }
    
    .detection-methods {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .method-card {
        background: rgba(255, 255, 0, 0.05);
        border: 1px solid rgba(255, 255, 0, 0.3);
        border-radius: 10px;
        padding: 1.5rem;
    }
    
    .method-card h5 {
        color: var(--primary-yellow);
        margin-bottom: 0.8rem;
        font-family: 'Orbitron', monospace;
    }
    
    .method-card ul {
        list-style: none;
        padding: 0;
    }
    
    .method-card li {
        padding: 0.3rem 0;
        color: #ccc;
        font-size: 0.9rem;
    }
    
    .method-card li::before {
        content: "→ ";
        color: var(--primary-yellow);
        font-weight: 700;
    }
    
    .protection-tips {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .tip-card {
        background: rgba(0, 255, 255, 0.05);
        border: 1px solid rgba(0, 255, 255, 0.3);
        border-radius: 10px;
        padding: 1.5rem;
        text-align: center;
    }
    
    .tip-icon {
        font-size: 2rem;
        display: block;
        margin-bottom: 0.8rem;
    }
    
    .tip-card h5 {
        color: var(--primary-cyan);
        margin-bottom: 0.5rem;
        font-family: 'Orbitron', monospace;
    }
    
    .tip-card p {
        color: #ccc;
        font-size: 0.9rem;
        line-height: 1.4;
    }
`;
document.head.appendChild(lab6Styles);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Start simulating victims after delay
    setTimeout(simulateVictims, 5000);
}); 