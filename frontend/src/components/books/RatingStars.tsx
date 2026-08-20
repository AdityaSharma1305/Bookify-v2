import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  size = 16,
  interactive = false,
  onRatingChange,
}) => {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: max }, (_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= Math.round(rating);

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(starNumber)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? 'fill-[#E85D26] text-[#E85D26]'
                  : 'fill-transparent text-gray-300'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};
