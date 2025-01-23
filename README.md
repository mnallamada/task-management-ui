# Task Manager UI

This is the frontend application for the Task Manager website. It allows users to create, edit, delete, and mark tasks as complete. Users can also sort tasks and interact with an API for data management. The application is built using modern web technologies, including React, Tailwind CSS, TypeScript, and Axios.

## Features

- **Add, Edit, and Delete Tasks**: Users can manage their tasks effortlessly.
- **Mark Tasks as Complete**: A checkbox feature lets users mark tasks as done.
- **Sort Tasks**: Sort tasks based on priority or due date.
- **Authentication**: Secure login and logout functionality.
- **API Integration**: Communicates with the backend for data persistence.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **React**: For building the user interface.
- **Tailwind CSS**: For styling the components.
- **TypeScript**: For type safety and better code maintenance.
- **Axios**: For making API requests.
- **Firebase**: Used for deployment and hosting.

## Project Structure

```
Task-Management-UI/
├── src/
│   ├── components/
│   │   ├── Tasks/
│   │   │   ├── NavigationBar.tsx
│   │   │   ├── PrivateRoute.tsx
│   │   ├── context/
│   ├── services/
│   │   ├── api.ts
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   ├── logo.svg
├── .firebaserc
├── .gitignore
├── firebase.json
├── package-lock.json
├── package.json
├── README.md
```

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- A Firebase account for deployment.

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/mnallamada/task-management-ui.git
   cd task-management-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the necessary environment variables:
   ```env
   REACT_APP_API_URL=https://taskmanager-api.mounikanallamada.com
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Deployment

This project uses Firebase for deployment.

### Steps:

1. Build the project:
   ```bash
   npm run build
   ```

2. Log in to Firebase:
   ```bash
   firebase login
   ```

3. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Contributing

Feel free to contribute by submitting issues or pull requests. For major changes, please discuss them in an issue first.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

**Author**: Mounika Nallamada
