'use client';

interface Props {
  prenom: string;
}

export default function Confirmation({ prenom }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full text-center">
        <div className="card">
          {/* Icône succès */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-green-600 text-4xl">&#10003;</span>
          </div>

          <h1 className="text-2xl font-bold text-[#0D1B4C] mb-2">
            Merci {prenom} !
          </h1>

          <p className="text-gray-600 mb-6">
            Vous avez rejoint l&apos;armée des phoners pour Paris 2026.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
            <h3 className="font-semibold text-[#0D1B4C] mb-2">Prochaines étapes :</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>1. Vous recevrez un email avec les instructions</li>
              <li>2. Vous serez formé(e) avec des scripts et des arguments</li>
              <li>3. Vous pourrez commencer à phoner depuis chez vous</li>
            </ul>
          </div>

          <div className="info-box text-sm">
            <p>
              Chaque appel compte ! Ensemble, reconquérons Paris.
            </p>
          </div>

          {/* Logo */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="font-bold">
              <span className="text-[#0D1B4C]">Municipales </span>
              <span className="text-[#E30613]">Reconquête 2026</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
