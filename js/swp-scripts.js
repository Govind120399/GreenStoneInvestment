document.addEventListener("DOMContentLoaded", () => {
    const initialInvestmentInput = document.getElementById("initialInvestment");
    const monthlyWithdrawalInput = document.getElementById("monthlyWithdrawal");
    const expectedReturnInput = document.getElementById("expectedReturn");
    const timePeriodInput = document.getElementById("timePeriod");

    const initialInvestmentSlider = document.getElementById("initialInvestmentSlider");
    const monthlyWithdrawalSlider = document.getElementById("monthlyWithdrawalSlider");
    const expectedReturnSlider = document.getElementById("expectedReturnSlider");
    const timePeriodSlider = document.getElementById("timePeriodSlider");

    const totalWithdrawnDisplay = document.getElementById("totalWithdrawn");
    const remainingBalanceDisplay = document.getElementById("remainingBalance");
    const remainingInvestmentDisplay = document.getElementById("remainingInvestment");
    const totalInterestDisplay = document.getElementById("totalInterest");

    // Sync sliders with input fields
    function syncInputs(input, slider) {
        input.addEventListener("input", () => {
            slider.value = input.value;
            calculateSWP();
        });
        slider.addEventListener("input", () => {
            input.value = slider.value;
            calculateSWP();
        });
    }

    syncInputs(initialInvestmentInput, initialInvestmentSlider);
    syncInputs(monthlyWithdrawalInput, monthlyWithdrawalSlider);
    syncInputs(expectedReturnInput, expectedReturnSlider);
    syncInputs(timePeriodInput, timePeriodSlider);

    // Calculate SWP results
function calculateSWP() {
    const initialInvestment = parseFloat(initialInvestmentInput.value);
    const monthlyWithdrawal = parseFloat(monthlyWithdrawalInput.value);
    const expectedReturn = parseFloat(expectedReturnInput.value) / 100;
    const timePeriod = parseInt(timePeriodInput.value);

    let balance = initialInvestment;
    let totalWithdrawn = 0;
    let totalInterestEarned = 0;

    for (let i = 0; i < timePeriod * 12; i++) {
        // Step 1: Apply return first (on current balance)
        const monthlyInterest = balance * (expectedReturn / 12);
        totalInterestEarned += monthlyInterest;
        balance += monthlyInterest;

        // Step 2: Deduct withdrawal
        balance -= monthlyWithdrawal;
        totalWithdrawn += monthlyWithdrawal;
    }

    // Format results
    const remainingBalance = balance; // Can be negative
    const remainingInvestment = Math.max(0, balance); // Only show positive part
    const formattedRemainingBalance = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(remainingBalance);
    const formattedTotalWithdrawn = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalWithdrawn);
    const formattedRemainingInvestment = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(remainingInvestment);
    const formattedTotalInterest = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalInterestEarned);

    // Update DOM
    totalWithdrawnDisplay.textContent = formattedTotalWithdrawn;
    remainingBalanceDisplay.innerHTML = `<span style="color:${remainingBalance < 0 ? 'red' : 'inherit'}">${formattedRemainingBalance}</span>`;
    remainingInvestmentDisplay.textContent = formattedRemainingInvestment;
    totalInterestDisplay.textContent = formattedTotalInterest;

    // Update chart
    updateChart(totalWithdrawn, Math.max(0, balance));
}

    // Update chart
    const ctx = document.getElementById("swpChart").getContext("2d");
    const swpChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Total Withdrawn", "Remaining Balance"],
            datasets: [
                {
                    label: "Amount (₹)",
                    data: [0, 0],
                    backgroundColor: ["#1E8E3E", "#A8A8A8"],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });

    function updateChart(totalWithdrawn, remainingBalance) {
        swpChart.data.datasets[0].data = [totalWithdrawn, remainingBalance];
        swpChart.update();
    }

    // Initial calculation
    calculateSWP();
});