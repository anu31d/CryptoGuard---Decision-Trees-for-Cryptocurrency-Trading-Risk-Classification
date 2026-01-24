// Page Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        }
    });
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Initialize charts if analytics page
    if (pageId === 'analytics') {
        initCharts();
    }
}

// Initialize navigation when DOM is ready
function initNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(link.dataset.page);
        });
    });
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}

// Risk Calculation
function calculateRisk() {
    const returnVal = parseFloat(document.getElementById('return-input').value) / 100;
    const volatility = parseFloat(document.getElementById('volatility-input').value);
    const volumeChange = parseFloat(document.getElementById('volume-input').value) / 100;
    
    const resultCard = document.getElementById('result-card');
    const resultIcon = document.getElementById('result-icon');
    const resultText = document.getElementById('result-text');
    const resultDescription = document.getElementById('result-description');
    const inputSummary = document.getElementById('input-summary');
    
    // Validate inputs
    if (isNaN(returnVal) || isNaN(volatility) || isNaN(volumeChange)) {
        resultCard.className = 'result-card';
        resultIcon.textContent = '❌';
        resultText.textContent = 'Invalid Input';
        resultDescription.textContent = 'Please enter valid numeric values for all fields';
        inputSummary.style.display = 'none';
        return;
    }
    
    // Decision Tree Logic (simplified version matching the Python model)
    let riskLevel;
    let riskClass;
    
    if (volatility < 0.02) {
        riskLevel = 'Low Risk';
        riskClass = 'low';
    } else if (volatility < 0.05) {
        riskLevel = 'Medium Risk';
        riskClass = 'medium';
    } else {
        riskLevel = 'High Risk';
        riskClass = 'high';
    }
    
    // Update result card
    resultCard.className = `result-card ${riskClass}`;
    
    const icons = {
        low: '✅',
        medium: '⚠️',
        high: '🚨'
    };
    
    const descriptions = {
        low: 'Stable market conditions. Suitable for conservative trading strategies.',
        medium: 'Moderate volatility detected. Proceed with standard risk management.',
        high: 'High volatility alert! Use caution and consider reducing position size.'
    };
    
    resultIcon.textContent = icons[riskClass];
    resultText.textContent = riskLevel;
    resultDescription.textContent = descriptions[riskClass];
    
    // Update summary
    inputSummary.style.display = 'block';
    document.getElementById('summary-return').textContent = (returnVal * 100).toFixed(2) + '%';
    document.getElementById('summary-volatility').textContent = volatility.toFixed(4);
    document.getElementById('summary-volume').textContent = (volumeChange * 100).toFixed(2) + '%';
    
    // Add animation
    resultCard.style.animation = 'none';
    resultCard.offsetHeight; // Trigger reflow
    resultCard.style.animation = 'fadeIn 0.5s ease';
}

// Charts initialization
let priceChart = null;
let returnsChart = null;
let volatilityChart = null;

// Cryptocurrency data storage
let coinData = [];

// Coin symbols mapping
const coinSymbols = {
    'Bitcoin': 'BTC', 'Ethereum': 'ETH', 'BinanceCoin': 'BNB', 'Cardano': 'ADA',
    'Solana': 'SOL', 'XRP': 'XRP', 'Dogecoin': 'DOGE', 'Polkadot': 'DOT',
    'Litecoin': 'LTC', 'ChainLink': 'LINK', 'Uniswap': 'UNI', 'Stellar': 'XLM',
    'Monero': 'XMR', 'Cosmos': 'ATOM', 'Tether': 'USDT', 'USDCoin': 'USDC',
    'Aave': 'AAVE', 'EOS': 'EOS', 'Tron': 'TRX', 'NEM': 'XEM', 'Iota': 'MIOTA',
    'WrappedBitcoin': 'WBTC', 'CryptocomCoin': 'CRO'
};

// Load coin data from CSV
async function loadCoinData() {
    const coinSelect = document.getElementById('coin-select');
    const coinName = coinSelect.value;
    
    try {
        const response = await fetch(`data/coin_${coinName}.csv`);
        const csvText = await response.text();
        coinData = parseCSV(csvText);
        updateAnalytics(coinName);
    } catch (error) {
        console.error('Error loading data:', error);
        // Use sample data if CSV not available
        generateSampleData(coinName);
    }
}

// Parse CSV data
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
            row[header.trim()] = values[index];
        });
        data.push(row);
    }
    return data;
}

