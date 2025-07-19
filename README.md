# 🚀 Snippet_Master – The Ultimate Code Snippet Manager

> **Notice:**   
> Forking, copying, or deploying this project is not permitted without explicit written permission.

## 📌 Overview

**Snippet_Master** is a full-stack, real-time code snippet sharing platform. It allows users to create, organize, and discover code snippets with advanced features like AI-powered code analysis, real-time updates, and a beautiful, responsive UI.

- **Live Demo:** [snippet-master-one.vercel.app](https://snippet-master-one.vercel.app)

---

## 🌟 Key Features (Detailed)

### 🔐 Authentication & User Profiles
Secure, modern authentication system with:
- User registration and login using JWT tokens.
- Email verification to ensure valid signups.
- Password reset via secure email links.
- Profile management: Users can update their name, bio, social links, and profile picture (with Cloudinary integration).
- Role-based access for future admin/creator features.

![Auth & Profile](/client/public/logo.png)

---

### 📝 Create, Edit, and Organize Snippets
- Rich snippet editor: Users can add, edit, and delete code snippets in multiple programming languages.
- Syntax highlighting and code formatting for better readability.
- Tagging system: Assign multiple tags to each snippet for easy organization and discovery.
- Privacy controls: Choose to make snippets public or private.

![Snippet Creation](/client/public/logo.png)

---

### ⭐ Favorites & Leaderboard
- Favorites system: Users can save their most-used or liked snippets for quick access.
- Leaderboard: Displays top contributors based on snippet popularity and activity, encouraging community engagement.

![Leaderboard](/client/public/glass-bg.png)

---

### 🔍 Powerful Search & Tagging
- Full-text search: Instantly find snippets by title, description, or code content.
- Tag-based filtering: Filter snippets by language, tag, or popularity.
- Dynamic suggestions: As you type, get real-time suggestions for tags and snippets.

![Search](/client/public/flurry.png)

---

### 🤖 AI-Powered Code Analysis
- AI integration (Google AI/OpenAI): Analyze code for quality, best practices, and potential improvements.
- Automatic documentation generation: Instantly create documentation for any code snippet.
- Code improvement suggestions: Get actionable feedback and refactoring tips.
- Language conversion: Convert code between supported programming languages.

![AI Features](/client/public/logo.png)

---

### ⚡ Real-time Updates
- Socket.IO-powered live updates: New snippets, likes, and leaderboard changes appear instantly for all users.
- Live status indicator: Shows whether the user is connected to the real-time server (“Live”/“Offline”).
- No page refresh needed: All updates are pushed in real time.

![Real-time](/client/public/glass-bg.png)

---

### 🖥️ Responsive, Modern UI
- Fully responsive design: Works seamlessly on desktop, tablet, and mobile.
- Modern, accessible UI: Built with Next.js, TailwindCSS, and Shadcn UI for a clean, professional look.
- Dark mode and accessibility: Designed for usability and comfort.

![Mobile View](/client/public/glass-bg.png)

---

### 📨 Email Notifications
- Automated emails for account verification, password reset, and important updates.
- Custom email templates for a branded user experience.

---

### 🔒 Privacy Controls
- Public/private snippet options: Users control who can see their code.
- Secure file uploads: Profile images are uploaded and managed securely via Cloudinary.

---

### 🏆 Community & Social Features
- Share snippets: Easily share code with others via direct links.
- Popular & trending sections: Discover what’s hot in the community.
- User profiles: View and follow top contributors.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript, TailwindCSS
- **Backend:** Node.js, Express, MongoDB, Socket.IO
- **Other:** Cloudinary, Google AI, JWT, Nodemailer

## 👨‍💻 My Role

I designed and developed the entire application, including:
- Architecting the backend API and real-time features
- Building the frontend UI and state management
- Integrating AI-powered code analysis
- Implementing authentication, file uploads, and deployment

## 📝 License

This project is licensed under a custom, restrictive license.  
See [LICENSE](LICENSE) for details.

---

**Built with ❤️ for my portfolio and placement.**
