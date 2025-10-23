import React from 'react';

interface BackToBasicsDemoProps {
  onBackToMain: () => void;
}

const BackToBasicsDemo: React.FC<BackToBasicsDemoProps> = ({
  onBackToMain,
}) => {
  return (
    <div
      style={{
        padding: '20px',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
          Back to Basics Demo
        </h1>
        <button
          onClick={onBackToMain}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Terug
        </button>
      </div>

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>
          Welkom bij Back to Basics
        </h2>
        <p
          style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '15px' }}
        >
          Deze demo toont de basis functionaliteit van de Back to Basics module.
          Hier kun je de verschillende levensgebieden verkennen en praktische
          tips vinden.
        </p>
        <p style={{ fontSize: '14px', opacity: '0.8' }}>
          Swipe naar links of rechts om door de verschillende gebieden te
          navigeren.
        </p>
      </div>

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px',
        }}
      >
        <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>
          Beschikbare Functies:
        </h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '8px 0', fontSize: '14px' }}>
            • Verken 9 levensgebieden
          </li>
          <li style={{ padding: '8px 0', fontSize: '14px' }}>
            • Praktische tips per gebied
          </li>
          <li style={{ padding: '8px 0', fontSize: '14px' }}>
            • Persoonlijke voortgang tracking
          </li>
          <li style={{ padding: '8px 0', fontSize: '14px' }}>
            • Interactieve navigatie
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BackToBasicsDemo;
