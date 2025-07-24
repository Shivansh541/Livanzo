# 🏠 Livanzo – Hostel & Flat Discovery Platform

**Livanzo** is a full-stack web platform designed to help students, employees, and general users discover and list hostels, PGs, and rental rooms. With role-based dashboards, powerful search filters, and user-friendly interfaces, Livanzo streamlines the entire process of finding or managing hostel accommodations.

---

## 🚀 Features

### 👥 Role-Based Access
- 👤 **Guests** – Browse all hostels, search, login/signup
- 🧑‍🎓 **Users** – Search/view hostels, add reviews, mark favorites, access profile
- 🏢 **Owners** – Upload/manage hostels, view listings, edit profile

### 🔍 Search & Filter
- Search hostels by **name**
- Filter by **budget**, **room type**, **allowed for**, **nearby colleges**

### 🧾 Owner Panel
- View all hostels or only "My Hostels"
- Add/edit hostel listings with multiple images
- Update owner details

### 💬 User Panel
- View hostel details with:
  - Image carousel + full preview modal
  - Favorite toggle
  - Owner info card
  - Add/Edit review (if not already reviewed)

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router, AOS, FontAwesome
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Multer
- **Hosting**: Frontend – Vercel | Backend – Railway

---

## 📦 Installation

```bash
# Clone the repos
git clone https://github.com/Shivansh541/livanzo-frontend
git clone https://github.com/Shivansh541/livanzo-backend

# Install frontend dependencies
cd livanzo-frontend
npm install

# Install backend dependencies
cd ../livanzo-backend
npm install
