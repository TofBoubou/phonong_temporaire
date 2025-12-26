export interface PhoningFormData {
  prenom: string;
  nom: string;
  mobile: string;
  email: string;
  ville: string;
  code_postal: string;
  disponibilite: '1-2h' | '3-5h' | '5h+' | '';
  experience: 'deja_fait' | 'jamais_mais_motive' | '';
}
