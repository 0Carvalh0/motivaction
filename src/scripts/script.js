document.addEventListener("DOMContentLoaded", () => {
  const quoteText = document.getElementById("quote-text");
  const newQuoteBtn = document.getElementById("new-quote-btn");
  const saveQuoteBtn = document.getElementById("save-quote-btn");
  const savedQuotesList = document.getElementById("saved-quotes-list");

  let currentQuote = "";

  async function fetchQuote() {
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

  function displaySavedQuotes() {
    const savedQuotes = JSON.parse(localStorage.getItem("savedQuotes")) || [];
    savedQuotesList.innerHTML = "";
    savedQuotes.forEach((quote) => {
      const quoteCard = document.createElement("div");
      quoteCard.className =
        "bg-white p-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105";
      quoteCard.innerHTML = `
                <p class="text-gray-700 mb-2">"${quote.content}"</p>
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
