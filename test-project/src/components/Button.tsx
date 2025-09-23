import React, { useState, useEffect } from 'react';

// Пример компонента с различными проблемами качества кода
const Button = ({ onClick, children, disabled = false, variant = 'primary' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);

  // Проблема: useEffect без зависимостей
  useEffect(() => {
    console.log('Button mounted');
    
    // Потенциальная утечка памяти - нет cleanup
    const interval = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    
    // Отсутствует return для cleanup
  }, []);

  // Проблема: слишком сложная функция
  const handleClick = async (event) => {
    if (disabled) return;
    
    setIsLoading(true);
    
    try {
      if (onClick) {
        // Проблема: нет обработки ошибок
        await onClick(event);
      }
      
      // Магическое число
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      // Проблема: плохое сообщение об ошибке
      console.error('Error');
      setIsLoading(false);
    }
  };

  // Проблема: inline стили вместо CSS классов
  const buttonStyle = {
    padding: variant === 'primary' ? '12px 24px' : '8px 16px',
    backgroundColor: variant === 'primary' ? '#007bff' : '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    fontSize: variant === 'large' ? '18px' : '14px'
  };

  return (
    <button 
      style={buttonStyle}
      onClick={handleClick}
      disabled={disabled || isLoading}
      // Проблема: отсутствует aria-label для accessibility
    >
      {isLoading ? 'Loading...' : children}
      {/* Проблема: счетчик без смысла */}
      <span style={{ marginLeft: '10px' }}>({count})</span>
    </button>
  );
};

export default Button;
