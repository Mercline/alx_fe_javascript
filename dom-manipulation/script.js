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

// Function to populate category dropdown
const populateCategories = () => {
    const categorySelect = document.getElementById('categorySelect');
    const categories = [...new Set(quotes.map(quote => quote.category))]; // Extract unique categories

    // Clear existing options
    categorySelect.innerHTML = '';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    // Restore the last selected category from local storage
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        categorySelect.value = lastSelectedCategory; // Set dropdown to last selected category
        filterQuotes(); // Display quotes for the last selected category
    }
};

// Function to filter quotes based on the selected category
const filterQuotes = () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const selectedCategory = document.getElementById('categorySelect').value;

    // Save the last selected category to local storage
    localStorage.setItem('lastSelectedCategory', selectedCategory);

    // Filter quotes based on selected category
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    quoteDisplay.innerHTML = ''; // Clear previous quotes

    // Display the filtered quotes
    if (filteredQuotes.length > 0) {
        filteredQuotes.forEach(quote => {
            quoteDisplay.innerHTML += `"${quote.text}" <br><strong>Category:</strong> ${quote.category}<br><br>`;
        });
    } else {
        quoteDisplay.innerHTML = "No quotes available in this category.";
    }
};

// Function to display a random quote
const showRandomQuote = () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const selectedCategory = document.getElementById('categorySelect').value;

    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    const randomQuote = filteredQuotes.length > 0 
        ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)] 
        : { text: "No quotes available in this category.", category: "" };

    quoteDisplay.innerHTML = `"${randomQuote.text}" <br><strong>Category:</strong> ${randomQuote.category}`;
};

// Event listener for the button click
document.getElementById('generateQuoteBtn').addEventListener('click', showRandomQuote);

// Call populateCategories to populate the category dropdown on page load
populateCategories();
