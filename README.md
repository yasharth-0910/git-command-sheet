# Git Cheat Sheet 🚀

**Git Cheat Sheet** is a full-stack web application designed to help developers learn, reference, and practice Git commands in an interactive and secure environment. It combines a **command reference** with a **live sandbox** to execute Git commands in real-time, making it a powerful tool for both beginners and experienced developers.

👉 **Live Demo**: [https://git.cicr.in](https://git.cicr.in)  
---

## Features ✨

### Frontend (React + TypeScript)
- **Interactive Command Search**: Quickly find Git commands using a ⌘K-powered search bar.
- **Categorized Commands**: Browse Git commands by categories with detailed descriptions.
- **Copy-to-Clipboard**: One-click copy for quick command usage.
- **Live Sandbox**: Execute Git commands in a secure, isolated environment.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.
- **Dark Theme**: Eye-friendly dark mode for extended usage.

### Backend (Node.js + Express.js)
- **Isolated Sandboxes**: Each user session gets a dedicated, secure sandbox.
- **Secure Command Execution**: Only allows a limited set of commands (git, ls, pwd, cd, mkdir, touch).
- **Automatic Cleanup**: Inactive sessions are automatically cleaned up to free resources.
- **CORS Protection**: Whitelisted domains for secure API access.

---

## Tech Stack 🛠️

### Frontend
- **Framework**: React + TypeScript
- **Styling**: TailwindCSS + Shadcn/UI
- **Build Tool**: Vite
- **Deployment**: Vercel

### Backend
- **Framework**: Express.js
- **Libraries**: simple-git, uuid
- **Deployment**: Railway
- **Process Management**: PM2

---

## Core Functionalities 💡

### 1. **Command Reference**
- Browse Git commands by category (e.g., Branching, Committing, Merging).
- Instant search with keyboard shortcuts.
- Detailed descriptions and examples for each command.
- One-click copy functionality for quick usage.

### 2. **Interactive Sandbox**
- Execute Git commands in real-time.
- Session persistence for uninterrupted practice.
- Command history for easy navigation.
- Error handling with user-friendly messages.

### 3. **User Experience**
- Keyboard shortcuts for faster navigation.
- Visual feedback for actions (e.g., copying, executing commands).
- Responsive design for seamless usage on all devices.
- Clear error messages and command output display.

---

## Deployment 🚀

### Frontend (Vercel)
- **URL**: [https://git.cicr.in](https://git.cicr.in)
- **Environment Variables**: Stored in .env.production.

### Backend (Railway)
- **Process Management**: PM2 for process monitoring and management.
- **Auto-Scaling**: Automatically scales based on traffic.
- **Continuous Deployment**: Integrated with GitHub for seamless updates.

---

## Security Features 🔒

1. **Sandboxed Environments**: Each user session is isolated for security.
2. **Limited Command Set**: Only allows safe commands (git, ls, pwd, cd, mkdir, touch).
3. **CORS Protection**: Whitelisted domains to prevent unauthorized access.
4. **Automatic Cleanup**: Inactive sessions are cleaned up to free resources.

---

## Monitoring & Maintenance 📊

- **PM2**: Used for backend process management and monitoring.
- **Railway**: Provides backend monitoring and logging.
- **Vercel**: Tracks frontend analytics and performance.
- **Error Logging**: Comprehensive error logging for debugging.
- **Session Cleanup**: Automatic cleanup of inactive sessions.

---

## How to Run Locally 🛠️

### Prerequisites
- Node.js (v18 or higher)
- Git
- Yarn or npm

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/git-sheet.git
   cd git-sheet
   ```

2. **Install Dependencies**:

   #### Frontend:
   ```bash
   cd src
   yarn install
   ```

   #### Backend:
   ```bash
   cd server
   yarn install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the `src` and `server` directories based on `.env.example`.

4. **Run the Frontend**:
   ```bash
   cd src
   yarn dev
   ```

5. **Run the Backend**:
   ```bash
   cd server
   yarn start
   ```

6. **Access the Application**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend**: [http://localhost:5000](http://localhost:5000) / [http://localhost:5173](http://localhost:5173)

---

## Contributing 🤝

Contributions are welcome! Please follow these steps:

    1. Fork the repository.
    2. Create a new branch (`git checkout -b feature/your-feature`).
    3. Commit your changes (`git commit -m 'Add some feature'`).
    4. Push to the branch (`git push origin feature/your-feature`).
    5. Open a pull request.

---

## License 📄

This project is currently not under any licence, but please give credits if code is used.

---

## Acknowledgments 🙏

- **Vercel** and **Railway** for hosting.
- **TailwindCSS** and **Shadcn/UI** for styling.
- **Simple-git** for Git command execution.

Enjoy using Git Cheat Sheet! If you have any questions or feedback, feel free to open an issue or reach out. Happy coding! 🎉

---

## Contributors

- Yasharth Singh
