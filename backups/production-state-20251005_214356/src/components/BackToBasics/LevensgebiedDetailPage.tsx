import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Progress,
  Chip,
  Tabs,
  Tab,
} from "@nextui-org/react";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Calendar,
  Star,
  CheckCircle,
  Play,
  BookOpen,
  MessageCircle,
  BarChart3,
  Bot,
  Save,
} from "lucide-react";
import database from "../../database";
import { useAppStore } from "../../store/useAppStore";
import { logger } from "../../utils/logger";

const LevensgebiedDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { areaId } = useParams<{ areaId: string }>();
  const { userData } = useAppStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<{
    [key: string]: number;
  }>({});
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const areaDetails = {
    psychischeGezondheid: {
      id: "psychischeGezondheid",
      name: "🧠 Psychische Gezondheid",
      color: "from-blue-500 to-purple-600",
      description: "Mental health coaching en tracking voor emotionele balans",
      hashtags: ["#Mindfulness", "#EmotioneleRegulatie", "#Zelfcompassie"],
      questionnaire: {
        title: "Mentale Veerkracht & Emotionele Gezondheid",
        questions: [
          {
            id: "emotie_regulatie",
            question: "Hoe goed kun je je emoties reguleren in stress?",
            context:
              "Direct gerelateerd aan mentale veerkracht en emotionele gezondheid.",
            scale: "1-10",
          },
          {
            id: "zingeving",
            question:
              "Hoe vaak ervaar je zingeving in dagelijkse activiteiten?",
            context:
              "Zingeving is een belangrijk aspect van mentale gezondheid.",
            scale: "1-10",
          },
          {
            id: "zelfcompassie",
            question: "Hoe vaak ben je vriendelijk voor jezelf bij tegenslag?",
            context:
              "Zelfcompassie is een kernonderdeel van psychische gezondheid.",
            scale: "1-10",
          },
          {
            id: "stress_niveau",
            question: "Hoe hoog is je ervaren stressniveau?",
            context: "Stress is een centrale indicator van mentale gezondheid.",
            scale: "0-10",
          },
        ],
      },
      exercises: [
        {
          title: "Emotionele Regulatie Oefening",
          duration: "15 min",
          difficulty: "Medium",
        },
        {
          title: "Mindset Transformatie Sessie",
          duration: "20 min",
          difficulty: "Hard",
        },
        {
          title: "Zelfcompassie Meditatie",
          duration: "10 min",
          difficulty: "Easy",
        },
      ],
      community: {
        links: [
          { title: "Mindfulness Community", hashtag: "#Mindfulness", url: "#" },
          {
            title: "Emotionele Balans Groep",
            hashtag: "#EmotioneleRegulatie",
            url: "#",
          },
          {
            title: "Zelfcompassie Support",
            hashtag: "#Zelfcompassie",
            url: "#",
          },
        ],
        events: [
          {
            title: "Weekend Retreat: Innerlijke Vrede",
            date: "15-17 December 2024",
            location: "Ardennen, België",
          },
          {
            title: "Online Workshop: Stress Management",
            date: "22 November 2024",
            location: "Online",
          },
        ],
      },
    },
    lichamelijkeGezondheid: {
      id: "lichamelijkeGezondheid",
      name: "💪 Lichamelijke Gezondheid",
      color: "from-green-500 to-teal-600",
      description: "Physical health optimization voor vitaliteit en energie",
      hashtags: ["#Gezondheidstechnologie", "#Vitaliteit", "#PreventieveZorg"],
      questionnaire: {
        title: "Fysiek Welzijn & Vitaliteit",
        questions: [
          {
            id: "slaap_regelmaat",
            question: "Hoe regelmatig slaap je voldoende?",
            context:
              "Slaap is essentieel voor lichamelijk herstel en gezondheid.",
            scale: "1-10",
          },
          {
            id: "vermoeidheid",
            question: "Hoe vaak heb je last van vermoeidheid overdag?",
            context:
              "Vermoeidheid is vaak een fysiek symptoom dat samenhangt met slaap en levensstijl.",
            scale: "1-10",
          },
          {
            id: "beweging",
            question: "Hoe vaak beweeg je matig/intensief per week?",
            context:
              "Beweging is direct gerelateerd aan lichamelijke gezondheid.",
            scale: "1-10",
          },
          {
            id: "lichamelijke_klachten",
            question:
              "Hoe vaak ervaar je lichamelijke klachten die functioneren beïnvloeden?",
            context:
              "Lichamelijke klachten vallen duidelijk onder fysieke gezondheid.",
            scale: "1-10",
          },
        ],
      },
      exercises: [
        {
          title: "Energie Optimalisatie",
          duration: "20 min",
          difficulty: "Medium",
        },
        {
          title: "Holistische Gezondheid Planning",
          duration: "30 min",
          difficulty: "Hard",
        },
        { title: "Vitaliteit Boost", duration: "15 min", difficulty: "Easy" },
      ],
      community: {
        links: [
          {
            title: "Gezondheidstechnologie",
            hashtag: "#Gezondheidstechnologie",
            url: "#",
          },
          { title: "Vitaliteit Community", hashtag: "#Vitaliteit", url: "#" },
          { title: "Preventieve Zorg", hashtag: "#PreventieveZorg", url: "#" },
        ],
        events: [
          {
            title: "Fitness Challenge: 30 Dagen",
            date: "1-30 December 2024",
            location: "Online + Lokaal",
          },
          {
            title: "Yoga & Mindfulness Retreat",
            date: "8-10 December 2024",
            location: "Veluwe, Nederland",
          },
        ],
      },
    },
    financieen: {
      id: "financieen",
      name: "💰 Financiën",
      color: "from-purple-500 to-pink-600",
      description: "Financial planning en security voor financiële vrijheid",
      hashtags: ["#VroegInvesteren", "#FinanciëleEducatie", "#BudgetApps"],
      questionnaire: {
        title: "Financiële Gezondheid & Planning",
        questions: [
          {
            id: "uitgaven_bewustzijn",
            question: "Hoe bewust ben je van je uitgavenpatronen?",
            context:
              "Financiële bewustwording is de basis van gezonde financiën.",
            scale: "1-10",
          },
          {
            id: "budget_discipline",
            question: "Hoe goed kun je je aan je budget houden?",
            context:
              "Budget discipline is cruciaal voor financiële stabiliteit.",
            scale: "1-10",
          },
          {
            id: "zelf_investeren",
            question: "Hoe regelmatig investeer je in jezelf?",
            context:
              "Investeren in persoonlijke ontwikkeling is een belangrijke financiële beslissing.",
            scale: "1-10",
          },
          {
            id: "financiële_tevredenheid",
            question: "Hoe tevreden ben je met je financiële situatie?",
            context:
              "Financiële tevredenheid is een indicator van financiële gezondheid.",
            scale: "1-10",
          },
        ],
      },
      exercises: [
        {
          title: "Financiële Bewustwording",
          duration: "25 min",
          difficulty: "Medium",
        },
        {
          title: "Investeren in Jezelf",
          duration: "30 min",
          difficulty: "Hard",
        },
        { title: "Budget Planning", duration: "20 min", difficulty: "Easy" },
      ],
      community: {
        links: [
          { title: "Vroeg Investeren", hashtag: "#VroegInvesteren", url: "#" },
          {
            title: "Financiële Educatie",
            hashtag: "#FinanciëleEducatie",
            url: "#",
          },
          { title: "Budget Apps", hashtag: "#BudgetApps", url: "#" },
        ],
        events: [
          {
            title: "Financiële Planning Seminar",
            date: "28 November 2024",
            location: "Amsterdam",
          },
          {
            title: "Investeren Workshop",
            date: "5 December 2024",
            location: "Online",
          },
        ],
      },
    },
    werkSamenleving: {
      id: "werkSamenleving",
      name: "💼 Werk & Samenleving",
      color: "from-orange-500 to-red-600",
      description: "Career development en balance voor professionele groei",
      hashtags: ["#Carrièretransities", "#WerkPrivéBalans", "#HybrideWerken"],
      questionnaire: {
        title: "Carrière & Maatschappelijke Betekenis",
        questions: [
          {
            id: "werk_zingeving",
            question:
              "Hoe vaak ervaar je zingeving in dagelijkse activiteiten?",
            context:
              "Zingeving kan ook verband houden met werk en maatschappelijke bijdrage.",
            scale: "1-10",
          },
          {
            id: "doelgericht_handelen",
            question: "Hoe vaak handel je doelgericht?",
            context:
              "Doelgericht handelen is relevant voor werk en balans in het leven.",
            scale: "1-10",
          },
          {
            id: "werk_stress",
            question: "Hoe hoog is je ervaren stressniveau?",
            context: "Stress kan vaak werkgerelateerd zijn.",
            scale: "0-10",
          },
          {
            id: "werk_privé_balans",
            question: "Hoe goed kun je werk en privé balanceren?",
            context:
              "Werk-privé balans is essentieel voor duurzame carrière ontwikkeling.",
            scale: "1-10",
          },
        ],
      },
      exercises: [
        {
          title: "Productiviteit Balans",
          duration: "25 min",
          difficulty: "Medium",
        },
        { title: "Purpose Alignment", duration: "30 min", difficulty: "Hard" },
        { title: "Werk-Privé Balans", duration: "20 min", difficulty: "Easy" },
      ],
      community: {
        links: [
          {
            title: "Carrièretransities",
            hashtag: "#Carrièretransities",
            url: "#",
          },
          { title: "Werk Privé Balans", hashtag: "#WerkPrivéBalans", url: "#" },
          { title: "Hybride Werken", hashtag: "#HybrideWerken", url: "#" },
        ],
        events: [
          {
            title: "Networking Event: Tech & Innovation",
            date: "20 November 2024",
            location: "Rotterdam",
          },
          {
            title: "Career Coaching Workshop",
            date: "12 December 2024",
            location: "Online",
          },
        ],
      },
    },
    hobbyPassies: {
      id: "hobbyPassies",
      name: "🎨 Hobby's & Passies",
      color: "from-pink-500 to-rose-600",
      description:
        "Creativity coaching en inspiration voor persoonlijke expressie",
      hashtags: [
        "#DigitaleCreativiteit",
        "#Zelfexpressie",
        "#OnlineCommunities",
      ],
      questionnaire: {
        title: "Creativiteit & Persoonlijke Expressie",
        questions: [
          {
            id: "hobby_zingeving",
            question:
              "Hoe vaak ervaar je zingeving in dagelijkse activiteiten?",
            context: "Zingeving kan ook voortkomen uit hobby's en passies.",
            scale: "1-10",
          },
          {
            id: "passie_tijd",
            question: "Hoe vaak besteed je tijd aan je passies?",
            context:
              "Tijd voor passies is essentieel voor persoonlijke vervulling.",
            scale: "1-10",
          },
          {
            id: "creativiteit_dagelijks",
            question: "Hoe creatief voel je je in je dagelijks leven?",
            context:
              "Creativiteit is een belangrijke indicator van persoonlijke expressie.",
            scale: "1-10",
          },
          {
            id: "creativiteit_delen",
            question: "Hoe vaak deel je je creatieve werk met anderen?",
            context:
              "Het delen van creativiteit versterkt de verbinding met anderen.",
            scale: "1-10",
          },
        ],
      },
      exercises: [
        {
          title: "Passie Ontdekking",
          duration: "30 min",
          difficulty: "Medium",
        },
        {
          title: "Creativiteit Cultivatie",
          duration: "25 min",
          difficulty: "Hard",
        },
        {
          title: "Zelfexpressie Sessie",
          duration: "20 min",
          difficulty: "Easy",
        },
      ],
      community: {
        links: [
          {
            title: "Digitale Creativiteit",
            hashtag: "#DigitaleCreativiteit",
            url: "#",
          },
          { title: "Zelfexpressie", hashtag: "#Zelfexpressie", url: "#" },
          {
            title: "Online Communities",
            hashtag: "#OnlineCommunities",
            url: "#",
          },
        ],
        events: [
          {
            title: "Creativiteit Festival",
            date: "25-26 November 2024",
            location: "Utrecht",
          },
          {
            title: "Schrijven Workshop",
            date: "15 December 2024",
            location: "Online",
          },
        ],
      },
    },
    actieveImaginatie: {
      id: "actieveImaginatie",
      name: "🧘 Actieve Imaginatie",
      color: "from-indigo-500 to-blue-600",
      description: "Imagination coaching en resources voor innerlijke groei",
      hashtags: [
        "#MindfulnessTechnieken",
        "#Visualisatie",
        "#CreatieveTherapie",
      ],
      questionnaire: {
        title: "Innerlijke Reis & Zelfontdekking",
        questions: [
          {
            id: "visualisatie_oefenen",
            question: "Hoe vaak oefen je visualisatie of meditatie?",
            context:
              "Regelmatige beoefening van actieve imaginatie versterkt innerlijke groei.",
            scale: "1-10",
          },
          {
            id: "innerlijke_stem",
            question: "Hoe goed kun je je innerlijke stem horen?",
            context:
              "Verbinding met je innerlijke zelf is de basis van actieve imaginatie.",
            scale: "1-10",
          },
          {
            id: "diepe_inzichten",
            question: "Hoe vaak ervaar je diepe inzichten over jezelf?",
            context:
              "Zelfinzicht is een resultaat van actieve imaginatie praktijken.",
            scale: "1-10",
          },
          {
            id: "innerlijke_reizen",
            question: "Hoe comfortabel ben je met innerlijke reizen?",
            context:
              "Comfort met innerlijke reizen is essentieel voor spirituele groei.",
            scale: "1-10",
          },
        ],
      },
      exercises: [
        {
          title: "Zelfacceptatie Visualisatie",
          duration: "20 min",
          difficulty: "Medium",
        },
        {
          title: "Innerlijke Dialoog Versterking",
          duration: "25 min",
          difficulty: "Hard",
        },
        {
          title: "Spirituele Groei Sessie",
          duration: "15 min",
          difficulty: "Easy",
        },
      ],
      community: {
        links: [
          {
            title: "Mindfulness Technieken",
            hashtag: "#MindfulnessTechnieken",
            url: "#",
          },
          { title: "Visualisatie", hashtag: "#Visualisatie", url: "#" },
          {
            title: "Creatieve Therapie",
            hashtag: "#CreatieveTherapie",
            url: "#",
          },
        ],
        events: [
          {
            title: "Actieve Imaginatie Retreat",
            date: "1-3 December 2024",
            location: "Ardennen, België",
          },
          {
            title: "Visualisatie Workshop",
            date: "18 November 2024",
            location: "Online",
          },
        ],
      },
    },
    professioneleOntwikkeling: {
      id: "professioneleOntwikkeling",
      name: "📈 Professionele Ontwikkeling",
      color: "from-emerald-500 to-green-600",
      description: "Professional growth en skills voor carrière vooruitgang",
      hashtags: ["#DigitaleVaardigheden", "#AIKennis", "#CarrièreCoaching"],
      questionnaire: {
        title: "Carrière Groei & Vaardigheden",
        questions: [
          {
            id: "prof_doelgericht",
            question: "Hoe vaak handel je doelgericht?",
            context:
              "Doelgericht handelen is relevant voor professionele groei.",
            scale: "1-10",
          },
          {
            id: "prof_stress",
            question: "Hoe hoog is je ervaren stressniveau?",
            context:
              "Stress kan ook verband houden met professionele ontwikkeling.",
            scale: "0-10",
          },
          {
            id: "nieuwe_vaardigheden",
            question: "Hoe regelmatig ontwikkel je nieuwe vaardigheden?",
            context: "Continue leren is essentieel voor professionele groei.",
            scale: "1-10",
          },
          {
            id: "prof_tevredenheid",
            question: "Hoe tevreden ben je met je professionele vooruitgang?",
            context:
              "Professionele tevredenheid is een indicator van carrière gezondheid.",
            scale: "1-10",
          },
        ],
      },
      exercises: [
        {
          title: "Skill Gap Analyse",
          duration: "30 min",
          difficulty: "Medium",
        },
        { title: "Netwerk Strategie", duration: "25 min", difficulty: "Hard" },
        {
          title: "Vaardigheden Tracking",
          duration: "20 min",
          difficulty: "Easy",
        },
      ],
      community: {
        links: [
          {
            title: "Digitale Vaardigheden",
            hashtag: "#DigitaleVaardigheden",
            url: "#",
          },
          { title: "AI Kennis", hashtag: "#AIKennis", url: "#" },
          {
            title: "Carrière Coaching",
            hashtag: "#CarrièreCoaching",
            url: "#",
          },
        ],
        events: [
          {
            title: "Leadership Summit",
            date: "30 November 2024",
            location: "Amsterdam",
          },
          {
            title: "Tech Skills Workshop",
            date: "10 December 2024",
            location: "Online",
          },
        ],
      },
    },
    socialeRelaties: {
      id: "socialeRelaties",
      name: "❤️ Sociale en Liefdesrelaties",
      color: "from-red-500 to-pink-600",
      description: "Relationship coaching en privacy voor gezonde verbindingen",
      hashtags: [
        "#Communicatievaardigheden",
        "#EmotioneleIntelligentie",
        "#RelatieCoaching",
      ],
      questionnaire: {
        title: "Verbinding & Intimiteit",
        questions: [
          {
            id: "sociale_steun",
            question: "Hoeveel sociale steun ervaar je?",
            context:
              "Sociale steun is direct gerelateerd aan relaties en sociale netwerken.",
            scale: "1-10",
          },
          {
            id: "relatie_stress",
            question: "Hoe hoog is je ervaren stressniveau?",
            context: "Stress kan ook voortkomen uit relaties.",
            scale: "0-10",
          },
          {
            id: "emoties_delen",
            question: "Hoe goed kun je je emoties delen met anderen?",
            context: "Emotionele openheid is essentieel voor gezonde relaties.",
            scale: "1-10",
          },
          {
            id: "sociale_tevredenheid",
            question: "Hoe tevreden ben je met je sociale netwerk?",
            context:
              "Sociale tevredenheid is een indicator van relationele gezondheid.",
            scale: "1-10",
          },
        ],
      },
      exercises: [
        {
          title: "Communicatie Vaardigheden",
          duration: "25 min",
          difficulty: "Medium",
        },
        {
          title: "Emotionele Intelligentie",
          duration: "30 min",
          difficulty: "Hard",
        },
        { title: "Relatie Coaching", duration: "20 min", difficulty: "Easy" },
      ],
      community: {
        links: [
          {
            title: "Communicatievaardigheden",
            hashtag: "#Communicatievaardigheden",
            url: "#",
          },
          {
            title: "Emotionele Intelligentie",
            hashtag: "#EmotioneleIntelligentie",
            url: "#",
          },
          { title: "Relatie Coaching", hashtag: "#RelatieCoaching", url: "#" },
        ],
        events: [
          {
            title: "Relatie Workshop: Communicatie",
            date: "23 November 2024",
            location: "Den Haag",
          },
          {
            title: "Sociale Vaardigheden Training",
            date: "7 December 2024",
            location: "Online",
          },
        ],
      },
    },
    thuisOmgeving: {
      id: "thuisOmgeving",
      name: "🏡 Thuis en Omgeving",
      color: "from-yellow-500 to-orange-600",
      description:
        "Environment optimization en resources voor gezonde leefomgeving",
      hashtags: [
        "#SlimmeTechnologie",
        "#DuurzaamWonen",
        "#GezondeLeefomgeving",
      ],
      questionnaire: {
        title: "Leefomgeving & Energie",
        questions: [
          {
            id: "thuis_slaap",
            question: "Hoe regelmatig slaap je voldoende?",
            context: "Slaap kan beïnvloed worden door de thuisomgeving.",
            scale: "1-10",
          },
          {
            id: "thuis_stress",
            question: "Hoe hoog is je ervaren stressniveau?",
            context: "De omgeving kan stress beïnvloeden.",
            scale: "0-10",
          },
          {
            id: "thuis_comfort",
            question: "Hoe comfortabel voel je je in je thuisomgeving?",
            context: "Comfort in je omgeving is essentieel voor welzijn.",
            scale: "1-10",
          },
          {
            id: "thuis_organisatie",
            question: "Hoe georganiseerd is je leefruimte?",
            context:
              "Organisatie van je omgeving beïnvloedt je energie en focus.",
            scale: "1-10",
          },
        ],
      },
      exercises: [
        {
          title: "Thuis Optimalisatie",
          duration: "30 min",
          difficulty: "Medium",
        },
        { title: "Duurzaam Leven", duration: "25 min", difficulty: "Hard" },
        { title: "Energie Management", duration: "20 min", difficulty: "Easy" },
      ],
      community: {
        links: [
          {
            title: "Slimme Technologie",
            hashtag: "#SlimmeTechnologie",
            url: "#",
          },
          { title: "Duurzaam Wonen", hashtag: "#DuurzaamWonen", url: "#" },
          {
            title: "Gezonde Leefomgeving",
            hashtag: "#GezondeLeefomgeving",
            url: "#",
          },
        ],
        events: [
          {
            title: "Thuis Optimalisatie Workshop",
            date: "27 November 2024",
            location: "Eindhoven",
          },
          {
            title: "Duurzaam Leven Seminar",
            date: "14 December 2024",
            location: "Online",
          },
        ],
      },
    },
  };

  const area = areaDetails[areaId as keyof typeof areaDetails];

  useEffect(() => {
    if (area) {
      // Initialize questionnaire answers
      const initialAnswers: { [key: string]: number } = {};
      area.questionnaire.questions.forEach((q) => {
        initialAnswers[q.id] = 5; // Default to middle value
      });
      setQuestionnaireAnswers(initialAnswers);

      // Calculate initial progress
      const totalQuestions = area.questionnaire.questions.length;
      const answeredQuestions = Object.keys(initialAnswers).length;
      setProgress((answeredQuestions / totalQuestions) * 100);
    }
  }, [area]);

  const handleQuestionnaireChange = (questionId: string, value: number) => {
    setQuestionnaireAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Update progress
    const totalQuestions = area?.questionnaire.questions.length || 0;
    const answeredQuestions = Object.keys(questionnaireAnswers).length;
    setProgress((answeredQuestions / totalQuestions) * 100);
  };

  const calculateAverageScore = () => {
    const values = Object.values(questionnaireAnswers);
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  };

  const handleSave = async () => {
    if (!area || !areaId) {
      logger.error("No area or areaId available for saving");
      return;
    }

    setIsSaving(true);
    setSaveStatus("saving");

    try {
      logger.info("💾 Saving levensgebied questionnaire answers:", {
        areaId,
        answers: questionnaireAnswers,
        totalScore: calculateAverageScore(),
      });

      await database.write(async () => {
        const levensgebiedenCollection = database.get(
          "levensgebieden_questionnaires",
        );

        // Check if there's already a record for this user and levensgebied
        const existingRecords = await levensgebiedenCollection.query().fetch();

        const existingRecord = existingRecords.find(
          (record) =>
            (record as any).userId === (userData?.id || "anon") &&
            (record as any).levensgebied === areaId,
        );

        if (existingRecord) {
          // Update existing record
          await existingRecord.update((record: any) => {
            record.answersJson = JSON.stringify(questionnaireAnswers);
            record.totalScore = calculateAverageScore();
            record.completedAt = Date.now();
            record.assessmentType = "follow_up";
            record.mbtiType = userData?.mbtiType || "UNKNOWN";
            record.updatedAt = Date.now();
          });

          logger.info("✅ Updated existing levensgebied questionnaire record");
        } else {
          // Create new record
          await levensgebiedenCollection.create((record: any) => {
            record.userId = userData?.id || "anon";
            record.levensgebied = areaId;
            record.answersJson = JSON.stringify(questionnaireAnswers);
            record.totalScore = calculateAverageScore();
            record.completedAt = Date.now();
            record.assessmentType = "initial";
            record.mbtiType = userData?.mbtiType || "UNKNOWN";
            record.createdAt = Date.now();
            record.updatedAt = Date.now();
          });

          logger.info("✅ Created new levensgebied questionnaire record");
        }
      });

      setSaveStatus("saved");
      logger.info("🎉 Levensgebied questionnaire saved successfully!");

      // Reset save status after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch (error) {
      logger.error("❌ Error saving levensgebied questionnaire:", undefined, error);
      setSaveStatus("error");

      // Reset error status after 5 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToBasics = () => {
    navigate("/basics");
  };

  if (!area) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Levensgebied niet gevonden
          </h1>
          <Button color="primary" onClick={handleBackToBasics}>
            Terug naar Basics
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className={`bg-gradient-to-r ${area.color} text-white p-6`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              isIconOnly
              variant="light"
              onClick={handleBackToBasics}
              className="text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold">{area.name}</h1>
          </div>
          <p className="text-lg opacity-90">{area.description}</p>

          {/* Hashtags */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {area.hashtags.map((hashtag, index) => (
              <Chip
                key={index}
                variant="flat"
                className="bg-white/20 text-white border-white/30"
              >
                {hashtag}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
          className="w-full"
          color="primary"
          variant="underlined"
        >
          <Tab
            key="overview"
            title={
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Overzicht
              </div>
            }
          >
            <Card className="mt-6">
              <CardHeader>
                <h2 className="text-xl font-semibold">
                  Welkom bij {area.name}
                </h2>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600 mb-4">
                  Dit levensgebied focust op {area.description.toLowerCase()}.
                  Gebruik de verschillende tabs om je persoonlijke ontwikkeling
                  te tracken en te verbeteren.
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {area.questionnaire.questions.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      Vragenlijst Items
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {area.exercises.length}
                    </div>
                    <div className="text-sm text-gray-600">Oefeningen</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {area.community.links.length}
                    </div>
                    <div className="text-sm text-gray-600">Community Links</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab
            key="exercises"
            title={
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Oefeningen
              </div>
            }
          >
            <Card className="mt-6">
              <CardHeader>
                <h2 className="text-xl font-semibold">
                  Beschikbare Oefeningen
                </h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {area.exercises.map((exercise, index) => (
                    <Card
                      key={index}
                      className="border-2 border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <CardBody>
                        <h3 className="font-semibold mb-2">{exercise.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {exercise.duration}
                          </span>
                          <Chip
                            size="sm"
                            color={
                              exercise.difficulty === "Easy"
                                ? "success"
                                : exercise.difficulty === "Medium"
                                  ? "warning"
                                  : "danger"
                            }
                          >
                            {exercise.difficulty}
                          </Chip>
                        </div>
                        <Button
                          color="primary"
                          size="sm"
                          className="mt-3 w-full"
                          startContent={<Play className="w-4 h-4" />}
                        >
                          Start Oefening
                        </Button>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab
            key="questionnaire"
            title={
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Vragenlijst
              </div>
            }
          >
            <Card className="mt-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {area.questionnaire.title}
                  </h2>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {calculateAverageScore().toFixed(1)}/10
                    </div>
                    <div className="text-sm text-gray-600">
                      Gemiddelde Score
                    </div>
                  </div>
                </div>
                <Progress
                  value={progress}
                  color="success"
                  className="mt-2"
                  showValueLabel={true}
                />
              </CardHeader>
              <CardBody>
                <div className="space-y-6">
                  {area.questionnaire.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="border-l-4 border-blue-500 pl-4"
                    >
                      <h3 className="font-semibold mb-2">
                        {index + 1}. {question.question}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {question.context}
                      </p>

                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 w-16">
                          {question.scale.split("-")[0]}
                        </span>
                        <input
                          type="range"
                          min={question.scale.split("-")[0]}
                          max={question.scale.split("-")[1]}
                          value={questionnaireAnswers[question.id] || 5}
                          onChange={(e) =>
                            handleQuestionnaireChange(
                              question.id,
                              parseInt(e.target.value),
                            )
                          }
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="text-sm text-gray-500 w-16 text-right">
                          {question.scale.split("-")[1]}
                        </span>
                        <span className="text-lg font-semibold text-blue-600 w-12 text-center">
                          {questionnaireAnswers[question.id] || 5}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {Object.keys(questionnaireAnswers).length > 0
                        ? `${Object.keys(questionnaireAnswers).length} vragen beantwoord`
                        : "Geen vragen beantwoord"}
                    </div>
                    <Button
                      color={
                        saveStatus === "saved"
                          ? "success"
                          : saveStatus === "error"
                            ? "danger"
                            : "primary"
                      }
                      variant={saveStatus === "saved" ? "flat" : "solid"}
                      startContent={
                        saveStatus === "saving" ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : saveStatus === "saved" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )
                      }
                      onClick={handleSave}
                      isLoading={isSaving}
                      disabled={Object.keys(questionnaireAnswers).length === 0}
                      className="min-w-[120px]"
                    >
                      {saveStatus === "saving" && "Opslaan..."}
                      {saveStatus === "saved" && "Opgeslagen!"}
                      {saveStatus === "error" && "Fout - Probeer opnieuw"}
                      {saveStatus === "idle" && "Antwoorden Opslaan"}
                    </Button>
                  </div>

                  {saveStatus === "saved" && (
                    <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Je antwoorden zijn succesvol opgeslagen in de database!
                    </div>
                  )}

                  {saveStatus === "error" && (
                    <div className="mt-2 text-sm text-red-600">
                      Er is een fout opgetreden bij het opslaan. Probeer het
                      opnieuw.
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab
            key="community"
            title={
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Community
              </div>
            }
          >
            <Card className="mt-6">
              <CardHeader>
                <h2 className="text-xl font-semibold">
                  Community Links & Events
                </h2>
              </CardHeader>
              <CardBody>
                {/* Community Links */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Community Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {area.community.links.map((link, index) => (
                      <Card
                        key={index}
                        className="border-2 border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <CardBody>
                          <h4 className="font-semibold mb-2">{link.title}</h4>
                          <Chip color="primary" variant="flat" className="mb-3">
                            {link.hashtag}
                          </Chip>
                          <Button
                            color="primary"
                            size="sm"
                            className="w-full"
                            startContent={<MessageCircle className="w-4 h-4" />}
                          >
                            Bekijk Community
                          </Button>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Events */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Aankomende Events
                  </h3>
                  <div className="space-y-3">
                    {area.community.events.map((event, index) => (
                      <Card key={index} className="border-2 border-gray-200">
                        <CardBody>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold mb-1">
                                {event.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                {event.date}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <Star className="w-4 h-4" />
                                {event.location}
                              </div>
                            </div>
                            <Button
                              color="success"
                              size="sm"
                              startContent={<CheckCircle className="w-4 h-4" />}
                            >
                              Inschrijven
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab
            key="progress"
            title={
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Progressie
              </div>
            }
          >
            <Card className="mt-6">
              <CardHeader>
                <h2 className="text-xl font-semibold">Jouw Progressie</h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Questionnaire Progress */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Vragenlijst Resultaten
                    </h3>
                    <div className="space-y-3">
                      {area.questionnaire.questions.map((question) => (
                        <div
                          key={question.id}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600 flex-1 mr-4">
                            {question.question.substring(0, 30)}...
                          </span>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={
                                (questionnaireAnswers[question.id] || 0) * 10
                              }
                              color="primary"
                              className="w-20"
                              size="sm"
                            />
                            <span className="text-sm font-semibold w-8 text-right">
                              {questionnaireAnswers[question.id] || 0}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overall Stats */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Algemene Statistieken
                    </h3>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">
                          {calculateAverageScore().toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Gemiddelde Score
                        </div>
                      </div>

                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-600">
                          {Math.round(progress)}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Vragenlijst Voltooid
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab
            key="ai-coaching"
            title={
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                AI Coaching
              </div>
            }
          >
            <Card className="mt-6">
              <CardHeader>
                <h2 className="text-xl font-semibold">
                  AI Coaching & Inzichten
                </h2>
              </CardHeader>
              <CardBody>
                <div className="text-center py-8">
                  <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    AI Coaching Komt Binnenkort
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Gebaseerd op je vragenlijst resultaten en MBTI type, krijg
                    je gepersonaliseerde coaching en inzichten voor dit
                    levensgebied.
                  </p>
                  <Button color="primary" disabled>
                    AI Coaching Activeren
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default LevensgebiedDetailPage;
