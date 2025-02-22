Task Management Application with React + TypeScript + Vite
This application provides a comprehensive task management solution built with React, TypeScript, and Vite. The platform enables users to efficiently create, organize, and track tasks through an intuitive interface with features like drag-and-drop functionality, task categorization, and multiple view options.
Live Demo
Visit the application: Task Manager
Core Features
User Authentication

Google Sign-In integration via Firebase Authentication
Profile management capabilities

Task Management

Create, edit, and delete tasks
Task categorization (work, personal, etc.)
Due date assignment
Drag-and-drop task organization
Sort tasks by due dates (ascending/descending)

Advanced Features

Batch actions for multiple tasks
Task history and activity logging
File attachment support
Comprehensive filtering (tags, category, date range)
Search functionality by task title
Dual view options: Board (Kanban-style) and List view
Responsive design for all devices

Technical Stack

React with TypeScript
Vite for build tooling
Firebase for authentication and data storage
React Query for data management
React DND for drag-and-drop functionality

Development Setup
Prerequisites
bashCopynode >= 18.0.0
npm >= 9.0.0
Installation

Clone the repository:

bashCopygit clone [repository-url]

Install dependencies:

bashCopynpm install

Configure environment variables:

bashCopycp .env.example .env

Start the development server:

bashCopynpm run dev
ESLint Configuration
For production applications, enhance the TypeScript-aware lint rules:

Configure parser options:

jsCopyexport default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})

Update ESLint plugins:

jsCopyimport react from 'eslint-plugin-react'

export default tseslint.config({
  settings: { react: { version: '18.3' } },
  plugins: {
    react,
  },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
Development Challenges and Solutions
Drag and Drop Implementation
The primary challenge encountered during development was selecting and implementing an effective drag-and-drop library. After comprehensive evaluation of various options, React DND was chosen for its:

Robust functionality
Excellent TypeScript support
Seamless integration with React components
Superior performance with complex task arrangements

Build and Deployment

Build the application:

bashCopynpm run build

Deploy to Firebase:

bashCopyfirebase deploy


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
