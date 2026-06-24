Overview
This is a full-stack E-commerce application built using the MERN Stack (MongoDB, Express, React, Node.js). The project is designed to provide a secure and efficient shopping experience, featuring robust authentication, role-based access, and a complete order management workflow.

🚀 Key Features
Secure Auth: Industry-standard authentication with hashing and JWT for secure sessions.

Role-Based Access Control (RBAC): Distinct permissions for Admin, Delivery Agent, and Users.

Smart Caching: Integrated Redis to ensure high performance and faster database queries.

Full CRUD Operations: Comprehensive product management for Admins, including file uploads.

Delivery Workflow: Unique ID-based delivery verification system with duplicate protection.

Automated Notifications: Instant HTML-based email alerts to the Admin upon new order placement.

🎨 Frontend & Design (AI-Assisted)
Transparency Notice: I have utilized AI tools to assist in the frontend design and UI structuring of this project. AI helped me refine the layout and user experience, ensuring a clean and modern interface. I believe in being transparent about my development process as it represents the modern way of building software efficiently.

🛠 Tech Stack
Frontend: React.js, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB

Caching: Redis

Auth: JWT & Bcrypt

Others: Multer (File Upload), Nodemailer

⚙️ How it Works
Authentication: Secure registration and login flows.

Order Flow: Users add products to their cart. Upon checkout, the system validates the user's address and triggers a persistent order record.

Notifications: Once an order is placed, an automated, detailed email is sent to the Admin.

Delivery Verification: Delivery Agents use a unique, order-specific ID to mark an order as 'Delivered.' The system includes a check to prevent duplicate delivery entries.

💡 Learning & Challenges
Building this project allowed me to dive deep into Security Architecture, Database Synchronization, and Edge Case Handling (such as preventing duplicate deliveries and ensuring cache invalidation). It has been a significant learning milestone in my journey toward becoming a full-stack developer.
