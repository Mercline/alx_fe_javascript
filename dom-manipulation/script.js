// Load quotes from local storage or use default quotes if none exist
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

let quotes = loadQuotes();

// Function to extract unique categories and populate dropdowns
const populateCategories = () => {
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    const categorySelect = document.getElementById('categorySelect');
    categorySelect.innerHTML = ''; // Clear existing options
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    const filterSelect = document.getElementById('filterSelect');
    filterSelect.innerHTML = ''; // Clear existing options
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterSelect.appendChild(option);
    });
};

// Call the function to populate categories on page load
populateCategories();

// Function to display quotes
const displayQuotes = (quotesToDisplay) => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = quotesToDisplay.map(quote => `"${quote.text}" <br><strong>Category:</strong> ${quote.category}`).join('<br><br>');
};

// Function to filter quotes by selected category
const filterQuotes = () => {
    const selectedCategory = document.getElementById('filterSelect').value;
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);

    // Save the selected category to local storage
    localStorage.setItem('lastSelectedCategory', selectedCategory);

    // Display the filtered quotes
    displayQuotes(filteredQuotes);
};

// Restore the last selected category from local storage
const restoreLastSelectedCategory = () => {
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        const filterSelect = document.getElementById('filterSelect');
        filterSelect.value = lastSelectedCategory;
        filterQuotes(); // Display quotes for the restored category
    }
};

// Function to add a new quote
const addQuote = () => {
    const newQuoteText = document.getElementById('newQuoteInput').value.trim();
    const newQuoteCategory = document.getElementById('newCategoryInput').value.trim();

    if (newQuoteText && newQuoteCategory) {
        // Add the new quote object to the quotes array
        quotes.push({ text: newQuoteText, category: newQuoteCategory });

        // Update categories in dropdowns
        populateCategories();

        // Save the updated quotes array to local storage
        localStorage.setItem('quotes', JSON.stringify(quotes));

        // Clear the input fields
        document.getElementById('newQuoteInput').value = '';
        document.getElementById('newCategoryInput').value = '';

        alert('Quote added successfully!');
        
        // Display all quotes after adding a new one
        displayQuotes(quotes);
    } else {
        alert('Please fill in both fields.');
    }
};

// Event listeners
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
document.getElementById('filterQuoteBtn').addEventListener('click', filterQuotes);

// Call the restore function on page load
restoreLastSelectedCategory();
