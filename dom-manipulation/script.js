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
    const categories = [...new Set(quotes.map(quote => quote.category))];

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
        categorySelect.value = lastSelectedCategory;
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

// Function to create and display the form for adding new quotes
const createAddQuoteForm = () => {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <h2>Add a New Quote</h2>
        <input type="text" id="newQuoteText" placeholder="Enter quote text" required>
        <input type="text" id="newQuoteCategory" placeholder="Enter category" required>
        <button id="addQuoteBtn">Add Quote</button>
        <button id="exportQuotesBtn">Export Quotes</button>
        <h2>Import Quotes</h2>
        <input type="file" id="importQuotesInput" accept=".json">
    `;
    
    document.body.appendChild(formContainer);

    // Event listener for the add quote button
    document.getElementById('addQuoteBtn').addEventListener('click', () => {
        const newQuoteText = document.getElementById('newQuoteText').value;
        const newQuoteCategory = document.getElementById('newQuoteCategory').value;

        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            localStorage.setItem('quotes', JSON.stringify(quotes));

            alert('Quote added successfully!');

            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';

            populateCategories();
            filterQuotes();
        } else {
            alert('Please fill in both fields.');
        }
    });

    document.getElementById('exportQuotesBtn').addEventListener('click', exportQuotes);
    document.getElementById('importQuotesInput').addEventListener('change', handleFileUpload);
    document.getElementById('categorySelect').addEventListener('change', filterQuotes);
};

// Function to handle file input for importing quotes
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            try {
                const importedQuotes = JSON.parse(content);
                quotes = [...quotes, ...importedQuotes];
                localStorage.setItem('quotes', JSON.stringify(quotes));
                alert('Quotes imported successfully!');
                populateCategories();
                filterQuotes();
            } catch (error) {
                alert('Failed to import quotes. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
};

// Function to export quotes as a JSON file
const exportQuotes = () => {
    const jsonString = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

// Event listener for the button click
document.getElementById('generateQuoteBtn').addEventListener('click', showRandomQuote);

// Call createAddQuoteForm to display the form for adding new quotes
createAddQuoteForm();

// Call populateCategories to populate the category dropdown on page load
populateCategories();
