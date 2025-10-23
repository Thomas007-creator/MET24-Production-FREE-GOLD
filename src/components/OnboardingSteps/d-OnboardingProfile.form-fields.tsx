import React from 'react';
import { Input } from '@nextui-org/react';
import { useOnboardingProfile } from './d-OnboardingProfile.provider';

export const OnboardingProfileFormFields: React.FC = () => {
  const { name, dob, errors, setName, setDob } = useOnboardingProfile();

  return (
    <div className="bg-yellow-800/80 backdrop-blur-xl border border-yellow-800/60 rounded-xl p-6 mb-8">
      {/* First Name Field */}
      <div className="mb-6">
        <label
          htmlFor="name"
          className="block text-left text-sm font-medium mb-2"
        >
          Naam *
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Jouw naam"
          className={`w-full ${
            errors.name
              ? 'border-red-400 focus:border-red-400'
              : 'border-white/30 focus:border-white/50'
          }`}
          classNames={{
            input: 'text-white placeholder:text-white/60',
            inputWrapper:
              'bg-white/10 backdrop-blur-xl border-white/30 focus-within:border-white/50',
          }}
        />
        {errors.name && (
          <p className="text-red-300 text-xs mt-2 text-left">
            {errors.name}
          </p>
        )}
      </div>

      {/* Date of Birth Field */}
      <div className="mb-6">
        <label
          htmlFor="dob"
          className="block text-left text-sm font-medium mb-2"
        >
          Geboortedatum
        </label>
        <Input
          id="dob"
          type="date"
          value={dob}
          onChange={e => setDob(e.target.value)}
          className={`w-full ${
            errors.age
              ? 'border-red-400 focus:border-red-400'
              : 'border-white/30 focus:border-white/50'
          }`}
          classNames={{
            input: 'text-white',
            inputWrapper:
              'bg-white/10 backdrop-blur-xl border-white/30 focus-within:border-white/50',
          }}
        />
        {errors.age && (
          <p className="text-red-300 text-xs mt-2 text-left">
            {errors.age}
          </p>
        )}
        <p className="text-xs text-white/70 mt-2 text-left leading-relaxed">
          Je geboortedatum blijft privé en helpt ons adviezen voor jouw
          levensfase te geven.
        </p>
      </div>
    </div>
  );
};