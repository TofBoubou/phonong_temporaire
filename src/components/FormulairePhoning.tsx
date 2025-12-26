'use client';

import { useState } from 'react';
import { PhoningFormData } from '@/types/phoning';
import Confirmation from './Confirmation';

const initialFormData: PhoningFormData = {
  prenom: '',
  nom: '',
  mobile: '',
  email: '',
  ville: '',
  code_postal: '',
  disponibilite: '',
  experience: '',
};

export default function FormulairePhoning() {
  const [formData, setFormData] = useState<PhoningFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateFormData = (updates: Partial<PhoningFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setValidationError(null);
  };

  const scrollToField = (fieldId: string) => {
    const element = document.getElementById(fieldId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
    }
  };

  const validateForm = (): { valid: boolean; fieldId?: string; message?: string } => {
    if (!formData.prenom.trim()) {
      return { valid: false, fieldId: 'field-prenom', message: 'Le prenom est obligatoire' };
    }
    if (!formData.nom.trim()) {
      return { valid: false, fieldId: 'field-nom', message: 'Le nom est obligatoire' };
    }
    if (!formData.mobile.trim()) {
      return { valid: false, fieldId: 'field-mobile', message: 'Le numero de mobile est obligatoire' };
    }
    if (!formData.email.trim()) {
      return { valid: false, fieldId: 'field-email', message: 'L\'email est obligatoire' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return { valid: false, fieldId: 'field-email', message: 'L\'email n\'est pas valide' };
    }
    if (!formData.ville.trim()) {
      return { valid: false, fieldId: 'field-ville', message: 'La ville est obligatoire' };
    }
    if (!formData.code_postal.trim()) {
      return { valid: false, fieldId: 'field-code_postal', message: 'Le code postal est obligatoire' };
    }
    if (!formData.disponibilite) {
      return { valid: false, fieldId: 'field-disponibilite', message: 'Veuillez indiquer votre disponibilite' };
    }
    if (!formData.experience) {
      return { valid: false, fieldId: 'field-experience', message: 'Veuillez indiquer votre experience' };
    }
    return { valid: true };
  };

  const handleSubmit = async () => {
    const validation = validateForm();
    if (!validation.valid) {
      setValidationError(validation.message || 'Veuillez remplir tous les champs obligatoires');
      if (validation.fieldId) {
        scrollToField(validation.fieldId);
      }
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la soumission');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return <Confirmation prenom={formData.prenom} />;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0D1B4C] mb-2">
            <span className="text-[#0D1B4C]">Reconquete </span>
            <span className="text-[#E30613]">Paris 2026</span>
          </h1>
          <p className="text-gray-600 text-lg font-medium">Je phone</p>
        </div>

        {/* Intro */}
        <div className="card mb-6">
          <p className="text-gray-700 mb-4">
            Meme si vous n&apos;habitez pas a Paris, aidez-nous a convaincre la capitale !
          </p>
          <h2 className="text-xl font-bold text-[#0D1B4C] mb-4">
            Rejoignez notre armee de phoners ! 30 minutes depuis chez vous suffisent pour faire la difference.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="feature-card">
              <span className="feature-icon">&#127968;</span>
              <div>
                <p className="font-semibold text-[#0D1B4C]">Depuis chez vous</p>
                <p className="text-sm text-gray-600">Pas besoin de vous deplacer, phonez ou que vous soyez en France</p>
              </div>
            </div>
            <div className="feature-card">
              <span className="feature-icon">&#9201;</span>
              <div>
                <p className="font-semibold text-[#0D1B4C]">30 min suffisent</p>
                <p className="text-sm text-gray-600">Donnez le temps que vous pouvez, chaque appel compte</p>
              </div>
            </div>
            <div className="feature-card">
              <span className="feature-icon">&#127891;</span>
              <div>
                <p className="font-semibold text-[#0D1B4C]">Vous serez forme</p>
                <p className="text-sm text-gray-600">On vous accompagne avec des scripts et des arguments</p>
              </div>
            </div>
            <div className="feature-card">
              <span className="feature-icon">&#129309;</span>
              <div>
                <p className="font-semibold text-[#0D1B4C]">Rejoignez un collectif</p>
                <p className="text-sm text-gray-600">Faites partie de l&apos;armee des phoners pour Paris</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="card">
          {/* Erreur de validation */}
          {validationError && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-sm">
              {validationError}
            </div>
          )}

          <div className="space-y-6">
            {/* Prenom & Nom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prenom *
                </label>
                <input
                  id="field-prenom"
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => updateFormData({ prenom: e.target.value })}
                  placeholder="Votre prenom"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  id="field-nom"
                  type="text"
                  value={formData.nom}
                  onChange={(e) => updateFormData({ nom: e.target.value })}
                  placeholder="Votre nom"
                  required
                />
              </div>
            </div>

            {/* Mobile & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile *
                </label>
                <input
                  id="field-mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => updateFormData({ mobile: e.target.value })}
                  placeholder="06 12 34 56 78"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  id="field-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            {/* Ville & Code postal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville *
                </label>
                <input
                  id="field-ville"
                  type="text"
                  value={formData.ville}
                  onChange={(e) => updateFormData({ ville: e.target.value })}
                  placeholder="Votre ville"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal *
                </label>
                <input
                  id="field-code_postal"
                  type="text"
                  value={formData.code_postal}
                  onChange={(e) => updateFormData({ code_postal: e.target.value })}
                  placeholder="75001"
                  required
                />
              </div>
            </div>

            {/* Disponibilite */}
            <div id="field-disponibilite">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Disponibilite *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label
                  className={`radio-card ${formData.disponibilite === '1-2h' ? 'selected' : ''}`}
                  onClick={() => updateFormData({ disponibilite: '1-2h' })}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.disponibilite === '1-2h' ? 'border-[#0D1B4C]' : 'border-gray-300'
                  }`}>
                    {formData.disponibilite === '1-2h' && (
                      <div className="w-3 h-3 rounded-full bg-[#0D1B4C]" />
                    )}
                  </div>
                  <span>1-2h/semaine</span>
                </label>
                <label
                  className={`radio-card ${formData.disponibilite === '3-5h' ? 'selected' : ''}`}
                  onClick={() => updateFormData({ disponibilite: '3-5h' })}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.disponibilite === '3-5h' ? 'border-[#0D1B4C]' : 'border-gray-300'
                  }`}>
                    {formData.disponibilite === '3-5h' && (
                      <div className="w-3 h-3 rounded-full bg-[#0D1B4C]" />
                    )}
                  </div>
                  <span>3-5h/semaine</span>
                </label>
                <label
                  className={`radio-card ${formData.disponibilite === '5h+' ? 'selected' : ''}`}
                  onClick={() => updateFormData({ disponibilite: '5h+' })}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.disponibilite === '5h+' ? 'border-[#0D1B4C]' : 'border-gray-300'
                  }`}>
                    {formData.disponibilite === '5h+' && (
                      <div className="w-3 h-3 rounded-full bg-[#0D1B4C]" />
                    )}
                  </div>
                  <span>5h et +</span>
                </label>
              </div>
            </div>

            {/* Experience phoning */}
            <div id="field-experience">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Experience phoning *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label
                  className={`radio-card ${formData.experience === 'deja_fait' ? 'selected' : ''}`}
                  onClick={() => updateFormData({ experience: 'deja_fait' })}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.experience === 'deja_fait' ? 'border-[#0D1B4C]' : 'border-gray-300'
                  }`}>
                    {formData.experience === 'deja_fait' && (
                      <div className="w-3 h-3 rounded-full bg-[#0D1B4C]" />
                    )}
                  </div>
                  <span>Deja fait</span>
                </label>
                <label
                  className={`radio-card ${formData.experience === 'jamais_mais_motive' ? 'selected' : ''}`}
                  onClick={() => updateFormData({ experience: 'jamais_mais_motive' })}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.experience === 'jamais_mais_motive' ? 'border-[#0D1B4C]' : 'border-gray-300'
                  }`}>
                    {formData.experience === 'jamais_mais_motive' && (
                      <div className="w-3 h-3 rounded-full bg-[#0D1B4C]" />
                    )}
                  </div>
                  <span>Jamais fait mais motive</span>
                </label>
              </div>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Bouton de soumission */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Je rejoins l\'armee des phoners'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-8">
          Vos informations sont traitees par l&apos;equipe de campagne Reconquete Paris 2026.
        </p>
      </div>
    </div>
  );
}
