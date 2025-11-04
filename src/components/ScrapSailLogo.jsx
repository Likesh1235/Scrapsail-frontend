import React from 'react';

const ScrapSailLogo = ({ size = 'medium', showText = true, logoPath = '/logo512.png' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'w-8 h-8',
          logoCircle: 'w-8 h-8',
          text: 'text-sm',
          tagline: 'text-xs'
        };
      case 'large':
        return {
          container: 'w-16 h-16',
          logoCircle: 'w-16 h-16',
          text: 'text-3xl',
          tagline: 'text-base'
        };
      default: // medium
        return {
          container: 'w-12 h-12',
          logoCircle: 'w-12 h-12',
          text: 'text-xl',
          tagline: 'text-xs'
        };
    }
  };

  const sizes = getSizeClasses();

  return (
    <div className="flex items-center space-x-3">
      {/* Circular Logo Container with Recycling Icon - 3D Enhanced */}
      <div 
        className={`${sizes.logoCircle} relative flex items-center justify-center rounded-full overflow-hidden transform transition-all duration-300 hover:scale-110 hover:rotate-12`}
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
          boxShadow: `
            0 0 0 2px rgba(255, 255, 255, 0.3),
            0 0 0 4px rgba(16, 185, 129, 0.2),
            0 8px 16px rgba(0, 0, 0, 0.3),
            0 4px 8px rgba(16, 185, 129, 0.4),
            inset 0 -2px 4px rgba(0, 0, 0, 0.2),
            inset 0 2px 4px rgba(255, 255, 255, 0.3)
          `,
          filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.5))'
        }}
      >
        {/* Inner highlight for 3D effect */}
        <div 
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6), transparent 70%)'
          }}
        />
        {/* Recycling Icon */}
        <span 
          className="relative z-10 text-white font-bold drop-shadow-lg"
          style={{ 
            fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '2rem' : '1.25rem',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5), 0 0 8px rgba(255, 255, 255, 0.3)'
          }}
        >
          ♻️
        </span>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${sizes.text} font-bold bg-gradient-to-r from-green-400 via-emerald-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent drop-shadow-lg`} style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}>
            ScrapSail
          </h1>
          {size === 'large' && (
            <p className={`${sizes.tagline} text-green-300 font-medium`}>
              Scrap out, sail on!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScrapSailLogo;
