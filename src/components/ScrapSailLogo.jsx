import React from 'react';

const ScrapSailLogo = ({ size = 'medium', showText = true }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'w-8 h-8',
          image: 'w-8 h-8',
          text: 'text-lg',
          tagline: 'text-xs'
        };
      case 'large':
        return {
          container: 'w-16 h-16',
          image: 'w-16 h-16',
          text: 'text-4xl',
          tagline: 'text-sm'
        };
      default: // medium
        return {
          container: 'w-12 h-12',
          image: 'w-12 h-12',
          text: 'text-2xl',
          tagline: 'text-xs'
        };
    }
  };

  const sizes = getSizeClasses();

  return (
    <div className="flex items-center space-x-3">
      {/* Logo Image */}
      <div className={`${sizes.container} relative`}>
        <img 
          src="/logo.svg" 
          alt="ScrapSail Logo" 
          className={`${sizes.image} object-contain`}
          onError={(e) => {
            // Fallback to text-based logo if image not found
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback text logo */}
        <div className={`${sizes.image} hidden items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg`}>
          <span className="text-white font-bold text-xs">SS</span>
        </div>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${sizes.text} font-bold`}>
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Scrap
            </span>
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              Sail
            </span>
          </h1>
          {size === 'large' && (
            <p className={`${sizes.tagline} bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent font-medium`}>
              Scrap out, sail on!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScrapSailLogo;
