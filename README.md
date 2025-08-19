<p align="center">
  <a href='https://postimg.cc/dDGC59s7' target='_blank'><img src='https://i.postimg.cc/dDGC59s7/temp-Image-FGa-ZGJ.avif' border='0' alt='temp-Image-FGa-ZGJ'/></a>
</p>

<h1 align="center">Pixsort - AI-Powered Image Marketplace</h1>

<p align="center">
  <strong>Upload your images, have them automatically categorized by a powerful AI, and sell them on a vibrant, modern marketplace.</strong>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</p>

## 📋 Table of Contents

- [🌟 Key Features](#-key-features)
- [📸 Screenshots](#-screenshots)
- [💻 Tech Stack](#-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [📜 License](#-license)

---

## 🌟 Key Features

Pixsort is a full-stack application built with a modern microservices architecture. It combines a user-friendly React frontend with a robust Node.js backend and a sophisticated Python AI service for image analysis.

-   **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT).
-   **AI Image Classification**: Uploaded images are automatically analyzed by a Python microservice using **YOLOv8** and **ResNet** models to generate detailed and general category tags.
-   **Cloud Image Storage**: All images are securely hosted on **Cloudinary** for fast and reliable delivery.
-   **Dynamic Marketplace**: Users can list their uploaded images for sale and purchase images from other users.
-   **Personalized Collections**: View your own uploaded and purchased images in a private gallery.
-   **Responsive UI with Dark/Light Mode**: A sleek and modern interface built with Tailwind CSS that looks great on all devices and includes a theme toggle.
-   **Animated Statistics**: The homepage features animated counters showcasing the platform's usage statistics, which are fetched live from the database.

---

## 📸 Screenshots


| Light Mode | Dark Mode |
| :---: | :---: |
| <a href='https://postimg.cc/CR4mBTDx' target='_blank'><img src='https://i.postimg.cc/CR4mBTDx/temp-Image44-B6-IW.avif' border='0' alt='temp-Image44-B6-IW'/></a> | <a href='https://postimg.cc/jWLPsG49' target='_blank'><img src='https://i.postimg.cc/jWLPsG49/temp-Imaget-Z2s-BN.avif' border='0' alt='temp-Imaget-Z2s-BN'/></a> |

---

## 💻 Tech Stack

This project is divided into three main parts, each with its own technology stack:

| **Component** | **Technology** |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 🖥️ **Frontend** | React, React Router, Tailwind CSS, Axios, Heroicons                                                                                         |
| ⚙️ **Backend (API)** | Node.js, Express, MongoDB (with Mongoose), JWT for authentication, Cloudinary for image hosting, Multer for file handling                     |
| 🧠 **AI Service** | Python, Django (with Django REST Framework), PyTorch, OpenCV, Ultralytics (for YOLOv8), NLTK (for WordNet categorization)                      |

---

## 🏗️ Architecture

Pixsort is built using a microservices-oriented architecture to separate concerns and improve scalability:

1.  **React Frontend**: A modern Single Page Application (SPA) that provides the user interface. It communicates with the backend via a REST API.
2.  **Node.js Backend**: The core API server that handles user data, image metadata, marketplace transactions, and authentication. When an image is uploaded, it forwards the file to the AI Service for analysis.
3.  **Python AI Service**: A dedicated Django server that exposes a single endpoint for image classification. It receives an image, processes it through computer vision models, and returns a set of descriptive categories.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   **Node.js** and **npm**
-   **Python** and **pip**
-   A **MongoDB** account (you can use a free cluster from MongoDB Atlas)
-   A **Cloudinary** account (for image storage)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/pixsort.git](https://github.com/your-username/pixsort.git)
    cd pixsort
    ```

2.  **Backend Setup:**
    -   Navigate to the backend directory: `cd backend`
    -   Install dependencies: `npm install`
    -   Create a `.env` file and add the following environment variables:
        ```env
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        PYTHON_API_URL=[http://127.0.0.1:8000/api/classify/](http://127.0.0.1:8000/api/classify/)
        ```
    -   Start the backend server: `npm run server`

3.  **AI Service Setup:**
    -   Navigate to the marketplace service directory: `cd ../marketplace_service`
    -   Install Python dependencies: `pip install -r requirements.txt`
    -   Start the Django server: `python manage.py runserver`

4.  **Frontend Setup:**
    -   Navigate to the frontend directory: `cd ../frontend`
    -   Install dependencies: `npm install`
    -   Start the React development server: `npm start`

Your application should now be running, with the frontend available at `http://localhost:3000`!

---

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

