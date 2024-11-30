document.addEventListener("DOMContentLoaded", () => {
  const quoteText = document.getElementById("quote-text");
  const quoteLoading = document.getElementById("quote__loading");
  const newQuoteBtn = document.getElementById("new-quote-btn");
  const saveQuoteBtn = document.getElementById("save-quote-btn");
  const savedQuotesList = document.getElementById("saved-quotes-list");

  let currentQuote = "";

  async function fetchQuote() {
    quoteText.classList.add("hidden")
    quoteLoading.classList.remove("hidden");
    try {
      const response = await fetch("https://api.adviceslip.com/advice");
      const data = await response.json();
      translateQuote(data.slip.advice);
    } catch (error) {
      quoteText.textContent = "Não foi possível carregar uma nova frase.";
    }
  }

  async function translateQuote(quote) {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          quote
        )}&langpair=en|pt`
      );
      const data = await response.json();
      currentQuote = {
        content: data.responseData.translatedText,
        _id: Date.now().toString(), // Use timestamp as a unique ID
      };
      displayQuote();
    } catch (error) {
      quoteText.textContent = "Não foi possível traduzir a frase.";
    }
  }

  function displayQuote() {
    quoteText.textContent = `"${currentQuote.content}"`;
    quoteText.style.opacity = 0;
    setTimeout(() => {
      quoteLoading.classList.add("hidden");
      quoteText.classList.remove("hidden");
      quoteText.style.opacity = 1;
    }, 50);
  }

  function saveQuote() {
    if (currentQuote) {
      const savedQuotes = JSON.parse(localStorage.getItem("savedQuotes")) || [];
      if (!savedQuotes.some((quote) => quote._id === currentQuote._id)) {
        savedQuotes.push(currentQuote);
        localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
        displaySavedQuotes();
      } else {
        alert("Esta citação já está salva!");
      }
    }
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest("#delete-quote-btn").id === "delete-quote-btn") {
      let deleteQuoteBtn = e.target.closest("#delete-quote-btn");
      let savedQuotes = JSON.parse(localStorage.getItem("savedQuotes")) || [];
      let quoteId = deleteQuoteBtn.parentElement.id;

      savedQuotes = savedQuotes.filter((quote) => quote._id !== quoteId);
      localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));

      displaySavedQuotes();
    }
  });

  function displaySavedQuotes() {
    const savedQuotes = JSON.parse(localStorage.getItem("savedQuotes")) || [];
    savedQuotesList.innerHTML = "";
    savedQuotes.forEach((quote) => {
      const quoteCard = document.createElement("div");
      quoteCard.id = quote._id;
      quoteCard.className =
        "bg-white flex items-center p-4 gap-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105";
      quoteCard.innerHTML = `
      <p class="text-gray-700 mb-2">"${quote.content}"</p><button id="delete-quote-btn"><i class="fa-solid fa-trash"></i></button>
      `;
      savedQuotesList.appendChild(quoteCard);
    });
  }

  newQuoteBtn.addEventListener("click", fetchQuote);
  saveQuoteBtn.addEventListener("click", saveQuote);

  // Initial quote and saved quotes display
  fetchQuote();
  displaySavedQuotes();
});
