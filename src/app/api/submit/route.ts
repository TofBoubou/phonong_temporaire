import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { appendToSheet, initializeSheetHeaders } from '@/lib/googleSheets';
import { PhoningFormData } from '@/types/phoning';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData: PhoningFormData = await request.json();

    // Validation basique
    if (!formData.prenom || !formData.nom || !formData.email || !formData.mobile) {
      return NextResponse.json(
        { error: 'Prenom, nom, email et mobile sont obligatoires' },
        { status: 400 }
      );
    }

    if (!formData.disponibilite || !formData.experience) {
      return NextResponse.json(
        { error: 'Disponibilite et experience sont obligatoires' },
        { status: 400 }
      );
    }

    // Inserer dans Supabase
    const { data, error: supabaseError } = await supabase
      .from('phoning_temporaire')
      .insert([{
        prenom: formData.prenom,
        nom: formData.nom,
        mobile: formData.mobile,
        email: formData.email,
        ville: formData.ville,
        code_postal: formData.code_postal,
        disponibilite: formData.disponibilite,
        experience: formData.experience,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (supabaseError) {
      console.error('Erreur Supabase:', supabaseError);

      // Verifier si c'est une erreur de doublon
      if (supabaseError.code === '23505' || supabaseError.message?.includes('unique') || supabaseError.message?.includes('duplicate')) {
        return NextResponse.json(
          { error: 'Cette adresse email a deja ete utilisee.' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement' },
        { status: 500 }
      );
    }

    // Syncer avec Google Sheets
    try {
      await initializeSheetHeaders();
      await appendToSheet({
        ...formData,
        id: data.id,
        created_at: data.created_at,
      });
    } catch (sheetError) {
      console.error('Erreur Google Sheets:', sheetError);
      // On ne fait pas echouer la requete si le Sheet echoue
      // Les donnees sont deja dans Supabase
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
