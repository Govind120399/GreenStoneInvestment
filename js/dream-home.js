document.addEventListener('DOMContentLoaded', () => {
  const homeCostInput = document.getElementById('homeCost');
  const homeCostSlider = document.getElementById('homeCostSlider');
  const yearsToSaveInput = document.getElementById('yearsToSave');
  const yearsToSaveSlider = document.getElementById('yearsToSaveSlider');
  const currentInvestmentInput = document.getElementById('currentInvestment');
  const currentInvestmentSlider = document.getElementById('currentInvestmentSlider');

  const requiredCorpusEl = document.getElementById('requiredCorpus');
  const futureValueEl = document.getElementById('futureValue');
  const sipAmountEl = document.getElementById('sipAmount');
  const lumpsumAmountEl = document.getElementById('lumpsumAmount');
  const displayYearsEl = document.getElementById('displayYears');
  const displayCurrentInvestmentEl = document.getElementById('displayCurrentInvestment');
  const returnRateSelect = document.getElementById('returnRateSelect');
  const inflationRateSelect = document.getElementById('inflationRateSelect');
  const returnRateDisplay = document.getElementById('returnRateDisplay');

  let chartInstance = null;

  // Sync Sliders and Inputs
  function syncInputs(input, slider) {
    input.addEventListener('input', () => {
      slider.value = input.value;
      calculate();
    });
    slider.addEventListener('input', () => {
      input.value = slider.value;
      calculate();
    });
  }

  syncInputs(homeCostInput, homeCostSlider);
  syncInputs(yearsToSaveInput, yearsToSaveSlider);
  syncInputs(currentInvestmentInput, currentInvestmentSlider);

  returnRateSelect.addEventListener('change', calculate);
  inflationRateSelect.addEventListener('change', calculate);
  
  function formatCurrency(value, lakhs = false) {
    if (lakhs) return value.toFixed(2);
    return Math.round(value).toLocaleString('en-IN');
  }

  function calculate() {
    const homeCost = parseFloat(homeCostInput.value);
    const years = parseFloat(yearsToSaveInput.value);
    const currentInvestment = parseFloat(currentInvestmentInput.value);
    const annualReturn = parseFloat(returnRateSelect.value);
    const inflation = parseFloat(inflationRateSelect.value);

    // Future cost adjusted for inflation
    const futureCost = homeCost * Math.pow(1 + inflation / 100, years);
    requiredCorpusEl.textContent = formatCurrency(futureCost / 100000, true) + " Lakhs";

    // Future value of current investment
    const futureCurrentValue = currentInvestment * Math.pow(1 + annualReturn / 100, years);
    futureValueEl.textContent = "₹" + formatCurrency(futureCurrentValue / 100000, true) + " Lakhs";
    displayYearsEl.textContent = `${years} year${years > 1 ? 's' : ''}`;
    displayCurrentInvestmentEl.textContent = parseFloat(formatCurrency(currentInvestment / 100000, true)).toFixed(0) + " Lakhs";

    // Required Monthly SIP
    const monthlyReturn = annualReturn / 100 / 12;
    const months = years * 12;
    const requiredMonthlySIP = ((futureCost - futureCurrentValue) * monthlyReturn) /
                                ((Math.pow(1 + monthlyReturn, months) - 1) * (1 + monthlyReturn));
    sipAmountEl.textContent = formatCurrency(requiredMonthlySIP);

    // Required Lumpsum
    const requiredLumpsum = (futureCost - futureCurrentValue) / Math.pow(1 + annualReturn / 100, years);
    lumpsumAmountEl.textContent = formatCurrency(requiredLumpsum);

    returnRateDisplay.textContent = annualReturn + "%";

    // Update Chart
    updateChart({
      futureCost,
      futureCurrentValue,
      requiredMonthlySIP: requiredMonthlySIP * 12, // Annualized
      requiredLumpsum
    });
  }

  function updateChart(data) {
    const ctx = document.getElementById('dreamHomeChart').getContext('2d');

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Future Cost', 'Current Investment Growth', 'Annual SIP', 'Lumpsum'],
        datasets: [{
          label: 'Amount (₹)',
          data: [
            data.futureCost,
            data.futureCurrentValue,
            data.requiredMonthlySIP,
            data.requiredLumpsum
          ],
          backgroundColor: [
            'rgba(70, 130, 180, 0.6)',   // Steel Blue
            'rgba(50, 205, 50, 0.6)',   // Lime Green
            'rgba(255, 99, 132, 0.6)',  // Red
            'rgba(255, 206, 86, 0.6)'   // Yellow
          ],
          borderColor: [
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ' ₹' + parseInt(context.raw).toLocaleString('en-IN');
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '₹' + formatValueShort(value);
              }
            }
          }
        }
      }
    });
  }

  function formatValueShort(value) {
    if (value >= 10000000) return (value / 1000000).toFixed(1) + 'M';
    else if (value >= 100000) return (value / 100000).toFixed(1) + 'L';
    else if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    else return value;
  }

  calculate(); // Initial calculation
});