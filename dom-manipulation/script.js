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

// Save quotes to local storage
const saveQuotes = () => {
    localStorage.setItem('quotes', JSON.stringify(quotes));
};

// Save the last selected category to local storage
const saveSelectedCategory = (category) => {
    localStorage.setItem('selectedCategory', category);
};

// Initialize quotes from local storage
let quotes = loadQuotes();

// Function to populate the category filter dropdown
const populateCategories = () => {
    const categoryFilter = document.getElementById('categoryFilter'); // Getting the category filter element
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))]; // Using map to get unique categories

    // Clear existing options
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Populate the dropdown with unique categories
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore the last selected category from local storage
    const savedCategory = localStorage.getItem('selectedCategory') || 'all';
    categoryFilter.value = savedCategory;

    // Filter quotes based on the restored category
    filterQuotes();

    // Add event listener for category change
    categoryFilter.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;
        saveSelectedCategory(selectedCategory); // Save the selected category
        filterQuotes();
    });
};

// Function to display a random quote
const showRandomQuote = (filteredQuotes) => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];

        // Display the selected quote
        quoteDisplay.innerHTML = `"${randomQuote.text}" <br><strong>Category:</strong> ${randomQuote.category}`;
    } else {
        quoteDisplay.innerHTML = "No quotes available for this category.";
    }
};

// Function to display quotes based on selected category
const filterQuotes = () => {
    const selectedCategory = document.getElementById('categoryFilter').value;

    // Filter quotes based on the selected category
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

    // Show a random quote from the filtered quotes
    showRandomQuote(filteredQuotes);
};

// Function to create and display the form for adding new quotes
const createAddQuoteForm = () => {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <h2>Add a New Quote</h2>
        <input type="text" id="newQuoteText" placeholder="Enter quote text" required>
        <input type="text" id="newQuoteCategory" placeholder="Enter category" required>
        <button id="addQuoteBtn">Add Quote</button>
        <button id="exportQuotesBtn">Export Quotes as JSON</button>
        <input type="file" id="uploadQuotesFile" accept=".json" />
    `;

    document.body.appendChild(formContainer);

    // Event listener for the add quote button
    document.getElementById('addQuoteBtn').addEventListener('click', () => {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (newQuoteText && newQuoteCategory) {
            // Add the new quote object to the quotes array
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            alert('Quote added successfully!');

            // Save the updated quotes array to local storage
            saveQuotes();

            // Clear the input fields
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';

            // Update categories and show the new quote immediately
            updateCategories(newQuoteCategory);
            filterQuotes();
        } else {
            alert('Please fill in both fields.');
        }
    });

    // Event listener for the export quotes button
    document.getElementById('exportQuotesBtn').addEventListener('click', exportQuotes);

    // Event listener for file input
    document.getElementById('uploadQuotesFile').addEventListener('change', handleFileUpload);
};

// Function to update categories in the dropdown if a new category is introduced
const updateCategories = (newCategory) => {
    const categoryFilter = document.getElementById('categoryFilter');
    const existingCategories = [...categoryFilter.options].map(option => option.value); // Getting existing categories with map

    // If the new category is not in the dropdown, add it
    if (!existingCategories.includes(newCategory)) {
        const option = document.createElement('option');
        option.value = newCategory;
        option.textContent = newCategory;
        categoryFilter.appendChild(option);
    }
};

// Function to handle file upload
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const uploadedQuotes = JSON.parse(e.target.result);
                if (Array.isArray(uploadedQuotes)) {
                    quotes = uploadedQuotes; // Update quotes array
                    saveQuotes(); // Save updated quotes to local storage
                    populateCategories(); // Populate categories after upload
                    alert('Quotes uploaded successfully!');
                } else {
                    alert('Invalid JSON format. Please upload a valid quotes file.');
                }
            } catch (error) {
                alert('Error reading file: ' + error.message);
            }
        };
        reader.readAsText(file);
    } else {
        alert('Please upload a valid JSON file.');
    }
};

// Function to export quotes as a JSON file
const exportQuotes = () => {
    const jsonString = JSON.stringify(quotes, null, 2); // Convert quotes to a JSON string
    const blob = new Blob([jsonString], { type: 'application/json' }); // Create a Blob from the JSON string
    const url = URL.createObjectURL(blob); // Create a URL for the Blob

    // Create a link element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json'; // Set the default file name

    // Programmatically click the link to trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up and remove the link
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Free up memory
};

// Call the function to create the form for adding new quotes
createAddQuoteForm();

// Populate categories on page load
populateCategories();