// Generate sample data if CSV not found
function generateSampleData(coinName) {
    coinData = [];
    const basePrice = Math.random() * 50000 + 100;
    const startDate = new Date('2020-01-01');
    
    for (let i = 0; i < 1000; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const variation = (Math.random() - 0.5) * 0.1;
        const price = basePrice * (1 + variation * i / 100);
        
        coinData.push({
            Date: date.toISOString(),
            Open: price * (1 + (Math.random() - 0.5) * 0.02),
            High: price * (1 + Math.random() * 0.03),
            Low: price * (1 - Math.random() * 0.03),
            Close: price,
            Volume: Math.random() * 1000000000,
            Marketcap: price * 19000000
        });
    }
    updateAnalytics(coinName);
}

// Update all analytics displays
function updateAnalytics(coinName) {
    if (coinData.length === 0) return;
    
    // Update info
    document.getElementById('info-coin').textContent = coinName;
    document.getElementById('info-symbol').textContent = coinSymbols[coinName] || coinName;
    document.getElementById('info-records').textContent = coinData.length.toLocaleString();
    
    // Extract numeric data
    const closes = coinData.map(d => parseFloat(d.Close)).filter(v => !isNaN(v));
    const opens = coinData.map(d => parseFloat(d.Open)).filter(v => !isNaN(v));
    const highs = coinData.map(d => parseFloat(d.High)).filter(v => !isNaN(v));
    const lows = coinData.map(d => parseFloat(d.Low)).filter(v => !isNaN(v));
    const volumes = coinData.map(d => parseFloat(d.Volume)).filter(v => !isNaN(v));
    const dates = coinData.map(d => d.Date ? d.Date.split(' ')[0] : '');
    
    // Key metrics
    document.getElementById('current-price').textContent = '$' + formatNumber(closes[closes.length - 1]);
    document.getElementById('all-time-high').textContent = '$' + formatNumber(Math.max(...highs));
    document.getElementById('all-time-low').textContent = '$' + formatNumber(Math.min(...lows));
    document.getElementById('avg-volume').textContent = formatVolume(average(volumes));
    
    // Date range
    if (dates.length > 0) {
        document.getElementById('info-daterange').textContent = `${dates[0]} to ${dates[dates.length - 1]}`;
    }
    
    // Market cap
    const lastMarketcap = parseFloat(coinData[coinData.length - 1].Marketcap);
    document.getElementById('info-marketcap').textContent = formatMarketCap(lastMarketcap);
    
    // Statistics table
    updateStatsTable(opens, highs, lows, closes, volumes);
    
    // Calculate returns
    const returns = [];
    for (let i = 1; i < closes.length; i++) {
        returns.push((closes[i] - closes[i - 1]) / closes[i - 1] * 100);
    }
    
    // Calculate rolling volatility (7-day)
    const volatility = [];
    for (let i = 7; i < returns.length; i++) {
        const window = returns.slice(i - 7, i);
        volatility.push(standardDeviation(window));
    }
    
    // Update charts
    updateCharts(dates, closes, returns, volatility);
}

// Update statistics table
function updateStatsTable(opens, highs, lows, closes, volumes) {
    // Mean
    document.getElementById('mean-open').textContent = '$' + formatNumber(average(opens));
    document.getElementById('mean-high').textContent = '$' + formatNumber(average(highs));
    document.getElementById('mean-low').textContent = '$' + formatNumber(average(lows));
    document.getElementById('mean-close').textContent = '$' + formatNumber(average(closes));
    document.getElementById('mean-volume').textContent = formatVolume(average(volumes));
    
    // Std Dev
    document.getElementById('std-open').textContent = '$' + formatNumber(standardDeviation(opens));
    document.getElementById('std-high').textContent = '$' + formatNumber(standardDeviation(highs));
    document.getElementById('std-low').textContent = '$' + formatNumber(standardDeviation(lows));
    document.getElementById('std-close').textContent = '$' + formatNumber(standardDeviation(closes));
    document.getElementById('std-volume').textContent = formatVolume(standardDeviation(volumes));
    
    // Min
    document.getElementById('min-open').textContent = '$' + formatNumber(Math.min(...opens));
    document.getElementById('min-high').textContent = '$' + formatNumber(Math.min(...highs));
    document.getElementById('min-low').textContent = '$' + formatNumber(Math.min(...lows));
    document.getElementById('min-close').textContent = '$' + formatNumber(Math.min(...closes));
    document.getElementById('min-volume').textContent = formatVolume(Math.min(...volumes));
    
    // Max
    document.getElementById('max-open').textContent = '$' + formatNumber(Math.max(...opens));
    document.getElementById('max-high').textContent = '$' + formatNumber(Math.max(...highs));
    document.getElementById('max-low').textContent = '$' + formatNumber(Math.max(...lows));
    document.getElementById('max-close').textContent = '$' + formatNumber(Math.max(...closes));
    document.getElementById('max-volume').textContent = formatVolume(Math.max(...volumes));
}

