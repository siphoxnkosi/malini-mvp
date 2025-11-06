# Malini - Bill Splitting PWA

This is a vanilla HTML/CSS/JS web application for restaurant bill splitting.

## Running the Application

To run the application, you need a simple static server. You can use any static server, but here's how to do it with Python's built-in server:

1.  Make sure you have Python 3 installed.
2.  Open your terminal and navigate to the root directory of this project.
3.  Run the following command:

    ```bash
    python3 -m http.server
    ```

4.  Open your web browser and go to `http://localhost:8000`.

## Swapping the Mock API

The application uses a mock API by default, which persists data to `localStorage`. To swap this out with a real API or another storage mechanism, you can use the `replaceStorageAdapter` function in `app/state.js`.

The storage adapter is an object with two methods: `getItem(key)` and `setItem(key, value)`. You can create your own adapter that communicates with a real backend and then call `replaceStorageAdapter` with your new adapter.

Example:

```javascript
import { replaceStorageAdapter } from './app/state.js';

const myApiAdapter = {
  getItem: async (key) => {
    // Fetch data from your API
  },
  setItem: async (key, value) => {
    // Send data to your API
  }
};

replaceStorageAdapter(myApiAdapter);
```
