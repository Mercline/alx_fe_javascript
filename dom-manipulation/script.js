// Base URL for the mock API
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Replace with a relevant endpoint for quotes

// Load quotes from the mock API
const loadQuotes = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.slice(0, 5).map(item => ({ text: item.title, category: 'General' })); // Simulating quotes structure
};

// Function to fetch quotes from server
const fetchQuotesFromServer = async () => {
    try {
        const fetchedQuotes = await loadQuotes();
        return fetchedQuotes;
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        return [];
    }
};

// Save quotes to the mock API
const saveQuoteToAPI = async (quote) => {
    await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: quote.text,
            body: quote.category,
            userId: 1 // Simulated userId
        })
    });
};

// Save the last selected category to local storage
const saveSelectedCategory = (category) => {
    localStorage.setItem('selectedCategory', category);
};

// Save quotes to local storage
const saveQuotesToLocalStorage = () => {
    localStorage.setItem('quotes', JSON.stringify(quotes));
};

// Initialize quotes from the mock API
let quotes = [];

// Function to create a notification banner
const createNotificationBanner = (message) => {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '0';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0.9';
    notification.style.transition = 'opacity 0.5s';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
};

// Function to populate the category filter dropdown
const populateCategories = () => {
    const categoryFilter = document.getElementById('categoryFilter');
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    // Clear existing options
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Populate the dropdown with unique categories
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const savedCategory = localStorage.getItem('selectedCategory') || 'all';
    categoryFilter.value = savedCategory;
    filterQuotes();

    categoryFilter.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;
        saveSelectedCategory(selectedCategory);
        filterQuotes();
    });
};

// Function to display a random quote
const showRandomQuote = (filteredQuotes) => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];

        quoteDisplay.innerHTML = `"${randomQuote.text}" <br><strong>Category:</strong> ${randomQuote.category}`;
    } else {
        quoteDisplay.innerHTML = "No quotes available for this category.";
    }
};

// Function to display quotes based on selected category
const filterQuotes = () => {
    const selectedCategory = document.getElementById('categoryFilter').value;

    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
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

    document.getElementById('addQuoteBtn').addEventListener('click', async () => {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (newQuoteText && newQuoteCategory) {
            const newQuote = { text: newQuoteText, category: newQuoteCategory };
            quotes.push(newQuote);
            createNotificationBanner('Quote added successfully!');

            await saveQuoteToAPI(newQuote);

            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';

            updateCategories(newQuoteCategory);
            filterQuotes();
        } else {
            alert('Please fill in both fields.');
        }
    });

    document.getElementById('exportQuotesBtn').addEventListener('click', exportQuotes);
    document.getElementById('uploadQuotesFile').addEventListener('change', handleFileUpload);
};

// Function to update categories in the dropdown if a new category is introduced
const updateCategories = (newCategory) => {
    const categoryFilter = document.getElementById('categoryFilter');
    const existingCategories = [...categoryFilter.options].map(option => option.value);

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
                    quotes = uploadedQuotes;
                    saveQuotesToLocalStorage();
                    populateCategories();
                    createNotificationBanner('Quotes uploaded successfully!');
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
    const jsonString = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// Function to manually resolve conflicts
const resolveConflict = (existingQuote, newQuote) => {
    return new Promise((resolve) => {
        const conflictMessage = `
            Conflict detected for quote: "${existingQuote.text}".
            New quote from server: "${newQuote.text}".
            Choose the option:
            1. Keep existing quote
            2. Replace with new quote
        `;
        const userChoice = prompt(conflictMessage);

        if (userChoice === '2') {
            resolve(newQuote); // Replace with new quote
        } else {
            resolve(existingQuote); // Keep existing quote
        }
    });
};

// Function to periodically fetch updates
const fetchUpdates = async () => {
    const newQuotes = await fetchQuotesFromServer();

    let updated = false;
    for (const newQuote of newQuotes) {
        const existingQuoteIndex = quotes.findIndex(quote => quote.text === newQuote.title);

        if (existingQuoteIndex !== -1) {
            const existingQuote = quotes[existingQuoteIndex];
            // If there's a conflict, ask the user how to resolve it
            const resolvedQuote = await resolveConflict(existingQuote, { text: newQuote.title, category: 'General' });
            quotes[existingQuoteIndex] = resolvedQuote; // Update with resolved quote
            updated = true;
        } else {
            quotes.push({ text: newQuote.title, category: 'General' });
            updated = true;
        }
    }

    if (updated) {
        createNotificationBanner('Quotes updated successfully!');
    }

    saveQuotesToLocalStorage();
    populateCategories();
    filterQuotes();
};

// Initialize the app
const init = async () => {
    quotes = await fetchQuotesFromServer();
    createAddQuoteForm();
    populateCategories();

    setInterval(fetchUpdates, 30000);
};

init();
