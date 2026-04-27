import { createContext, useContext, useState, ReactNode } from 'react';

export type CharacterType = 'boy' | 'girl' | null;

interface UserProfile {
  name: string;
  character: CharacterType;
  level: number;
  exp: number;
  energy: number;
  completedStories: number;
  achievements: string[];
}

interface UserContextType {
  profile: UserProfile;
  updateName: (name: string) => void;
  updateCharacter: (char: CharacterType) => void;
  updateEnergy: (diff: number) => void;
  addExp: (amount: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    character: null,
    level: 1,
    exp: 60,
    energy: 100,
    completedStories: 1,
    achievements: ['Rajin Posyandu', 'Minum Air Putih', 'Sarapan Sehat'],
  });

  const updateName = (name: string) => setProfile(prev => ({ ...prev, name }));
  const updateCharacter = (character: CharacterType) => setProfile(prev => ({ ...prev, character }));
  const updateEnergy = (diff: number) => setProfile(prev => ({ ...prev, energy: Math.max(0, Math.min(100, prev.energy + diff)) }));
  const addExp = (amount: number) => {
    setProfile(prev => {
      const newExp = prev.exp + amount;
      if (newExp >= 100) {
        return { ...prev, level: prev.level + 1, exp: newExp - 100 };
      }
      return { ...prev, exp: newExp };
    });
  };

  return (
    <UserContext.Provider value={{ profile, updateName, updateCharacter, updateEnergy, addExp }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
