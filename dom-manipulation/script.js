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

// Function to extract unique categories and populate dropdowns
const populateCategories = () => {
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    // Populate categorySelect
    const categorySelect = document.getElementById('categorySelect');
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    // Populate filterSelect
    const filterSelect = document.getElementById('filterSelect');
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterSelect.appendChild(option);
    });

    // Add an option for all categories in the filter
    const allOption = document.createElement('option');
    allOption.value = 'All';
    allOption.textContent = 'All Categories';
    filterSelect.appendChild(allOption);
};

// Call the function to populate categories on page load
populateCategories();

// Function to display all quotes
const displayQuotes = (quotesToDisplay) => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = quotesToDisplay.map(quote => `"${quote.text}" <br><strong>Category:</strong> ${quote.category}`).join('<br><br>');
};

// Function to filter quotes by selected category
const filterQuotes = () => {
    const selectedCategory = document.getElementById('filterSelect').value;
    const filteredQuotes = selectedCategory === 'All'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    // Display the filtered quotes
    displayQuotes(filteredQuotes);
};

// Event listeners
document.getElementById('filterQuoteBtn').addEventListener('click', filterQuotes);

// Function to display a random quote
const showRandomQuote = () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const selectedCategory = document.getElementById('categorySelect').value;

    const filteredQuotes = selectedCategory === 'All'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);
    
    const randomQuote = filteredQuotes.length > 0 
        ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)] 
        : { text: "No quotes available in this category.", category: "" };

    quoteDisplay.innerHTML = `"${randomQuote.text}" <br><strong>Category:</strong> ${randomQuote.category}`;
};

// Event listener for the button click
document.getElementById('generateQuoteBtn').addEventListener('click', showRandomQuote);
