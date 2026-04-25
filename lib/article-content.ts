export const article = {
  category: "Climate / Innovation",
  title: "Floating solar can power coastal cities without taking farmland offline",
  dek:
    "A pilot across West African lagoons shows how modular floating solar fields can stabilize grids, lower diesel reliance, and create new jobs for fishing communities.",
  readTime: "8 min read",
  source: "Global Signal",
  published: "April 25, 2026",
  author: "Amara Soglo",
  authorRole: "Energy & Cities Correspondent",
};

export const articleBody = {
  english: {
    label: "English",
    paragraphs: [
      "At sunrise, the pilot array off the Porto-Novo lagoon barely registers as infrastructure. The modules sit low on the water, framed by fishing boats and mangrove edges, but the energy output is significant: enough to cover nearly one-third of the nearby district's daytime demand during the dry season.",
      "Local officials backed the project because it avoids one of the hardest tradeoffs in fast-growing cities: whether to dedicate scarce land to food, housing, or power. By shifting generation onto sheltered water, planners preserved peri-urban farmland while cutting expensive diesel imports that previously filled evening gaps in supply.",
      "Engineers also designed the system around access. Maintenance walkways double as inspection routes for local operators, and the platform's sensor layer feeds into an AI assistant that flags panel fouling, predicts battery strain, and explains output dips in plain language for non-specialist staff.",
      "Residents describe the biggest change less in technical terms than in daily rhythm. Clinics now keep refrigeration stable through heat spikes, market vendors run fans longer into the afternoon, and students in nearby neighborhoods report fewer study interruptions during exam weeks.",
      "The next phase will test whether community-owned energy cooperatives can take partial ownership of new floating arrays. If that model works, planners believe the region could expand generation faster while keeping the economic upside closer to the neighborhoods most affected by unreliable supply.",
    ],
  },
  french: {
    label: "Francais",
    paragraphs: [
      "Au lever du jour, l'installation pilote au large de la lagune de Porto-Novo se fond presque dans le paysage. Les modules flottent bas sur l'eau, entre les barques de peche et les mangroves, mais leur rendement est deja important: assez pour couvrir pres d'un tiers de la demande diurne du district voisin pendant la saison seche.",
      "Les autorites locales ont soutenu le projet car il evite l'un des arbitrages les plus difficiles des villes en croissance rapide: faut-il reserver les terres a l'agriculture, au logement ou a l'energie? En deplacant la production vers une zone d'eau abritee, les urbanistes ont preserve les terres periurbaines tout en reduisant les importations couteuses de diesel.",
      "Les ingenieurs ont egalement pense le systeme pour qu'il soit exploitable localement. Les passerelles de maintenance servent aussi de parcours d'inspection, et la couche de capteurs alimente un assistant IA capable de signaler l'encrassement des panneaux, d'anticiper la fatigue des batteries et d'expliquer les baisses de production dans un langage simple.",
      "Les habitants decrivent surtout un changement dans le rythme quotidien. Les cliniques maintiennent la refrigeration pendant les pics de chaleur, les commercants gardent leurs ventilateurs allumes plus longtemps et les eleves subissent moins d'interruptions pendant les semaines d'examens.",
      "La prochaine phase evaluera si des cooperatives energetiques communautaires peuvent prendre une participation partielle dans les nouvelles installations flottantes. Si ce modele fonctionne, la region pourrait accelerer son deploiement tout en gardant une partie de la valeur economique au plus pres des quartiers concernes.",
    ],
  },
  fon: {
    label: "Fon",
    paragraphs: [
      "Xwe ji caca me, sunu ton floton to Porto-Novo lagune me ma ko xwla bigan to glen-glen o. Panel lolo yi daho ji ji me, bo akpa xwla kpo kpo kple mangrove lolo, gbo nujlodo ton tindo bo vovo: e se bo na kpaye district si to ayi me ji akue do azan me.",
      "Hounnongan xwe tado le do project ehe ta bo e ko nyi nuyizan we to ville lolo me: an na zaan agbeto sin, xwe xwe, alo electricite? To bo sunu ton yi jlo ji me sin ton me, planner lolo to preserve agbeto sin peri-urbain bo to kpe diesel xexo lolo do gbe.",
      "Ingenieur lolo ko na mido system ehe bo gbe to xwe me. Passerelle de maintenance lolo na yi gudo inspection, eye sensor lolo na ko AI assistant si na xlwe panel nado, na yi battery xomavo, bo na gblonujijem do production gbegble me kpo nujijem gangan ma gbo.",
      "Nukon lolo gblonmii be ayi dida ton ma to technique me o, kon gbeta yi xwegbeta me. Clinique lolo no ko refrigeration do gbe, vendeuse lolo no ko ventilateur bo daho, eye sukuvi lolo no ko interruption we do examen tem me.",
      "Etape si to wa me na kpe be cooperative energetique communautaire lolo ka se bo na xo part to installation yeyeme lolo me. Ne ehe yi dji, region ton na se bo na tonton sunu vovo bo gbena gain ton ma no yi hounkpati lolo si do electricite nyi gbe me.",
    ],
  },
} as const;

export const summaryPoints = [
  "Floating solar gives coastal cities more energy capacity without taking farmland out of production.",
  "The pilot improves service reliability for clinics, vendors, and students while reducing diesel dependence.",
  "AI monitoring lowers the operational barrier by explaining maintenance and performance issues in plain language.",
];

export const qaExamples = [
  {
    question: "Why is floating solar a better fit than land-based solar here?",
    answer:
      "The article explains that land around the city is already under pressure from housing and food production, so using sheltered water reduces that tradeoff.",
  },
  {
    question: "What role does AI play in the story?",
    answer:
      "AI supports monitoring by identifying panel fouling, forecasting battery strain, and explaining output drops for local operators in plain language.",
  },
  {
    question: "What should the app help the reader do after reading?",
    answer:
      "The product should let the reader switch language, request a concise summary, listen to the article, and ask grounded follow-up questions without leaving the page.",
  },
];

export const landingFeatures = [
  {
    title: "Translate every article",
    description:
      "Readers can move between global and local languages from the article header without losing structure or context.",
  },
  {
    title: "Get the summary fast",
    description:
      "Long stories can be reduced into a few reliable points before the reader decides to go deeper.",
  },
  {
    title: "Listen instead of reading",
    description:
      "Audio mode turns any article into a hands-free experience with playback progress and listening context.",
  },
  {
    title: "Ask the story questions",
    description:
      "A built-in Q&A surface lets the reader interrogate the article directly with backend actions handled by Next API routes later.",
  },
];
