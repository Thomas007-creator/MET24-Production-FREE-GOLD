# 🎯 9 Levensgebieden Evaluatie Vragen - Holistisch Welzijn Radar

## **📊 RADAR DIAGRAM FOUNDATION**
Elk levensgebied wordt geëvalueerd met **4 kernvragen** op een **5-punts Likert-scale**:
- 1 = Helemaal niet waar / Zeer ontevreden
- 2 = Grotendeels niet waar / Ontevreden  
- 3 = Neutraal / Gemiddeld tevreden
- 4 = Grotendeels waar / Tevreden
- 5 = Helemaal waar / Zeer tevreden

**Radar Score Berekening**: Gemiddelde van 4 vragen × 20 = Percentage (0-100%)

---

## **💼 1. WERK & CARRIÈRE**

### **Universele Basisvragen:**
1. **Tevredenheid**: "Hoe tevreden ben je over het algemeen met je huidige werk?"
2. **Betekenis**: "Voelt je werk betekenisvol en vervullend voor jou?"
3. **Groei**: "Heb je voldoende mogelijkheden voor persoonlijke en professionele ontwikkeling?"
4. **Balans**: "Is er een gezonde balans tussen je werk en de rest van je leven?"

### **MBTI-Specifieke Aanvullingen:**
```typescript
mbtiSpecificQuestions = {
  'NT': {
    focus: 'Strategische uitdaging en autonomie',
    additionalContext: [
      'Intellectuele stimulatie in dagelijkse taken',
      'Vrijheid om innovatieve oplossingen te ontwikkelen',
      'Mogelijkheid tot langetermijnplanning',
      'Erkenning van expertise en competentie'
    ]
  },
  'SF': {
    focus: 'Menselijke connectie en praktische impact',
    additionalContext: [
      'Positieve relaties met collega\'s',
      'Directe impact op mensen helpen',
      'Ondersteunende werkomgeving',
      'Waardering voor persoonlijke inzet'
    ]
  },
  'NF': {
    focus: 'Waarden-alignment en persoonlijke groei',
    additionalContext: [
      'Werk dat aansluit bij persoonlijke waarden',
      'Mogelijkheden om anderen te inspireren',
      'Creatieve vrijheid en expressie',
      'Bijdrage aan grotere maatschappelijke doelen'
    ]
  },
  'ST': {
    focus: 'Stabiliteit en concrete resultaten',
    additionalContext: [
      'Duidelijke structuur en verwachtingen',
      'Meetbare resultaten en prestaties',
      'Financiële zekerheid en voordelen',
      'Gerespecteerde routine en processen'
    ]
  }
}
```

---

## **💪 2. GEZONDHEID & WELZIJN**

### **Universele Basisvragen:**
1. **Fysieke Gezondheid**: "Hoe tevreden ben je met je huidige fysieke gezondheid?"
2. **Energie**: "Heb je voldoende energie voor je dagelijkse activiteiten?"
3. **Mentaal Welzijn**: "Voel je je mentaal gezond en emotioneel stabiel?"
4. **Zelfzorg**: "Neem je voldoende tijd voor zelfzorg en ontspanning?"

### **MBTI-Specifieke Focus:**
```typescript
healthWellnessMBTI = {
  'Introverted': {
    emphasis: 'Energiemanagement en alleen-tijd',
    questions: [
      'Heb je voldoende stille tijd om op te laden?',
      'Bescherm je je energie tegen sociale uitputting?'
    ]
  },
  'Extraverted': {
    emphasis: 'Sociale verbinding en actieve lifestyle',
    questions: [
      'Krijg je genoeg sociale interactie voor je welzijn?',
      'Heb je actieve, energiegevende activiteiten?'
    ]
  },
  'Sensing': {
    emphasis: 'Fysieke ervaring en praktische routine',
    questions: [
      'Heb je een consistente gezondheidsroutine?',
      'Let je op concrete fysieke signalen van je lichaam?'
    ]
  },
  'Intuitive': {
    emphasis: 'Holistische benadering en toekomstvisie',
    questions: [
      'Zie je verbanden tussen verschillende aspecten van je gezondheid?',
      'Heb je een langetermijnvisie op je welzijn?'
    ]
  }
}
```

---

## **❤️ 3. RELATIES & SOCIAAL LEVEN**

### **Universele Basisvragen:**
1. **Relatie Kwaliteit**: "Hoe tevreden ben je met de kwaliteit van je belangrijkste relaties?"
2. **Sociale Verbinding**: "Voel je je verbonden met familie, vrienden of gemeenschap?"
3. **Communicatie**: "Kun je jezelf authentiek uitdrukken in je relaties?"
4. **Ondersteuning**: "Ervaar je voldoende emotionele steun van anderen?"

