// FAQ Dropdown Functionality
document.addEventListener("DOMContentLoaded", function () {
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach((question) => {
        question.addEventListener("click", () => {
            // Toggle 'active' class on the clicked question
            question.classList.toggle("active");

            // Find the corresponding answer
            const answer = question.nextElementSibling;

            // Close all other answers before opening the clicked one
            document.querySelectorAll(".faq-answer").forEach((item) => {
                if (item !== answer) {
                    item.classList.remove("open");
                }
            });

            // Toggle 'open' class on the clicked answer
            answer.classList.toggle("open");
        });
    });
});