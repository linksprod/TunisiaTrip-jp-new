import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  images: string[];
}

interface PresentationRequest {
  activities: Activity[];
  hotels: Hotel[];
  language: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { activities, hotels, language = 'french' }: PresentationRequest = await req.json();
    
    console.log('Generating presentation for:', { activitiesCount: activities.length, hotelsCount: hotels.length, language });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!activities || activities.length === 0) {
      throw new Error('No activities provided');
    }

    // Create prompt for OpenAI to generate presentation content
    const prompt = `Créez une présentation marketing professionnelle pour un voyage en Tunisie. Voici les activités sélectionnées et les hôtels associés:

ACTIVITÉS SÉLECTIONNÉES:
${activities.map(activity => `- ${activity.title} (${activity.location}): ${activity.description}
  Image: ${activity.images?.[0] || ''}`).join('\n')}

HÉBERGEMENTS DISPONIBLES:
${hotels.map(hotel => `- ${hotel.name} (${hotel.location}): ${hotel.description}
  Image: ${hotel.images?.[0] || ''}`).join('\n')}

Créez une présentation HTML avec ce format EXACT:

<div class="slide cover-slide">
  <div class="slide-content">
    <div class="cover-image" style="background-image: url('/uploads/05c1d0ef-d2de-4096-a5eb-7b5cc45a4789.png');">
      <div class="cover-overlay">
        <h1 class="cover-title">Tunisia Trip Tour</h1>
        <p class="cover-subtitle">Découvrez la magie de la Tunisie</p>
      </div>
    </div>
  </div>
</div>

Pour chaque activité, créez une slide avec ce format:
<div class="slide activity-slide">
  <div class="slide-content">
    <div class="activity-hero" style="background-image: url('[URL_IMAGE_ACTIVITE]');">
      <div class="activity-overlay">
        <h2 class="activity-title">[TITRE_ACCROCHEUR]</h2>
        <p class="activity-location">[LIEU]</p>
      </div>
    </div>
    <div class="activity-details">
      <p class="activity-description">[DESCRIPTION_EMOTIONNELLE]</p>
      <div class="hotel-recommendation">
        <h3>Hébergement recommandé</h3>
        <p>[NOM_HOTEL] - [DESCRIPTION_COURTE]</p>
      </div>
    </div>
  </div>
</div>

Terminez par:
<div class="slide conclusion-slide">
  <div class="slide-content">
    <h2 class="conclusion-title">Réservez votre aventure tunisienne</h2>
    <p class="conclusion-text">Une expérience inoubliable vous attend en Tunisie</p>
  </div>
</div>

IMPORTANT: 
- Utilisez EXACTEMENT les URLs d'images fournies
- Répondez UNIQUEMENT avec le HTML structuré
- Créez du contenu émotionnel et inspirant
- Associez chaque activité avec l'hébergement le plus proche
- Utilisez les classes CSS exactes spécifiées`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Tu es un expert en marketing touristique spécialisé dans les voyages en Tunisie. Tu créés des présentations engageantes qui donnent envie de voyager. Réponds UNIQUEMENT avec du HTML pur, sans markdown.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('Presentation generated successfully');

    return new Response(JSON.stringify({ 
      htmlContent: generatedContent,
      activitiesCount: activities.length,
      hotelsCount: hotels.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-presentation function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate presentation content'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});