### **MBTI Relatiedynamiek:**
```typescript
relationshipsMBTI = {
  'Fe-types': ['ESFJ', 'ENFJ', 'ESFP', 'ENFP'],
  focus: 'Harmonie en anderen helpen',
  questions: [
    'Kun je anderen helpen zonder jezelf te verwaarlozen?',
    'Voel je je gewaardeerd voor je zorgzaamheid?'
  ],
  
  'Fi-types': ['ISFP', 'INFP', 'ISFJ', 'INFJ'],
  focus: 'Authentieke verbindingen',
  questions: [
    'Kun je je ware zelf zijn in je relaties?',
    'Respecteren anderen je waarden en grenzen?'
  ],
  
  'Te-types': ['ESTJ', 'ENTJ', 'ESTP', 'ENTP'],
  focus: 'Efficiënte en doelgerichte relaties',
  questions: [
    'Dragen je relaties bij aan je persoonlijke groei?',
    'Kunnen anderen je ambitie en drive waarderen?'
  ],
  
  'Ti-types': ['ISTP', 'INTP', 'ISTJ', 'INTJ'],
  focus: 'Intellectuele verbinding en autonomie',
  questions: [
    'Respecteren anderen je behoefte aan onafhankelijkheid?',
    'Kun je intellectueel stimulerende gesprekken voeren?'
  ]
}
```

---

## **🏠 4. WOON- & LEEFOMGEVING**

### **Universele Basisvragen:**
1. **Thuis Gevoel**: "Voel je je thuis en comfortabel in je woonruimte?"
2. **Functionaliteit**: "Ondersteunt je leefomgeving je dagelijkse activiteiten goed?"
3. **Esthetiek**: "Ben je tevreden met hoe je woonruimte eruit ziet en aanvoelt?"
4. **Locatie**: "Woon je op een plek die past bij je lifestyle en behoeften?"

### **MBTI Woonomgeving Voorkeuren:**
```typescript
livingEnvironmentMBTI = {
  'J-types': {
    focus: 'Structuur en organisatie',
    questions: [
      'Is je woonruimte goed georganiseerd en opgeruimd?',
      'Heb je vaste plekken voor al je spullen?'
    ]
  },
  'P-types': {
    focus: 'Flexibiliteit en spontaniteit',
    questions: [
      'Geeft je woonruimte je vrijheid om spontaan te zijn?',
      'Kun je je ruimte makkelijk aanpassen aan verschillende behoeften?'
    ]
  },
  'S-types': {
    focus: 'Comfort en praktische functionaliteit',
    questions: [
      'Is je woonruimte praktisch ingericht voor dagelijks gebruik?',
      'Voelt je huis fysiek comfortabel en gezellig?'
    ]
  },
  'N-types': {
    focus: 'Inspiratie en persoonlijke expressie',
    questions: [
      'Inspireert je woonruimte je creativiteit en dromen?',
      'Reflecteert je interieur je persoonlijke identiteit?'
    ]
  }
}
```

---

## **💰 5. FINANCIËN & MATERIËLE ZEKERHEID**

### **Universele Basisvragen:**
1. **Financiële Veiligheid**: "Voel je je financieel veilig en stabiel?"
2. **Budgetbeheersing**: "Heb je controle over je inkomsten en uitgaven?"
3. **Toekomstplanning**: "Ben je tevreden met je financiële planning voor de toekomst?"
4. **Stress Niveau**: "Ervaar je weinig stress over geld en financiële kwesties?"

### **MBTI Financiële Benaderingen:**
```typescript
financesMBTI = {
  'TJ-types': ['ESTJ', 'ENTJ', 'ISTJ', 'INTJ'],
  approach: 'Strategische planning en controle',
  questions: [
    'Heb je een duidelijke financiële strategie?',
    'Behaalt je geld management je langetermijndoelen?'
  ],
  
  'FP-types': ['ESFP', 'ENFP', 'ISFP', 'INFP'],
  approach: 'Waarden-gebaseerde uitgaven',
  questions: [
    'Geeft je geld uit aan dingen die je waardevol vindt?',
    'Kun je genieten van geld zonder schuldgevoel?'
  ],
  
  'SP-types': ['ESTP', 'ESFP', 'ISTP', 'ISFP'],
  approach: 'Flexibele en opportunistische financiën',
  questions: [
    'Kun je spontane financiële kansen benutten?',
    'Heb je financiële ruimte voor onverwachte gelegenheden?'
  ],
  
  'NJ-types': ['ENFJ', 'INFJ', 'ENTJ', 'INTJ'],
  approach: 'Toekomstgerichte zekerheid',
  questions: [
    'Dragen je financiële keuzes bij aan je toekomstvisie?',
    'Voel je je voorbereid op belangrijke life events?'
  ]
}
```

