// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UploadPage from "./pages/UploadPage";
import MarketplacePage from "./pages/MarketplacePage";
import MyImagesPage from "./pages/MyImagePage";
import PaymentPage from "./pages/PaymentPage"; // --- IMPORT NEW PAGE ---
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />

            {/* Protected Routes */}
            <Route
              path="/upload"
              element={
                <PrivateRoute>
                  <UploadPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-images"
              element={
                <PrivateRoute>
                  <MyImagesPage />
                </PrivateRoute>
              }
            />
            {/* --- NEW ROUTE FOR PAYMENT --- */}
            <Route
              path="/payment/:imageId"
              element={
                <PrivateRoute>
                  <PaymentPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
export default App;
