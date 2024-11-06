# step-by-step guide  

- [Пошаговое руководство на русском](./step-by-step_ru.md)  

## Table of contents  
* [Introduction](#Introduction)
* [The free resources to help you understand JavaScript better](#The-free-resources-to-help-you-understand-JavaScript-better )
* [Configuring browser environment](#Configuring-browser-environment)
* [Setting up Green-API instance ](#Setting-up-Green-API-instance)
* [Creating the Main File: Integrating WhatsApp Voice Calls](#creating-the-main-file-integrating-whatsapp-voice-calls)
* [Conclusion](#Conclusion)

## Introduction  

If you are reading this, you probably want to know how to integrate voice calls through WhatsApp using the `whatsapp-api-calls-client-js` library. Great! You've come to the right place. In this guide, you'll learn:

* How to start integrating voice calls from scratch.
* And much more.

This guide will also cover topics such as common errors and how to resolve them, keeping your code clean, setting up a proper development environment, and other important aspects. Sounds good? Excellent! Let's get started.  

## The free resources to help you understand JavaScript better  

Integrating voice calls is exciting, but there are a few prerequisites. To create an integration using `whatsapp-api-calls-client-js`, you need to have a solid understanding of JavaScript. While it's possible to create an integration with minimal knowledge of JavaScript and programming, trying to do so without a good grasp of the language will only make the process more difficult. You might get stuck on simple tasks, struggle with basic solutions, and end up frustrated. That doesn't sound like fun.  

If you're not familiar with JavaScript but would like to learn, here are a few resources to get you started:  

* [Eloquent JavaScript](https://eloquentjavascript.net/), a free online book.
* [JavaScript.info](https://javascript.info/), a modern JavaScript tutorial.
* [Codecademy](https://www.codecademy.com/learn/introduction-to-javascript), an interactive JavaScript course.
* [Nodeschool](http://nodeschool.io/), lessons on JavaScript and Node.js.
* [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide), a guide and full documentation for JavaScript.
* And of course, Google — your best friend.

Choose a resource, learn some JavaScript, and once you feel confident enough, come back and get started with building your app.  

## Configuring browser environment  

Before you begin integrating WhatsApp voice calls, it's essential to set up a proper development environment. In this section, we’ll cover how to set up a simple web server using Vite. We'll also explore how to use React with Vite as an alternative setup.

**Note:** If you are already familiar with setting up a development environment using Vite or React, feel free to skip this section and move on to the next step.

## Setting Up Vite without React

Vite is a powerful build tool that can be used not only with frameworks like React or Vue, but also for simple, framework-less projects. It offers fast build times and a smooth development experience.

### Step 1: Install Node.js

First, ensure that Node.js is installed on your machine. You can download the latest version from the [official Node.js website](https://nodejs.org/). Node.js comes with npm (Node Package Manager), which you will need to install Vite.

### Step 2: Create a Basic Vite Project

To create a new project with Vite, open your terminal and run the following commands:

```bash
npm create vite@latest my-simple-app
```

When prompted to select a framework, choose "Vanilla" for a project without any specific front-end framework.

```bash
cd my-simple-app
npm install
```

This will create a new Vite project without any frameworks.

### Step 3: Start the Development Server

Now that your project is set up, you can start the development server:

```bash
npm run dev
```

Vite will start a local development server and provide a URL (usually `http://localhost:5173`) where you can see your website in the browser.

### Project Structure

The structure of your project will look like this:

```
my-simple-app/
├── index.html
├── main.js
├── style.css
├── vite.config.js
└── package.json
```

- `index.html`: The main HTML file of your site.
- `main.js`: The main JavaScript file where you can add your custom scripts.
- `style.css`: The CSS file where you can write your custom styles.
- `vite.config.js`: Configuration file for Vite.

### Writing Basic HTML and JavaScript

You can now edit `index.html` and `main.js` to build your site. Here's an example of a simple `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Simple App</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>Hello, Vite!</h1>
  <p>This is a simple project without any frameworks.</p>
  <script type="module" src="/main.js"></script>
</body>
</html>
```

And a basic `main.js`:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  console.log('JavaScript is working!');
});
```

You can add your styles to `style.css` and scripts to `main.js` as needed.

### Building for Production

Once you’re ready to deploy your site, you can build the project for production:

```bash
npm run build
```

This will create a `dist` folder with your optimized and minified files ready for deployment.

### Learn More About Vite

For more in-depth information on using Vite without a framework, check out these resources:

- [Vite Official Documentation](https://vitejs.dev/guide/)
- [Vite with Vanilla JS](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)

---

## Setting Up Vite with React

If you prefer using React for your project, Vite provides an excellent development environment for it as well.

### Step 1: Create a New React Project with Vite

To create a new React project with Vite, open your terminal and run:

```bash
npm create vite@latest my-react-app
```

When prompted, select "React" and then choose whether you want to use JavaScript or TypeScript.

```bash
cd my-react-app
npm install
```

### Step 2: Start the Development Server

Just like in the simple Vite setup, you can start the development server:

```bash
npm run dev
```

This will start the server, and you can view your React app at `http://localhost:5173`.

### Project Structure

The structure of a React project with Vite will look like this:

```
my-react-app/
├── src/
│ ├── assets/
│ ├── common/
│ ├── components/
│ ├── hooks/
│ ├── pages/
│ ├── router/
│ ├── services/
│ ├── store/
│ ├── styles/
│ ├── store/
│ ├── utils/
│ ├── voip/
│ ├── App.tsx
│ ├── main.tsx
│ └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.js
└── .gitignore
```

- `index.html`: HTML file to start building the Vite project
- `package.json` - needed for npm build
- `tsconfig.json` - needed to use typescript
- `vite.config.js` - needed to build the project's html pages
- `public/index.html`: Main HTML file
- `src/App.jsx`: Main React component
- `src/main.jsx`: React application entry point
- `src/index.css`: CSS file for styling
- `assets` -- project images
- `common` - everything related to typing and constants
- `components` - folder with custom react components
- `hooks` - custom hooks for react components
- `pages` - page components (essentially a component consisting of several custom components, for example, the main page consists of header, contact-list, etc. components)
- `services` - contains the Redux Toolkit configuration for sending requests to the server (for example, for a list of contacts, getting the status of an instance, etc.)
- `store` - Redux Toolkit configuration for working with a client store
- `utils` - auxiliary functions for the project (error handling, date formatting, etc.)

### Modifying the App Component

You can start by modifying the `App.jsx` component:

```jsx
import React from 'react';

function App() {
  return (
    <div className="App">
      <h1>Hello, React with Vite!</h1>
      <p>Start building your app here.</p>
    </div>
  );
}

export default App;
```

### Building for Production

When you’re ready to deploy your React app, run:

```bash
npm run build
```

This will create a production-ready build in the `dist` folder.

### Learn More About Vite with React

For more in-depth information on using Vite with React, explore these resources:

- [React Official Website](https://reactjs.org/)
- [Vite Documentation for React](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)
- [React and Vite - Getting Started](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app)

---

By following these steps, you can either set up a simple, framework-less web application using Vite, or a more robust React application. Both approaches provide a fast and efficient development environment to help you build and deploy your projects.  

## Setting up Green-API instance  

### Creating your instance  

Now that you have configured the browser environment and installed `whatsapp-api-calls-client.js`, you're almost ready to start writing code! The next step is to create a Green API instance on the GreenAPI website.

Creating an instance is straightforward. The steps are as follows:

1. Open the [GreenAPI console](https://console.green-api.com/instanceList) and log into your account.
2. Click on the "Create Instance" button and follow the instructions.

### Your instance token  

> **DANGER**
>
> This section is critical, so pay close attention. It explains what your instance token is, as well as the security aspects of it.

After creating a bot user, you'll see a section like this:

![img.png](./assets/img.png)

In this panel, you can modify various parameters of the instance, specify its name, configure webhooks, etc. Your instance token will be displayed when you click on the "eye" icon, or you can simply copy it. When we ask you to insert your instance token somewhere, this is the value you need to enter. If you accidentally lose your instance token at some point, you will need to return to this page and reset your instance token, after which a new token will be generated, invalidating all previous ones.

### Token Security  

It's crucial to keep your instance token secure. Do not hard-code the token in your codebase or share it with others. If your token is compromised, immediately reset it from the Green-API console to prevent unauthorized access.

### API Usage Limits  

Be aware that GreenAPI may impose certain rate limits on the number of requests you can make within a specific timeframe. Exceeding these limits could result in temporary or permanent suspension of your API access. Always refer to the official documentation to understand these limitations.  

## Creating the Main File: Integrating WhatsApp Voice Calls  

In this section, we'll guide you through the process of creating the main file for your WhatsApp voice call integration using the `GreenApiVoipClient` class. This file will handle the key events such as incoming calls, accepting and rejecting calls, and managing peer connections. By the end of this guide, you'll have a working example that can manage WhatsApp voice calls effectively.

#### Step 1: Setting Up the Basic Structure  

First, let's create a new JavaScript file, `main.js` (or `main.ts` if you're using TypeScript), which will serve as the entry point for our integration.

```javascript
import { GreenApiVoipClient } from '@green-api/whatsapp-api-calls-client-js';

// Initialize the GreenApiVoipClient
const greenApiVoipClient = new GreenApiVoipClient();

// Example initialization options, replace with your actual instance details
const initOptions = {
  idInstance: 'your-id-instance',
  apiTokenInstance: 'your-api-token-instance',
};

// Initialize the client
greenApiVoipClient.init(initOptions).then(() => {
  console.log('GreenApiVoipClient initialized and connected.');
}).catch(error => {
  console.error('Failed to initialize GreenApiVoipClient:', error);
});
```

#### Step 2: Handling Key Events

The `GreenApiVoipClient` class emits several important events that you can listen to in order to manage the lifecycle of a call.

##### 1. **Incoming Call Event**  

When an incoming call is detected, the `INCOMING_CALL` event is fired. This event provides the `callId` and `wid` (WhatsApp ID of the user).

```javascript
greenApiVoipClient.addEventListener('INCOMING_CALL', (event) => {
  const { callId, wid } = event.detail.info;
  console.log('Incoming call from:', wid.user, 'Call ID:', callId);
  
  // Automatically accept the call (or show UI to the user)
  greenApiVoipClient.acceptCall().then(() => {
    console.log('Call accepted.');
  }).catch(error => {
    console.error('Error accepting call:', error);
  });
});
```

##### 2. **Remote Stream Ready Event**  

Once the connection is successfully established and the remote media stream is ready, the `REMOTE_STREAM_READY` event is triggered. You can use this event to start playing the remote audio stream.

```javascript
greenApiVoipClient.addEventListener('REMOTE_STREAM_READY', (event) => {
  const remoteStream = event.detail;
  
  // For example, attach the stream to an audio element to play the sound
  const audioElement = document.createElement('audio');
  audioElement.srcObject = remoteStream;
  audioElement.play();
  
  console.log('Remote stream ready and playing.');
});
```

##### 3. **Ending a Call**  

The `END_CALL` event is fired when a call ends. This could happen for various reasons, such as the remote party hanging up or a timeout.

```javascript
greenApiVoipClient.addEventListener('END_CALL', (event) => {
  const { type, payload } = event.detail;
  
  if (type === 'TIMEOUT') {
    console.log('Call ended due to timeout.');
  } else if (type === 'REMOTE') {
    console.log('Call ended by the remote party.');
  } else if (type === 'REJECTED') {
    console.log('Call was rejected.');
  } else if (type === 'SELF') {
    console.log('Call ended by the user.');
  }
  
  // Clean up the UI or reset the application state
});
```

##### 4. **Handling Call States**  

The `CALL_STATE` event provides updates on the state of the call, such as ringing, connecting, or connected.

```javascript
greenApiVoipClient.addEventListener('CALL_STATE', (event) => {
  const { state } = event.detail;
  console.log('Call state changed:', state);
  
  // Update your UI based on the state, e.g., show "Ringing..." when the state is 'ringing'
});
```

#### Step 3: Making an Outgoing Call  

To initiate a new call, use the `startCall` method.  

```javascript
const phoneNumber = 'recipient-phone-number';  // Replace with the actual phone number

greenApiVoipClient.startCall(phoneNumber, true, false).then(() => {
  console.log('Call started.');
}).catch(error => {
  console.error('Error starting call:', error);
});
```

#### Step 4: Ending or Rejecting a Call  

To end a call that is currently active, use the `endCall` method. If you need to reject an incoming call, use the `rejectCall` method.

```javascript
// End an active call
greenApiVoipClient.endCall().then(success => {
  if (success) {
    console.log('Call ended successfully.');
  } else {
    console.log('Failed to end the call.');
  }
}).catch(error => {
  console.error('Error ending call:', error);
});

// Reject an incoming call
greenApiVoipClient.rejectCall().then(() => {
  console.log('Call rejected.');
}).catch(error => {
  console.error('Error rejecting call:', error);
});
```

### Conclusion  

In this guide, we covered the creation of the main file for your WhatsApp voice call integration using the `GreenApiVoipClient` class. By handling key events such as incoming calls, remote streams, and call states, you can effectively manage the lifecycle of WhatsApp calls within your application. This setup provides a solid foundation for further customization and integration of additional features as needed.

Feel free to expand on this example by adding user interface elements, error handling, and any other custom logic required for your specific use case.  