---

## **🎨 6. HOBBY'S & VRIJE TIJD**

### **Universele Basisvragen:**
1. **Tijd voor Plezier**: "Heb je voldoende tijd voor hobby's en activiteiten die je leuk vindt?"
2. **Vervulling**: "Geven je hobby's je voldoening en persoonlijke vreugde?"
3. **Nieuwe Ervaringen**: "Probeer je regelmatig nieuwe activiteiten of hobby's uit?"
4. **Balance**: "Is er een goede balans tussen actieve en ontspannende vrije tijd?"

### **MBTI Hobby Voorkeuren:**
```typescript
hobbiesMBTI = {
  'Artistic': ['ISFP', 'INFP', 'ESFP', 'ENFP'],
  preferences: 'Creatieve expressie en esthetische ervaringen',
  questions: [
    'Geeft je vrije tijd je ruimte voor creatieve expressie?',
    'Vind je schoonheid en inspiratie in je hobby\'s?'
  ],
  
  'Athletic': ['ESTP', 'ESFP', 'ISTP', 'ESTJ'],
  preferences: 'Fysieke activiteit en competitie',
  questions: [
    'Heb je voldoende fysiek actieve hobby\'s?',
    'Geeft sport/beweging je energie en voldoening?'
  ],
  
  'Intellectual': ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
  preferences: 'Leren en mentale uitdaging',
  questions: [
    'Stimuleren je hobby\'s je intellectuele groei?',
    'Kun je diep ingaan op onderwerpen die je interesseren?'
  ],
  
  'Social': ['ESFJ', 'ENFJ', 'ESFP', 'ENFP'],
  preferences: 'Gemeenschapsactiviteiten en verbinding',
  questions: [
    'Doe je hobby\'s samen met andere mensen?',
    'Helpen je activiteiten je sociale netwerk uit te breiden?'
  ]
}
```

---

## **📚 7. PERSOONLIJKE GROEI & ONTWIKKELING**

### **Universele Basisvragen:**
1. **Zelfkennis**: "Heb je een goed begrip van jezelf en je persoonlijke waarden?"
2. **Leerdoelen**: "Werk je actief aan persoonlijke ontwikkeling en nieuwe vaardigheden?"
3. **Uitdagingen**: "Neem je bewust uitdagingen aan die je helpen groeien?"
4. **Reflectie**: "Neem je regelmatig tijd voor zelfreflectie en introspectie?"

### **MBTI Groei Benaderingen:**
```typescript
personalGrowthMBTI = {
  'Inferior_Se': ['INTJ', 'INFJ'],
  developmentFocus: 'Spontaniteit en zintuiglijke ervaring',
  questions: [
    'Probeer je bewust meer in het moment te leven?',
    'Verken je nieuwe fysieke ervaringen en sensaties?'
  ],
  
  'Inferior_Si': ['ENTP', 'ENFP'],
  developmentFocus: 'Stabiliteit en routine ontwikkeling',
  questions: [
    'Werk je aan het opbouwen van gezonde routines?',
    'Leer je van je verleden voor betere beslissingen?'
  ],
  
  'Inferior_Ne': ['ISTJ', 'ISFJ'],
  developmentFocus: 'Creativiteit en mogelijkheden verkenning',
  questions: [
    'Verken je bewust nieuwe ideeën en mogelijkheden?',
    'Geef je jezelf ruimte voor creativiteit en innovatie?'
  ],
  
  'Inferior_Ni': ['ESTP', 'ESFP'],
  developmentFocus: 'Toekomstplanning en diepere betekenis',
  questions: [
    'Neem je tijd voor langetermijnplanning en reflectie?',
    'Zoek je naar diepere betekenis in je ervaringen?'
  ]
}
```

---

## **🌍 8. MAATSCHAPPELIJKE BETROKKENHEID**

### **Universele Basisvragen:**
1. **Bijdrage**: "Heb je het gevoel dat je een positieve bijdrage levert aan de samenleving?"
2. **Gemeenschap**: "Voel je je verbonden met je lokale of bredere gemeenschap?"
3. **Waarden in Actie**: "Kun je je waarden en overtuigingen uiten in maatschappelijke betrokkenheid?"
4. **Impact Bewustzijn**: "Ben je bewust van de impact van je keuzes op anderen en de wereld?"