// Update all charts
function updateCharts(dates, closes, returns, volatility) {
    // Destroy existing charts
    if (priceChart) priceChart.destroy();
    if (returnsChart) returnsChart.destroy();
    if (volatilityChart) volatilityChart.destroy();
    
    // Sample data for performance (every nth point)
    const sampleRate = Math.max(1, Math.floor(dates.length / 100));
    const sampledDates = dates.filter((_, i) => i % sampleRate === 0);
    const sampledCloses = closes.filter((_, i) => i % sampleRate === 0);
    
    // Price Chart
    const priceCtx = document.getElementById('priceChart').getContext('2d');
    priceChart = new Chart(priceCtx, {
        type: 'line',
        data: {
            labels: sampledDates,
            datasets: [{
                label: 'Close Price ($)',
                data: sampledCloses,
                borderColor: 'rgba(99, 102, 241, 1)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#e2e8f0' }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(99, 102, 241, 0.1)' }
                },
                x: {
                    ticks: { color: '#94a3b8', maxTicksLimit: 10 },
                    grid: { display: false }
                }
            }
        }
    });
    
    // Returns Histogram
    const returnBins = createHistogram(returns, 20);
    const returnsCtx = document.getElementById('returnsChart').getContext('2d');
    returnsChart = new Chart(returnsCtx, {
        type: 'bar',
        data: {
            labels: returnBins.labels,
            datasets: [{
                label: 'Frequency',
                data: returnBins.counts,
                backgroundColor: returnBins.labels.map(l => 
                    parseFloat(l) >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
                ),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(99, 102, 241, 0.1)' }
                },
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { display: false }
                }
            }
        }
    });
    
    // Volatility Chart
    const volSampleRate = Math.max(1, Math.floor(volatility.length / 100));
    const sampledVol = volatility.filter((_, i) => i % volSampleRate === 0);
    const volDates = dates.slice(7).filter((_, i) => i % volSampleRate === 0);
    
    const volCtx = document.getElementById('volatilityChart').getContext('2d');
    volatilityChart = new Chart(volCtx, {
        type: 'line',
        data: {
            labels: volDates,
            datasets: [{
                label: '7-Day Rolling Volatility (%)',
                data: sampledVol,
                borderColor: 'rgba(245, 158, 11, 1)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#e2e8f0' }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(99, 102, 241, 0.1)' }
                },
                x: {
                    ticks: { color: '#94a3b8', maxTicksLimit: 10 },
                    grid: { display: false }
                }
            }
        }
    });
}

// Helper functions
function average(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function standardDeviation(arr) {
    const avg = average(arr);
    const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(average(squareDiffs));
}

function formatNumber(num) {
    if (num >= 1000) return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    if (num >= 1) return num.toFixed(2);
    return num.toFixed(6);
}

function formatVolume(vol) {
    if (vol >= 1e12) return (vol / 1e12).toFixed(2) + 'T';
    if (vol >= 1e9) return (vol / 1e9).toFixed(2) + 'B';
    if (vol >= 1e6) return (vol / 1e6).toFixed(2) + 'M';
    if (vol >= 1e3) return (vol / 1e3).toFixed(2) + 'K';
    return vol.toFixed(0);
}

function formatMarketCap(cap) {
    if (isNaN(cap)) return 'N/A';
    if (cap >= 1e12) return '$' + (cap / 1e12).toFixed(2) + 'T';
    if (cap >= 1e9) return '$' + (cap / 1e9).toFixed(2) + 'B';
    if (cap >= 1e6) return '$' + (cap / 1e6).toFixed(2) + 'M';
    return '$' + cap.toLocaleString();
}

function createHistogram(data, numBins) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / numBins;
    const counts = new Array(numBins).fill(0);
    const labels = [];
    
    for (let i = 0; i < numBins; i++) {
        const binStart = min + i * binWidth;
        labels.push(binStart.toFixed(1));
    }
    
    data.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), numBins - 1);
        counts[binIndex]++;
    });
    
    return { labels, counts };
}

function initCharts() {
    loadCoinData();
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Scroll to section within glossary page
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if analytics page is active on load
    if (document.getElementById('analytics').classList.contains('active')) {
        initCharts();
    }
});
