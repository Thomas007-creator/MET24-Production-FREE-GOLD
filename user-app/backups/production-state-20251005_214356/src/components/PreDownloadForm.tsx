import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem } from '@nextui-org/react';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import { appDownloadService } from '../services/appDownloadService';

interface PreDownloadFormProps {
  onSuccess?: (userData: { email: string; name: string; mbtiType: string }) => void;
  onError?: (error: string) => void;
}

const MBTI_TYPES = [
  { value: 'INTJ', label: 'INTJ - De Architect' },
  { value: 'INTP', label: 'INTP - De Denker' },
  { value: 'ENTJ', label: 'ENTJ - De Commandant' },
  { value: 'ENTP', label: 'ENTP - De Debater' },
  { value: 'INFJ', label: 'INFJ - De Advocaat' },
  { value: 'INFP', label: 'INFP - De Mediator' },
  { value: 'ENFJ', label: 'ENFJ - De Protagonist' },
  { value: 'ENFP', label: 'ENFP - De Kampioen' },
  { value: 'ISTJ', label: 'ISTJ - De Logistiek Specialist' },
  { value: 'ISFJ', label: 'ISFJ - De Verdediger' },
  { value: 'ESTJ', label: 'ESTJ - De Uitvoerder' },
  { value: 'ESFJ', label: 'ESFJ - De Consul' },
  { value: 'ISTP', label: 'ISTP - De Virtuoos' },
  { value: 'ISFP', label: 'ISFP - De Avonturier' },
  { value: 'ESTP', label: 'ESTP - De Ondernemer' },
  { value: 'ESFP', label: 'ESFP - De Entertainer' },
];

const PreDownloadForm: React.FC<PreDownloadFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mbtiType: '',
  });
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Naam is verplicht';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is verplicht';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ongeldig email adres';
    }

    if (!formData.mbtiType) {
      newErrors.mbtiType = 'MBTI type is verplicht';
    }

    if (!consent) {
      newErrors.consent = 'Je moet akkoord gaan met de privacy voorwaarden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      logger.info('🚀 Submitting pre-download form', { 
        email: formData.email, 
        name: formData.name, 
        mbtiType: formData.mbtiType 
      });

      // Call Supabase function to create pre-download user
      const { data, error } = await supabase.rpc('create_pre_download_user', {
        p_email: formData.email,
        p_name: formData.name,
        p_mbti_type: formData.mbtiType,
        p_consent_given: consent
      });

      if (error) {
        logger.error('❌ Error creating pre-download user:', { error });
        throw new Error(error.message);
      }

      logger.info('✅ Pre-download user created successfully', { userId: data });

      // Start app download
      try {
        const downloadSuccess = await appDownloadService.startDownload({
          email: formData.email,
          name: formData.name,
          mbtiType: formData.mbtiType,
          source: 'hubspot_form'
        });

        if (downloadSuccess) {
          // Call success callback
          if (onSuccess) {
            onSuccess({
              email: formData.email,
              name: formData.name,
              mbtiType: formData.mbtiType
            });
          }

          // Show success message
          alert('Bedankt! Je gegevens zijn opgeslagen en de app wordt gedownload.');
        } else {
          throw new Error('Download kon niet worden gestart');
        }
      } catch (downloadError) {
        logger.error('❌ Download failed:', { downloadError });
        // Show fallback message
        alert('Bedankt! Je gegevens zijn opgeslagen. Je kunt de app handmatig downloaden.');
      }

    } catch (error) {
      logger.error('❌ Form submission error:', { error });
      const errorMessage = error instanceof Error ? error.message : 'Er is een fout opgetreden';
      
      if (onError) {
        onError(errorMessage);
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20">
        <CardHeader className="text-center">
          <div className="w-full">
            <h1 className="text-2xl font-bold text-white mb-2">
              🚀 Download Your Future Self App
            </h1>
            <p className="text-gray-300 text-sm">
              Vul je gegevens in om de app te downloaden
            </p>
          </div>
        </CardHeader>
        
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <Input
                label="Naam"
                placeholder="Je volledige naam"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                isInvalid={!!errors.name}
                errorMessage={errors.name}
                className="text-white"
                classNames={{
                  input: "text-white",
                  label: "text-gray-300"
                }}
              />
            </div>

            {/* Email Input */}
            <div>
              <Input
                label="Email adres"
                placeholder="je@email.com"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
                className="text-white"
                classNames={{
                  input: "text-white",
                  label: "text-gray-300"
                }}
              />
            </div>

            {/* MBTI Type Select */}
            <div>
              <Select
                label="MBTI Type"
                placeholder="Selecteer je MBTI type"
                selectedKeys={formData.mbtiType ? [formData.mbtiType] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  handleInputChange('mbtiType', selected);
                }}
                isInvalid={!!errors.mbtiType}
                errorMessage={errors.mbtiType}
                className="text-white"
                classNames={{
                  trigger: "bg-white/10 border-white/20",
                  label: "text-gray-300"
                }}
              >
                {MBTI_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-white">
                    {type.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Consent Checkbox */}
            <div className="space-y-2">
              <label className="flex items-start gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (errors.consent) {
                      setErrors(prev => ({ ...prev, consent: '' }));
                    }
                  }}
                  className="mt-1"
                />
                <span>
                  Ik ga akkoord met de{' '}
                  <a href="/privacy" className="text-blue-400 hover:underline">
                    privacy voorwaarden
                  </a>{' '}
                  en geef toestemming voor het opslaan van mijn naam, email en MBTI type 
                  voor personalisatie van de app.
                </span>
              </label>
              {errors.consent && (
                <p className="text-red-400 text-xs">{errors.consent}</p>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-200 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={isLoading}
              disabled={!consent}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold"
            >
              {isLoading ? 'Bezig met opslaan...' : '📱 Download App'}
            </Button>
          </form>

          {/* Privacy Notice */}
          <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-200 text-xs">
              <strong>🔒 Privacy:</strong> Alleen je naam, email en MBTI type worden 
              niet-geanonimiseerd opgeslagen. Alle andere gegevens worden geanonimiseerd 
              voor optimale privacy bescherming.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PreDownloadForm;
