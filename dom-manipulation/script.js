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
        } else {
            alert('Please fill in both fields.');
        }
    });

    // Event listener for the export quotes button
    document.getElementById('exportQuotesBtn').addEventListener('click', exportQuotes);

    // Event listener for the import quotes file input
    document.getElementById('importQuotesInput').addEventListener('change', handleFileUpload);
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
