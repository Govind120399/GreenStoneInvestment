document.addEventListener("DOMContentLoaded", () => {
    const initialInvestmentInput = document.getElementById("initialInvestment");
    const annualStepUpInput = document.getElementById("annualStepUp");
    const expectedReturnInput = document.getElementById("expectedReturn");
    const timePeriodInput = document.getElementById("timePeriod");

    const initialInvestmentSlider = document.getElementById("initialInvestmentSlider");
    const annualStepUpSlider = document.getElementById("annualStepUpSlider");
    const expectedReturnSlider = document.getElementById("expectedReturnSlider");
    const timePeriodSlider = document.getElementById("timePeriodSlider");

    const totalInvestedDisplay = document.getElementById("totalInvested");
    const totalInterestDisplay = document.getElementById("totalInterest");
    const futureValueDisplay = document.getElementById("futureValue");

    // Sync sliders with input fields
    function syncInputs(input, slider) {
        input.addEventListener("input", () => {
            slider.value = input.value;
            calculateStepUpSIP();
        });
        slider.addEventListener("input", () => {
            input.value = slider.value;
            calculateStepUpSIP();
        });
    }

    syncInputs(initialInvestmentInput, initialInvestmentSlider);
    syncInputs(annualStepUpInput, annualStepUpSlider);
    syncInputs(expectedReturnInput, expectedReturnSlider);
    syncInputs(timePeriodInput, timePeriodSlider);

    // Calculate Step-Up SIP results
    function calculateStepUpSIP() {
        const initialInvestment = parseFloat(initialInvestmentInput.value);
        const annualStepUp = parseFloat(annualStepUpInput.value) / 100;
        const expectedReturn = parseFloat(expectedReturnInput.value) / 100;
        const timePeriod = parseInt(timePeriodInput.value);

        let monthlyInvestment = initialInvestment;
        let totalInvested = 0;
        let futureValue = 0;

        for (let year = 1; year <= timePeriod; year++) {
            const monthlyRate = expectedReturn / 12;
            const monthsInYear = 12;

            for (let month = 1; month <= monthsInYear; month++) {
                futureValue = (futureValue + monthlyInvestment) * (1 + monthlyRate);
                totalInvested += monthlyInvestment;
            }

            // Apply annual step-up
            monthlyInvestment *= (1 + annualStepUp);
        }

        const totalInterestEarned = futureValue - totalInvested;

        // Update results
        totalInvestedDisplay.textContent = `₹${totalInvested.toLocaleString()}`;
        totalInterestDisplay.textContent = `₹${totalInterestEarned.toLocaleString()}`;
        futureValueDisplay.textContent = `₹${futureValue.toLocaleString()}`;

        // Update chart
        updateChart(totalInvested, totalInterestEarned, futureValue);
    }

    // Initialize bar chart
    const ctx = document.getElementById("stepUpChart").getContext("2d");
    const stepUpChart = new Chart(ctx, {
        type: "bar", // Changed from "line" to "bar"
        data: {
            labels: ["Total Invested", "Total Interest Earned", "Future Value"],
            datasets: [
                {
                    label: "Amount (₹)",
                    data: [0, 0, 0],
                    backgroundColor: ["#A8A8A8", "#1E8E3E", "#FFC107"], // Different colors for each bar
                    borderColor: ["#A8A8A8", "#1E8E3E", "#FFC107"],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false, // Hide the legend
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `₹${context.raw.toLocaleString()}`; // Format tooltip values
                        },
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return `₹${value.toLocaleString()}`; // Format y-axis values
                        },
                    },
                },
            },
        },
    });

    // Update chart with new data
    function updateChart(totalInvested, totalInterest, futureValue) {
        stepUpChart.data.datasets[0].data = [totalInvested, totalInterest, futureValue];
        stepUpChart.update();
    }

    // Initial calculation
    calculateStepUpSIP();
});