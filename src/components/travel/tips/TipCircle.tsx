
import React from "react";
import { TipCircleProps } from "./types";

const TipCircle: React.FC<TipCircleProps> = ({ isActive = false, image, onClick, category }) => {
  const healthImage = "/uploads/7b86a3b2-caf9-430a-b0ff-cfeb58b8a665.png";
  const displayImage = category?.toLowerCase() === "health" ? healthImage : image;

  return (
    <div 
      className={`w-[95px] h-[95px] sm:w-[101px] sm:h-[101px] rounded-full flex items-center justify-center cursor-pointer flex-shrink-0 transition-all duration-300
        ${isActive 
          ? 'bg-[#E2EDFF] border-2 border-[#7BABFF] shadow-md' 
          : 'bg-[#F8F8F8] border border-[#E0E0E0] hover:bg-[#F3F7FF]'}`}
      onClick={onClick}
    >
      {displayImage && (
        <img 
          src={displayImage} 
          alt="Category icon" 
          className={`w-[76px] h-[76px] sm:w-[85px] sm:h-[85px] object-contain mx-auto transition-all duration-300
            ${isActive 
              ? 'opacity-100' 
              : 'opacity-80 filter-none'}`}
        />
      )}
    </div>
  );
};

export default TipCircle;

