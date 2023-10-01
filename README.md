# Chrome Extension for Fetching and Displaying MP4 Videos

## Overview

This Chrome extension allows users to fetch and display MP4 videos from a remote server. It includes a content script (`content.js`) injected into web pages and a website (`script.js`) where the videos are displayed.

## Features

- Fetches MP4 video URLs from a JSON endpoint on the server.
- Displays the last fetched MP4 video on the website.

## Setup

1. Install the Chrome extension by navigating to `chrome://extensions/` and enabling Developer mode. Then, click "Load unpacked" and select the extension directory.

2. Ensure the server (URL: `'https://chrome-extension-backend-w4r6.onrender.com/extension/'`) is correctly set up to provide JSON responses with MP4 video URLs.

## Usage

1. Open the website where you want to display the video (ensure the content script is active).
2. The website and the content script will fetch the JSON data from the server.
3. The last MP4 video URL in the JSON response will be displayed on the website and can be played using the video player.

## Code Explanation

- `content.js` (Chrome Extension):
  - Injected into web pages.
  - Fetches JSON data from the server.
  - Parses JSON to obtain MP4 video URLs.
  - Displays the last MP4 video on the web page.

- `script.js` (Website):
  - Displays the fetched MP4 video from the content script.

## Server Requirements

- Ensure that the server provides JSON responses with a 'data' key containing MP4 video URLs.

## Known Issues

- None reported at the moment.

## Contributions

Contributions to this project are welcome. Please feel free to open issues or submit pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