### **MBTI Maatschappelijke Rollen:**
```typescript
societalEngagementMBTI = {
  'Leaders': ['ENTJ', 'ENFJ', 'ESTJ', 'ESFJ'],
  role: 'Organiseren en leiden van maatschappelijke initiatieven',
  questions: [
    'Neem je leiderschap in maatschappelijke kwesties?',
    'Organiseer je anderen rond gemeenschappelijke doelen?'
  ],
  
  'Advocates': ['INFJ', 'ENFJ', 'INFP', 'ENFP'],
  role: 'Voorvechten van waarden en sociale rechtvaardigheid',
  questions: [
    'Spreek je op voor belangrijke maatschappelijke kwesties?',
    'Inspireer je anderen om positieve verandering te maken?'
  ],
  
  'Implementers': ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
  role: 'Praktische uitvoering van maatschappelijke programma\'s',
  questions: [
    'Draag je bij aan praktische oplossingen voor gemeenschapsproblemen?',
    'Help je betrouwbaar bij maatschappelijke organisaties?'
  ],
  
  'Innovators': ['ENTP', 'ENFP', 'INTP', 'INTJ'],
  role: 'Ontwikkelen van nieuwe benaderingen voor maatschappelijke uitdagingen',
  questions: [
    'Bedenk je creatieve oplossingen voor maatschappelijke problemen?',
    'Deel je innovatieve ideeën voor sociale verbetering?'
  ]
}
```

---

## **🧘 9. SPIRITUALITEIT & ZINGEVING**

### **Universele Basisvragen:**
1. **Zinervaring**: "Ervaar je een gevoel van betekenis en doel in je leven?"
2. **Spirituele Praktijk**: "Heb je spirituele of filosofische praktijken die je vervullen?"
3. **Transcendentie**: "Ervaar je momenten van verbinding met iets groters dan jezelf?"
4. **Inner Peace**: "Vind je innerlijke rust en vrede in je dagelijks leven?"

### **MBTI Spirituele Benaderingen:**
```typescript
spiritualityMBTI = {
  'Mystical': ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
  approach: 'Intuïtieve en emotionele spirituele ervaring',
  questions: [
    'Ervaar je diepe, intuïtieve spirituele momenten?',
    'Voel je emotionele verbinding met het transcendente?'
  ],
  
  'Practical': ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
  approach: 'Gestructureerde en traditionele spirituele praktijk',
  questions: [
    'Geeft traditie en routine je spirituele stabiliteit?',
    'Vind je betekenis in bewezen spirituele praktijken?'
  ],
  
  'Intellectual': ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
  approach: 'Filosofische en conceptuele benadering van spiritualiteit',
  questions: [
    'Verken je spiritualiteit door filosofische studie?',
    'Vind je betekenis in begrip van grotere systemen en patronen?'
  ],
  
  'Experiential': ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
  approach: 'Direct ervaren en in-het-moment spiritualiteit',
  questions: [
    'Vind je spirituele betekenis in directe, zintuiglijke ervaring?',
    'Geeft natuurbeleving je gevoel van transcendentie?'
  ]
}
```

---

## **📊 RADAR DIAGRAM IMPLEMENTATIE**

### **Score Berekening:**
```typescript
interface LevensgebiedScore {
  gebied: string;
  vraag1Score: number; // 1-5
  vraag2Score: number; // 1-5  
  vraag3Score: number; // 1-5
  vraag4Score: number; // 1-5
  gemiddelde: number; // (v1+v2+v3+v4)/4
  percentage: number; // gemiddelde * 20 (0-100%)
  mbtiOptimized: boolean;
  evaluatieDatum: Date;
}

function calculateRadarScores(responses: LevensgebiedResponses[]): RadarData {
  return responses.map(response => ({
    gebied: response.levensgebied,
    score: (response.vragen.reduce((sum, score) => sum + score, 0) / 4) * 20,
    mbtiRelevance: calculateMBTIRelevance(response, userMBTI),
    improvementPotential: calculateImprovementPotential(response)
  }));
}
```

### **Radar Visualisatie:**
```typescript
// React component voor radar diagram
export const HolisticWellnessRadar: React.FC<{
  scores: LevensgebiedScore[];
  mbtiType: MBTIType;
}> = ({ scores, mbtiType }) => {
  
  const radarData = {
    labels: scores.map(s => s.gebied),
    datasets: [{
      label: 'Huidige Scores',
      data: scores.map(s => s.percentage),
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2
    }]
  };
  
  return (
    <div className="radar-container">
      <Radar data={radarData} options={radarOptions} />
      <MBTIInsightsPanel scores={scores} mbtiType={mbtiType} />
    </div>
  );
};
```

**🎯 Complete foundation voor Holistisch Welzijn Radar Diagram met MBTI optimization!**