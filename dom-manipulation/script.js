// Function to load quotes from local storage or use default quotes if none exist
const loadQuotes = () => {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        return JSON.parse(savedQuotes);
    }
    return [
        { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Get busy living or get busy dying.", category: "Motivation" },
        { text: "You only live once, but if you do it right, once is enough.", category: "Life" },
        { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Friendship" }
    ];
};

// Load quotes from local storage
let quotes = loadQuotes();

// Function to display a random quote
const showRandomQuote = () => {
    const quoteDisplay = document.getElementById('quoteDisplay');

    // Select a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Clear existing content and display the new quote
    quoteDisplay.innerHTML = `"${randomQuote.text}" <br><strong>Category:</strong> ${randomQuote.category}`;
};

// Function to create and display the form for adding new quotes
const createAddQuoteForm = () => {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <h2>Add a New Quote</h2>
        <input type="text" id="newQuoteText" placeholder="Enter quote text" required>
        <input type="text" id="newQuoteCategory" placeholder="Enter category" required>
        <button id="addQuoteBtn">Add Quote</button>
    `;
    
    document.body.appendChild(formContainer);

    // Event listener for the add quote button
    document.getElementById('addQuoteBtn').addEventListener('click', () => {
        const newQuoteText = document.getElementById('newQuoteText').value;
        const newQuoteCategory = document.getElementById('newQuoteCategory').value;

        if (newQuoteText && newQuoteCategory) {
            // Add the new quote object to the quotes array
            quotes.push({ text: newQuoteText, category: newQuoteCategory });

            // Save updated quotes to local storage
            localStorage.setItem('quotes', JSON.stringify(quotes)); // <-- Saving to localStorage

            alert('Quote added successfully!');

            // Clear the input fields
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';
        } else {
            alert('Please fill in both fields.');
        }
    });
};

// Event listener for the button click
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Call createAddQuoteForm to display the form for adding new quotes
createAddQuoteForm();
