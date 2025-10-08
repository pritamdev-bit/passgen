# 🔐 PassGen

**PassGen** is a modern **Password Generator and Vault** built with **Next.js**, **React**, and **MongoDB**.  
It allows users to **generate secure passwords**, **store them safely**, and **manage** (edit, delete, or copy) their credentials — all in one sleek interface.

---

## 🚀 Features

- ✅ **Password Generator** — Generate strong, customizable passwords instantly.  
- 🔒 **Secure Vault** — Save and manage your passwords safely.  
- ✏️ **Edit & Delete** — Update or remove stored credentials easily.  
- 📋 **One-Click Copy** — Copy passwords instantly to your clipboard.  
- 🔐 **Authentication** — Powered by [Clerk](https://clerk.com) for secure sign-in and user sessions.  
- 🌙 **Modern UI** — Clean and responsive interface built with **Tailwind CSS** and **React**.  

---

## 🧠 Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **Auth:** Clerk  
- **Security:** bcryptjs, crypto-js  
- **Icons:** Tabler Icons, Lucide React  
- **Notifications:** React Hot Toast  

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/passgen.git
cd passgen

```
### 2. Install dependencies
```bash
npm install
```
3. Set up environment variables

Create a .env.local file in the root directory and add:
```env
MONGO_URI=your_mongodb_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```
4. Run the development server
```bash
npm run dev
```
Then open http://localhost:3000
 in your browser.

 | Command         | Description                             |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start development server with Turbopack |
| `npm run build` | Build for production                    |
| `npm start`     | Start production server                 |
| `npm run lint`  | Run ESLint checks                       |