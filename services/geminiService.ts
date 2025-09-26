import { GoogleGenAI, Type } from "@google/genai";
import { Championship, Match } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getChampionshipName = (championship: Championship): string => {
  switch (championship) {
    case Championship.BRASILEIRAO:
      return "Campeonato Brasileiro (Brasileirão)";
    case Championship.LIBERTADORES:
      return "Copa Libertadores";
    case Championship.COPA_DO_BRASIL:
      return "Copa do Brasil";
    default:
      return "";
  }
};

const matchSchema = {
  type: Type.OBJECT,
  properties: {
    id: {
      type: Type.STRING,
      description: "ID único para o jogo, combinando nomes dos times e data. Ex: 'flamengo-vs-corinthians-202407281600'."
    },
    teams: {
      type: Type.ARRAY,
      description: "Array com duas equipes. A primeira é o time da casa, a segunda o visitante.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Nome do time." },
          logoUrl: { type: Type.STRING, description: "URL para o escudo do time. Use 'https://picsum.photos/100' como placeholder." },
        },
        required: ["name", "logoUrl"],
      },
    },
    dateTime: {
      type: Type.STRING,
      description: "Data e hora do jogo no formato ISO 8601 (ex: '2024-07-28T16:00:00-03:00').",
    },
    broadcasters: {
      type: Type.ARRAY,
      description: "Canais ou serviços de streaming que transmitirão o jogo.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Nome do canal (ex: 'Globo', 'ESPN', 'YouTube', 'Globoplay + Premiere')." },
          url: { type: Type.STRING, description: "Link direto e VÁLIDO para a transmissão ao vivo do canal. Por exemplo: para Globo, 'https://globoplay.globo.com/agora-na-tv/'; para ESPN, 'https://www.espn.com.br/watch/' (via Star+); para um canal do YouTube, o link direto do canal ou da transmissão. Forneça o link mais preciso possível." },
        },
        required: ["name", "url"],
      },
    },
  },
  required: ["id", "teams", "dateTime", "broadcasters"],
};


export const fetchMatches = async (championship: Championship): Promise<Match[]> => {
  try {
    const championshipName = getChampionshipName(championship);
    const prompt = `Liste os próximos 8 jogos de futebol para o campeonato "${championshipName}". Para cada jogo, inclua um 'id' único (combinando os nomes dos times e a data), as duas equipes (com nome e uma URL de placeholder de 'https://picsum.photos/100' para o escudo), a data e hora exatas no fuso horário de Brasília (GMT-3), e uma lista completa de TODOS os canais e serviços de streaming que transmitirão a partida. Importante: para canais como 'Premiere' ou 'ESPN', certifique-se de incluir também os serviços de streaming que os oferecem, como por exemplo 'Globoplay + Premiere', 'Prime Video Channels (Premiere)', ou 'Star+' (para a ESPN). Forneça URLs VÁLIDAS e específicas para cada opção de transmissão. Pesquise e forneça os links e serviços mais corretos e completos possíveis. Certifique-se de que os times e confrontos sejam realistas para o campeonato solicitado.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: matchSchema,
        },
      },
    });

    const jsonText = response.text.trim();
    const matches = JSON.parse(jsonText) as Match[];

    // Sort matches by date
    return matches.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  } catch (error) {
    console.error("Error fetching matches from Gemini API:", error);
    // In case of error, return some mock data to show the UI
    return Promise.reject("Não foi possível carregar os jogos. Tente novamente mais tarde.");
  }
};
