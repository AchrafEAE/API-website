# Simple API Website

This project is a simple web application that demonstrates how to interact with an external API using JavaScript. It is structured to follow best practices in web development, including a mobile-first design approach and the use of modern JavaScript features.

## Project Structure

```
simple-api-website
├── src
│   ├── index.html       # Main HTML document
│   ├── styles.css       # Styles for the website
│   ├── app.js           # Main JavaScript file for handling API requests
│   └── api
│       └── service.js   # Functions for interacting with the external API
├── package.json         # npm configuration file
└── README.md            # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/simple-api-website.git
   cd simple-api-website
   ```

2. **Install dependencies:**
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Run the application:**
   Open `src/index.html` in your web browser to view the application.

## Usage

- The application fetches data from an external API and displays it on the webpage.
- The layout is responsive and designed to work on both mobile and desktop devices.

## Features

- **Responsive Design:** Utilizes Tailwind CSS for a mobile-first approach.
- **AJAX Requests:** Implements fetch and async/await for API calls.
- **Concurrent Requests:** Uses Promise.all() to handle multiple API requests simultaneously.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.

## License

This project is open-source and available under the MIT License.