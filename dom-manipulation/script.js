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
    const categories = [...new Set(quotes.map(quote => quote.category))]; // Get unique categories

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

// Function to display quotes based on the selected category
const filterQuotes = () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const selectedCategory = document.getElementById('categorySelect').value;

    // Save the last selected category to local storage
    localStorage.setItem('lastSelectedCategory', selectedCategory);

    // Filter quotes based on selected category
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    quoteDisplay.innerHTML = ''; // Clear previous quotes

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

    // Filter quotes based on selected category
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    const randomQuote = filteredQuotes.length > 0 
        ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)] 
        : { text: "No quotes available in this category.", category: "" };

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
        <button id="exportQuotesBtn">Export Quotes</button> <!-- Export Quotes button -->
        <h2>Import Quotes</h2>
        <input type="file" id="importQuotesInput" accept=".json"> <!-- File input for importing quotes -->
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
            localStorage.setItem('quotes', JSON.stringify(quotes)); // Saving to localStorage

            alert('Quote added successfully!');

            // Clear the input fields
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';

            // Populate categories to include the new category
            populateCategories();

            // Refresh the displayed quotes
            filterQuotes();
        } else {
            alert('Please fill in both fields.');
        }
    });

    // Event listener for the export quotes button
    document.getElementById('exportQuotesBtn').addEventListener('click', exportQuotes);

    // Event listener for the import quotes file input
    document.getElementById('importQuotesInput').addEventListener('change', handleFileUpload);
    
    // Event listener for category selection change
    document.getElementById('categorySelect').addEventListener('change', filterQuotes);
};

// Function to handle file input for importing quotes
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader(); // Create a FileReader object
        reader.onload = (e) => {
            const content = e.target.result; // Get the file content
            try {
                const importedQuotes = JSON.parse(content); // Parse the JSON content
                quotes = [...quotes, ...importedQuotes]; // Merge imported quotes with existing
                localStorage.setItem('quotes', JSON.stringify(quotes)); // Update local storage
                alert('Quotes imported successfully!');
                populateCategories(); // Update categories after import
                filterQuotes(); // Refresh the displayed quotes
            } catch (error) {
                alert('Failed to import quotes. Please check the file format.');
            }
        };
        reader.readAsText(file); // Read the file as text
    }
};

// Function to export quotes as a JSON file
const exportQuotes = () => {
    const jsonString = JSON.stringify(quotes, null, 2); // Convert quotes array to JSON
    const blob = new Blob([jsonString], { type: 'application/json' }); // Create a Blob with application/json type
    const url = URL.createObjectURL(blob); // Create a URL for the Blob

    const a = document.createElement('a'); // Create an anchor element
    a.href = url; // Set the href to the Blob URL
    a.download = 'quotes.json'; // Set the filename for download
    document.body.appendChild(a); // Append the anchor to the document
    a.click(); // Trigger the download
    document.body.removeChild(a); // Remove the anchor from the document
};

// Event listener for the button click
document.getElementById('generateQuoteBtn').addEventListener('click', showRandomQuote);

// Call createAddQuoteForm to display the form for adding new quotes
createAddQuoteForm();

// Call populateCategories to populate the category dropdown on page load
populateCategories();
