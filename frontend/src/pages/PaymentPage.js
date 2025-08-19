// frontend/src/pages/PaymentPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const PaymentPage = () => {
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { imageId } = useParams();
  const location = useLocation();
  const { image } = location.state || {}; // Get image data passed from previous page

  useEffect(() => {
    if (!image) {
      // If the user navigates directly to this page, redirect them
      navigate("/marketplace");
    }
  }, [image, navigate]);

  const validateForm = () => {
    // Card Number: Should be 16 digits
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
      setError("Card number must be 16 digits.");
      return false;
    }
    // Expiry Date: Should be in MM/YY format and not in the past
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      setError("Expiry date must be in MM/YY format.");
      return false;
    }
    const [month, year] = expiryDate.split("/");
    const expiry = new Date(`20${year}`, month - 1);
    const now = new Date();
    now.setMonth(now.getMonth() - 1); // Allow current month
    if (expiry < now) {
      setError("Card has expired.");
      return false;
    }
    // CVV: Should be 3 or 4 digits
    if (!/^\d{3,4}$/.test(cvv)) {
      setError("CVV must be 3 or 4 digits.");
      return false;
    }
    if (!cardholderName.trim()) {
      setError("Cardholder name cannot be empty.");
      return false;
    }
    setError("");
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`/api/marketplace/${imageId}/buy`, {}, config);
      alert(
        "Mock payment successful! The image has been added to your collection."
      );
      navigate("/my-images");
    } catch (err) {
      setError(err.response?.data?.message || "Purchase failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!image) return null; // Render nothing if redirected

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl dark:bg-gray-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Complete Your Purchase
          </h2>
          <div className="mt-4 p-4 border rounded-lg dark:border-gray-700">
            <img
              src={image.imageUrl}
              alt={image.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                {image.title}
              </p>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                ${image.price}
              </p>
            </div>
          </div>
        </div>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="cardholderName"
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Cardholder Name"
              />
            </div>
            <div>
              <input
                name="cardNumber"
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Card Number (16 digits)"
              />
            </div>
            <div className="flex">
              <input
                name="expiryDate"
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-bl-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="MM/YY"
              />
              <input
                name="cvv"
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-br-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="CVV"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? <Spinner small /> : `Pay $${image.price}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
