// DOM Elements
const monthlyInvestmentInput = document.getElementById('monthlyInvestment');
const expectedReturnInput = document.getElementById('expectedReturn');
const timePeriodInput = document.getElementById('timePeriod');

const monthlyInvestmentSlider = document.getElementById('monthlyInvestmentSlider');
const expectedReturnSlider = document.getElementById('expectedReturnSlider');
const timePeriodSlider = document.getElementById('timePeriodSlider');

const investedAmountEl = document.getElementById('investedAmount');
const estimatedReturnsEl = document.getElementById('estimatedReturns');
const totalValueEl = document.getElementById('totalValue');

const pieChartCircles = document.querySelectorAll('.pie-chart circle');

// Sync Input Fields and Sliders
function syncInputs(input, slider) {
    input.addEventListener('input', () => {
        slider.value = input.value;
        calculateSIP();
    });

    slider.addEventListener('input', () => {
        input.value = slider.value;
        calculateSIP();
    });
}

syncInputs(monthlyInvestmentInput, monthlyInvestmentSlider);
syncInputs(expectedReturnInput, expectedReturnSlider);
syncInputs(timePeriodInput, timePeriodSlider);

// SIP Calculator Logic
function calculateSIP() {
    const monthlyInvestment = parseFloat(monthlyInvestmentInput.value);
    const expectedReturn = parseFloat(expectedReturnInput.value);
    const timePeriod = parseFloat(timePeriodInput.value);

    if (!monthlyInvestment || !expectedReturn || !timePeriod) {
        alert("Please fill in all fields.");
        return;
    }

    const totalMonths = timePeriod * 12;
    const monthlyRate = expectedReturn / 12 / 100;

    let futureValue = 0;
    for (let i = 0; i < totalMonths; i++) {
        futureValue += monthlyInvestment * Math.pow(1 + monthlyRate, totalMonths - i);
    }

    const investedAmount = monthlyInvestment * totalMonths;
    const estimatedReturns = futureValue - investedAmount;

    // Update Results
    investedAmountEl.textContent = `₹${formatNumber(investedAmount)}`;
    estimatedReturnsEl.textContent = `₹${formatNumber(estimatedReturns)}`;
    totalValueEl.textContent = `₹${formatNumber(futureValue)}`;

    // Update Pie Chart
    updatePieChart(investedAmount, estimatedReturns);
}

// Format Numbers with Commas
function formatNumber(num) {
    return num.toLocaleString('en-IN');
}

// Update Pie Chart
// Update Pie Chart
function updatePieChart(investedAmount, estimatedReturns) {
    const total = investedAmount + estimatedReturns;

    // Calculate percentages
    const investedPercentage = (investedAmount / total) * 100;
    const returnsPercentage = (estimatedReturns / total) * 100;

    // Total circumference of the circle (2πr, where r = 90)
    const totalCircumference = 2 * Math.PI * 90;

    // Calculate stroke-dasharray values
    const investedDashArray = (investedPercentage / 100) * totalCircumference;
    const returnsDashArray = (returnsPercentage / 100) * totalCircumference;

    // Update the SVG circles - we need to skip the first circle (background)
    // Invested amount (green)
    pieChartCircles[1].setAttribute('stroke-dasharray', `${investedDashArray} ${totalCircumference - investedDashArray}`);
    // Estimated returns (dark green)
    pieChartCircles[2].setAttribute('stroke-dasharray', `${returnsDashArray} ${totalCircumference - returnsDashArray}`);
    pieChartCircles[2].setAttribute('stroke-dashoffset', `-${investedDashArray}`);
}

// Initial Calculation
calculateSIP();