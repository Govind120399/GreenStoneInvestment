document.addEventListener('DOMContentLoaded', () => {
    const currentAge = document.getElementById("currentAge");
    const higherEducationAge = document.getElementById("higherEducationAge");
  
    // Populate age options
    for (let i = 0; i <= 17; i++) {
      let opt = document.createElement("option");
      opt.value = i;
      opt.text = i;
      if (i === 0) opt.selected = true;
      currentAge.appendChild(opt);
    }
  
    for (let i = 18; i <= 57; i++) {
      let opt = document.createElement("option");
      opt.value = i;
      opt.text = i;
      if (i === 18) opt.selected = true;
      higherEducationAge.appendChild(opt);
    }
  
    window.calculate = function () {
      const current = parseInt(currentAge.value);
      const future = parseInt(higherEducationAge.value);
      const years = future - current;
      const presentCost = parseFloat(document.getElementById("presentCost").value);
      const returnRate = parseFloat(document.getElementById("returnRate").value);
  
      // Inflation assumed at 6%
      const inflation = 6;
      const futureCost = presentCost * Math.pow(1 + inflation / 100, years);
  
      // Monthly investment needed
      const monthlyReturn = returnRate / 100 / 12;
      const months = years * 12;
      const requiredMonthlySIP = (futureCost * monthlyReturn) / ((Math.pow(1 + monthlyReturn, months) - 1) * (1 + monthlyReturn));
  
      document.getElementById("yearsUntil").textContent = years;
      document.getElementById("futureCost").textContent = "₹" + formatCurrency(futureCost);
      document.getElementById("monthlyInvestmentRequired").textContent = "₹" + formatCurrency(requiredMonthlySIP);
  
      updateChart({
        futureCost,
        requiredMonthlySIP
      });
    };
  
    window.resetForm = function () {
      document.getElementById("currentAge").value = "0";
      document.getElementById("higherEducationAge").value = "18";
      document.getElementById("returnRate").value = "10";
      document.getElementById("presentCost").value = "2500000";
      document.getElementById("yearsUntil").textContent = "18";
      document.getElementById("futureCost").textContent = "₹71,35,847.88";
      document.getElementById("monthlyInvestmentRequired").textContent = "₹11,783.73";
      if (chartInstance) chartInstance.destroy();
    };
  
    function formatCurrency(value) {
      return Math.round(value).toLocaleString('en-IN');
    }
  
    let chartInstance = null;
  
    function updateChart(data) {
      const ctx = document.getElementById('childEducationChart').getContext('2d');
  
      if (chartInstance) {
        chartInstance.destroy();
      }
  
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Future Cost', 'Monthly SIP'],
          datasets: [{
            label: 'Amount (₹)',
            data: [data.futureCost, data.requiredMonthlySIP * 12],
            backgroundColor: [
              'rgba(70, 130, 180, 0.6)',
              'rgba(255, 99, 132, 0.6)'
            ],
            borderColor: [
              'rgba(70, 130, 180, 1)',
              'rgba(255, 99, 132, 1)'
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