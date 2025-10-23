import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Textarea,
  Input,
  Chip,
  Progress,
  Badge,
} from '@nextui-org/react';
import {
  BookOpen,
  Plus,
  Calendar,
  Target,
  Edit,
  Trash,
  Save,
  X,
  ArrowLeft,
  Home,
  Brain,
  Lightbulb,
  Heart,
  Trophy,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { logger } from '../utils/logger';
import database from '../database/v14/database'; // V14 database
import { TaskV14 } from '../database/v14/models/Task'; // V14 Task model
import JournalEntryModel from '../database/v14/models/JournalEntry'; // V14 JournalEntry model
import v14AppSyncService from '../services/v14AppSyncService'; // V14 sync service
import V14SyncStatus from './V14SyncStatus'; // V14 sync status component
import MBTIJournalingPrompts from './MBTIJournalingPrompts';
import AICoachingWithContext from './AICoachingWithContext';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: number;
  tags: string[];
  date: string;
  createdAt: string;
  mbtiType?: string;
  promptId?: string;
  category?: 'self-awareness' | 'relationships' | 'growth' | 'creativity' | 'values';
  insights?: string[];
  contentReflections?: string[];
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

const JournalingPage: React.FC = () => {
  const { userData } = useAppStore();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // V14: Load tasks from database with sync
  const loadTasks = async () => {
    try {
      const tasksCollection = database.get('tasks');
      const allTasks = await tasksCollection.query().fetch();
      const userTasks = allTasks.filter((task: any) => task.userId === (userData?.id || ''));
      setTasks(userTasks as any);
      
      // Sync tasks to MCP-Bridge
      await v14AppSyncService.syncTable('tasks');
      logger.info('Tasks synced to MCP-Bridge');
    } catch (error) {
      logger.error('Failed to load tasks:', undefined, error);
    }
  };
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [showMBTIPrompts, setShowMBTIPrompts] = useState(false);
  const [showAICoaching, setShowAICoaching] = useState(false);
  const [currentView, setCurrentView] = useState<'journal' | 'prompts' | 'coaching'>('journal');
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 3,
    tags: [],
    mbtiType: userData?.mbtiType || 'INFP',
    category: 'self-awareness' as 'self-awareness' | 'relationships' | 'growth' | 'creativity' | 'values',
  });
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
  });
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const userName = userData?.name || 'Gebruiker';

  // Mock data for demonstration
  useEffect(() => {
    // V14: Load tasks from database
    if (userData?.id) {
      loadTasks();
    }
    
    const mockEntries: JournalEntry[] = [
      {
        id: '1',
        title: 'Mijn Innerlijke Waarden Verkenning',
        content:
          'Vandaag heb ik diep nagedacht over mijn kernwaarden. Ik realiseer me dat authenticiteit en creativiteit voor mij het belangrijkst zijn. Ik voel me het meest mezelf wanneer ik kan uiten wat ik echt voel en denk.',
        mood: 4,
        tags: ['waarden', 'authenticiteit', 'zelfreflectie'],
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        mbtiType: userData?.mbtiType || 'INFP',
        promptId: 'infp_1',
        category: 'values',
        insights: ['Authenticiteit is mijn hoogste waarde', 'Creativiteit geeft me energie'],
        contentReflections: ['Mindfulness oefening over waarden', 'MBTI waarden assessment']
      },
      {
        id: '2',
        title: 'Empathie en Grenzen',
        content:
          'Ik merk dat ik soms te veel energie geef aan anderen en te weinig aan mezelf. Vandaag heb ik geleerd om "nee" te zeggen zonder me schuldig te voelen. Het is oké om voor mezelf te zorgen.',
        mood: 3,
        tags: ['empathie', 'grenzen', 'zelfzorg'],
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        mbtiType: userData?.mbtiType || 'INFP',
        promptId: 'infp_3',
        category: 'relationships',
        insights: ['Grenzen stellen is een vorm van zelfliefde', 'Empathie moet in balans zijn'],
        contentReflections: ['Artikel over gezonde grenzen', 'Podcast over empathie en energie']
      },
    ];

    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Dagelijkse reflectie schrijven',
        completed: true,
        priority: 'high',
        dueDate: new Date().toISOString().split('T')[0],
      },
      {
        id: '2',
        title: 'Nieuwe doelen opstellen',
        completed: false,
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      },
    ];

    setEntries(mockEntries);
    setTasks(mockTasks);
  }, []);

  const handleAddEntry = () => {
    if (newEntry.title && newEntry.content) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        title: newEntry.title,
        content: newEntry.content,
        mood: newEntry.mood,
        tags: newEntry.tags,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        mbtiType: newEntry.mbtiType,
        category: newEntry.category,
      };
      setEntries([entry, ...entries]);
      setNewEntry({ 
        title: '', 
        content: '', 
        mood: 3, 
        tags: [],
        mbtiType: userData?.mbtiType || 'INFP',
        category: 'self-awareness'
      });
      setIsAddingEntry(false);
    }
  };

  const handleMBTIPromptSelect = (prompt: any) => {
    setNewEntry({
      ...newEntry,
      title: prompt.title,
      content: `Prompt: ${prompt.description}\n\nMijn reflectie:\n`,
      category: prompt.category,
      tags: prompt.tags,
    });
    setShowMBTIPrompts(false);
    setIsAddingEntry(true);
  };

  const handleAddTask = async () => {
    if (newTask.title && userData?.id) {
      try {
        // V14: Create task in database
        const tasksCollection = database.get('tasks');
        await database.write(async () => {
          await tasksCollection.create((task: any) => {
            task.userId = userData.id;
            task.title = newTask.title;
            task.description = '';
            task.completed = false;
            task.priority = newTask.priority;
            task.dueDate = newTask.dueDate ? new Date(newTask.dueDate).getTime() : null;
            task.category = 'personal';
            task.tags = '[]';
            task.createdAt = Date.now();
            task.updatedAt = Date.now();
            task.createdBy = userData.id;
          });
        });
        
        // Reload tasks from database
        await loadTasks();
        
        setNewTask({ title: '', priority: 'medium', dueDate: '' });
        setIsAddingTask(false);
      } catch (error) {
        logger.error('Failed to create task:', undefined, error);
      }
    }
  };

  const toggleTask = async (taskId: string) => {
    try {
      // V14: Update task in database
      const tasksCollection = database.get('tasks');
      const task = await tasksCollection.find(taskId);
      
      await database.write(async () => {
        await task.update((taskRecord: any) => {
          taskRecord.completed = !taskRecord.completed;
          taskRecord.updatedAt = Date.now();
        });
      });
      
      // Reload tasks from database
      await loadTasks();
    } catch (error) {
      logger.error('Failed to toggle task:', undefined, error);
    }
  };

  const deleteEntry = (entryId: string) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
    if (selectedEntry?.id === entryId) {
      setSelectedEntry(null);
    }
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😢', '😕', '😐', '🙂', '😊'];
    return emojis[Math.min(mood - 1, 4)];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900/20 via-purple-900/20 to-slate-900/20 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h1 className='text-3xl font-bold text-white mb-2'>
                📖 MBTI Journaling & Reflectie
              </h1>
              <p className='text-gray-300'>
                Welkom terug, {userName}! Ontdek je {userData?.mbtiType || 'INFP'} persoonlijkheid door diepgaande reflectie en AI-coaching.
              </p>
            </div>
            <div className='flex gap-3 flex-wrap'>
              <Button
                color='secondary'
                variant='bordered'
                startContent={<ArrowLeft />}
                onClick={() => window.history.back()}
                className='bg-white/10 border-white/20 text-white hover:bg-white/20'
              >
                Terug
              </Button>
              <Button
                color='warning'
                variant='bordered'
                startContent={<Trophy />}
                onClick={() => (window.location.href = '/challenges')}
                className='bg-white/10 border-white/20 text-white hover:bg-white/20'
              >
                Challenges
              </Button>
              <Button
                color='primary'
                variant='bordered'
                startContent={<Home />}
                onClick={() => (window.location.href = '/')}
                className='bg-white/10 border-white/20 text-white hover:bg-white/20'
              >
                Hoofdmenu
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className='flex justify-center mb-6'>
            <div className='glass rounded-xl p-2'>
              <div className='flex space-x-2'>
                {[
                  { id: 'journal', label: 'Dagboek', icon: '📖' },
                  { id: 'prompts', label: 'MBTI Prompts', icon: '🧠' },
                  { id: 'coaching', label: 'AI Coaching', icon: '💡' }
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    onClick={() => setCurrentView(tab.id as any)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentView === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span className='mr-2'>{tab.icon}</span>
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Challenge Section */}
          <div className='mb-6'>
            <Card className='bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-orange-500/30'>
              <CardBody className='p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-lg'>
                      🏆
                    </div>
                    <div>
                      <h3 className='font-semibold text-white'>Journaling Challenge Actief</h3>
                      <p className='text-sm text-gray-300'>30 Dagen Journaling Challenge - 15/30 dagen voltooid</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Progress 
                      value={50} 
                      className='w-24' 
                      color='warning'
                      size='sm'
                    />
                    <Button
                      color='warning'
                      size='sm'
                      variant='bordered'
                      startContent={<Trophy className='w-4 h-4' />}
                      onClick={() => (window.location.href = '/challenges')}
                    >
                      Bekijk Challenge
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Main Content Area */}
        {currentView === 'journal' && (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Journal Entries Section */}
            <div className='lg:col-span-2'>
              <Card className='mb-6 glass border border-white/10'>
            <CardHeader className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <BookOpen className='text-blue-500' />
                <h2 className='text-xl font-semibold'>Dagboek Entries</h2>
              </div>
              <Button
                color='primary'
                startContent={<Plus />}
                onClick={() => setIsAddingEntry(true)}
              >
                Nieuwe Entry
              </Button>
            </CardHeader>
            <CardBody>
              {/* Add New Entry Form */}
              {isAddingEntry && (
                <Card className='mb-4 border-2 border-blue-200'>
                  <CardBody className='space-y-4'>
                    <Input
                      label='Titel'
                      value={newEntry.title}
                      onChange={e =>
                        setNewEntry({ ...newEntry, title: e.target.value })
                      }
                      placeholder='Geef je entry een titel...'
                    />
                    <Textarea
                      label='Inhoud'
                      value={newEntry.content}
                      onChange={e =>
                        setNewEntry({ ...newEntry, content: e.target.value })
                      }
                      placeholder='Schrijf hier je gedachten...'
                      minRows={4}
                    />
                    <div className='flex gap-4'>
                      <div className='flex-1'>
                        <label
                          htmlFor='mood-selector'
                          className='text-sm font-medium mb-2 block'
                        >
                          Humeur
                        </label>
                        <div className='flex gap-2'>
                          {[1, 2, 3, 4, 5].map(mood => (
                            <Button
                              key={mood}
                              size='sm'
                              variant={
                                newEntry.mood === mood ? 'solid' : 'bordered'
                              }
                              onClick={() => setNewEntry({ ...newEntry, mood })}
                            >
                              {getMoodEmoji(mood)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <Button color='success' onClick={handleAddEntry}>
                        <Save className='w-4 h-4 mr-2' />
                        Opslaan
                      </Button>
                      <Button
                        color='danger'
                        variant='bordered'
                        onClick={() => setIsAddingEntry(false)}
                      >
                        <X className='w-4 h-4 mr-2' />
                        Annuleren
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Entries List */}
              <div className='space-y-4'>
                {entries.map(entry => (
                  <Card
                    key={entry.id}
                    className='cursor-pointer hover:shadow-md transition-shadow'
                  >
                    <CardBody>
                      <div className='flex justify-between items-start mb-2'>
                        <h3 className='font-semibold text-lg'>{entry.title}</h3>
                        <div className='flex items-center gap-2'>
                          <span className='text-2xl'>
                            {getMoodEmoji(entry.mood)}
                          </span>
                          <div className='flex gap-1'>
                            <Button
                              size='sm'
                              variant='light'
                              onClick={() => {
                                logger.debug('Edit entry:', { id: entry.id });
                              }}
                            >
                              <Edit className='w-4 h-4' />
                            </Button>
                            <Button
                              size='sm'
                              variant='light'
                              color='danger'
                              onClick={() => deleteEntry(entry.id)}
                            >
                              <Trash className='w-4 h-4' />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className='text-gray-600 mb-3 line-clamp-3'>
                        {entry.content}
                      </p>
                      <div className='flex justify-between items-center'>
                        <div className='flex gap-2'>
                          {entry.tags.map((tag, index) => (
                            <Chip key={index} size='sm' variant='flat'>
                              {tag}
                            </Chip>
                          ))}
                        </div>
                        <span className='text-sm text-gray-500'>
                          {entry.date}
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Tasks Section */}
        <div>
          <Card>
            <CardHeader className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <Target className='text-green-500' />
                <h2 className='text-xl font-semibold'>Taken</h2>
              </div>
              <Button
                color='success'
                size='sm'
                startContent={<Plus />}
                onClick={() => setIsAddingTask(true)}
              >
                Nieuwe Taak
              </Button>
            </CardHeader>
            <CardBody>
              {/* Progress */}
              <div className='mb-4'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm font-medium'>Voortgang</span>
                  <span className='text-sm text-gray-500'>
                    {completedTasks}/{totalTasks}
                  </span>
                </div>
                <Progress
                  value={completionRate}
                  color='success'
                  className='mb-2'
                />
                <span className='text-xs text-gray-500'>
                  {Math.round(completionRate)}% voltooid
                </span>
              </div>

              {/* Add New Task Form */}
              {isAddingTask && (
                <Card className='mb-4 border-2 border-green-200'>
                  <CardBody className='space-y-3'>
                    <Input
                      label='Taak'
                      value={newTask.title}
                      onChange={e =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                      placeholder='Wat wil je doen?'
                    />
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        variant={
                          newTask.priority === 'low' ? 'solid' : 'bordered'
                        }
                        color='success'
                        onClick={() =>
                          setNewTask({ ...newTask, priority: 'low' })
                        }
                      >
                        Laag
                      </Button>
                      <Button
                        size='sm'
                        variant={
                          newTask.priority === 'medium' ? 'solid' : 'bordered'
                        }
                        color='warning'
                        onClick={() =>
                          setNewTask({ ...newTask, priority: 'medium' })
                        }
                      >
                        Gemiddeld
                      </Button>
                      <Button
                        size='sm'
                        variant={
                          newTask.priority === 'high' ? 'solid' : 'bordered'
                        }
                        color='danger'
                        onClick={() =>
                          setNewTask({ ...newTask, priority: 'high' })
                        }
                      >
                        Hoog
                      </Button>
                    </div>
                    <div className='flex gap-2'>
                      <Button color='success' size='sm' onClick={handleAddTask}>
                        <Save className='w-4 h-4 mr-2' />
                        Toevoegen
                      </Button>
                      <Button
                        color='danger'
                        size='sm'
                        variant='bordered'
                        onClick={() => setIsAddingTask(false)}
                      >
                        <X className='w-4 h-4 mr-2' />
                        Annuleren
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Tasks List */}
              <div className='space-y-2'>
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      task.completed
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <input
                      type='checkbox'
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className='w-4 h-4 text-blue-600'
                    />
                    <div className='flex-1'>
                      <p
                        className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}
                      >
                        {task.title}
                      </p>
                      {task.dueDate && (
                        <p className='text-xs text-gray-500 flex items-center gap-1'>
                          <Calendar className='w-3 h-3' />
                          {task.dueDate}
                        </p>
                      )}
                    </div>
                    <Badge
                      color={getPriorityColor(task.priority)}
                      variant='flat'
                      size='sm'
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
            </div>
          </div>
        )}

        {/* MBTI Prompts View */}
        {currentView === 'prompts' && (
          <div className='glass rounded-xl p-6'>
            <div className='text-center mb-6'>
              <h2 className='text-2xl font-bold text-white mb-2'>
                🧠 MBTI Journaling Prompts
              </h2>
              <p className='text-gray-300'>
                Gepersonaliseerde prompts voor jouw {userData?.mbtiType || 'INFP'} persoonlijkheidstype
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {[
                {
                  title: 'Waarden Verkenning',
                  description: 'Ontdek je kernwaarden en hoe ze je keuzes beïnvloeden',
                  category: 'values',
                  icon: '⭐',
                  difficulty: 'beginner'
                },
                {
                  title: 'Creatieve Expressie',
                  description: 'Verbind je emoties met creatieve uitdrukking',
                  category: 'creativity',
                  icon: '🎨',
                  difficulty: 'intermediate'
                },
                {
                  title: 'Empathie en Grenzen',
                  description: 'Balans tussen helpen en zelfzorg',
                  category: 'relationships',
                  icon: '💕',
                  difficulty: 'intermediate'
                },
                {
                  title: 'Zelfbewustzijn',
                  description: 'Diepgaande reflectie op je persoonlijkheid',
                  category: 'self-awareness',
                  icon: '🔍',
                  difficulty: 'beginner'
                },
                {
                  title: 'Persoonlijke Groei',
                  description: 'Strategieën voor ontwikkeling en verbetering',
                  category: 'growth',
                  icon: '🌱',
                  difficulty: 'advanced'
                }
              ].map((prompt, index) => (
                <Card
                  key={index}
                  className='glass border border-white/10 hover:bg-white/10 transition-all cursor-pointer'
                  onClick={() => setShowMBTIPrompts(true)}
                >
                  <CardBody className='p-4'>
                    <div className='text-center'>
                      <div className='text-3xl mb-2'>{prompt.icon}</div>
                      <h3 className='font-semibold text-white mb-2'>{prompt.title}</h3>
                      <p className='text-sm text-gray-300 mb-3'>{prompt.description}</p>
                      <div className='flex justify-between items-center'>
                        <span className='text-xs text-gray-400'>{prompt.category}</span>
                        <span className='text-xs text-gray-400'>{prompt.difficulty}</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
            <div className='text-center mt-6'>
              <Button
                color='primary'
                variant='solid'
                onClick={() => setShowMBTIPrompts(true)}
                className='bg-purple-600 hover:bg-purple-700'
              >
                <Brain className='w-4 h-4 mr-2' />
                Bekijk Alle Prompts
              </Button>
            </div>
          </div>
        )}

        {/* AI Coaching View */}
        {currentView === 'coaching' && (
          <AICoachingWithContext
            userId={userData?.userId || 'temp_user'}
            mbtiType={userData?.mbtiType || 'INFP'}
          />
        )}

        {/* MBTI Prompts Modal */}
        {showMBTIPrompts && (
          <MBTIJournalingPrompts
            onSelectPrompt={handleMBTIPromptSelect}
            onClose={() => setShowMBTIPrompts(false)}
          />
        )}
      </div>
    </div>
  );
};

export default JournalingPage;
