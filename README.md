# Task Management Application with React + TypeScript + Vite

This application provides a comprehensive task management solution built with React, TypeScript, and Vite. The platform enables users to efficiently create, organize, and track tasks through an intuitive interface with features like drag-and-drop functionality, task categorization, and multiple view options.

## Live Demo

Visit the application: [Task Manager](https://taskmanagerapp-d4680.web.app/)

## Core Features

### User Authentication
- Google Sign-In integration via Firebase Authentication
- Profile management capabilities

### Task Management
- Create, edit, and delete tasks
- Task categorization (work, personal, etc.)
- Due date assignment
- Drag-and-drop task organization
- Sort tasks by due dates (ascending/descending)

### Advanced Features
- Batch actions for multiple tasks
- Task history and activity logging
- File attachment support
- Comprehensive filtering (tags, category, date range)
- Search functionality by task title
- Dual view options: Board (Kanban-style) and List view
- Responsive design for all devices

## Technical Stack

- React with TypeScript
- Vite for build tooling
- Firebase for authentication and data storage
- React Query for data management
- React DND for drag-and-drop functionality

## Development Setup

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

## ESLint Configuration

For production applications, enhance the TypeScript-aware lint rules:

1. Configure parser options:
```js
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

2. Update ESLint plugins:
```js
import react from 'eslint-plugin-react'

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
```

## Development Challenges and Solutions

### Drag and Drop Implementation
The primary challenge encountered during development was selecting and implementing an effective drag-and-drop library. After comprehensive evaluation of various options, React DND was chosen for its:
- Robust functionality
- Excellent TypeScript support
- Seamless integration with React components
- Superior performance with complex task arrangements

## Build and Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy
```



