import React, { useEffect, useState } from 'react';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import { dictionary } from '@zxcvbn-ts/language-common';
import { translations } from '@zxcvbn-ts/language-en';

// Initialize zxcvbn options
zxcvbnOptions.setOptions({
  translations,
  graphs: dictionary.graphs,
  dictionary: {
    ...dictionary.dictionary,
  },
});

const PasswordStrengthMeter = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setStrength(result.score); // 0-4
      setFeedback(result.feedback.warning || result.feedback.suggestions[0] || '');
    } else {
      setStrength(0);
      setFeedback('');
    }
  }, [password]);

  const getColor = () => {
    switch (strength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getLabel = () => {
    switch (strength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className={`h-full rounded-full transition-all ${getColor()}`}
          style={{ width: `${(strength + 1) * 20}%` }}
        />
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{getLabel()}</span>
        {feedback && <span className="text-gray-500">{feedback}</span>}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
