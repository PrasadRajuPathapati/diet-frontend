import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://diet-backend-nnb5.onrender.com/api';

export default function ProfileSetupPage({ user, onLogin }) {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [initialWeight, setInitialWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [age, setAge] = useState('');
  const [conditions, setConditions] = useState('');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setName(user.name || '');
      setInitialWeight(user.initialWeight || '');
      setTargetWeight(user.targetWeight || '');
      setAge(user.age || '');
      setConditions(user.conditions || '');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !initialWeight || !targetWeight || !age || !conditions.trim()) {
      setMessage('⚠️ Please fill all the fields.');
      return;
    }

    if (!user?.id) {
      setMessage('❌ Error: User ID not available. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const payload = {
        userId: user.id,
        name: name.trim(),
        age: Number(age),
        initialWeight: Number(initialWeight),
        targetWeight: Number(targetWeight),
        conditions: conditions.trim(),
      };
      // ✅ NEW DEBUG LOG: What is the payload being sent?
      console.log('[ProfileSetupPage] Sending payload to backend:', payload);

      const res = await axios.post(`${API_BASE_URL}/profile-setup`, payload);

      // ✅ NEW DEBUG LOG: What is the response from the backend?
      console.log('[ProfileSetupPage] Backend response on save:', res.data);

      if (res.status === 200) {
        setMessage('✅ Profile saved successfully! Redirecting to dashboard...');
        setRedirecting(true);

        onLogin(res.data.user, localStorage.getItem('currentUser') !== null);

        setTimeout(() => {
          navigate('/home');
        }, 2000);

      } else {
        setMessage(`❌ Error: ${res.data?.message || 'Unknown server issue.'}`);
      }
    } catch (err) {
      console.error('Profile save error:', err);
      setMessage(`❌ Failed to save profile. ${err.response?.data?.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-green-200 flex items-center justify-center px-4 animate-bg-gradient">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8 transition-all duration-300 animate-fade-slide-in">
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">Complete Your Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="number"
            placeholder="Initial Weight (kg)"
            value={initialWeight}
            onChange={(e) => setInitialWeight(e.target.value)}
            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="number"
            placeholder="Target Weight (kg)"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <textarea
            placeholder="Any medical conditions? (e.g., Diabetes, Hypertension, None)"
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 min-h-[80px] resize-y"
            required
          ></textarea>

          <button
            type="submit"
            disabled={loading || redirecting}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></span>
                Saving...
              </>
            ) : 'Save Profile'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-semibold ${
              message.startsWith('✅')
                ? 'text-green-600'
                : message.startsWith('⚠️')
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}

        {redirecting && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}