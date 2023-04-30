# Discord Bot

## Getting Started

### Description

This is a Discord Bot, built for a university project

### Prerequisites

To run this project locally, you will need to have NPM and NodeJS installed.<br/>
This project is developed on NodeJS v16.14.2.<br/>

-   [Download NodeJS](https://nodejs.org/en/download/)

### Setup

1. Clone the repository inside your project folder.
    ```sh
    git clone https://github.com/hypetf/MMUDiscbot-bot.git
    ```
2. Install all required npm packages by running:
    ```sh
    npm install
    ```
3. Install ffmpeg locally: https://ffmpeg.org/download.html
4. Get the bot running with **_(create .env file before this)_**:
    ```sh
    npm run bot
    ```

#### Create .env file and fill the following variables:

```sh
CLIENT_ID=
TOKEN=
OPENAI_API_KEY= (optional unless using record cmd)
SPEECHMATICS_API_KEY= (optional unless using record cmd)
```

# Features and requirements

## Client

-   [x] Setup all routes and protected routes
-   [x] Create all pages UI
-   [x] Communicate with server to login user
-   [x] Allow to logout
-   [ ] Allow to revoke access token
-   [x] Implement notifications
-   [x] Create interface for uploading files
-   [x] Display list of uploaded files
-   [x] Use state manager **(zustand)**
-   [ ] Make UI responsive

## Server

-   [x] Use Discord API as login method, revoke access token, etc...
-   [x] Handle sessions and cors
-   [x] Implement logout and clear session
-   [x] Handle Upload `POST` route to handle uploads from client
-   [ ] Verify if user is in voice channel and guild before saving and playing file
-   [ ] Clear space after song is queued

## Bot

-   [x] Play music in a voice channel
-   [x] Implement queue and functionalities like: pause, skip, resume, stop
-   [x] Implement record functionality and implement Speech-To-Text
-   [ ] Use transcribed text to use functionalities already implemented
