const quizFormElement = document.querySelector("#quiz-form");
const questionNameElement = document.querySelector("#question-name");
const previousButtonElement = document.querySelector("#previous-button");
const nextButtonElement = document.querySelector("#next-button");
const navBarElement = document.querySelector("#nav-bar");
const alertBox = document.createElement("div");

let slideIndex = 0;
const userAnswers = [];
const questionsData = [
  {
    questionText: "Question 1",
    optionsCount: Math.floor(Math.random() * (8 - 2 + 1) + 2),
    maxAnswers: 3,
  },
  {
    questionText: "Question 2",
    optionsCount: Math.floor(Math.random() * (8 - 2 + 1) + 2),
    maxAnswers: 4,
  },
  {
    questionText: "Question 3",
    optionsCount: Math.floor(Math.random() * (8 - 2 + 1) + 2),
    maxAnswers: 5,
  },
  {
    questionText: "Question 4",
    optionsCount: Math.floor(Math.random() * (8 - 2 + 1) + 2),
    maxAnswers: 6,
  },
];

alertBox.classList.add("alert-box");
document.body.appendChild(alertBox);

function renderQuestionSlide(slideIndex) {
  quizFormElement.innerHTML = "";
  questionNameElement.textContent = questionsData[slideIndex].questionText;

  for (let i = 0; i < questionsData[slideIndex].optionsCount; i++) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `option-${slideIndex}-${i}`;

    if (
      userAnswers[slideIndex] &&
      userAnswers[slideIndex].includes(checkbox.id)
    ) {
      checkbox.checked = true;
    }

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = `Option ${i + 1}`;

    quizFormElement.appendChild(checkbox);
    quizFormElement.appendChild(label);
    quizFormElement.appendChild(document.createElement("br"));

    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        if (!userAnswers[slideIndex]) {
          userAnswers[slideIndex] = [];
        }
        userAnswers[slideIndex].push(checkbox.id);
      } else {
        userAnswers[slideIndex] = userAnswers[slideIndex].filter(
          (id) => id !== checkbox.id
        );
      }

      updateNavBar();
      checkExcessCheckboxes();
      disableButton();
    });
  }

  updateNextButton();
  updateNavBar();
}

nextButtonElement.addEventListener("click", function () {
  loader.style.display = "block";
  setTimeout(function () {
    loader.style.display = "none";
  }, 1000);

  if (slideIndex < questionsData.length - 1) {
    slideIndex++;
    renderQuestionSlide(slideIndex);
  } else {
    showSummary();
  }
});

previousButtonElement.addEventListener("click", function () {
  if (slideIndex > 0) {
    slideIndex--;
    renderQuestionSlide(slideIndex);
  }
});

function updateNextButton() {
  if (slideIndex === questionsData.length - 1) {
    nextButtonElement.textContent = "Submit answers";
  } else {
    nextButtonElement.textContent = "Next";
  }

  disableButton();
}

function disableButton() {
  checkAnsweredQuestions();
  nextButtonElement.disabled =
    nextButtonElement.textContent === "Submit answers" && !allQuestionsAnswered;
}

let allQuestionsAnswered = true;

function checkAnsweredQuestions() {
  allQuestionsAnswered = true;
  for (let i = 0; i < questionsData.length; i++) {
    if (!userAnswers[i] || userAnswers[i].length === 0) {
      allQuestionsAnswered = false;
      break;
    }
  }
}

function checkExcessCheckboxes() {
  const maxAnswers = questionsData[slideIndex].maxAnswers;
  const checkboxes = quizFormElement.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const currentCount = Array.from(checkboxes).filter(
        (cb) => cb.checked
      ).length;

      if (checkbox.checked && currentCount > maxAnswers) {
        checkbox.checked = false;
        showAlert(`You can select a maximum of ${maxAnswers} answers.`);
      }
      // Update userAnswers based on the checkbox state
      if (checkbox.checked) {
        // Only add to userAnswers if not already present
        if (!userAnswers[slideIndex]) {
          userAnswers[slideIndex] = [];
        }
        if (!userAnswers[slideIndex].includes(checkbox.id)) {
          userAnswers[slideIndex].push(checkbox.id);
        }
      } else {
        // Remove the checkbox id from userAnswers when unchecked
        if (userAnswers[slideIndex]) {
          userAnswers[slideIndex] = userAnswers[slideIndex].filter(
            (id) => id !== checkbox.id
          );
        }
      }

      updateNavBar();
      disableButton();
    });
  });
}

function showAlert(message) {
  alertBox.textContent = message;
  alertBox.classList.add("show");

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 3000);
}

function updateNavBar() {
  navBarElement.innerHTML = "";
  for (let i = 0; i < questionsData.length; i++) {
    const navButton = document.createElement("button");
    navButton.textContent = `Q${i + 1}`;
    navButton.classList.add("nav-button");
    if (userAnswers[i] && userAnswers[i].length > 0) {
      navButton.classList.add("answered"); 
    }

    navButton.addEventListener("click", () => {
      slideIndex = i;
      renderQuestionSlide(slideIndex);
    });

    navBarElement.appendChild(navButton);
  }

  previousButtonElement.style.display = slideIndex === 0 ? "none" : "inline";
}

function showSummary() {
  quizFormElement.innerHTML = "";

  const summaryTitle = document.createElement("h3");
  summaryTitle.textContent = "Summary of your answers:";
  quizFormElement.appendChild(summaryTitle);

  navBarElement.style.display = "none";
  questionNameElement.style.display = "none";

  for (let i = 0; i < questionsData.length; i++) {
    const summaryItem = document.createElement("p");

    const selectedAnswers = userAnswers[i]
      .map((id) => parseInt(id.split("-").pop()) + 1)
      .join(", ");

    summaryItem.textContent = `${questionsData[i].questionText}: ${selectedAnswers}`;
    quizFormElement.appendChild(summaryItem);
  }

  nextButtonElement.style.display = "none";
  previousButtonElement.style.display = "none";
}

renderQuestionSlide(slideIndex);
updateNavBar();
