import { useState, useEffect } from 'react';
import { PawPrint } from 'lucide-react';
import type { Pet } from '../lib/api/pets';

interface PetImageSliderProps {
  pet: Pet;
}

export default function PetImageSlider({ pet }: PetImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extract all valid image URLs
  const allImages = [
    pet.imagem_principal_url,
    ...(pet.pet_imagens?.filter(img => img.ordem !== 0).sort((a, b) => a.ordem - b.ordem).map(img => img.url) || [])
  ].filter((url, index, self) => url && self.indexOf(url) === index) as string[];

  useEffect(() => {
    if (allImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [allImages.length]);

  if (allImages.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <PawPrint className="w-12 h-12 text-gray-300" />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {allImages.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`${pet.nome} foto ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            idx === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}
