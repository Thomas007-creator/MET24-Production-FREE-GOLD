import React from 'react';
import { Shield } from 'lucide-react';

export const OnboardingAccountSecuritySecurityNote: React.FC = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-6">
      <div className="flex items-start gap-3">
        <Shield className="text-blue-400 mt-0.5 flex-shrink-0" size={20} />
        <div className="text-sm text-white/70 space-y-2">
          <p className="font-medium text-white/90">Veiligheid eerst</p>
          <p>
            Je wachtwoord wordt versleuteld opgeslagen en we gebruiken moderne beveiligingsmaatregelen
            om je account te beschermen. We delen nooit je gegevens met derden zonder je toestemming.
          </p>
          <p>
            Gebruik een sterk wachtwoord met minimaal 8 karakters, hoofdletters, kleine letters,
            cijfers en speciale karakters voor optimale bescherming.
          </p>
        </div>
      </div>
    </div>
  );
};