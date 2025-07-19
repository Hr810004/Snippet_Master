# 🚀 Snippet_Master – The Ultimate Code Snippet Manager

## 📌 Project Overview

**Snippet_Master** is a modern, full-stack MERN application for managing, sharing, and discovering code snippets. Designed for developers, teams, and learners, it features authentication, tagging, favorites, search, and a beautiful UI. Built with **Node.js**, **MongoDB**, **React**, **TypeScript**, and **TailwindCSS**.

---

## 🌟 Key Features

- 🔐 **Authentication** (Register, Login, Email Verification, Password Reset)
- 📝 **Create, Edit, Delete, and View Snippets**
- 🏷️ **Tagging System** for organizing snippets
- ⭐ **Favorites** – Save your most-used snippets
- 🔍 **Powerful Search** and Filters
- 🏆 **Leaderboard** for top contributors
- 👤 **User Profiles** and Editable Info
- 📈 **Popular & Trending Snippets**
- 📨 **Email Notifications** (Verification, Password Reset)
- 🖥️ **Responsive UI** with TailwindCSS & Shadcn UI
- 🌐 **Deployed on Vercel** for instant access

---

## 🛠️ Tools & Technologies

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React.js, Next.js (App Router), TypeScript
- **UI:** TailwindCSS, Shadcn UI
- **Authentication:** JWT, Email Verification
- **Email:** Nodemailer, Handlebars
- **State Management:** React Context API
- **Other:** Vercel (Deployment), SCSS, PostCSS

---

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Hr810004/Snippet_Master.git
cd Snippet_Master
```

### 2. Set Up Environment Variables

Create a `.env` file in `backend/` and add:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/snippet_master
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:3000
```

For the frontend, you may also need a `.env.local` in `client/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../client
npm install
```

### 4. Run the Application

```bash
# In backend/
npm run dev

# In client/
npm run dev
```

- Backend: [http://localhost:5000](http://localhost:5000)
- Frontend: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment

1. **Set environment variables** on your hosting platform (e.g., Vercel for frontend, Render/Heroku for backend).
2. **Deploy** both backend and frontend using your preferred method.

---

## 📂 Project Structure

```plaintext
Snippet_Master/
  ├── backend/
  │   ├── src/
  │   │   ├── controllers/
  │   │   ├── models/
  │   │   ├── routes/
  │   │   └── ...
  │   └── server.js
  └── client/
      ├── app/
      ├── components/
      ├── context/
      └── ...
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check [issues](https://github.com/Hr810004/Snippet_Master/issues) page.

---

## 🙏 Acknowledgements

- [Vercel](https://vercel.com/) for deployment
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for managed database
- [Shadcn UI](https://ui.shadcn.com/) for UI components

---

> **Live Demo:** [snippet-master-one.vercel.app](https://snippet-master-one.vercel.app)

---

**Happy Coding!** 🚀

---
