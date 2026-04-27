import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/src/context/UserContext';
import Button from '@/src/components/atoms/Button';
import { motion } from 'motion/react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { updateName, updateCharacter, profile } = useUser();
  const [nameInput, setNameInput] = useState(profile.name);
  const [selectedChar, setSelectedChar] = useState(profile.character);

  const handleContinue = () => {
    if (nameInput && selectedChar) {
      updateName(nameInput);
      updateCharacter(selectedChar);
      navigate('/home');
    }
  };

  return (
    <div className="p-8 flex flex-col items-center min-h-screen bg-bg-pink">
      <h1 className="text-3xl font-bold text-accent-pink mt-12 mb-12">Pilih Karakter</h1>

      <div className="flex gap-6 mb-12">
        {/* Boy Option */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedChar('boy')}
          className={`relative w-40 rounded-3xl overflow-hidden border-2 transition-all cursor-pointer ${
            selectedChar === 'boy' ? 'border-primary-pink scale-105 shadow-lg' : 'border-transparent opacity-80'
          }`}
        >
          <div className="bg-character-blue h-32 flex items-center justify-center pt-4">
             <span className="text-7xl">👦</span>
          </div>
          <div className="bg-white py-3 text-center font-bold text-gray-700">Laki - Laki</div>
        </motion.div>

        {/* Girl Option */}
        <motion.div
           whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedChar('girl')}
          className={`relative w-40 rounded-3xl overflow-hidden border-2 transition-all cursor-pointer ${
            selectedChar === 'girl' ? 'border-primary-pink scale-105 shadow-lg' : 'border-transparent opacity-80'
          }`}
        >
          <div className="bg-character-pink h-32 flex items-center justify-center pt-4">
             <span className="text-7xl">👧</span>
          </div>
          <div className="bg-white py-3 text-center font-bold text-gray-700">Perempuan</div>
        </motion.div>
      </div>

      <div className="w-full space-y-4">
        <h2 className="text-center text-accent-pink font-bold text-lg">Masukkan Nama</h2>
        <input
          type="text"
          placeholder="Nama Kamu.."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="w-full px-6 py-4 rounded-full border-2 border-primary-pink bg-white outline-none focus:ring-2 ring-primary-pink/20 transition-all text-center text-lg font-medium"
        />
      </div>

      <div className="mt-auto w-full pb-8">
        <Button 
          disabled={!nameInput || !selectedChar}
          onClick={handleContinue}
        >
          LANJUTKAN
        </Button>
      </div>
    </div>
  );
}
