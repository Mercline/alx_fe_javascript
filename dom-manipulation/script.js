// Array of quote objects
const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Motivation" },
    { text: "You only live once, but if you do it right, once is enough.", category: "Life" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Friendship" }
];

// Function to display a random quote
const showRandomQuote = () => {
    const quoteDisplay = document.getElementById('quoteDisplay');

    // Select a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Clear existing content and display the new quote
    quoteDisplay.innerHTML = `"${randomQuote.text}" <br><strong>Category:</strong> ${randomQuote.category}`;
};

// Function to add a new quote
const addQuote = () => {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText && newQuoteCategory) {
        // Add the new quote object to the quotes array
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        alert('Quote added successfully!');

        // Clear the input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        // Optionally show the new quote immediately
        showRandomQuote();
    } else {
        alert('Please fill in both fields.');
    }
};

// Event listener for the button click
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
