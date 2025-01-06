import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./style.css";

// Modal.setAppElement("#root");

function App() {
  const [greeting, setGreeting] = useState("");
  const [isGreetingOpen, setIsGreetingOpen] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning!");
    else if (hour >= 12 && hour < 16) setGreeting("Good Afternoon!");
    else if (hour >= 16 && hour < 21) setGreeting("Good Evening!");
    else setGreeting("Good Night!");

    const savedFeedback = JSON.parse(localStorage.getItem("feedbackList")) || [];
    setFeedbackList(savedFeedback);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format.";
    if (!formData.message) newErrors.message = "Message is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      const newFeedback = { ...formData };
      const updatedFeedbackList = [...feedbackList, newFeedback];
      setFeedbackList(updatedFeedbackList);
      localStorage.setItem("feedbackList", JSON.stringify(updatedFeedbackList));
      setIsThankYouOpen(true);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="App">
      <Modal
        isOpen={isGreetingOpen}
        onRequestClose={() => setIsGreetingOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{greeting}</h2>
        <button onClick={() => setIsGreetingOpen(false)}>Close</button>
      </Modal>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <h1>Feedback Form</h1>

        <div className="form-group">
          <label For="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className={errors.message ? "error" : ""}
          ></textarea>
          {errors.message && <span className="error-text">{errors.message}</span>}
        </div>

        <button type="submit">Submit</button>
      </form>

      <div className="feedback-list">
        <h2>Submitted Feedback</h2>
        {feedbackList.length === 0 ? (
          <p>No feedback submitted yet.</p>
        ) : (
          <ul>
            {feedbackList.map((feedback, index) => (
              <li key={index}>
                <strong>{feedback.name}</strong> ({feedback.email}): {feedback.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        isOpen={isThankYouOpen}
        onRequestClose={() => setIsThankYouOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Thank you for your feedback, {formData.name || "User"}!</h2>
        <button onClick={() => setIsThankYouOpen(false)}>Close</button>
      </Modal>
    </div>
  );
}

export default App;
