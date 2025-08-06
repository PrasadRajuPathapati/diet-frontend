import React from 'react';
import { a, useSpring } from '@react-spring/web';

const HeroSection = ({ userName, latestWeight, dietPlanStatusMessage }) => {
  const welcomeProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 200,
  });

  const statsProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 500,
  });

  return (
    <a.div
      style={welcomeProps}
      className="bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/30 text-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-2">Welcome, {userName}! 🌱</h2>
      <p className="text-lg md:text-xl text-gray-700">Let’s keep crushing your goals today!</p>
      
      <a.div style={statsProps} className="mt-6 space-y-2 text-sm md:text-base text-gray-800">
        <p><strong>Latest Weight:</strong> {latestWeight}</p>
        <p><strong>Diet Status:</strong> {dietPlanStatusMessage}</p>
        <p>Other Goals: *Coming soon!*</p>
      </a.div>
    </a.div>
  );
};

export default HeroSection;