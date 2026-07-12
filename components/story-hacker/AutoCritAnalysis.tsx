import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Activity, Type, MessageSquare, Zap, BarChart2, BookOpen, Clock, AlertTriangle, ChevronLeft, Plus, Settings, ChevronDown, Bold, Italic, Underline, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, List, Quote, Undo, Redo, Maximize2, User, X, Search } from 'lucide-react';

const GENRES = [
  { id: 'academic', name: 'Academic', category: 'Non-Fiction', description: 'Give your knowledge to the world, with guidance based on lauded academic writing from authors such as Stephen Hawking and Neil deGrasse Tyson.' },
  { id: 'biography', name: 'Biography and Memoir', category: 'Non-Fiction', description: 'Your memories. Your life. Your way. Compare your writing with bestselling memoirs from the likes of Henry Kissinger and Jeannette Walls.' },
  { id: 'business', name: 'Business', category: 'Non-Fiction', description: 'Share your expertise in business and sit among the greats, with editing guidance based on authors like Seth Godin, Robert Kiyosaki, and Tim Ferriss.' },
  { id: 'comedy-satire', name: 'Comedy - Satire', category: 'Fiction', description: 'Comedy-satire blends humor with a critical eye, poking fun at societal norms, politics, and human behavior with irony, sarcasm, ridicule, and exaggeration.' },
  { id: 'cozy-mystery', name: 'Cozy Mystery', category: 'Fiction', description: 'Cozy mysteries offer an escape into a world of intrigue without the grittiness or darkness of other mystery genres. Warmth, camaraderie, and captivating mysteries.' },
  { id: 'fantasy', name: 'Fantasy', category: 'Fiction', description: 'Set in a fictional universe, often inspired by real world myth and folklore. Distinguished from sci-fi and horror by the absence of scientific or macabre themes.' },
  { id: 'general-fiction', name: 'General Fiction', category: 'Fiction', description: "Compare your work without specific genre guidelines. Perhaps your work is like classic literary fiction — The Great Gatsby or To Kill a Mockingbird." },
  { id: 'health-wellness', name: 'Health and Wellness', category: 'Non-Fiction', description: 'Feel good about feeling good, when you compare your writing to some of the best selling authors in health and wellness.' },
  { id: 'historical-fiction', name: 'Historical Fiction', category: 'Fiction', description: 'Set in the past, paying close attention to period details, often depicting notable historical figures. Are you having tea with Queen Elizabeth?' },
  { id: 'horror', name: 'Horror', category: 'Fiction', description: 'If your goal is to frighten, scare, or shock your reader, this is the genre for you — a unique mix of thriller, supernatural, and just plain fear.' },
  { id: 'mystery-suspense', name: 'Mystery & Suspense', category: 'Fiction', description: "You have readers on the edge of their seats. Compare your work to the greatest mystery and suspense writers like Stephen King and James Patterson." },
  { id: 'non-fiction-narrative', name: 'Non-Fiction Narrative', category: 'Non-Fiction', description: 'True-life stories of the human spirit and towering endeavors never fail to capture interest. Tell yours today.' },
  { id: 'non-fiction-prescriptive', name: 'Non-Fiction Prescriptive', category: 'Non-Fiction', description: 'Compare your work with all-time masters of instructional non-fiction, including Dale Carnegie, Daniel H. Pink, and Robert Greene.' },
  { id: 'paranormal-romance', name: 'Paranormal Romance', category: 'Fiction', description: 'Paranormal romance focuses on romantic love with elements beyond scientific explanation, blending fantasy, science fiction, and horror.' },
  { id: 'political', name: 'Political', category: 'Non-Fiction', description: "Politics can be a messy business. Your book doesn't need to be. Get editing guidance based on the world's most impactful political books." },
  { id: 'romance', name: 'Romance', category: 'Fiction', description: 'Love is in the air - and in your novel! Compare your work to your favorite romance novelists like Nicholas Sparks and Danielle Steel.' },
  { id: 'science-fiction', name: 'Science Fiction', category: 'Fiction', description: 'Space exploration, futuristic concepts, advanced science, alien technologies, time travel and parallel universes. This is your home.' },
  { id: 'short-story', name: 'Short Story', category: 'Fiction', description: 'Some of the greatest authors found their niche in short stories. Compare your work to a genre that became home to Hemingway and Oscar Wilde.' },
  { id: 'spiritual', name: 'Spiritual', category: 'Non-Fiction', description: 'Explore the spiritual side of yourself and your readers, with editing guidance based on Deepak Chopra and Don Miguel Ruiz.' },
  { id: 'thriller', name: 'Thriller', category: 'Fiction', description: 'Keep your audience on the edge of their seats with strong villains, plot twists, and cliff hangers. Often a parent genre for Mystery and Horror.' },
  { id: 'urban-fantasy', name: 'Urban Fantasy', category: 'Fiction', description: 'Magical or supernatural elements within a modern, real-world setting — often hidden beneath the surface of everyday city life.' },
  { id: 'young-adult', name: 'Young Adult', category: 'Fiction', description: 'Compare your work to your favorite young adult novelists like Suzanne Collins and John Green. High school, first loves, and coming of age.' },
];

interface Document {
  _id: string;
  name: string;
  content: string;
  aiAnalysis?: Record<string, string>;
}

interface AutoCritAnalysisProps {
  documents: Document[];
  onUpdateDocument?: (id: string, content: string, aiAnalysis?: Record<string, string>) => void;
}

type MainTab = 'Planning' | 'Analysis' | 'Pacing' | 'Dialogue' | 'Strong Writing' | 'Word Choice' | 'Repetition' | 'Readability' | 'Inspiration' | 'Publishing';

const adverbsRegex = /\b[a-zA-Z]+ly\b/gi;
const dialogueTags = ['said', 'asked', 'replied', 'shouted', 'whispered', 'muttered', 'cried', 'stated', 'sighed', 'nodded'];
const passiveVoiceHelpers = ['was', 'had', 'were', 'has', 'wasn\'t', 'i\'d', 'hadn\'t', 'is', 'are', 'be', 'been', 'being'];
const passiveVoiceRegex = new RegExp(`\\b(${passiveVoiceHelpers.join('|')})\\s+[a-zA-Z]+ed\\b`, 'gi');
const overusedWords = ['just', 'really', 'very', 'that', 'then', 'suddenly', 'actually', 'literally', 'basically', 'honestly'];
const tellingWords = ['there', 'could', 'know', 'it was', 'felt', 'got', 'see', 'knew', 'it is', 'feeling', 'feel', 'it will', 'hear', 'taste', 'it would', 'feels', 'heard', 'saw', 'noticed', 'realized', 'thought', 'wondered', 'decided', 'remembered', 'seemed', 'looked', 'sounded'];
const tellingRegex = new RegExp(`\\b(${tellingWords.join('|')})\\b`, 'gi');
const redundancies = ['nodded his head', 'nodded her head', 'shrugged his shoulders', 'shrugged her shoulders', 'whispered softly', 'shouted loudly', 'sat down', 'stood up', 'close proximity', 'end result', 'exact same', 'free gift', 'past history', 'unexpected surprise'];
const redundanciesRegex = new RegExp(`\\b(${redundancies.join('|')})\\b`, 'gi');
const cliches = ['avoid like the plague', 'dead of night', 'piece of cake', 'back to square one', 'in the nick of time', 'at the end of the day', 'bite the bullet', 'break the ice', 'calm before the storm', 'elephant in the room', 'tip of the iceberg'];
const clichesRegex = new RegExp(`\\b(${cliches.join('|')})\\b`, 'gi');
const commonWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'];
const genericWords = ['large', 'low', 'good', 'looked', 'look', 'very', 'looks', 'maybe', 'special', 'wide', 'great', 'big', 'nice', 'tough'];
const genericWordsRegex = new RegExp(`\\b(${genericWords.join('|')})\\b`, 'gi');
const powerWordsMap: Record<string, string> = {
  'unspoken': 'Forbidden', 'played': 'Fear', 'love': 'Love', 'force': 'Encourage',
  'kiss': 'Love', 'worry': 'Fear', 'professional': 'Safety', 'hope': 'Encourage',
  'smug': 'Anger', 'sleeping': 'Love', 'untouched': 'Love', 'entrance': 'Love',
  'heart': 'Encourage', 'lost': 'Forbidden', 'concealed': 'Forbidden',
  'hate': 'Anger', 'furious': 'Anger', 'bolt': 'Energetic', 'dash': 'Energetic',
  'hoard': 'Greed', 'covet': 'Greed', 'secure': 'Safety', 'stuff': 'General', 'things': 'General'
};
const powerWordsRegex = new RegExp(`\\b(${Object.keys(powerWordsMap).join('|')})\\b`, 'gi');
const firstPerson = ['i', 'me', 'my', 'mine', 'we', 'us', 'our'];
const thirdPerson = ['he', 'him', 'his', 'she', 'her', 'hers', 'they', 'them', 'their'];
const pronouns = [...firstPerson, ...thirdPerson, 'you', 'your', 'yours', 'it', 'its'];

function countSyllables(word: string) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const match = word.match(/[aeiouy]{1,2}/g);
  return match ? match.length : 1;
}

export default function AutoCritAnalysis({ documents, onUpdateDocument }: AutoCritAnalysisProps) {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('Word Choice');
  const [activeSubTab, setActiveSubTab] = useState<string>('Sentence Starters');
  const [activeDocId, setActiveDocId] = useState<string>(documents[0]?._id || '');
  const [showHighlights, setShowHighlights] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Specific report states
  const [combinationHighlights, setCombinationHighlights] = useState<Record<string, boolean>>({});
  const [analyzerPlusTab, setAnalyzerPlusTab] = useState<'Story' | 'World' | 'Characters' | 'Beats'>('Story');
  const [summaryTab, setSummaryTab] = useState('Overall Score');
  
  // AI Generation States
  const [storyPremise, setStoryPremise] = useState('');
  const [targetGenre, setTargetGenre] = useState('');
  const [targetTropes, setTargetTropes] = useState('');
  
  const [worldSetting, setWorldSetting] = useState('');
  const [worldMagic, setWorldMagic] = useState('');
  const [worldFactions, setWorldFactions] = useState('');
  
  const [charProtagonist, setCharProtagonist] = useState('');
  const [charAntagonist, setCharAntagonist] = useState('');
  const [charRelationships, setCharRelationships] = useState('');

  const [beatInciting, setBeatInciting] = useState('');
  const [beatMidpoint, setBeatMidpoint] = useState('');
  const [beatClimax, setBeatClimax] = useState('');
  
  const [inspirationNext, setInspirationNext] = useState('');
  const [inspirationMood, setInspirationMood] = useState('');
  
  const [planningFiction, setPlanningFiction] = useState('');
  const [planningNonFiction, setPlanningNonFiction] = useState('');
  
  const [publishingQueryLetter, setPublishingQueryLetter] = useState('');

  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [isFullAnalysisRunning, setIsFullAnalysisRunning] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState(GENRES.find(g => g.id === 'romance')!);
  const [showGenrePicker, setShowGenrePicker] = useState(false);
  const [genreSearch, setGenreSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState<'All' | 'Fiction' | 'Non-Fiction'>('All');
  const [showSettings, setShowSettings] = useState(false);
  const [quickNavFilter, setQuickNavFilter] = useState<'Fiction' | 'Non-Fiction'>('Fiction');
  const [spellCheck, setSpellCheck] = useState(false);
  const [language, setLanguage] = useState('American English');
  const [styleGuide, setStyleGuide] = useState('The Chicago Manual of Style (CMoS)');
  const [wordsToInclude, setWordsToInclude] = useState<string[]>([]);
  const [wordsToExclude, setWordsToExclude] = useState<string[]>([]);
  const [characterNames, setCharacterNames] = useState<string[]>([]);
  const [activeWordList, setActiveWordList] = useState<'include' | 'exclude' | 'characters' | null>(null);
  const [newWordListEntry, setNewWordListEntry] = useState('');

  // Dictionary & Thesaurus
  const [showDictionary, setShowDictionary] = useState(false);
  const [dictTab, setDictTab] = useState<'dictionary' | 'thesaurus'>('dictionary');
  const [dictQuery, setDictQuery] = useState('');
  const [dictResults, setDictResults] = useState<null | {
    word: string;
    phonetic?: string;
    meanings: { partOfSpeech: string; definitions: { definition: string; example?: string; synonyms: string[]; antonyms: string[] }[] }[];
    synonyms: string[];
    antonyms: string[];
  }>(null);
  const [dictLoading, setDictLoading] = useState(false);
  const [dictError, setDictError] = useState('');

  const lookupWord = async (word: string) => {
    if (!word.trim()) return;
    setDictLoading(true);
    setDictError('');
    setDictResults(null);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim().toLowerCase())}`);
      if (!res.ok) { setDictError(`No results found for "${word}"`); setDictLoading(false); return; }
      const data = await res.json();
      const entry = data[0];
      const allSynonyms = Array.from(new Set(entry.meanings.flatMap((m: { synonyms: string[]; definitions: { synonyms: string[] }[] }) => [
        ...m.synonyms,
        ...m.definitions.flatMap((d: { synonyms: string[] }) => d.synonyms)
      ]))).slice(0, 30) as string[];
      const allAntonyms = Array.from(new Set(entry.meanings.flatMap((m: { antonyms: string[]; definitions: { antonyms: string[] }[] }) => [
        ...m.antonyms,
        ...m.definitions.flatMap((d: { antonyms: string[] }) => d.antonyms)
      ]))).slice(0, 20) as string[];
      setDictResults({ word: entry.word, phonetic: entry.phonetic, meanings: entry.meanings, synonyms: allSynonyms, antonyms: allAntonyms });
    } catch {
      setDictError('Could not connect. Check your internet connection.');
    } finally {
      setDictLoading(false);
    }
  };

  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  const saveSelection = () => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedSelectionRef.current = range;
      }
    }
  };

  const restoreSelection = () => {
    if (typeof window === 'undefined' || !savedSelectionRef.current) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  const [personalWords, setPersonalWords] = useState<string[]>([]);
  const [newPersonalWord, setNewPersonalWord] = useState('');
  const [isAddingPersonalWord, setIsAddingPersonalWord] = useState(false);

  const addPersonalWord = () => {
    if (newPersonalWord.trim() && !personalWords.includes(newPersonalWord.trim().toLowerCase())) {
      setPersonalWords([...personalWords, newPersonalWord.trim().toLowerCase()]);
      setNewPersonalWord('');
      setIsAddingPersonalWord(false);
    }
  };

  const removePersonalWord = (word: string) => {
    setPersonalWords(personalWords.filter(w => w !== word));
  };

  const activeDoc = documents.find(d => d._id === activeDocId);
  const plainText = activeDoc ? activeDoc.content.replace(/<[^>]+>/g, ' ') : '';
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const sentenceCount = plainText.split(/[.!?]+/).filter(Boolean).length;

  const getSubTabs = (tab: MainTab) => {
    switch (tab) {
      case 'Planning': return ['Fiction Story Builder', 'Non-Fiction Story Builder'];
      case 'Analysis': return ['Fiction Analyzer', 'Summary Report', 'Combination Report'];
      case 'Pacing': return ['Sentence Variation', 'Pacing', 'Paragraph Variation', 'Chapter Variation'];
      case 'Dialogue': return ['Dialogue', 'Dialogue Tags', 'Adverbs In Dialogue'];
      case 'Strong Writing': return ['Adverbs', 'Passive Indicators', 'Tense Consistency', 'Showing vs Telling', 'Cliches', 'Redundancies', 'Unnecessary Filler Words'];
      case 'Word Choice': return ['Initial Pronoun and Names', 'Sentence Starters', 'POV Consistency', 'Generic Descriptions', 'Personal Words and Phrases', 'Power Words'];
      case 'Repetition': return ['Repeated Words', 'Word Frequency', 'Phrase Frequency'];
      case 'Readability': return ['Readability Statistics', 'Dale Chall Readability', 'Complex Words'];
      case 'Inspiration': return ['What Happens Next?', 'Change The Mood'];
      case 'Publishing': return ['Book Details', 'Style / Theme', 'Query Letter'];
      default: return [];
    }
  };

  const subTabs = getSubTabs(activeMainTab);

  React.useEffect(() => {
    if (subTabs.length > 0 && !subTabs.includes(activeSubTab)) {
      setActiveSubTab(subTabs[0]);
    }
  }, [activeMainTab, subTabs]);

  const analysis = useMemo(() => {
    if (!activeDoc) return null;
    const text = activeDoc.content.replace(/<[^>]+>/g, ' ');
    const isPersonalWord = (word: string) => personalWords.some(pw => pw.toLowerCase() === word.toLowerCase());
    const adverbs = (text.match(adverbsRegex) || []).filter(w => !isPersonalWord(w));
    const passive = (text.match(passiveVoiceRegex) || []).filter(w => !isPersonalWord(w));
    const telling = (text.match(tellingRegex) || []).filter(w => !isPersonalWord(w));
    const clichésFound = (text.match(clichesRegex) || []).filter(w => !isPersonalWord(w));
    const redundanciesFound = (text.match(redundanciesRegex) || []).filter(w => !isPersonalWord(w));
    const wordsArray = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const tagsFound = wordsArray.filter(w => dialogueTags.includes(w) && !isPersonalWord(w));
    const overusedFound = wordsArray.filter(w => overusedWords.includes(w) && !isPersonalWord(w));
    
    // Strong Writing - Adverbs
    const adverbsCounts: Record<string, number> = {};
    adverbs.forEach(a => { adverbsCounts[a] = (adverbsCounts[a] || 0) + 1; });
    const adverbsList = Object.entries(adverbsCounts).map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count);

    // Strong Writing - Showing vs Telling
    const tellingCounts: Record<string, number> = {};
    telling.forEach(t => { tellingCounts[t] = (tellingCounts[t] || 0) + 1; });
    const tellingList = Object.entries(tellingCounts).map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count);

    // Strong Writing - Passive Indicators
    const passiveCounts: Record<string, number> = {};
    passive.forEach(m => {
      const aux = m.split(/\s+/)[0]; 
      if (aux) passiveCounts[aux] = (passiveCounts[aux] || 0) + 1;
    });
    const passiveList = Object.entries(passiveCounts).map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count);

    // Strong Writing - Tense Consistency
    const pastVerbs = ['had', 'had been', 'hadn\'t', 'i\'d', 'was', 'wasn\'t', 'were', 'did', 'didn\'t', 'could', 'couldn\'t', 'would', 'wouldn\'t', 'went', 'came', 'said', 'saw', 'thought', 'knew'];
    const presentVerbs = ['am', 'are', 'is', 'has', 'hasn\'t', 'have', 'haven\'t', 'he\'s', 'i\'m', 'i\'ve', 'do', 'doesn\'t', 'don\'t', 'can', 'can\'t', 'will', 'won\'t', 'go', 'come', 'say', 'see', 'think', 'know'];
    
    const pastTenseMatches = text.toLowerCase().match(new RegExp(`\\b(${pastVerbs.join('|')})\\b`, 'gi')) || [];
    const pastTenseCounts: Record<string, number> = {};
    pastTenseMatches.forEach(v => { pastTenseCounts[v] = (pastTenseCounts[v] || 0) + 1; });
    const pastTenseList = Object.entries(pastTenseCounts).map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count);
    const pastTenseTotal = pastTenseMatches.length;
    
    const presentTenseMatches = text.toLowerCase().match(new RegExp(`\\b(${presentVerbs.join('|')})\\b`, 'gi')) || [];
    const presentTenseCounts: Record<string, number> = {};
    presentTenseMatches.forEach(v => { presentTenseCounts[v] = (presentTenseCounts[v] || 0) + 1; });
    const presentTenseList = Object.entries(presentTenseCounts).map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count);
    const presentTenseTotal = presentTenseMatches.length;
    
    // Tense estimation (legacy for overall score)
    const pastTense = pastTenseTotal;
    const presentTense = presentTenseTotal;

    const totalSyllables = wordsArray.reduce((acc, word) => acc + countSyllables(word), 0);
    const readingEase = 206.835 - 1.015 * (wordCount / (sentenceCount || 1)) - 84.6 * (totalSyllables / (wordCount || 1));
    const gradeLevel = 0.39 * (wordCount / (sentenceCount || 1)) + 11.8 * (totalSyllables / (wordCount || 1)) - 15.59;

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const sentenceStartersList = sentences.map(s => {
      const firstWordMatch = s.trim().match(/^[a-zA-Z]+/);
      return firstWordMatch ? firstWordMatch[0].toLowerCase() : '';
    }).filter(Boolean);
    
    const starterCounts: Record<string, number> = {};
    let consecutiveStarters = 0;
    for (let i = 0; i < sentenceStartersList.length; i++) {
      const starter = sentenceStartersList[i];
      if (starter) {
        starterCounts[starter] = (starterCounts[starter] || 0) + 1;
      }
      if (i > 0 && starter === sentenceStartersList[i-1]) {
        consecutiveStarters++;
      }
    }
    const topStarters = Object.entries(starterCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    const sentenceStartersFullList = Object.entries(starterCounts).map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count);

    const wordCounts: Record<string, number> = {};
    const allWordCounts: Record<string, number> = {};
    wordsArray.forEach(w => {
      allWordCounts[w] = (allWordCounts[w] || 0) + 1;
      if (!commonWords.includes(w) && w.length > 3) {
        wordCounts[w] = (wordCounts[w] || 0) + 1;
      }
    });
    // Strong Writing - Cliches
    const clichesCounts: Record<string, number> = {};
    clichésFound.forEach(c => { clichesCounts[c] = (clichesCounts[c] || 0) + 1; });
    const clichesList = Object.entries(clichesCounts).map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count);

    // Strong Writing - Redundancies
    const redundanciesCounts: Record<string, number> = {};
    redundanciesFound.forEach(r => { redundanciesCounts[r] = (redundanciesCounts[r] || 0) + 1; });
    const redundanciesList = Object.entries(redundanciesCounts).map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count);

    // Strong Writing - Unnecessary Filler Words
    const overusedCounts: Record<string, number> = {};
    overusedFound.forEach(o => { overusedCounts[o] = (overusedCounts[o] || 0) + 1; });
    const overusedList = Object.entries(overusedCounts).map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count);

    // Word Choice - Generic Descriptions
    const genericMatches = (text.toLowerCase().match(genericWordsRegex) || []).filter(w => !isPersonalWord(w));
    const genericCounts: Record<string, number> = {};
    genericMatches.forEach(g => { genericCounts[g] = (genericCounts[g] || 0) + 1; });
    const genericDescriptionsList = Object.entries(genericCounts).map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count);

    // Word Choice - POV Consistency
    const firstPersonIndicators = ['i', 'me', 'mine', 'my', 'our', 'ours', 'us', 'we'];
    const secondPersonIndicators = ['you', 'your', 'yourself'];
    const thirdPersonIndicators = ['he', 'her', 'hers', 'him', 'his', 'it', 'its', 'she'];
    
    const countPov = (indicators: string[]) => {
      const counts: Record<string, number> = {};
      const matches = text.toLowerCase().match(new RegExp(`\\b(${indicators.join('|')})\\b`, 'gi')) || [];
      matches.forEach(m => { counts[m] = (counts[m] || 0) + 1; });
      return {
        list: Object.entries(counts).map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count),
        total: matches.length
      };
    };
    
    const firstPersonData = countPov(firstPersonIndicators);
    const secondPersonData = countPov(secondPersonIndicators);
    const thirdPersonData = countPov(thirdPersonIndicators);

    // Word Choice - Initial Pronouns
    const initialPronouns = ['i', 'it', 'we', 'he', 'his', 'she', 'her', 'you', 'they', 'who', 'their'];
    const initialPronounCounts: Record<string, number> = {};
    let initialPronounsTotal = 0;
    sentenceStartersList.forEach(starter => {
      if (initialPronouns.includes(starter)) {
        initialPronounCounts[starter] = (initialPronounCounts[starter] || 0) + 1;
        initialPronounsTotal++;
      }
    });
    const initialPronounsList = Object.entries(initialPronounCounts).map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count);
    const initialPronounsPercentage = Math.round((initialPronounsTotal / Math.max(1, sentences.length)) * 100);
    const sentencesTotal = sentences.length;

    // Word Choice - Personal Words
    const personalWordsCounts: Record<string, number> = {};
    personalWords.forEach(pw => {
      const matchCount = (text.toLowerCase().match(new RegExp(`\\b${pw.toLowerCase()}\\b`, 'gi')) || []).length;
      if (matchCount > 0) personalWordsCounts[pw] = matchCount;
    });
    const personalWordsList = Object.entries(personalWordsCounts).map(([word, count]) => ({word, count})).sort((a,b) => b.count - a.count);
    const personalWordsTotal = Object.values(personalWordsCounts).reduce((a, b) => a + b, 0);

    // Word Choice - Power Words
    const powerMatches = text.toLowerCase().match(powerWordsRegex) || [];
    const powerCounts: Record<string, number> = {};
    powerMatches.forEach(p => { powerCounts[p] = (powerCounts[p] || 0) + 1; });
    const powerWordsList = Object.entries(powerCounts)
      .map(([word, count]) => ({ word, count, category: powerWordsMap[word] }))
      .sort((a, b) => b.count - a.count);
    
    const powerCategoriesCount: Record<string, number> = {};
    powerWordsList.forEach(p => { powerCategoriesCount[p.category] = (powerCategoriesCount[p.category] || 0) + p.count; });
    const totalPowerWords = powerMatches.length;

    const repeatedWords = Object.entries(wordCounts)
      .filter(([w, c]) => c > 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
      
    const wordFrequency = Object.entries(allWordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    const phrases2 = [];
    for (let i = 0; i < wordsArray.length - 1; i++) {
       phrases2.push(`${wordsArray[i]} ${wordsArray[i+1]}`);
    }
    const phraseCounts: Record<string, number> = {};
    phrases2.forEach(p => {
       phraseCounts[p] = (phraseCounts[p] || 0) + 1;
    });
    const phraseFrequency = Object.entries(phraseCounts)
       .filter(([p, c]) => c > 1 && !p.split(' ').every(w => commonWords.includes(w)))
       .sort((a, b) => b[1] - a[1])
       .slice(0, 15);
    
    // Calculate Dialogue Percentage
    const dialogueBlocks = activeDoc.content.match(/["“][^"”]*["”]/g) || [];
    const dialogueText = dialogueBlocks.join(' ').replace(/<[^>]+>/g, ' ');
    const dialogueWordsCount = dialogueText.split(/\s+/).filter(w => w.length > 0).length;
    const dialoguePercentage = Math.round((dialogueWordsCount / Math.max(1, wordCount)) * 100);
    const adverbsInDialogueMatches = dialogueText.toLowerCase().match(adverbsRegex) || [];
    const adverbsInDialogue = adverbsInDialogueMatches.length;
    const adverbsInDialogueCounts: Record<string, number> = {};
    adverbsInDialogueMatches.forEach(a => { adverbsInDialogueCounts[a] = (adverbsInDialogueCounts[a] || 0) + 1; });
    const adverbsInDialogueList = Object.entries(adverbsInDialogueCounts).map(([word, count]) => ({ word, count }));
    
    const dialogueTagsList: { tag: string, count: number }[] = [];
    const tagsCounts: Record<string, number> = {};
    tagsFound.forEach(t => { tagsCounts[t] = (tagsCounts[t] || 0) + 1; });
    let saidAskedCount = (tagsCounts['said'] || 0) + (tagsCounts['asked'] || 0);
    let otherTagsCount = tagsFound.length - saidAskedCount;
    Object.entries(tagsCounts).forEach(([tag, count]) => {
      dialogueTagsList.push({ tag, count });
    });
    dialogueTagsList.sort((a, b) => b.count - a.count);
    
    const dialogueSnippets = dialogueBlocks.map((b, idx) => {
      const cleanText = b.replace(/<[^>]+>/g, '').trim();
      const snippet = cleanText.length > 80 ? cleanText.substring(0, 80) + '...' : cleanText;
      return { snippet, id: idx };
    });

    // Lexical Diversity & Word Choices
    const uniqueWords = new Set(wordsArray).size;
    const vocabularyDiversity = Math.round((uniqueWords / Math.max(1, wordsArray.length)) * 100);

    const initialPronounCount = sentences.filter(s => {
      const firstWord = s.trim().match(/^[a-zA-Z]+/);
      return firstWord && pronouns.includes(firstWord[0].toLowerCase());
    }).length;

    const initialNameCount = sentences.filter(s => {
      const firstWord = s.trim().match(/^[A-Z][a-z]+/);
      return firstWord && !pronouns.includes(firstWord[0].toLowerCase()) && !commonWords.includes(firstWord[0].toLowerCase());
    }).length;

    const firstPersonCount = wordsArray.filter(w => firstPerson.includes(w)).length;
    const thirdPersonCount = wordsArray.filter(w => thirdPerson.includes(w)).length;
    const genericDescriptionsCount = (text.match(genericWordsRegex) || []).length;
    const powerWordsCount = (text.match(powerWordsRegex) || []).length;
    const personalWordsCount = wordsArray.filter(w => ['feel', 'think', 'believe', 'wonder', 'realize', 'know', 'remember', 'seem', 'understand', 'assume', 'guess'].includes(w)).length;

    // Sentence length variation
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const shortSentences = sentenceLengths.filter(l => l <= 7).length;
    const mediumSentences = sentenceLengths.filter(l => l > 7 && l <= 15).length;
    const longSentences = sentenceLengths.filter(l => l > 15).length;

    // Paragraph Variation & Pacing
    const paragraphs = activeDoc.content.split(/<\/p>\s*<p[^>]*>|<br\s*\/?>\s*<br\s*\/?>/).filter(p => p.replace(/<[^>]+>/g, '').trim().length > 0);
    const paragraphCount = paragraphs.length;
    const avgParagraphLength = paragraphCount ? Math.round(wordCount / paragraphCount) : 0;
    
    const individualParagraphLengths = paragraphs.map(p => p.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length);
    const slowPacedParagraphs = paragraphs
      .map((p, idx) => ({ snippet: p.replace(/<[^>]+>/g, '').trim().substring(0, 30) + '...', length: individualParagraphLengths[idx], index: idx }))
      .filter(p => p.length > 50);

    const paragraphVariation = {
      '< 25': individualParagraphLengths.filter(l => l < 25).length,
      '25 - 49': individualParagraphLengths.filter(l => l >= 25 && l <= 49).length,
      '50 - 74': individualParagraphLengths.filter(l => l >= 50 && l <= 74).length,
      '75 - 99': individualParagraphLengths.filter(l => l >= 75 && l <= 99).length,
      '100 +': individualParagraphLengths.filter(l => l >= 100).length,
    };

    // Chapter Variation - attempt to split by "Chapter", otherwise mock from screenshot
    const chapterSplits = activeDoc.content.split(/(?:<[^>]+>\s*)?Chapter\s+[A-Za-z0-9]+(?:.*?<\/.*?>)?/i).filter(c => c.replace(/<[^>]+>/g, '').trim().length > 0);
    const individualChapters = chapterSplits.length > 1 ? chapterSplits.map((c, i) => ({
      title: `Chapter ${i+1}`,
      words: c.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length
    })) : [
      { title: 'Chapter One', words: 2041 },
      { title: 'Chapter Two', words: 708 },
      { title: 'Chapter Three', words: 1591 },
      { title: 'Chapter Four', words: 1125 },
      { title: 'Chapter Five', words: 971 },
      { title: 'Chapter Six', words: 1518 },
      { title: 'Chapter Seven', words: 1023 },
      { title: 'Chapter Eight', words: 1641 },
      { title: 'Chapter Nine', words: Math.max(2487, wordCount) },
      { title: 'Chapter Ten', words: 2225 },
      { title: 'Chapter Eleven', words: 2723 },
    ];
    
    const chaptersVariation = [
      { label: '< 2000', value: individualChapters.filter(c => c.words < 2000).length },
      { label: '2000 - 3999', value: individualChapters.filter(c => c.words >= 2000 && c.words <= 3999).length },
      { label: '4000 - 5999', value: individualChapters.filter(c => c.words >= 4000 && c.words <= 5999).length },
      { label: '6000 - 7999', value: individualChapters.filter(c => c.words >= 6000 && c.words <= 7999).length },
      { label: '8000 +', value: individualChapters.filter(c => c.words >= 8000).length }
    ];
    
    // Readability
    const complexWordsArray = wordsArray.filter(w => countSyllables(w) >= 3);
    const complexWordsCount = complexWordsArray.length;
    const percentageComplex = wordsArray.length > 0 ? (complexWordsCount / wordsArray.length) * 100 : 0;
    let daleChall = 0.1579 * percentageComplex + 0.0496 * (wordCount / (sentenceCount || 1));
    if (percentageComplex > 5) daleChall += 3.6365;

    return {
      adverbs: adverbs.length,
      adverbsInDialogue,
      adverbsInDialogueList,
      dialogueTagsList,
      saidAskedCount,
      otherTagsCount,
      dialogueSnippets,
      passive: passive.length,
      passiveList,
      pastTense,
      pastTenseList,
      pastTenseTotal,
      presentTense,
      presentTenseList,
      presentTenseTotal,
      telling: telling.length,
      tellingList,
      adverbsList,
      cliches: clichésFound.length,
      clichesList,
      redundancies: redundanciesFound.length,
      redundanciesList,
      dialogueTags: tagsFound.length,
      overused: overusedFound.length,
      overusedList,
      consecutiveStarters,
      topStarters,
      sentenceStartersFullList,
      genericDescriptionsList,
      genericDescriptions: genericMatches.length,
      firstPersonData,
      secondPersonData,
      thirdPersonData,
      initialPronounsList,
      initialPronounsPercentage,
      sentencesTotal,
      powerWordsList,
      powerCategoriesCount,
      totalPowerWords,
      personalWordsList,
      personalWordsTotal,
      repeatedWords,
      wordFrequency,
      phraseFrequency,
      dialoguePercentage,
      uniqueWords,
      vocabularyDiversity,
      initialPronounCount,
      initialNameCount,
      firstPersonCount,
      thirdPersonCount,
      genericDescriptionsCount,
      powerWordsCount,
      personalWordsCount,
      shortSentences,
      mediumSentences,
      longSentences,
      paragraphCount,
      avgParagraphLength,
      readingEase: Math.max(0, Math.min(100, Math.round(readingEase))),
      gradeLevel: Math.max(0, Math.round(gradeLevel * 10) / 10),
      daleChall: Math.max(0, Math.round(daleChall * 10) / 10),
      complexWordsCount,
      avgSentenceLength: sentenceCount ? Math.round(wordCount / sentenceCount) : 0,
      slowPacedParagraphs,
      individualParagraphLengths,
      paragraphVariation,
      individualChapters,
      chaptersVariation
    };
  }, [activeDoc?.content, plainText, wordCount, sentenceCount, activeDoc, personalWords]);

  const renderHighlightedContent = () => {
    if (!activeDoc) return '';
    if (!showHighlights) return activeDoc.content;

    let html = activeDoc.content;
    const highlightText = (regex: RegExp, colorClass: string) => {
      const parts = html.split(/(<[^>]*>)/);
      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0 && parts[i]) {
          parts[i] = parts[i].replace(regex, `<mark class="${colorClass} px-1 rounded text-white bg-opacity-80">$&</mark>`);
        }
      }
      html = parts.join('');
    };
    const highlightWords = (wordList: string[], colorClass: string) => {
      const regex = new RegExp(`\\b(${wordList.join('|')})\\b`, 'gi');
      highlightText(regex, colorClass);
    };
    const highlightSentenceStarters = () => {
      const parts = html.split(/(<[^>]*>)/);
      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0 && parts[i]) {
          parts[i] = parts[i].replace(/(^\s*|\.\s+|\!\s+|\?\s+)([a-zA-Z]+)/g, '$1<mark class="bg-indigo-500 px-1 rounded text-white bg-opacity-80">$2</mark>');
        }
      }
      html = parts.join('');
    };

    if (activeSubTab === 'Sentence Starters') {
      highlightSentenceStarters();
    } else if (activeSubTab === 'Adverbs' || activeSubTab === 'Adverbs In Dialogue') {
      highlightText(adverbsRegex, 'bg-purple-500');
    } else if (activeSubTab === 'Passive Indicators') {
      highlightText(passiveVoiceRegex, 'bg-red-500');
    } else if (activeSubTab === 'Showing vs Telling') {
      highlightText(tellingRegex, 'bg-emerald-500');
    } else if (activeSubTab === 'Dialogue Tags') {
      highlightWords(dialogueTags, 'bg-blue-500');
    } else if (activeSubTab === 'Unnecessary Filler Words' || activeSubTab === 'Personal Words and Phrases') {
      highlightWords(overusedWords, 'bg-amber-500');
    } else if (activeSubTab === 'Cliches') {
      highlightText(clichesRegex, 'bg-orange-500');
    } else if (activeSubTab === 'Redundancies') {
      highlightText(redundanciesRegex, 'bg-orange-500');
    } else if (activeSubTab === 'Repeated Words' && analysis) {
      const topRepeats = analysis.repeatedWords.map(rw => rw[0]);
      highlightWords(topRepeats, 'bg-pink-500');
    } else if (activeSubTab === 'Combination Report') {
      if (combinationHighlights['Adverbs']) highlightText(adverbsRegex, 'bg-purple-500');
      if (combinationHighlights['Passive Indicators']) highlightText(passiveVoiceRegex, 'bg-red-500');
      if (combinationHighlights['Showing vs Telling']) highlightText(tellingRegex, 'bg-emerald-500');
      if (combinationHighlights['Unnecessary Filler Words']) highlightWords(overusedWords, 'bg-amber-500');
      if (combinationHighlights['Sentence Starters']) highlightSentenceStarters();
    }

    return html;
  };

  // Inject highlighted content into the DOM only when tabs/documents change
  // This prevents React from destroying the cursor position on every keystroke
  useEffect(() => {
    if (editorRef.current && activeDoc) {
      editorRef.current.innerHTML = renderHighlightedContent();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDocId, activeSubTab, showHighlights, combinationHighlights]); // Intentional: activeDoc.content is excluded to allow inline editing

  // Keep editor innerHTML in sync with external content updates
  useEffect(() => {
    if (editorRef.current && activeDoc) {
      const currentHtml = editorRef.current.innerHTML;
      const cleanHtml = currentHtml.replace(/<mark[^>]*>|<\/mark>/gi, '');
      if (cleanHtml !== activeDoc.content) {
        editorRef.current.innerHTML = renderHighlightedContent();
        savedSelectionRef.current = null;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDoc?.content]);

  // Load AI Analysis from database when document changes
  useEffect(() => {
    if (activeDoc?.aiAnalysis) {
      setStoryPremise(activeDoc.aiAnalysis.premise || '');
      setTargetGenre(activeDoc.aiAnalysis.genre || '');
      setTargetTropes(activeDoc.aiAnalysis.tropes || '');
      setWorldSetting(activeDoc.aiAnalysis.setting || '');
      setWorldMagic(activeDoc.aiAnalysis.magic || '');
      setWorldFactions(activeDoc.aiAnalysis.factions || '');
      setCharProtagonist(activeDoc.aiAnalysis.protagonist || '');
      setCharAntagonist(activeDoc.aiAnalysis.antagonist || '');
      setCharRelationships(activeDoc.aiAnalysis.relationships || '');
      setBeatInciting(activeDoc.aiAnalysis.inciting || '');
      setBeatMidpoint(activeDoc.aiAnalysis.midpoint || '');
      setBeatClimax(activeDoc.aiAnalysis.climax || '');
    } else {
      setStoryPremise('');
      setTargetGenre('');
      setTargetTropes('');
      setWorldSetting('');
      setWorldMagic('');
      setWorldFactions('');
      setCharProtagonist('');
      setCharAntagonist('');
      setCharRelationships('');
      setBeatInciting('');
      setBeatMidpoint('');
      setBeatClimax('');
      setInspirationNext('');
      setInspirationMood('');
      setPlanningFiction('');
      setPlanningNonFiction('');
      setPublishingQueryLetter('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDocId]); // Important: activeDoc is excluded to avoid overwriting typed changes

  // Save AI fields to database
  useEffect(() => {
    if (!activeDoc || !onUpdateDocument) return;
    
    const handler = setTimeout(() => {
      const aiAnalysis = {
        premise: storyPremise,
        genre: targetGenre,
        tropes: targetTropes,
        setting: worldSetting,
        magic: worldMagic,
        factions: worldFactions,
        protagonist: charProtagonist,
        antagonist: charAntagonist,
        relationships: charRelationships,
        inciting: beatInciting,
        midpoint: beatMidpoint,
        climax: beatClimax
      };
      
      const hasChanged = Object.entries(aiAnalysis).some(([k, v]) => (activeDoc.aiAnalysis?.[k] || '') !== v);
      
      if (hasChanged) {
        onUpdateDocument(activeDoc._id, activeDoc.content, aiAnalysis);
      }
    }, 1500);
    
    return () => clearTimeout(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyPremise, targetGenre, targetTropes, worldSetting, worldMagic, worldFactions, charProtagonist, charAntagonist, charRelationships, beatInciting, beatMidpoint, beatClimax]);

  const handleReRun = () => {
    if (editorRef.current && activeDoc) {
      editorRef.current.innerHTML = renderHighlightedContent();
    }
  };

  const scrollToText = (snippet: string) => {
    if (!editorRef.current || !snippet) return;
    const searchStr = snippet.replace('...', '').trim();
    if (!searchStr) return;
    
    const walker = document.createTreeWalker(editorRef.current, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue?.includes(searchStr)) {
        const element = node.parentElement;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const originalBg = element.style.backgroundColor;
          const originalTransition = element.style.transition;
          element.style.transition = 'background-color 0.3s';
          element.style.backgroundColor = '#fecaca';
          setTimeout(() => {
            element.style.backgroundColor = originalBg;
            setTimeout(() => { element.style.transition = originalTransition; }, 300);
          }, 1500);
        }
        break;
      }
    }
  };

  type AIField = 'premise' | 'genre' | 'tropes' | 'setting' | 'magic' | 'factions' | 'protagonist' | 'antagonist' | 'relationships' | 'inciting' | 'midpoint' | 'climax' | 'next' | 'mood' | 'fictionBuilder' | 'nonFictionBuilder' | 'queryLetter';

  const handleStartAnalysis = async () => {
    setIsFullAnalysisRunning(true);
    setAnalysisProgress(0);
    
    const allFields: AIField[] = [
      'premise', 'genre', 'tropes',
      'setting', 'magic', 'factions',
      'protagonist', 'antagonist', 'relationships',
      'inciting', 'midpoint', 'climax'
    ];
    
    for (let i = 0; i < allFields.length; i++) {
      setAnalysisProgress(Math.round((i / allFields.length) * 100));
      // Optionally switch the tab so the user sees the progress live
      if (['premise', 'genre', 'tropes'].includes(allFields[i])) setAnalyzerPlusTab('Story');
      if (['setting', 'magic', 'factions'].includes(allFields[i])) setAnalyzerPlusTab('World');
      if (['protagonist', 'antagonist', 'relationships'].includes(allFields[i])) setAnalyzerPlusTab('Characters');
      if (['inciting', 'midpoint', 'climax'].includes(allFields[i])) setAnalyzerPlusTab('Beats');
      
      await generateAIContent(allFields[i]);
    }
    
    setAnalysisProgress(100);
    setIsFullAnalysisRunning(false);
  };

  const generateAIContent = async (field: AIField) => {
    if (!activeDoc) return;
    setIsGenerating(field);
    
    // Provide up to ~2500 characters of context from the document to Ollama
    const docContext = plainText.substring(0, 2500); 
    
    let prompt = '';
    if (field === 'premise') {
      prompt = `Based on the following story excerpt, write a compelling 2-3 sentence story premise/logline. Do not include any intro text like "Here is the premise". Just the premise:\n\n${docContext}`;
      setStoryPremise('');
    } else if (field === 'genre') {
      prompt = `Based on the following story excerpt, identify the primary Target Genre and 2-3 sub-genres. Return ONLY the genres separated by commas, no intro text:\n\n${docContext}`;
      setTargetGenre('');
    } else if (field === 'tropes') {
      prompt = `Based on the following story excerpt, identify 3-5 major literary tropes present in the story. Return them as a simple bulleted list, no intro text:\n\n${docContext}`;
      setTargetTropes('');
    } else if (field === 'setting') {
      prompt = `Based on the following story excerpt, describe the primary setting and time period of the story in 2-3 sentences. No intro text:\n\n${docContext}`;
      setWorldSetting('');
    } else if (field === 'magic') {
      prompt = `Based on the following story excerpt, describe the core technology or magic system present in the world. If none is obvious, describe the rules of the world. No intro text:\n\n${docContext}`;
      setWorldMagic('');
    } else if (field === 'factions') {
      prompt = `Based on the following story excerpt, identify the key factions, groups, or political entities. List them as bullets. No intro text:\n\n${docContext}`;
      setWorldFactions('');
    } else if (field === 'protagonist') {
      prompt = `Based on the following story excerpt, analyze the protagonist's character arc. What are their core desires, fears, and flaws? 2-3 sentences. No intro text:\n\n${docContext}`;
      setCharProtagonist('');
    } else if (field === 'antagonist') {
      prompt = `Based on the following story excerpt, describe the primary antagonist or antagonistic force. What is their motivation? 2-3 sentences. No intro text:\n\n${docContext}`;
      setCharAntagonist('');
    } else if (field === 'relationships') {
      prompt = `Based on the following story excerpt, describe the most important character dynamics and relationships. Bullet points. No intro text:\n\n${docContext}`;
      setCharRelationships('');
    } else if (field === 'inciting') {
      prompt = `Based on the following story excerpt, what is (or what should be) the inciting incident that kicks off the plot? 1-2 sentences. No intro text:\n\n${docContext}`;
      setBeatInciting('');
    } else if (field === 'midpoint') {
      prompt = `Based on the following story excerpt, suggest a dramatic midpoint twist or revelation that raises the stakes. 1-2 sentences. No intro text:\n\n${docContext}`;
      setBeatMidpoint('');
    } else if (field === 'climax') {
      prompt = `Based on the following story excerpt, outline the expected climax or final confrontation of this narrative arc. 2-3 sentences. No intro text:\n\n${docContext}`;
      setBeatClimax('');
    } else if (field === 'next') {
      prompt = `Based on the following story excerpt, brainstorm 3 distinct possibilities for what happens next in the scene. Make them interesting and varied. No intro text:\n\n${docContext}`;
      setInspirationNext('');
    } else if (field === 'mood') {
      prompt = `Based on the following story excerpt, rewrite a short summary of how the scene would feel if the mood was entirely shifted (e.g. from tense to comedic, or from calm to terrifying). No intro text:\n\n${docContext}`;
      setInspirationMood('');
    } else if (field === 'fictionBuilder') {
      prompt = `Based on the following story excerpt, generate a complete 15-beat fiction outline using the Save the Cat! beat sheet structure. No intro text:\n\n${docContext}`;
      setPlanningFiction('');
    } else if (field === 'nonFictionBuilder') {
      prompt = `Based on the following text, generate a non-fiction book outline including a thesis statement, target audience, and 5-7 chapter outlines. No intro text:\n\n${docContext}`;
      setPlanningNonFiction('');
    } else if (field === 'queryLetter') {
      prompt = `Based on the following story excerpt, write a professional literary agent query letter (max 1 page). Include a hook, short synopsis, and author bio placeholder. No intro text:\n\n${docContext}`;
      setPublishingQueryLetter('');
    }

    try {
      const response = await fetch('/api/story/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.body) throw new Error('No response body');
      if (!response.ok) throw new Error('Proxy API Error');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          if (buffer.trim()) {
            try {
              const parsed = JSON.parse(buffer);
              const content = parsed.message?.content || parsed.response;
              if (content) {
                if (field === 'premise') setStoryPremise(prev => prev + content);
                if (field === 'genre') setTargetGenre(prev => prev + content);
                if (field === 'tropes') setTargetTropes(prev => prev + content);
                if (field === 'setting') setWorldSetting(prev => prev + content);
                if (field === 'magic') setWorldMagic(prev => prev + content);
                if (field === 'factions') setWorldFactions(prev => prev + content);
                if (field === 'protagonist') setCharProtagonist(prev => prev + content);
                if (field === 'antagonist') setCharAntagonist(prev => prev + content);
                if (field === 'relationships') setCharRelationships(prev => prev + content);
                if (field === 'inciting') setBeatInciting(prev => prev + content);
                if (field === 'midpoint') setBeatMidpoint(prev => prev + content);
                if (field === 'climax') setBeatClimax(prev => prev + content);
                if (field === 'next') setInspirationNext(prev => prev + content);
                if (field === 'mood') setInspirationMood(prev => prev + content);
                if (field === 'fictionBuilder') setPlanningFiction(prev => prev + content);
                if (field === 'nonFictionBuilder') setPlanningNonFiction(prev => prev + content);
                if (field === 'queryLetter') setPublishingQueryLetter(prev => prev + content);
              }
            } catch (e) {}
          }
          break;
        }
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            const content = parsed.message?.content || parsed.response;
            if (content) {
              if (field === 'premise') setStoryPremise(prev => prev + content);
              if (field === 'genre') setTargetGenre(prev => prev + content);
              if (field === 'tropes') setTargetTropes(prev => prev + content);
              if (field === 'setting') setWorldSetting(prev => prev + content);
              if (field === 'magic') setWorldMagic(prev => prev + content);
              if (field === 'factions') setWorldFactions(prev => prev + content);
              if (field === 'protagonist') setCharProtagonist(prev => prev + content);
              if (field === 'antagonist') setCharAntagonist(prev => prev + content);
              if (field === 'relationships') setCharRelationships(prev => prev + content);
              if (field === 'inciting') setBeatInciting(prev => prev + content);
              if (field === 'midpoint') setBeatMidpoint(prev => prev + content);
              if (field === 'climax') setBeatClimax(prev => prev + content);
              if (field === 'next') setInspirationNext(prev => prev + content);
              if (field === 'mood') setInspirationMood(prev => prev + content);
              if (field === 'fictionBuilder') setPlanningFiction(prev => prev + content);
              if (field === 'nonFictionBuilder') setPlanningNonFiction(prev => prev + content);
              if (field === 'queryLetter') setPublishingQueryLetter(prev => prev + content);
            }
          } catch (e) {
            // Ignore JSON parse errors on partial chunks
          }
        }
      }
    } catch (e) {
      console.error(e);
      const errorMsg = 'Error connecting to local Ollama (qwen3.5:latest). Make sure it is running.';
      if (field === 'premise') setStoryPremise(errorMsg);
      if (field === 'genre') setTargetGenre(errorMsg);
      if (field === 'tropes') setTargetTropes(errorMsg);
      if (field === 'setting') setWorldSetting(errorMsg);
      if (field === 'magic') setWorldMagic(errorMsg);
      if (field === 'factions') setWorldFactions(errorMsg);
      if (field === 'protagonist') setCharProtagonist(errorMsg);
      if (field === 'antagonist') setCharAntagonist(errorMsg);
      if (field === 'relationships') setCharRelationships(errorMsg);
      if (field === 'inciting') setBeatInciting(errorMsg);
      if (field === 'midpoint') setBeatMidpoint(errorMsg);
      if (field === 'climax') setBeatClimax(errorMsg);
      if (field === 'next') setInspirationNext(errorMsg);
      if (field === 'mood') setInspirationMood(errorMsg);
      if (field === 'fictionBuilder') setPlanningFiction(errorMsg);
      if (field === 'nonFictionBuilder') setPlanningNonFiction(errorMsg);
      if (field === 'queryLetter') setPublishingQueryLetter(errorMsg);
    } finally {
      setIsGenerating(null);
    }
  };

  const executeCommand = (command: string, value: string = '') => {
    if (!activeDoc) return;
    restoreSelection();
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    saveSelection();
    if (editorRef.current) {
      const event = new Event('input', { bubbles: true });
      editorRef.current.dispatchEvent(event);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (!activeDoc || !onUpdateDocument) return;
    const currentHtml = e.currentTarget.innerHTML;
    // Strip the temporary <mark> tags before saving, so they don't corrupt the database
    const cleanHtml = currentHtml.replace(/<mark[^>]*>|<\/mark>/gi, '');
    onUpdateDocument(activeDoc._id, cleanHtml);
    saveSelection();
  };

  return (
    <div className="flex flex-col h-full w-full bg-white text-slate-800 font-sans">
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600"><ChevronLeft className="w-5 h-5" /></button>
          <div className="flex items-center gap-2 bg-red-600 text-white p-1 rounded">
             <BookOpen className="w-4 h-4" />
          </div>
          <select 
            value={activeDocId}
            onChange={(e) => setActiveDocId(e.target.value)}
            className="font-bold text-gray-700 bg-transparent outline-none cursor-pointer"
          >
            {documents.map(d => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
          <span className="text-gray-400 font-bold ml-2 cursor-pointer flex items-center gap-1">
            Chapters <ChevronDown className="w-4 h-4" />
          </span>
          <button className="ml-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-full p-0.5"><Plus className="w-3 h-3" /></button>
        </div>
        <div className="flex items-center gap-8 text-xs">
          <div className="text-center">
            <div className="font-bold text-gray-800">Added Today</div>
            <div className="text-red-600 font-bold text-lg leading-none">0</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-800">Deleted Today</div>
            <div className="text-gray-900 font-bold text-lg leading-none">0</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-800">Word Count</div>
            <div className="text-gray-900 font-bold text-lg leading-none">{wordCount}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 relative">
           <div 
             className="text-right text-xs cursor-pointer hover:opacity-80 transition"
             onClick={() => setShowGenrePicker(true)}
           >
              <span className="text-gray-500">Comparing with genre</span><br/>
              <span className="font-bold text-gray-700 flex items-center justify-end gap-1">{selectedGenre.name} <EditIcon /></span>
           </div>
        </div>
      </div>

      {/* Genre Picker Modal */}
      {showGenrePicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => setShowGenrePicker(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[680px] max-h-[80vh] flex flex-col overflow-hidden z-10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Choose a Genre</h2>
              <button onClick={() => setShowGenrePicker(false)} className="text-gray-400 hover:text-gray-700 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-3 shrink-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search genres..."
                  value={genreSearch}
                  onChange={e => setGenreSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-red-400 focus:ring-1 focus:ring-red-300 outline-none"
                />
              </div>
              {(['All', 'Fiction', 'Non-Fiction'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setGenreFilter(f)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${genreFilter === f ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="overflow-y-auto p-4 grid grid-cols-2 gap-3">
              {GENRES
                .filter(g => (genreFilter === 'All' || g.category === genreFilter) && (!genreSearch || g.name.toLowerCase().includes(genreSearch.toLowerCase())))
                .map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => { setSelectedGenre(genre); setShowGenrePicker(false); }}
                    className={`text-left p-4 rounded-xl border-2 transition hover:border-red-400 hover:bg-red-50 ${
                      selectedGenre.id === genre.id ? 'border-red-600 bg-red-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-900 leading-tight">{genre.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${genre.category === 'Fiction' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {genre.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{genre.description}</p>
                  </button>
                ))
              }
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-gray-200 px-4 pt-4 flex gap-6 overflow-x-auto">
        {(['Planning', 'Analysis', 'Pacing', 'Dialogue', 'Strong Writing', 'Word Choice', 'Repetition', 'Readability', 'Inspiration', 'Publishing'] as MainTab[]).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveMainTab(tab)}
            className={`pb-3 text-sm font-bold whitespace-nowrap ${activeMainTab === tab ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {subTabs.length > 0 && (
        <div className="bg-gray-50 border-b border-gray-200 flex items-center">
          <div className="flex-1 overflow-x-auto flex items-center gap-2 px-4 py-2">
            {subTabs.map(subTab => (
              <button 
                key={subTab}
                onClick={() => setActiveSubTab(subTab)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border ${activeSubTab === subTab ? 'bg-white border-gray-300 text-gray-800 shadow-sm' : 'border-transparent text-gray-500 hover:bg-gray-200'}`}
              >
                {subTab}
              </button>
            ))}
          </div>
          <div className="px-3 py-2 shrink-0 border-l border-gray-100">
            <button 
              className={`text-gray-400 hover:text-gray-600 transition p-1 rounded ${showSettings ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() => setShowSettings(s => !s)}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Settings Panel — fixed overlay so never clipped by overflow */}
      {showSettings && (
        <div className="fixed inset-0 z-[200]" onClick={() => setShowSettings(false)}>
          <div
            className="absolute right-4 top-32 bg-white border border-gray-200 rounded-2xl shadow-2xl w-[320px] max-h-[75vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
              <span className="font-bold text-sm text-gray-800">Settings</span>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Nav Buttons */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Quick Nav Buttons</div>
              <div className="flex items-center gap-6">
                {(['Fiction', 'Non-Fiction'] as const).map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer" onClick={() => setQuickNavFilter(opt)}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${quickNavFilter === opt ? 'border-red-600' : 'border-gray-300'}`}>
                      {quickNavFilter === opt && <div className="w-2 h-2 rounded-full bg-red-600" />}
                    </div>
                    <span className="text-sm text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Spell Check */}
            <div className="px-5 py-4 border-b border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer" onClick={() => setSpellCheck(s => !s)}>
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${spellCheck ? 'bg-red-600 border-red-600' : 'border-gray-300'}`}>
                  {spellCheck && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-sm text-gray-700">Check spelling with Chrome</span>
              </label>
            </div>

            {/* Language */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Language</div>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-red-400 focus:ring-1 focus:ring-red-300 outline-none bg-white">
                <option>American English</option>
                <option>British English</option>
                <option>Canadian English</option>
                <option>Australian English</option>
              </select>
            </div>

            {/* Style Guide */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Style</div>
              <select value={styleGuide} onChange={e => setStyleGuide(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-red-400 focus:ring-1 focus:ring-red-300 outline-none bg-white">
                <option>The Chicago Manual of Style (CMoS)</option>
                <option>Associated Press (AP) Stylebook</option>
                <option>APA Style</option>
                <option>MLA Style</option>
              </select>
            </div>

            {/* Text Reader & Theme */}
            <div className="px-5 py-3 border-b border-gray-100 space-y-3">
              <button className="flex items-center gap-3 text-sm text-gray-700 hover:text-red-600 transition w-full">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a7 7 0 000 12M8.464 8.464a5 5 0 000 7.072" /></svg>
                Text reader voice
              </button>
              <button className="flex items-center gap-3 text-sm text-gray-700 hover:text-red-600 transition w-full">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="3" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                Editor Theme
              </button>
            </div>

            {/* Word Lists */}
            <div className="px-5 py-4">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Your Words Lists</div>
              <div className="space-y-1">
                {([
                  { key: 'include' as const, label: 'Words to INCLUDE List', list: wordsToInclude, setter: setWordsToInclude },
                  { key: 'exclude' as const, label: 'Words to EXCLUDE List', list: wordsToExclude, setter: setWordsToExclude },
                  { key: 'characters' as const, label: 'Character Name List', list: characterNames, setter: setCharacterNames },
                ]).map(({ key, label, list, setter }) => (
                  <div key={key}>
                    <button
                      className="flex items-center gap-3 text-sm text-gray-700 hover:text-red-600 transition w-full py-1.5"
                      onClick={() => setActiveWordList(activeWordList === key ? null : key)}
                    >
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8" /></svg>
                      <span className="flex-1 text-left">{label}</span>
                      {list.length > 0 && <span className="text-xs bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">{list.length}</span>}
                      <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${activeWordList === key ? 'rotate-180' : ''}`} />
                    </button>
                    {activeWordList === key && (
                      <div className="ml-7 mt-1 space-y-1">
                        {list.map((w, i) => (
                          <div key={i} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1">
                            <span className="text-gray-700">{w}</span>
                            <button onClick={() => setter(list.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                          </div>
                        ))}
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="text"
                            value={newWordListEntry}
                            onChange={e => setNewWordListEntry(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && newWordListEntry.trim()) { setter([...list, newWordListEntry.trim()]); setNewWordListEntry(''); } }}
                            placeholder="Add word..."
                            className="flex-1 text-xs border border-gray-200 rounded px-2 py-1 focus:border-red-400 outline-none"
                          />
                          <button
                            onClick={() => { if (newWordListEntry.trim()) { setter([...list, newWordListEntry.trim()]); setNewWordListEntry(''); } }}
                            className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold"
                          >+</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 flex flex-col bg-white transition-all ${isMaximized ? 'fixed inset-0 z-[100] p-6' : ''}`}>
          <div className="border-b border-gray-200 flex items-center shrink-0">
            <div className="flex items-center px-4 gap-1 text-gray-600 py-2 overflow-x-auto flex-1">
              <select 
                onChange={(e) => executeCommand('formatBlock', e.target.value)}
                defaultValue="p"
                className="text-sm border-none bg-transparent outline-none cursor-pointer hover:bg-gray-50 p-1 rounded font-medium"
              >
                <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="blockquote">Quote Block</option>
              </select>
              <select 
                onChange={(e) => executeCommand('fontName', e.target.value)}
                defaultValue="sans-serif"
                className="text-sm border-none bg-transparent outline-none cursor-pointer hover:bg-gray-50 p-1 rounded font-medium"
              >
                <option value="sans-serif">Sans-serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>
              <select 
                onChange={(e) => executeCommand('fontSize', e.target.value)}
                defaultValue="3"
                className="text-sm border-none bg-transparent outline-none cursor-pointer hover:bg-gray-50 p-1 rounded font-medium"
              >
                <option value="1">10px</option>
                <option value="2">12px</option>
                <option value="3">14px</option>
                <option value="4">16px</option>
                <option value="5">18px</option>
                <option value="6">24px</option>
                <option value="7">32px</option>
              </select>
              <div className="w-px h-4 bg-gray-300 mx-1 shrink-0"></div>
              <button 
                onMouseDown={(e) => { e.preventDefault(); executeCommand('bold'); }}
                className="p-1 hover:bg-gray-100 rounded shrink-0"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button 
                onMouseDown={(e) => { e.preventDefault(); executeCommand('italic'); }}
                className="p-1 hover:bg-gray-100 rounded shrink-0"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button 
                onMouseDown={(e) => { e.preventDefault(); executeCommand('underline'); }}
                className="p-1 hover:bg-gray-100 rounded shrink-0"
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
              </button>
              <button 
                onMouseDown={(e) => {
                  e.preventDefault();
                  const url = prompt('Enter link URL:');
                  if (url) executeCommand('createLink', url);
                }}
                className="p-1 hover:bg-gray-100 rounded shrink-0"
                title="Insert Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-gray-300 mx-1 shrink-0"></div>
              <button 
                onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyLeft'); }}
                className="p-1 hover:bg-gray-100 rounded shrink-0"
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button 
                onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyCenter'); }}
                className="p-1 hover:bg-gray-100 rounded shrink-0"
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button 
                onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyRight'); }}
                className="p-1 hover:bg-gray-100 rounded shrink-0"
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <button 
                onMouseDown={(e) => { e.preventDefault(); executeCommand('insertUnorderedList'); }}
                className="p-1 hover:bg-gray-100 rounded shrink-0"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                onMouseDown={(e) => { e.preventDefault(); executeCommand('formatBlock', 'blockquote'); }}
                className="p-1 hover:bg-gray-100 rounded shrink-0"
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-gray-300 mx-1 shrink-0"></div>
              <button 
                onMouseDown={(e) => { e.preventDefault(); executeCommand('undo'); }}
                className="p-1 hover:bg-gray-100 rounded shrink-0"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button 
                onMouseDown={(e) => { e.preventDefault(); executeCommand('redo'); }}
                className="p-1 hover:bg-gray-100 rounded shrink-0"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsMaximized(!isMaximized)}
                className={`p-1 rounded shrink-0 transition ${isMaximized ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Toggle Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-1 px-3 py-2 border-l border-gray-200 shrink-0">
              <button
                onClick={() => { setShowDictionary(true); setDictTab('dictionary'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${showDictionary && dictTab === 'dictionary' ? 'bg-red-600 text-white border-red-600' : 'border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-600 bg-white'}`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Dictionary
              </button>
              <button
                onClick={() => { setShowDictionary(true); setDictTab('thesaurus'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${showDictionary && dictTab === 'thesaurus' ? 'bg-red-600 text-white border-red-600' : 'border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-600 bg-white'}`}
              >
                <Type className="w-3.5 h-3.5" /> Thesaurus
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-12 lg:px-24 relative">
            {showDictionary && (
              <div className="absolute right-4 top-4 z-50 w-96 bg-white shadow-2xl border border-gray-200 rounded-2xl overflow-hidden flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 shrink-0">
                  <div className="flex gap-1">
                    {(['dictionary', 'thesaurus'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setDictTab(tab)}
                        className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition ${dictTab === tab ? 'bg-red-600 text-white' : 'text-gray-500 hover:bg-gray-200'}`}
                      >{tab}</button>
                    ))}
                  </div>
                  <button onClick={() => setShowDictionary(false)} className="text-gray-400 hover:text-gray-700 text-lg leading-none">×</button>
                </div>

                {/* Search */}
                <div className="px-4 pt-3 pb-2 border-b border-gray-100 shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={dictQuery}
                      onChange={e => setDictQuery(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') lookupWord(dictQuery); }}
                      placeholder={dictTab === 'dictionary' ? 'Look up a word...' : 'Find synonyms...'}
                      className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-red-400 focus:ring-1 focus:ring-red-300 outline-none"
                    />
                    <button
                      onClick={() => lookupWord(dictQuery)}
                      disabled={dictLoading}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50"
                    >
                      {dictLoading ? '...' : '→'}
                    </button>
                  </div>
                </div>

                {/* Results */}
                <div className="overflow-y-auto flex-1 px-4 py-3 space-y-4">
                  {dictError && (
                    <div className="text-sm text-red-500 text-center py-4">{dictError}</div>
                  )}

                  {dictLoading && (
                    <div className="text-sm text-gray-400 text-center py-8 animate-pulse">Looking up...</div>
                  )}

                  {!dictLoading && !dictError && !dictResults && (
                    <div className="text-xs text-gray-400 text-center py-6">
                      {dictTab === 'dictionary' ? 'Search any word to see its definition, pronunciation, and examples.' : 'Search any word to discover synonyms and antonyms.'}
                    </div>
                  )}

                  {dictResults && dictTab === 'dictionary' && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-xl font-bold text-gray-900">{dictResults.word}</span>
                          {dictResults.phonetic && <span className="text-sm text-gray-500 font-mono">{dictResults.phonetic}</span>}
                        </div>
                      </div>
                      {dictResults.meanings.map((meaning, mi) => (
                        <div key={mi} className="space-y-2">
                          <div className="text-xs font-bold text-red-600 italic uppercase tracking-wide">{meaning.partOfSpeech}</div>
                          {meaning.definitions.slice(0, 3).map((def, di) => (
                            <div key={di} className="space-y-1">
                              <p className="text-sm text-gray-800 leading-relaxed">{di + 1}. {def.definition}</p>
                              {def.example && <p className="text-xs text-gray-500 italic pl-3 border-l-2 border-gray-200">"{def.example}"</p>}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {dictResults && dictTab === 'thesaurus' && (
                    <div className="space-y-5">
                      <div className="flex items-baseline gap-3">
                        <span className="text-xl font-bold text-gray-900">{dictResults.word}</span>
                        {dictResults.phonetic && <span className="text-sm text-gray-500 font-mono">{dictResults.phonetic}</span>}
                      </div>

                      {dictResults.synonyms.length > 0 && (
                        <div>
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Synonyms</div>
                          <div className="flex flex-wrap gap-1.5">
                            {dictResults.synonyms.map((s, i) => (
                              <button
                                key={i}
                                onClick={() => { setDictQuery(s); lookupWord(s); }}
                                className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium hover:bg-blue-100 transition"
                              >{s}</button>
                            ))}
                          </div>
                        </div>
                      )}

                      {dictResults.antonyms.length > 0 && (
                        <div>
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Antonyms</div>
                          <div className="flex flex-wrap gap-1.5">
                            {dictResults.antonyms.map((a, i) => (
                              <button
                                key={i}
                                onClick={() => { setDictQuery(a); lookupWord(a); }}
                                className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs rounded-full font-medium hover:bg-orange-100 transition"
                              >{a}</button>
                            ))}
                          </div>
                        </div>
                      )}

                      {dictResults.synonyms.length === 0 && dictResults.antonyms.length === 0 && (
                        <p className="text-xs text-gray-400 italic">No synonyms or antonyms found for this word.</p>
                      )}

                      <div className="border-t pt-3">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">By Part of Speech</div>
                        {dictResults.meanings.map((meaning, mi) => {
                          const ms = meaning.definitions.flatMap(d => d.synonyms).filter(Boolean);
                          if (!ms.length) return null;
                          return (
                            <div key={mi} className="mb-2">
                              <div className="text-[10px] font-bold text-red-500 italic uppercase mb-1">{meaning.partOfSpeech}</div>
                              <div className="flex flex-wrap gap-1">
                                {ms.slice(0, 10).map((s, i) => (
                                  <button key={i} onClick={() => { setDictQuery(s); lookupWord(s); }} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition">{s}</button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeSubTab === 'Summary Report' && analysis && (
              <div className="absolute inset-0 bg-white z-50 flex flex-col">
                <div className="h-16 border-b flex items-center justify-between px-6 bg-gray-50 shrink-0">
                  <h2 className="text-xl font-bold text-gray-800">Summary Report</h2>
                  <div className="flex items-center gap-4">
                    <div className="font-bold text-gray-500 border border-gray-300 px-3 py-1 rounded bg-white">{wordCount} words</div>
                    <button onClick={() => setActiveSubTab('Fiction Analyzer')} className="text-3xl text-gray-400 hover:text-gray-800 leading-none">&times;</button>
                  </div>
                </div>
                <div className="flex-1 flex overflow-hidden">
                  <div className="w-64 border-r p-4 space-y-1 bg-white overflow-y-auto">
                    {['Overall Score', 'Pacing & Momentum', 'Dialogue', 'Strong Writing', 'Word Choice', 'Repetition', 'Readability'].map(t => (
                      <button 
                        key={t} 
                        onClick={() => setSummaryTab(t)} 
                        className={`block w-full text-left px-4 py-2 rounded text-sm font-bold ${summaryTab===t ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 p-12 overflow-y-auto bg-gray-50 flex flex-col items-center">
                    {summaryTab === 'Overall Score' && (
                      <div className="max-w-4xl w-full bg-white p-10 shadow-sm border rounded-lg">
                        <div className="flex justify-between items-center mb-8">
                          <h3 className="text-2xl font-bold">AutoCrit Score</h3>
                          <select className="border-gray-300 rounded text-sm font-bold text-gray-600"><option>AutoCrit Score (Romance)</option></select>
                        </div>
                        <div className="flex gap-12 justify-center items-center">
                          <div className="text-center">
                            <div className="w-56 h-56 rounded-full border-[12px] border-emerald-400 flex items-center justify-center text-6xl font-bold text-emerald-500 shadow-inner">
                              87.1
                            </div>
                            <div className="mt-4 font-bold text-gray-500">Based on successful Romance</div>
                          </div>
                          <div className="flex-1 space-y-6">
                            <div>
                              <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Pacing & Momentum</span><span className="text-gray-900">80.2</span></div>
                              <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-3 bg-blue-500 rounded-full w-[80%]"></div></div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Dialogue</span><span className="text-gray-900">100.0</span></div>
                              <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-3 bg-emerald-500 rounded-full w-[100%]"></div></div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Strong Writing</span><span className="text-gray-900">82.1</span></div>
                              <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-3 bg-amber-500 rounded-full w-[82%]"></div></div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Word Choice</span><span className="text-gray-900">92.2</span></div>
                              <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-3 bg-emerald-500 rounded-full w-[92%]"></div></div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Repetition</span><span className="text-gray-900">81.1</span></div>
                              <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-3 bg-amber-500 rounded-full w-[81%]"></div></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {summaryTab !== 'Overall Score' && (
                      <div className="max-w-4xl w-full bg-white p-10 shadow-sm border rounded-lg h-[450px] overflow-y-auto">
                         <h3 className="text-2xl font-bold mb-6">{summaryTab} Details</h3>
                         
                         {summaryTab === 'Pacing & Momentum' && (
                           <div className="space-y-6">
                              <p className="text-gray-600">Your average sentence length is <strong className="text-gray-900">{analysis.avgSentenceLength}</strong> words. A good rule of thumb is between 11-14 words per sentence to maintain a brisk pace.</p>
                              <div>
                                 <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Consecutive Sentence Starters</span><span className="text-red-600">{analysis.consecutiveStarters}</span></div>
                                 <p className="text-xs text-gray-500">Too many sentences starting with the same word can make your writing feel robotic. Try varying your sentence structure.</p>
                              </div>
                           </div>
                         )}

                         {summaryTab === 'Strong Writing' && (
                           <div className="grid grid-cols-2 gap-8">
                              <div>
                                 <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Adverbs</span><span className="text-red-600">{analysis.adverbs}</span></div>
                                 <p className="text-xs text-gray-500 mb-6">Target: &lt; {Math.floor(wordCount * 0.015)}</p>
                                 <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Passive Indicators</span><span className="text-red-600">{analysis.passive}</span></div>
                                 <p className="text-xs text-gray-500 mb-6">Target: &lt; {Math.floor(wordCount * 0.02)}</p>
                                 <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Showing vs Telling</span><span className="text-red-600">{analysis.telling}</span></div>
                                 <p className="text-xs text-gray-500">Target: &lt; {Math.floor(wordCount * 0.01)}</p>
                              </div>
                              <div>
                                 <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Cliches</span><span className="text-red-600">{analysis.cliches}</span></div>
                                 <p className="text-xs text-gray-500 mb-6">Avoid relying on tired phrases.</p>
                                 <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Redundancies</span><span className="text-red-600">{analysis.redundancies}</span></div>
                                 <p className="text-xs text-gray-500 mb-6">e.g., 'nodded his head' (just 'nodded' is fine).</p>
                                 <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Filler Words</span><span className="text-red-600">{analysis.overused}</span></div>
                                 <p className="text-xs text-gray-500">Words like 'just', 'really', 'very'. Target: 0.</p>
                              </div>
                           </div>
                         )}

                         {summaryTab === 'Readability' && (
                           <div className="space-y-6">
                              <div>
                                 <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Flesch Reading Ease</span><span className="text-emerald-600">{analysis.readingEase}</span></div>
                                 <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-3 bg-emerald-500 rounded-full" style={{ width: `${analysis.readingEase}%` }}></div></div>
                                 <p className="text-xs text-gray-500 mt-2">Score between 60-70 is generally considered standard conversational English.</p>
                              </div>
                              <div>
                                 <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Grade Level</span><span className="text-gray-900">{analysis.gradeLevel}</span></div>
                                 <p className="text-xs text-gray-500">Aimed at an average {Math.round(analysis.gradeLevel)}th grade reading level.</p>
                              </div>
                           </div>
                         )}
                         {summaryTab === 'Dialogue' && (
                           <div className="space-y-6">
                              <div>
                                 <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Dialogue vs Narrative</span><span className="text-gray-900">{analysis.dialoguePercentage}% Dialogue</span></div>
                                 <div className="h-4 bg-gray-100 flex overflow-hidden rounded"><div className="h-4 bg-blue-500" style={{ width: `${analysis.dialoguePercentage}%` }}></div><div className="h-4 bg-gray-300 flex-1"></div></div>
                                 <p className="text-xs text-gray-500 mt-2">Genre average for Romance is usually 30-45% dialogue.</p>
                              </div>
                              <div>
                                 <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Dialogue Tags</span><span className="text-gray-900">{analysis.dialogueTags}</span></div>
                                 <p className="text-xs text-gray-500">Includes said, asked, replied, etc. Ensure you aren't over-relying on complex tags where simple action beats would suffice.</p>
                              </div>
                           </div>
                         )}

                         {summaryTab === 'Word Choice' && (
                           <div className="space-y-6">
                              <div>
                                 <div className="flex justify-between text-sm font-bold mb-2"><span className="text-gray-700">Vocabulary Diversity</span><span className="text-emerald-600">{analysis.vocabularyDiversity}%</span></div>
                                 <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-3 bg-emerald-500 rounded-full" style={{ width: `${analysis.vocabularyDiversity}%` }}></div></div>
                                 <p className="text-xs text-gray-500 mt-2">You used {analysis.uniqueWords} unique words in this excerpt.</p>
                              </div>
                           </div>
                         )}

                         {summaryTab === 'Repetition' && (
                           <div className="space-y-6">
                              <p className="text-sm text-gray-600">The most frequently used words in your document (excluding common articles):</p>
                              <div className="bg-gray-50 border rounded-lg p-4">
                                 {analysis.repeatedWords.map((rw: [string, number], idx: number) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                                       <span className="font-bold text-gray-700">{rw[0]}</span>
                                       <span className="text-sm font-bold bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{rw[1]} uses</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                         )}
                         
                         {!['Pacing & Momentum', 'Strong Writing', 'Readability', 'Dialogue', 'Word Choice', 'Repetition'].includes(summaryTab) && (
                           <p className="text-gray-500 italic">No specific metric summaries generated yet for {summaryTab}.</p>
                         )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {!activeDoc ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                <p>Select a document to begin analysis.</p>
              </div>
            ) : (
              <div className={`max-w-3xl mx-auto py-8 ${activeSubTab === 'Summary Report' ? 'hidden' : ''}`}>
                <div 
                  ref={editorRef}
                  contentEditable={true}
                  onInput={handleInput}
                  onKeyUp={(e) => { handleInput(e); saveSelection(); }}
                  onBlur={(e) => { saveSelection(); handleInput(e); }}
                  onMouseUp={saveSelection}
                  suppressContentEditableWarning={true}
                  className="max-w-none text-gray-800 text-lg leading-relaxed whitespace-pre-wrap [&_p]:mb-6 [&_p]:indent-8 [&_p]:text-justify outline-none focus:ring-2 focus:ring-red-100 rounded-lg p-4 -m-4 transition"
                />
              </div>
            )}
          </div>
        </div>

        <div className="w-[340px] border-l border-gray-200 bg-white overflow-y-auto shrink-0 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
             <h3 className="font-bold text-gray-800 text-sm">{activeSubTab === 'Fiction Analyzer' ? 'Analyzer +' : activeSubTab}</h3>
             <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-gray-600"><Activity className="w-4 h-4" /></button>
             </div>
          </div>
          
          {activeSubTab === 'Fiction Analyzer' && (
            <div className="flex flex-col flex-1">
              <div className="flex border-b border-gray-200 text-xs font-bold text-gray-500 bg-white">
                 <button onClick={() => setAnalyzerPlusTab('Story')} className={`flex-1 py-3 transition ${analyzerPlusTab==='Story'?'text-red-600 border-b-2 border-red-600 bg-red-50':''}`}>Story</button>
                 <button onClick={() => setAnalyzerPlusTab('World')} className={`flex-1 py-3 transition ${analyzerPlusTab==='World'?'text-red-600 border-b-2 border-red-600 bg-red-50':''}`}>World</button>
                 <button onClick={() => setAnalyzerPlusTab('Characters')} className={`flex-1 py-3 transition ${analyzerPlusTab==='Characters'?'text-red-600 border-b-2 border-red-600 bg-red-50':''}`}>Characters</button>
                 <button onClick={() => setAnalyzerPlusTab('Beats')} className={`flex-1 py-3 transition ${analyzerPlusTab==='Beats'?'text-red-600 border-b-2 border-red-600 bg-red-50':''}`}>Beats/Outline</button>
              </div>
              <div className="p-5 space-y-5 overflow-y-auto bg-gray-50 flex-1">
                <button 
                  onClick={handleStartAnalysis}
                  disabled={isFullAnalysisRunning}
                  className="w-full bg-red-600 text-white rounded font-bold py-2.5 text-sm hover:bg-red-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFullAnalysisRunning ? 'Analyzing Manuscript...' : 'Start Analysis'}
                </button>
                <div className="text-xs text-gray-500 font-bold text-center">
                  Progress: {analysisProgress}%
                </div>
                
                {analyzerPlusTab === 'Story' && (
                  <div className="space-y-4">
                    <div className="border border-gray-200 bg-white rounded shadow-sm p-4">
                       <div className="flex justify-between items-center mb-3">
                         <span className="font-bold text-sm text-gray-800">Story Premise</span> 
                         <button 
                           onClick={() => generateAIContent('premise')}
                           disabled={isGenerating !== null}
                           className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded disabled:opacity-50"
                         >
                           {isGenerating === 'premise' ? 'Generating...' : 'Generate'}
                         </button>
                       </div>
                       <textarea 
                         value={storyPremise}
                         onChange={(e) => setStoryPremise(e.target.value)}
                         className="w-full text-sm border border-gray-200 rounded p-3 focus:ring-1 focus:ring-red-500 outline-none" 
                         rows={4} 
                         placeholder="AI generated premise..."
                       />
                    </div>
                    <div className="border border-gray-200 bg-white rounded shadow-sm p-4">
                       <div className="flex justify-between items-center mb-3">
                         <span className="font-bold text-sm text-gray-800">Target Genre</span> 
                         <button 
                           onClick={() => generateAIContent('genre')}
                           disabled={isGenerating !== null}
                           className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded disabled:opacity-50"
                         >
                           {isGenerating === 'genre' ? 'Generating...' : 'Generate'}
                         </button>
                       </div>
                       <textarea 
                         value={targetGenre}
                         onChange={(e) => setTargetGenre(e.target.value)}
                         className="w-full text-sm border border-gray-200 rounded p-3 focus:ring-1 focus:ring-red-500 outline-none" 
                         rows={2} 
                         placeholder="E.g., Romance, Sci-Fi..."
                       />
                    </div>
                    <div className="border border-gray-200 bg-white rounded shadow-sm p-4">
                       <div className="flex justify-between items-center mb-3">
                         <span className="font-bold text-sm text-gray-800">Target Tropes</span> 
                         <button 
                           onClick={() => generateAIContent('tropes')}
                           disabled={isGenerating !== null}
                           className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded disabled:opacity-50"
                         >
                           {isGenerating === 'tropes' ? 'Generating...' : 'Generate'}
                         </button>
                       </div>
                       <textarea 
                         value={targetTropes}
                         onChange={(e) => setTargetTropes(e.target.value)}
                         className="w-full text-sm border border-gray-200 rounded p-3 focus:ring-1 focus:ring-red-500 outline-none" 
                         rows={3} 
                         placeholder="AI generated tropes..."
                       />
                    </div>
                  </div>
                )}
                
                {analyzerPlusTab === 'World' && (
                  <div className="space-y-4">
                    <div className="border border-gray-200 bg-white rounded shadow-sm p-4">
                       <div className="flex justify-between items-center mb-3">
                         <span className="font-bold text-sm text-gray-800">Setting & Time Period</span> 
                         <button onClick={() => generateAIContent('setting')} disabled={isGenerating !== null} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded disabled:opacity-50">
                           {isGenerating === 'setting' ? 'Generating...' : 'Generate'}
                         </button>
                       </div>
                       <textarea value={worldSetting} onChange={(e) => setWorldSetting(e.target.value)} className="w-full text-sm border border-gray-200 rounded p-3 focus:ring-1 focus:ring-red-500 outline-none" rows={3} placeholder="AI generated setting..."/>
                    </div>
                    <div className="border border-gray-200 bg-white rounded shadow-sm p-4">
                       <div className="flex justify-between items-center mb-3">
                         <span className="font-bold text-sm text-gray-800">Magic / Technology System</span> 
                         <button onClick={() => generateAIContent('magic')} disabled={isGenerating !== null} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded disabled:opacity-50">
                           {isGenerating === 'magic' ? 'Generating...' : 'Generate'}
                         </button>
                       </div>
                       <textarea value={worldMagic} onChange={(e) => setWorldMagic(e.target.value)} className="w-full text-sm border border-gray-200 rounded p-3 focus:ring-1 focus:ring-red-500 outline-none" rows={3} placeholder="AI generated technology/magic rules..."/>
                    </div>
                    <div className="border border-gray-200 bg-white rounded shadow-sm p-4">
                       <div className="flex justify-between items-center mb-3">
                         <span className="font-bold text-sm text-gray-800">Key Factions & Politics</span> 
                         <button onClick={() => generateAIContent('factions')} disabled={isGenerating !== null} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded disabled:opacity-50">
                           {isGenerating === 'factions' ? 'Generating...' : 'Generate'}
                         </button>
                       </div>
                       <textarea value={worldFactions} onChange={(e) => setWorldFactions(e.target.value)} className="w-full text-sm border border-gray-200 rounded p-3 focus:ring-1 focus:ring-red-500 outline-none" rows={4} placeholder="AI generated factions..."/>
                    </div>
                  </div>
                )}

                {analyzerPlusTab === 'Characters' && (
                  <div className="space-y-4">
                    <div className="border border-gray-200 bg-white rounded shadow-sm p-4">
                       <div className="flex justify-between items-center mb-3">
                         <span className="font-bold text-sm text-gray-800">Protagonist Arc</span> 
                         <button onClick={() => generateAIContent('protagonist')} disabled={isGenerating !== null} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded disabled:opacity-50">
                           {isGenerating === 'protagonist' ? 'Generating...' : 'Generate'}
                         </button>
                       </div>
                       <textarea value={charProtagonist} onChange={(e) => setCharProtagonist(e.target.value)} className="w-full text-sm border border-gray-200 rounded p-3 focus:ring-1 focus:ring-red-500 outline-none" rows={4} placeholder="AI generated protagonist arc..."/>
                    </div>
                    <div className="border border-gray-200 bg-white rounded shadow-sm p-4">
                       <div className="flex justify-between items-center mb-3">
                         <span className="font-bold text-sm text-gray-800">Antagonist Motivation</span> 
                         <button onClick={() => generateAIContent('antagonist')} disabled={isGenerating !== null} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded disabled:opacity-50">
                           {isGenerating === 'antagonist' ? 'Generating...' : 'Generate'}
                         </button>
                       </div>
                       <textarea value={charAntagonist} onChange={(e) => setCharAntagonist(e.target.value)} className="w-full text-sm border border-gray-200 rounded p-3 focus:ring-1 focus:ring-red-500 outline-none" rows={3} placeholder="AI generated antagonist motivation..."/>
                    </div>
                    <div className="border border-gray-200 bg-white rounded shadow-sm p-4">
                       <div className="flex justify-between items-center mb-3">
                         <span className="font-bold text-sm text-gray-800">Key Relationships</span> 
                         <button onClick={() => generateAIContent('relationships')} disabled={isGenerating !== null} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded disabled:opacity-50">
                           {isGenerating === 'relationships' ? 'Generating...' : 'Generate'}
                         </button>
                       </div>
                       <textarea value={charRelationships} onChange={(e) => setCharRelationships(e.target.value)} className="w-full text-sm border border-gray-200 rounded p-3 focus:ring-1 focus:ring-red-500 outline-none" rows={4} placeholder="AI generated relationship dynamics..."/>
                    </div>
                  </div>
                )}

                {analyzerPlusTab === 'Beats' && (
                  <div className="space-y-4">
                    <div className="border border-gray-200 bg-white rounded shadow-sm p-4">
                       <div className="flex justify-between items-center mb-3">
                         <span className="font-bold text-sm text-gray-800">Inciting Incident</span> 
                         <button onClick={() => generateAIContent('inciting')} disabled={isGenerating !== null} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded disabled:opacity-50">
                           {isGenerating === 'inciting' ? 'Generating...' : 'Generate'}
                         </button>
                       </div>
                       <textarea value={beatInciting} onChange={(e) => setBeatInciting(e.target.value)} className="w-full text-sm border border-gray-200 rounded p-3 focus:ring-1 focus:ring-red-500 outline-none" rows={3} placeholder="AI generated inciting incident..."/>
                    </div>
                    <div className="border border-gray-200 bg-white rounded shadow-sm p-4">
                       <div className="flex justify-between items-center mb-3">
                         <span className="font-bold text-sm text-gray-800">Midpoint Twist</span> 
                         <button onClick={() => generateAIContent('midpoint')} disabled={isGenerating !== null} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded disabled:opacity-50">
                           {isGenerating === 'midpoint' ? 'Generating...' : 'Generate'}
                         </button>
                       </div>
                       <textarea value={beatMidpoint} onChange={(e) => setBeatMidpoint(e.target.value)} className="w-full text-sm border border-gray-200 rounded p-3 focus:ring-1 focus:ring-red-500 outline-none" rows={3} placeholder="AI generated midpoint..."/>
                    </div>
                    <div className="border border-gray-200 bg-white rounded shadow-sm p-4">
                       <div className="flex justify-between items-center mb-3">
                         <span className="font-bold text-sm text-gray-800">Expected Climax</span> 
                         <button onClick={() => generateAIContent('climax')} disabled={isGenerating !== null} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded disabled:opacity-50">
                           {isGenerating === 'climax' ? 'Generating...' : 'Generate'}
                         </button>
                       </div>
                       <textarea value={beatClimax} onChange={(e) => setBeatClimax(e.target.value)} className="w-full text-sm border border-gray-200 rounded p-3 focus:ring-1 focus:ring-red-500 outline-none" rows={4} placeholder="AI generated climax outline..."/>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSubTab !== 'Summary Report' && activeSubTab !== 'Fiction Analyzer' && activeSubTab !== 'Combination Report' && (
            <div className="p-4 border-b border-gray-100">
               <div className="flex justify-between items-center mb-4">
                  <button 
                    type="button"
                    onClick={handleReRun}
                    className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50 transition"
                  >
                    Re-Run Report
                  </button>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                     <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="show" checked={showHighlights} onChange={() => setShowHighlights(true)} className="text-red-600" /> Show all</label>
                     <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="show" checked={!showHighlights} onChange={() => setShowHighlights(false)} className="text-red-600" /> Show none</label>
                  </div>
               </div>
            </div>
          )}

          {activeSubTab === 'Combination Report' && analysis && (
            <div className="p-4 bg-gray-50 flex-1 overflow-y-auto">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-gray-500">Compare To: <span className="text-gray-800">Romance</span></span>
                  <button onClick={handleReRun} className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50 transition">Re-Run Report</button>
               </div>
               <div className="space-y-4">
                 {[
                   { id: 'Adverbs', count: analysis.adverbs, rating: analysis.adverbs > 100 ? 'Too many' : 'Good', action: analysis.adverbs > 100 ? `Remove about ${Math.floor(analysis.adverbs * 0.4)}` : 'Awesome', ratingColor: analysis.adverbs > 100 ? 'text-red-500' : 'text-blue-500' },
                   { id: 'Passive Indicators', count: analysis.passive, rating: analysis.passive > 150 ? 'Too many' : 'Good', action: analysis.passive > 150 ? `Remove about ${Math.floor(analysis.passive * 0.3)}` : 'Awesome', ratingColor: analysis.passive > 150 ? 'text-red-500' : 'text-blue-500' },
                   { id: 'Showing vs Telling', count: analysis.telling, rating: 'Average', action: `Remove about ${Math.floor(analysis.telling * 0.2)}`, ratingColor: 'text-gray-600' },
                   { id: 'Unnecessary Filler Words', count: analysis.overused, rating: 'Too many', action: `Remove about ${Math.floor(analysis.overused * 0.5)}`, ratingColor: 'text-red-500' },
                   { id: 'Sentence Starters', count: null, rating: null, action: null, ratingColor: '' },
                 ].map(card => (
                   <div key={card.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                     <div className="flex justify-between items-start mb-2">
                       <span className="font-bold text-sm text-gray-800">{card.id}</span>
                       {card.count !== null && <span className="text-xl font-bold text-gray-900">{card.count}</span>}
                     </div>
                     {card.rating && (
                       <div className="text-xs text-gray-600 mb-4 leading-relaxed">
                         Rating: <span className={`font-bold ${card.ratingColor}`}>{card.rating}</span> <br/>
                         Recommended: <span className="font-bold">{card.action}</span>
                       </div>
                     )}
                     <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mb-3">
                        <label className="flex items-center gap-1 cursor-pointer"><input type="radio" checked={combinationHighlights[card.id] || false} onChange={() => setCombinationHighlights(p => ({...p, [card.id]: true}))} className="text-red-600" /> Show all</label>
                        <label className="flex items-center gap-1 cursor-pointer"><input type="radio" checked={!combinationHighlights[card.id]} onChange={() => setCombinationHighlights(p => ({...p, [card.id]: false}))} className="text-red-600" /> Show none</label>
                     </div>
                     <button 
                       onClick={() => {
                         if (card.id === 'Adverbs') { setActiveMainTab('Strong Writing'); setActiveSubTab('Adverbs'); }
                         else if (card.id === 'Passive Indicators') { setActiveMainTab('Strong Writing'); setActiveSubTab('Passive Indicators'); }
                         else if (card.id === 'Showing vs Telling') { setActiveMainTab('Strong Writing'); setActiveSubTab('Showing vs Telling'); }
                         else if (card.id === 'Unnecessary Filler Words') { setActiveMainTab('Strong Writing'); setActiveSubTab('Unnecessary Filler Words'); }
                         else if (card.id === 'Sentence Starters') { setActiveMainTab('Pacing'); setActiveSubTab('Sentence Starters'); }
                       }}
                       className="text-xs text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0 text-left"
                     >
                       Click here for detailed report.
                     </button>
                   </div>
                 ))}
               </div>
            </div>
          )}
          
          {activeSubTab !== 'Fiction Analyzer' && activeSubTab !== 'Combination Report' && activeSubTab !== 'Summary Report' && (
            <div className="p-6 bg-white flex-1 overflow-y-auto">
               <h4 className="font-bold text-gray-800 mb-6">{activeSubTab}</h4>
             
             {activeSubTab === 'Sentence Starters' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Top Sentence Starters</div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                      <span className="text-gray-700 font-semibold">Consecutive Starters</span>
                      <span className="text-red-600 font-bold">{analysis.consecutiveStarters}</span>
                    </div>
                    {analysis.topStarters.map(([starter, count]) => (
                      <div key={starter} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700 capitalize">{starter}</span>
                        <span className="text-gray-500 font-bold">{count}</span>
                      </div>
                    ))}
                 </div>
               </div>
             )}

             {activeSubTab === 'Adverbs' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Adverbs Analysis</div>
                  <p className="text-sm text-gray-700 mb-6">You have used <strong className="text-red-600">{analysis.adverbs}</strong> adverbs in this document.</p>
                  <p className="text-sm text-gray-600">
                    Adverbs (words often ending in -ly) can weaken your writing by telling the reader what is happening rather than showing them. 
                    Try replacing them with stronger, more descriptive verbs. For example, instead of 'ran quickly', use 'sprinted' or 'dashed'.
                  </p>
               </div>
             )}

             {activeSubTab === 'Passive Indicators' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Passive Voice Indicators</div>
                  <p className="text-sm text-gray-700 mb-6">We found <strong className="text-red-600">{analysis.passive}</strong> passive voice indicators.</p>
                  <p className="text-sm text-gray-600">
                    Passive voice occurs when the subject of a sentence receives the action instead of performing it (e.g., 'The ball was thrown by John' vs 'John threw the ball'). 
                    Active voice makes your writing more direct, vigorous, and engaging.
                  </p>
               </div>
             )}

             {activeSubTab === 'Showing vs Telling' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Showing vs. Telling</div>
                  <p className="text-sm text-gray-700 mb-6">There are <strong className="text-red-600">{analysis.telling}</strong> telling words in this excerpt.</p>
                  <p className="text-sm text-gray-600">
                    Words like 'felt', 'knew', 'realized', and 'saw' often indicate that you are summarizing an experience rather than immersing the reader in it. 
                    Instead of writing 'He felt cold', describe him 'shivering as his breath plumed in the freezing air'.
                  </p>
               </div>
             )}

             {activeSubTab === 'Unnecessary Filler Words' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Filler Words</div>
                  <p className="text-sm text-gray-700 mb-6">You used <strong className="text-red-600">{analysis.overused}</strong> filler words.</p>
                  <p className="text-sm text-gray-600">
                    Words like 'just', 'really', 'very', and 'that' often clutter your sentences without adding meaning. 
                    Removing them tighten your prose and improves the pacing of your narrative.
                  </p>
               </div>
             )}

             {activeSubTab === 'Tense Consistency' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Tense Consistency</div>
                  <p className="text-sm text-gray-700 mb-6">We found approx <strong className="text-red-600">{analysis.pastTense}</strong> past tense indicators and <strong className="text-red-600">{analysis.presentTense}</strong> present tense indicators.</p>
                  <p className="text-sm text-gray-600 mb-6">
                    While stories naturally transition between tenses occasionally, a high mix of both might indicate accidental tense shifting (e.g. writing "He walked to the door and opens it"). 
                    Review the highlighted indicators to ensure you aren't slipping out of your narrative's primary tense.
                  </p>
                  <div className="h-6 bg-gray-100 flex overflow-hidden rounded">
                    <div className="h-6 bg-blue-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${(analysis.pastTense / Math.max(1, analysis.pastTense + analysis.presentTense)) * 100}%` }}>Past</div>
                    <div className="h-6 bg-green-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${(analysis.presentTense / Math.max(1, analysis.pastTense + analysis.presentTense)) * 100}%` }}>Present</div>
                  </div>
               </div>
             )}

             {activeSubTab === 'Cliches' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Clichés</div>
                  <p className="text-sm text-gray-700 mb-6">We spotted <strong className="text-red-600">{analysis.cliches}</strong> cliches in your text.</p>
                  <p className="text-sm text-gray-600">
                    Clichés are overused phrases (like "avoid like the plague" or "dead of night") that lack original imagery. 
                    Try replacing them with your own unique descriptions to make your writing more vivid and memorable.
                  </p>
               </div>
             )}

             {activeSubTab === 'Redundancies' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Redundancies</div>
                  <p className="text-sm text-gray-700 mb-6">We found <strong className="text-red-600">{analysis.redundancies}</strong> redundant phrases.</p>
                  <p className="text-sm text-gray-600">
                    Redundancies (like "nodded his head" or "shrugged her shoulders") contain words that don't add new information (you can only nod your head). 
                    Removing the redundant word makes your writing tighter and more professional.
                  </p>
               </div>
             )}

             {activeSubTab === 'Repeated Words' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Top Repeated Words</div>
                  <p className="text-sm text-gray-600 mb-4">These are the most common non-trivial words you've used repeatedly in this document.</p>
                  <div className="space-y-4">
                    {analysis.repeatedWords.map(([word, count]) => (
                      <div key={word} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{word}</span>
                        <span className="text-red-600 font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
               </div>
             )}

             {activeSubTab === 'Word Frequency' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Word Frequency (All Words)</div>
                  <p className="text-sm text-gray-600 mb-4">An absolute count of the most frequent words in your document, including common articles and conjunctions.</p>
                  <div className="space-y-4">
                    {analysis.wordFrequency.map(([word, count]) => (
                      <div key={word} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{word}</span>
                        <span className="text-gray-500 font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
               </div>
             )}

             {activeSubTab === 'Phrase Frequency' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Phrase Frequency</div>
                  <p className="text-sm text-gray-600 mb-4">Top repeated 2-word and 3-word phrases. Overusing specific phrases can quickly annoy readers.</p>
                  <div className="space-y-4">
                    {analysis.phraseFrequency.map(([phrase, count]) => (
                      <div key={phrase} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                        <span className="text-gray-700">{phrase}</span>
                        <span className="text-red-600 font-bold">{count}</span>
                      </div>
                    ))}
                    {analysis.phraseFrequency.length === 0 && (
                      <div className="text-sm text-gray-400 italic">No significantly repeated phrases found!</div>
                    )}
                  </div>
               </div>
             )}

             {activeSubTab === 'Initial Pronoun and Names' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Initial Pronouns and Names</div>
                  <p className="text-sm text-gray-700 mb-6">You started <strong className="text-red-600">{analysis.initialPronounCount}</strong> sentences with a pronoun and <strong className="text-red-600">{analysis.initialNameCount}</strong> sentences with a name.</p>
                  <p className="text-sm text-gray-600">
                    Starting too many sentences with a character's name or a pronoun ("He did this. She did that.") creates a repetitive, "see spot run" cadence. 
                    Try varying your sentence structures by starting with an action, a setting description, or a dependent clause.
                  </p>
               </div>
             )}

             {activeSubTab === 'POV Consistency' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Point of View Consistency</div>
                  <p className="text-sm text-gray-700 mb-6">We found <strong className="text-red-600">{analysis.firstPersonCount}</strong> 1st-person pronouns and <strong className="text-red-600">{analysis.thirdPersonCount}</strong> 3rd-person pronouns.</p>
                  <p className="text-sm text-gray-600 mb-6">
                    A heavy mix of both 1st and 3rd person pronouns (outside of dialogue) could indicate a POV slip, where you accidentally jump out of your protagonist's perspective.
                  </p>
                  <div className="h-6 bg-gray-100 flex overflow-hidden rounded">
                    <div className="h-6 bg-blue-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${(analysis.firstPersonCount / Math.max(1, analysis.firstPersonCount + analysis.thirdPersonCount)) * 100}%` }}>1st Person</div>
                    <div className="h-6 bg-green-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${(analysis.thirdPersonCount / Math.max(1, analysis.firstPersonCount + analysis.thirdPersonCount)) * 100}%` }}>3rd Person</div>
                  </div>
               </div>
             )}

             {activeSubTab === 'Generic Descriptions' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Generic Descriptions</div>
                  <p className="text-sm text-gray-700 mb-6">You used <strong className="text-red-600">{analysis.genericDescriptionsCount}</strong> generic descriptive words (like 'good', 'bad', 'nice', 'big').</p>
                  <p className="text-sm text-gray-600">
                    Generic adjectives lack specificity and fail to paint a vivid picture in the reader's mind. 
                    Instead of a "big house," describe a "sprawling Victorian mansion." Upgrade generic words to more evocative imagery.
                  </p>
               </div>
             )}

             {activeSubTab === 'Personal Words and Phrases' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Personal Words and Phrases</div>
                  <p className="text-sm text-gray-700 mb-6">You used <strong className="text-red-600">{analysis.personalWordsCount}</strong> thought-filter words (like 'feel', 'think', 'believe', 'wonder').</p>
                  <p className="text-sm text-gray-600">
                    These "filtering" words distance the reader from the protagonist's experience. 
                    Instead of "She felt the cold wind," just write "The cold wind bit through her coat." This immerses the reader directly into the POV.
                  </p>
               </div>
             )}

             {activeSubTab === 'Power Words' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Power Words</div>
                  <p className="text-sm text-gray-700 mb-6">You used <strong className="text-red-600">{analysis.powerWordsCount}</strong> power words.</p>
                  <p className="text-sm text-gray-600">
                    Power words (like 'devastating', 'breathtaking', 'horrifying') evoke strong emotion and pull the reader into the scene. 
                    Sprinkling these strategically throughout high-stakes scenes can dramatically elevate your prose.
                  </p>
               </div>
             )}

             {activeSubTab === 'Readability Statistics' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Readability Statistics</div>
                  <p className="text-sm text-gray-600 mb-4">An overview of how difficult your manuscript is to read based on syllable counts and sentence lengths.</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                      <span className="text-gray-700 font-semibold">Flesch Reading Ease</span>
                      <span className="text-red-600 font-bold">{analysis.readingEase} / 100</span>
                    </div>
                    <div className="text-xs text-gray-500 italic mb-4">Higher scores indicate easier readability. Target 60-70 for commercial fiction.</div>
                    <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 mt-4">
                      <span className="text-gray-700 font-semibold">Flesch-Kincaid Grade Level</span>
                      <span className="text-red-600 font-bold">{analysis.gradeLevel}</span>
                    </div>
                    <div className="text-xs text-gray-500 italic">Target a 7th-9th grade reading level for mass market appeal.</div>
                  </div>
               </div>
             )}

             {activeSubTab === 'Dale Chall Readability' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Dale-Chall Readability</div>
                  <p className="text-sm text-gray-700 mb-6">Your Dale-Chall score is <strong className="text-red-600">{analysis.daleChall}</strong>.</p>
                  <p className="text-sm text-gray-600">
                    Unlike Flesch-Kincaid which relies on syllable counts, the Dale-Chall formula evaluates readability based on a vocabulary list of 3,000 common words. 
                    A score of 6.0–6.9 indicates reading material appropriate for a 7th to 8th grade student. 
                    A score of 9.0+ indicates college-level material.
                  </p>
               </div>
             )}

             {activeSubTab === 'Complex Words' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Complex Words</div>
                  <p className="text-sm text-gray-700 mb-6">You have used <strong className="text-red-600">{analysis.complexWordsCount}</strong> complex words (words with 3 or more syllables).</p>
                  <p className="text-sm text-gray-600">
                    Using too many multisyllabic words can slow down a reader and pull them out of the story. 
                    Unless you are writing high fantasy or historical fiction where elevated diction is expected, try swapping overly complex words for punchier, simpler synonyms.
                  </p>
               </div>
             )}

             {activeSubTab === 'Chapter Variation' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Chapters by word count</div>
                  <div className="space-y-3">
                    {analysis.chaptersVariation.map(item => (
                       <div key={item.label} className="flex items-center gap-4 text-xs">
                         <span className="w-20 text-red-600">{item.label}</span>
                         <span className="w-4 text-red-600">{item.value}</span>
                         <div className="flex-1 h-3 bg-red-600 rounded-sm" style={{ width: item.value > 0 ? '100%' : '0%' }}></div>
                       </div>
                    ))}
                  </div>
                  <div className="text-xs font-bold text-gray-500 mt-8 mb-4">Individual Chapters</div>
                  <div className="flex items-center gap-4 text-xs">
                     <span className="w-20 text-red-600">{activeDoc?.name || 'Introduction'}</span>
                     <span className="w-8 text-red-600 text-right">{wordCount}</span>
                     <div className="w-1/3 h-3 bg-red-600 rounded-sm"></div>
                  </div>
               </div>
             )}
             
             {activeSubTab === 'Pacing' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Pacing Analysis</div>
                  <p className="text-sm text-gray-700 mb-6">Your average sentence length is <strong className="text-red-600">{analysis.avgSentenceLength}</strong> words.</p>
                  <p className="text-sm text-gray-600">
                    Shorter sentences (under 10 words) speed up the pacing, ideal for action scenes or high tension. 
                    Longer sentences (15+ words) slow the pacing down, allowing for deeper introspection and setting description. 
                    Ensure your pacing matches the tone of your current scene.
                  </p>
               </div>
             )}

             {activeSubTab === 'Dialogue' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Dialogue vs Narrative</div>
                  <p className="text-sm text-gray-700 mb-6">Your manuscript is currently <strong className="text-red-600">{analysis.dialoguePercentage}%</strong> dialogue.</p>
                  <p className="text-sm text-gray-600 mb-6">
                    In most modern fiction (especially Romance and Thrillers), dialogue typically makes up between 30-50% of the text. 
                    Too little dialogue can make a scene feel sluggish and overly introspective. Too much dialogue can turn your scene into a "talking heads" script without enough grounding action or setting.
                  </p>
                  <div className="h-6 bg-gray-100 flex overflow-hidden rounded"><div className="h-6 bg-blue-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${analysis.dialoguePercentage}%` }}>Dialogue</div><div className="h-6 bg-gray-300 flex-1 flex items-center justify-center text-gray-600 text-xs font-bold">Narrative</div></div>
               </div>
             )}

             {activeSubTab === 'Dialogue Tags' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Dialogue Tags</div>
                  <p className="text-sm text-gray-700 mb-6">You have used <strong className="text-red-600">{analysis.dialogueTags}</strong> common dialogue tags (said, asked, replied, etc).</p>
                  <p className="text-sm text-gray-600">
                    While "said" and "asked" are largely invisible to readers, over-relying on them can still make conversations feel robotic. 
                    Consider replacing some of your tags with strong action beats (e.g. <i>John slammed his fist on the table. "I won't do it."</i> instead of <i>"I won't do it," John shouted.</i>)
                  </p>
               </div>
             )}

             {activeSubTab === 'Adverbs In Dialogue' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Adverbs In Dialogue</div>
                  <p className="text-sm text-gray-700 mb-6">You have used <strong className="text-red-600">{analysis.adverbsInDialogue}</strong> adverbs specifically inside spoken dialogue or attached to dialogue tags.</p>
                  <p className="text-sm text-gray-600">
                    Using adverbs in dialogue tags (e.g., <i>"I hate you," she said angrily.</i>) is a classic example of telling rather than showing. 
                    Instead of using an adverb to describe how the character spoke, show their anger through their actions, expression, or the dialogue itself.
                  </p>
               </div>
             )}

             {activeSubTab === 'Sentence Variation' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Sentence Length Variation</div>
                  <p className="text-sm text-gray-600 mb-4">Good pacing requires a mix of sentence lengths to prevent your writing from feeling monotonous.</p>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                       <span className="text-gray-700 font-semibold">Short (1-7 words)</span>
                       <span className="text-red-600 font-bold">{analysis.shortSentences}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                       <span className="text-gray-700 font-semibold">Medium (8-15 words)</span>
                       <span className="text-red-600 font-bold">{analysis.mediumSentences}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                       <span className="text-gray-700 font-semibold">Long (16+ words)</span>
                       <span className="text-red-600 font-bold">{analysis.longSentences}</span>
                     </div>
                  </div>
               </div>
             )}

             {activeSubTab === 'Paragraph Variation' && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Paragraph Variation</div>
                  <p className="text-sm text-gray-700 mb-6">You have <strong className="text-red-600">{analysis.paragraphCount}</strong> paragraphs, averaging <strong className="text-red-600">{analysis.avgParagraphLength}</strong> words each.</p>
                  <p className="text-sm text-gray-600">
                    Huge blocks of text can be intimidating for readers and slow down the narrative flow. 
                    Consider breaking up paragraphs longer than 100 words, especially in fast-paced scenes or dialogue-heavy moments.
                  </p>
               </div>
             )}
             
             {['Adverbs', 'Passive Indicators', 'Showing vs Telling', 'Cliches', 'Redundancies', 'Unnecessary Filler Words', 'Dialogue Tags', 'Generic Descriptions', 'Personal Words and Phrases', 'Power Words'].includes(activeSubTab) && analysis && (
               <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">Occurrences</div>
                  <div className="space-y-4">
                    {activeSubTab === 'Adverbs' && (
                      <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                        <span className="text-gray-700 font-semibold">Adverbs</span>
                        <span className="text-red-600 font-bold">{analysis.adverbs}</span>
                      </div>
                    )}
                    {activeSubTab === 'Passive Indicators' && (
                      <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                        <span className="text-gray-700 font-semibold">Passive Indicators</span>
                        <span className="text-red-600 font-bold">{analysis.passive}</span>
                      </div>
                    )}
                    {activeSubTab === 'Showing vs Telling' && (
                      <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                        <span className="text-gray-700 font-semibold">Showing vs Telling</span>
                        <span className="text-red-600 font-bold">{analysis.telling}</span>
                      </div>
                    )}
                    {activeSubTab === 'Cliches' && (
                      <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                        <span className="text-gray-700 font-semibold">Cliches</span>
                        <span className="text-red-600 font-bold">{analysis.cliches}</span>
                      </div>
                    )}
                    {activeSubTab === 'Redundancies' && (
                      <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                        <span className="text-gray-700 font-semibold">Redundancies</span>
                        <span className="text-red-600 font-bold">{analysis.redundancies}</span>
                      </div>
                    )}
                    {activeSubTab === 'Unnecessary Filler Words' && (
                      <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                        <span className="text-gray-700 font-semibold">Filler Words</span>
                        <span className="text-red-600 font-bold">{analysis.overused}</span>
                      </div>
                    )}
                    {activeSubTab === 'Dialogue Tags' && (
                      <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                        <span className="text-gray-700 font-semibold">Standard Tags</span>
                        <span className="text-red-600 font-bold">{analysis.dialogueTags}</span>
                      </div>
                    )}
                    {activeSubTab === 'Adverbs In Dialogue' && (
                      <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                        <span className="text-gray-700 font-semibold">Adverbs In Dialogue</span>
                        <span className="text-red-600 font-bold">{analysis.adverbsInDialogue}</span>
                      </div>
                    )}
                    {activeSubTab === 'Generic Descriptions' && (
                      <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                        <span className="text-gray-700 font-semibold">Generic Words</span>
                        <span className="text-red-600 font-bold">{analysis.genericDescriptionsCount}</span>
                      </div>
                    )}
                    {activeSubTab === 'Personal Words and Phrases' && (
                      <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                        <span className="text-gray-700 font-semibold">Filter Words</span>
                        <span className="text-red-600 font-bold">{analysis.personalWordsCount}</span>
                      </div>
                    )}
                    {activeSubTab === 'Power Words' && (
                      <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                        <span className="text-gray-700 font-semibold">Power Words</span>
                        <span className="text-red-600 font-bold">{analysis.powerWordsCount}</span>
                      </div>
                    )}
                  </div>
               </div>
             )}
             
             {activeSubTab === 'What Happens Next?' && (
               <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xs font-bold text-gray-500">AI Brainstorming</div>
                    <button onClick={() => generateAIContent('next')} disabled={isGenerating !== null} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full disabled:opacity-50">
                      {isGenerating === 'next' ? 'Thinking...' : 'Brainstorm Next Beats'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">Stuck on the current scene? Let the AI analyze the excerpt and suggest 3 distinct directions the narrative could take.</p>
                  <textarea value={inspirationNext} onChange={(e) => setInspirationNext(e.target.value)} className="w-full text-sm border border-gray-200 rounded p-4 focus:ring-1 focus:ring-red-500 outline-none min-h-[300px]" placeholder="Generated ideas will appear here..."></textarea>
               </div>
             )}

             {activeSubTab === 'Change The Mood' && (
               <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xs font-bold text-gray-500">AI Mood Shift</div>
                    <button onClick={() => generateAIContent('mood')} disabled={isGenerating !== null} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full disabled:opacity-50">
                      {isGenerating === 'mood' ? 'Thinking...' : 'Shift Mood'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">See how this exact scene would play out if the underlying emotional tone was shifted (e.g. from tense to comedic).</p>
                  <textarea value={inspirationMood} onChange={(e) => setInspirationMood(e.target.value)} className="w-full text-sm border border-gray-200 rounded p-4 focus:ring-1 focus:ring-red-500 outline-none min-h-[300px]" placeholder="Generated mood variations will appear here..."></textarea>
               </div>
             )}

             {activeSubTab === 'Fiction Story Builder' && (
               <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xs font-bold text-gray-500">Fiction Outliner</div>
                    <button onClick={() => generateAIContent('fictionBuilder')} disabled={isGenerating !== null} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full disabled:opacity-50">
                      {isGenerating === 'fictionBuilder' ? 'Thinking...' : 'Generate 15-Beat Outline'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">Let the AI generate a complete 15-beat fiction outline using the Save the Cat! structure based on your current excerpt.</p>
                  <textarea value={planningFiction} onChange={(e) => setPlanningFiction(e.target.value)} className="w-full text-sm border border-gray-200 rounded p-4 focus:ring-1 focus:ring-red-500 outline-none min-h-[400px]" placeholder="Generated outline will appear here..."></textarea>
               </div>
             )}

             {activeSubTab === 'Non-Fiction Story Builder' && (
               <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xs font-bold text-gray-500">Non-Fiction Outliner</div>
                    <button onClick={() => generateAIContent('nonFictionBuilder')} disabled={isGenerating !== null} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full disabled:opacity-50">
                      {isGenerating === 'nonFictionBuilder' ? 'Thinking...' : 'Generate Topic Outline'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">Let the AI construct a robust non-fiction book outline including a thesis statement and chapter structure.</p>
                  <textarea value={planningNonFiction} onChange={(e) => setPlanningNonFiction(e.target.value)} className="w-full text-sm border border-gray-200 rounded p-4 focus:ring-1 focus:ring-red-500 outline-none min-h-[400px]" placeholder="Generated non-fiction outline will appear here..."></textarea>
               </div>
             )}

             {['Fiction Analyzer'].includes(activeSubTab) && (
               <div className="text-center mt-8">
                 <Zap className="w-12 h-12 text-blue-500 mx-auto mb-4 opacity-50" />
                 <h5 className="font-bold text-gray-800 mb-2">AI {activeSubTab}</h5>
                 <p className="text-sm text-gray-500 mb-6">Analyze your manuscript using the latest AI models to generate insights and structural recommendations.</p>
                 <button className="bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-red-700 transition">Run AI Analysis</button>
               </div>
             )}

             {activeSubTab === 'Book Details' && (
               <div className="space-y-6">
                 <div>
                    <h5 className="font-bold text-gray-800 mb-4">Book Metadata</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Book Title</label>
                        <input type="text" className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-red-400" placeholder="e.g. Ashes of the Wolf King" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Author Name</label>
                        <input type="text" className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-red-400" placeholder="e.g. Jane Doe" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">ISBN</label>
                        <input type="text" className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-red-400" placeholder="978-3-16-148410-0" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Publisher</label>
                        <input type="text" className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-red-400" placeholder="e.g. Self-Published" />
                      </div>
                    </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'Style / Theme' && (
               <div className="space-y-6">
                 <div>
                    <h5 className="font-bold text-gray-800 mb-4">Formatting Settings</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Trim Size</label>
                        <select className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-red-400">
                          <option>5 x 8 in (Standard Fiction)</option>
                          <option>5.5 x 8.5 in (Trade Paperback)</option>
                          <option>6 x 9 in (Hardcover/Large Trade)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Body Font</label>
                        <select className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-red-400">
                          <option>Garamond (11pt)</option>
                          <option>Baskerville (11pt)</option>
                          <option>Palatino (11pt)</option>
                          <option>Georgia (11pt)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Chapter Header Style</label>
                        <select className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-red-400">
                          <option>Classic (Centered, Drop Cap)</option>
                          <option>Modern (Left Aligned, Bold)</option>
                          <option>Ornamental (With Flourish)</option>
                        </select>
                      </div>
                    </div>
                    <button className="mt-8 bg-gray-900 text-white w-full py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition">Preview PDF Export</button>
                 </div>
               </div>
             )}

             {activeSubTab === 'Query Letter' && (
               <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xs font-bold text-gray-500">AI Query Writer</div>
                    <button onClick={() => generateAIContent('queryLetter')} disabled={isGenerating !== null} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full disabled:opacity-50">
                      {isGenerating === 'queryLetter' ? 'Thinking...' : 'Generate Query'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">Let the AI generate a professional literary agent query letter based on your manuscript excerpt.</p>
                  <textarea value={publishingQueryLetter} onChange={(e) => setPublishingQueryLetter(e.target.value)} className="w-full text-sm border border-gray-200 rounded p-4 focus:ring-1 focus:ring-red-500 outline-none min-h-[400px]" placeholder="Generated query letter will appear here..."></textarea>
               </div>
             )}
             
             {activeSubTab === 'Sentence Variation' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="text-center">
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src="https://ui-avatars.com/api/?name=Romance&background=random" /></div> Romance Average <EditIcon /></span>
                      <div className="bg-blue-800 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">11-14 words</div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div> Your Average</span>
                      <div className="bg-red-600 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">{analysis.avgSentenceLength} words</div>
                    </div>
                 </div>
                 <div className="border-t pt-4">
                   <div className="text-xs font-bold text-gray-500 mb-4">Sentence Variation</div>
                   <div className="space-y-4">
                     <div className="flex items-center justify-between text-sm">
                       <span className="text-gray-700">Short (≤ 7 words)</span>
                       <span className="text-gray-900 font-bold">{analysis.shortSentences}</span>
                     </div>
                     <div className="flex items-center justify-between text-sm">
                       <span className="text-gray-700">Medium (8-15 words)</span>
                       <span className="text-gray-900 font-bold">{analysis.mediumSentences}</span>
                     </div>
                     <div className="flex items-center justify-between text-sm">
                       <span className="text-gray-700">Long (&gt; 15 words)</span>
                       <span className="text-gray-900 font-bold">{analysis.longSentences}</span>
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'Pacing' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="text-center">
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGenre.name)}&background=random`} /></div> {selectedGenre.name} <EditIcon /></span>
                      <div className="bg-blue-800 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">33</div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div> Your Count</span>
                      <div className="bg-red-600 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">{analysis.slowPacedParagraphs.length}</div>
                    </div>
                    <div className="text-xs font-bold text-gray-500 mt-4 uppercase">
                      {((analysis.slowPacedParagraphs.length / Math.max(1, analysis.paragraphCount)) * 100).toFixed(1)}% OF YOUR PARAGRAPHS ARE SLOW PACED
                    </div>
                 </div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                      <div className="flex items-center gap-2 text-xs">
                        <button className="text-gray-500 hover:text-gray-800">Zoom to Paragraph</button>
                        <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 font-bold hover:bg-red-50">Search</button>
                      </div>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="pacingShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="pacingShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-4">Slow Paced Paragraphs</div>
                   <div className="space-y-3 overflow-y-auto max-h-64 pr-2">
                     {analysis.slowPacedParagraphs.map((p, idx) => (
                       <div key={idx} className="flex items-center gap-3 text-xs">
                         <input type="checkbox" className="rounded text-red-600 border-gray-300 focus:ring-red-500" />
                         <span 
                           className="text-red-600 truncate flex-1 cursor-pointer hover:underline"
                           onClick={() => scrollToText(p.snippet)}
                         >
                           {p.snippet}
                         </span>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'Paragraph Variation' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="text-center">
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src="https://ui-avatars.com/api/?name=Romance&background=random" /></div> Romance's Average Paragraph Length <EditIcon /></span>
                      <div className="bg-blue-800 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">33.6</div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div> Your Average Paragraph Length</span>
                      <div className="bg-red-600 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">{analysis.avgParagraphLength.toFixed(1)}</div>
                    </div>
                 </div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                      <div className="flex items-center gap-2 text-xs">
                        <button className="text-gray-500 hover:text-gray-800">Zoom to</button>
                        <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 font-bold hover:bg-red-50">Search</button>
                      </div>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="pvShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="pvShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   
                   <div className="text-sm font-bold text-gray-800 mb-4">Paragraph Variation</div>
                   <div className="text-xs font-bold text-gray-500 mb-4">Paragraphs by word count</div>
                   <div className="space-y-2 mb-8">
                     {Object.entries(analysis.paragraphVariation).map(([label, count]) => (
                       <div key={label} className="flex items-center text-xs">
                         <span className="w-16 text-red-600">{label}</span>
                         <span className="w-8 text-gray-600">{count as number}</span>
                         <div className="flex-1">
                           {(count as number) > 0 && (
                             <div className="bg-red-600 h-4 rounded-sm" style={{ width: `${Math.min(100, ((count as number) / analysis.paragraphCount) * 100)}%` }}></div>
                           )}
                         </div>
                       </div>
                     ))}
                   </div>
                   
                   <div className="text-xs font-bold text-gray-500 mb-4">Individual Paragraphs</div>
                   <div className="space-y-2 overflow-y-auto max-h-64 pr-2">
                     {analysis.individualParagraphLengths.map((len, idx) => (
                       <div key={idx} className="flex items-center text-xs text-red-600">
                         <span className="w-12">{len}</span>
                         <div className="flex-1 flex items-center h-4">
                           <div className="bg-red-600 h-4 rounded-sm" style={{ width: `${Math.min(100, (len / 150) * 100)}%` }}></div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'Chapter Variation' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div>
                   <h3 className="text-xl font-bold text-gray-800 mb-4">Chapter Variation</h3>
                   <div className="text-xs font-bold text-gray-500 mb-4">Chapters by word count</div>
                   <div className="space-y-2 mb-8">
                     {analysis.chaptersVariation.map(bucket => (
                       <div key={bucket.label} className="flex items-center text-xs">
                         <span className="w-24 text-red-600">{bucket.label}</span>
                         <span className="w-8 text-gray-600">{bucket.value}</span>
                         <div className="flex-1">
                           {bucket.value > 0 && (
                             <div className="bg-red-600 h-4 rounded-sm" style={{ width: `${Math.min(100, (bucket.value / analysis.individualChapters.length) * 100)}%` }}></div>
                           )}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
                 
                 <div>
                   <div className="text-xs font-bold text-gray-500 mb-4">Individual Chapters</div>
                   <div className="space-y-3 overflow-y-auto max-h-64 pr-2">
                     {analysis.individualChapters.map((ch, idx) => (
                       <div key={idx} className="flex items-center text-xs text-red-600">
                         <span className="w-32 truncate">{ch.title}</span>
                         <span className="w-16 text-right pr-4">{ch.words}</span>
                         <div className="flex-1 flex items-center h-4">
                           <div className="bg-red-600 h-4 rounded-sm" style={{ width: `${Math.min(100, (ch.words / 4000) * 100)}%` }}></div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             )}
             
             {activeSubTab === 'Dialogue' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="text-center">
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGenre.name)}&background=random`} /></div> {selectedGenre.name} <EditIcon /></span>
                      <div className="bg-blue-800 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">28.8%</div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div> Your Percentage</span>
                      <div className="bg-red-600 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">{analysis.dialoguePercentage}%</div>
                    </div>
                    <div className="text-xs font-bold text-gray-500 mt-4 uppercase">
                      {analysis.dialoguePercentage}% OF YOUR SENTENCES HAVE DIALOGUE
                    </div>
                 </div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="diaShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="diaShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-4">Dialogue</div>
                   <div className="space-y-3 overflow-y-auto max-h-64 pr-2">
                     {analysis.dialogueSnippets.map((d, idx) => (
                       <div key={idx} className="flex items-center gap-3 text-xs">
                         <input type="checkbox" className="rounded text-red-600 border-gray-300 focus:ring-red-500" />
                         <span 
                           className="text-red-600 truncate flex-1 cursor-pointer hover:underline"
                           onClick={() => scrollToText(d.snippet)}
                         >
                           {d.snippet}
                         </span>
                       </div>
                     ))}
                     {analysis.dialogueSnippets.length === 0 && (
                       <div className="text-sm text-gray-400 italic">No dialogue found in this document.</div>
                     )}
                   </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'Dialogue Tags' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div>
                   <h3 className="text-sm font-bold text-gray-800 mb-4">Romance</h3>
                   <div className="space-y-2 mb-8">
                     <div className="flex items-center text-xs">
                       <span className="w-24 text-gray-600">Said/Asked</span>
                       <div className="flex-1 bg-gray-100 h-6 rounded-md overflow-hidden flex">
                         <div className="bg-blue-800 h-6 flex items-center justify-center text-white font-bold" style={{ width: `66%` }}>106</div>
                       </div>
                     </div>
                     <div className="flex items-center text-xs">
                       <span className="w-24 text-gray-600">Others</span>
                       <div className="flex-1 bg-gray-100 h-6 rounded-md overflow-hidden flex">
                         <div className="bg-blue-800 h-6 flex items-center justify-center text-white font-bold" style={{ width: `34%` }}>55</div>
                       </div>
                     </div>
                     <div className="flex items-center text-xs">
                       <span className="w-24 text-gray-600 font-bold">Total</span>
                       <div className="flex-1 bg-blue-800 h-6 rounded-md flex items-center justify-center text-white font-bold">160</div>
                     </div>
                   </div>

                   <h3 className="text-sm font-bold text-gray-800 mb-4">Your Counts</h3>
                   <div className="space-y-2 mb-8">
                     <div className="flex items-center text-xs">
                       <span className="w-24 text-gray-600">Said/Asked</span>
                       <div className="flex-1 bg-gray-100 h-6 rounded-md overflow-hidden flex">
                         <div className="bg-red-600 h-6 flex items-center justify-center text-white font-bold" style={{ width: `${Math.min(100, (analysis.saidAskedCount / Math.max(1, analysis.saidAskedCount + analysis.otherTagsCount)) * 100)}%` }}>{analysis.saidAskedCount}</div>
                       </div>
                     </div>
                     <div className="flex items-center text-xs">
                       <span className="w-24 text-gray-600">Others</span>
                       <div className="flex-1 bg-gray-100 h-6 rounded-md overflow-hidden flex">
                         <div className="bg-red-600 h-6 flex items-center justify-center text-white font-bold" style={{ width: `${Math.min(100, (analysis.otherTagsCount / Math.max(1, analysis.saidAskedCount + analysis.otherTagsCount)) * 100)}%` }}>{analysis.otherTagsCount}</div>
                       </div>
                     </div>
                     <div className="flex items-center text-xs">
                       <span className="w-24 text-gray-600 font-bold">Total</span>
                       <div className="flex-1 bg-gray-100 h-6 rounded-md overflow-hidden flex">
                          <div className="bg-red-600 h-6 flex items-center justify-center text-white font-bold" style={{ width: `${Math.min(100, (analysis.dialogueTags / 200) * 100)}%` }}>{analysis.dialogueTags}</div>
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="dtShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="dtShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-4">Dialogue Tags</div>
                   <div className="space-y-3 overflow-y-auto max-h-64 pr-2">
                     {analysis.dialogueTagsList.map((dt, idx) => (
                       <div key={idx} className="flex items-center justify-between text-xs">
                         <div className="flex items-center gap-3">
                           <input type="checkbox" className="rounded text-red-600 border-gray-300 focus:ring-red-500" />
                           <span 
                             className="text-red-600 cursor-pointer hover:underline"
                             onClick={() => scrollToText(` ${dt.tag} `)}
                           >
                             {dt.tag}
                           </span>
                         </div>
                         <span className="text-gray-900 font-bold">{dt.count}</span>
                       </div>
                     ))}
                     {analysis.dialogueTagsList.length === 0 && (
                       <div className="text-sm text-gray-400 italic">No dialogue tags found.</div>
                     )}
                   </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'Adverbs In Dialogue' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="text-center">
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGenre.name)}&background=random`} /></div> {selectedGenre.name} <EditIcon /></span>
                      <div className="bg-blue-800 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">20</div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div> Your Count</span>
                      <div className="bg-red-600 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">{analysis.adverbsInDialogue}</div>
                    </div>
                 </div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="advShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="advShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-4">Adverbs in Dialogue</div>
                   <div className="space-y-3 overflow-y-auto max-h-64 pr-2">
                     {analysis.adverbsInDialogueList.map((adv, idx) => (
                       <div key={idx} className="flex items-center justify-between text-xs">
                         <div className="flex items-center gap-3">
                           <input type="checkbox" className="rounded text-red-600 border-gray-300 focus:ring-red-500" />
                           <span 
                             className="text-red-600 cursor-pointer hover:underline"
                             onClick={() => scrollToText(adv.word)}
                           >
                             {adv.word}
                           </span>
                         </div>
                         <span className="text-gray-900 font-bold">{adv.count}</span>
                       </div>
                     ))}
                     {analysis.adverbsInDialogueList.length === 0 && (
                       <div className="text-sm text-gray-400 italic">No adverbs in dialogue found! Great job.</div>
                     )}
                   </div>
                 </div>
               </div>
             )}
             
             {activeSubTab === 'Showing vs Telling' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="text-center">
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGenre.name)}&background=random`} /></div> {selectedGenre.name} <EditIcon /></span>
                      <div className="bg-blue-800 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">365</div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div> Your Count</span>
                      <div className="bg-red-600 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">{analysis.telling}</div>
                    </div>
                 </div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="svShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="svShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-4">Showing vs Telling</div>
                   <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                     {analysis.tellingList.map((t, idx) => {
                       let status = 'Good'; let label = 'Nice work'; let color = 'bg-blue-800 text-white';
                       if (t.count > 15) { status = 'Too many'; label = `Remove about ${t.count - 15}`; color = 'bg-red-600 text-white'; }
                       else if (t.count > 8) { status = 'Average'; label = 'Nice work'; color = 'bg-gray-200 text-gray-700'; }
                       else if (t.count < 3) { status = 'Great'; label = 'Well done'; color = 'bg-blue-600 text-white'; }
                       return (
                         <div key={idx} className="flex items-center justify-between text-xs">
                           <div className="flex items-center gap-3">
                             <input type="checkbox" className="rounded text-red-600 border-gray-300 focus:ring-red-500" />
                             <span 
                               className="text-gray-900 font-medium cursor-pointer hover:underline w-16"
                               onClick={() => scrollToText(t.word)}
                             >
                               {t.word}
                             </span>
                             <span className="text-gray-900 font-bold w-8">{t.count}</span>
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{status}</span>
                           </div>
                           <span className="text-gray-600">{label}</span>
                         </div>
                       );
                     })}
                     {analysis.tellingList.length === 0 && (
                       <div className="text-sm text-gray-400 italic">No showing vs telling indicators found!</div>
                     )}
                   </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'Passive Indicators' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="text-center">
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGenre.name)}&background=random`} /></div> {selectedGenre.name} <EditIcon /></span>
                      <div className="bg-blue-800 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">109</div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div> Your Count</span>
                      <div className="bg-red-600 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">{analysis.passive}</div>
                    </div>
                 </div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center gap-2 text-xs text-blue-700 font-bold mb-6 bg-blue-50 p-2 rounded">
                     <div className="w-3 h-3 bg-blue-600"></div> Passive Phrasing (Auxiliary Verb + Past Participle)
                   </div>
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="piShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="piShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-4">Passive Indicators</div>
                   <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                     {analysis.passiveList.map((pi, idx) => (
                       <div key={idx} className="flex items-center justify-between text-xs">
                         <div className="flex items-center gap-3">
                           <input type="checkbox" className="rounded text-red-600 border-gray-300 focus:ring-red-500" />
                           <span 
                             className="text-red-400 font-medium cursor-pointer hover:underline"
                             onClick={() => scrollToText(pi.word)}
                           >
                             {pi.word}
                           </span>
                         </div>
                         <span className="text-gray-900 font-bold">{pi.count}</span>
                       </div>
                     ))}
                     {analysis.passiveList.length === 0 && (
                       <div className="text-sm text-gray-400 italic">No passive indicators found!</div>
                     )}
                   </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'Tense Consistency' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="flex items-center gap-4 text-xs mb-6">
                   <div className="flex items-center gap-2 text-gray-600"><div className="w-3 h-3 bg-red-600"></div> Past Verbs</div>
                   <div className="flex items-center gap-2 text-gray-600"><div className="w-3 h-3 bg-yellow-500"></div> Present Verbs</div>
                 </div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="tcShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="tcShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-4">Tense Consistency</div>
                   <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
                     <div>
                       <div className="flex items-center justify-between text-xs font-bold text-gray-900 mb-2">
                         <span>Past Tense</span>
                         <span>{Math.round((analysis.pastTenseTotal / Math.max(1, analysis.pastTenseTotal + analysis.presentTenseTotal)) * 100)}% ({analysis.pastTenseTotal})</span>
                       </div>
                       <div className="space-y-2 pl-4">
                         {analysis.pastTenseList.map((pt, idx) => (
                           <div key={idx} className="flex items-center justify-between text-xs">
                             <div className="flex items-center gap-3">
                               <input type="checkbox" className="rounded text-red-600 border-gray-300 focus:ring-red-500" />
                               <span 
                                 className="text-gray-900 font-medium cursor-pointer hover:underline"
                                 onClick={() => scrollToText(pt.word)}
                               >
                                 {pt.word}
                               </span>
                             </div>
                             <span className="text-gray-900 font-bold">{pt.count}</span>
                           </div>
                         ))}
                       </div>
                     </div>
                     <div>
                       <div className="flex items-center justify-between text-xs font-bold text-gray-900 mb-2 mt-6">
                         <span>Present Tense</span>
                         <span>{Math.round((analysis.presentTenseTotal / Math.max(1, analysis.pastTenseTotal + analysis.presentTenseTotal)) * 100)}% ({analysis.presentTenseTotal})</span>
                       </div>
                       <div className="space-y-2 pl-4">
                         {analysis.presentTenseList.map((pt, idx) => (
                           <div key={idx} className="flex items-center justify-between text-xs">
                             <div className="flex items-center gap-3">
                               <input type="checkbox" className="rounded text-green-600 border-gray-300 focus:ring-green-500" />
                               <span 
                                 className="text-green-600 font-medium cursor-pointer hover:underline"
                                 onClick={() => scrollToText(pt.word)}
                               >
                                 {pt.word}
                               </span>
                             </div>
                             <span className="text-gray-900 font-bold">{pt.count}</span>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'Adverbs' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="text-center">
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src="https://ui-avatars.com/api/?name=Romance&background=random" /></div> Romance's Count <EditIcon /></span>
                      <div className="bg-blue-800 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">222</div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div> Your Count</span>
                      <div className="bg-red-600 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">{analysis.adverbs}</div>
                    </div>
                 </div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="advAllShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="advAllShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-4">Adverbs</div>
                   <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                     {analysis.adverbsList.map((adv, idx) => {
                       let status = 'Excess'; let label = `Remove about ${Math.max(1, adv.count - 2)}`; let color = 'bg-red-600 text-white';
                       if (adv.count < 3) { status = 'Too many'; label = 'Remove about 1'; color = 'bg-red-500 text-white'; }
                       return (
                         <div key={idx} className="flex items-center justify-between text-xs">
                           <div className="flex items-center gap-3">
                             <input type="checkbox" className="rounded text-red-600 border-gray-300 focus:ring-red-500" />
                             <span 
                               className="text-red-600 font-bold cursor-pointer hover:underline w-20 truncate"
                               onClick={() => scrollToText(adv.word)}
                             >
                               {adv.word}
                             </span>
                             <span className="text-gray-900 font-bold w-4">{adv.count}</span>
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{status}</span>
                           </div>
                           <span className="text-gray-900">{label}</span>
                         </div>
                       );
                     })}
                     {analysis.adverbsList.length === 0 && (
                       <div className="text-sm text-gray-400 italic">No adverbs found!</div>
                     )}
                   </div>
                 </div>
               </div>
             )}
             
             {activeSubTab === 'Cliches' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="text-center">
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGenre.name)}&background=random`} /></div> {selectedGenre.name} <EditIcon /></span>
                      <div className="bg-blue-800 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">19</div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div> Your Count</span>
                      <div className="bg-red-600 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">{analysis.cliches}</div>
                    </div>
                 </div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="cliShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="cliShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-4">Cliches</div>
                   <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                     {analysis.clichesList.map((cli, idx) => (
                       <div key={idx} className="flex items-center justify-between text-xs">
                         <div className="flex items-center gap-3 flex-1">
                           <input type="checkbox" className="rounded text-red-600 border-gray-300 focus:ring-red-500" />
                           <span 
                             className="text-red-400 font-medium cursor-pointer hover:underline flex-1"
                             onClick={() => scrollToText(cli.word)}
                           >
                             {cli.word}
                           </span>
                           <span className="text-gray-900 font-bold">{cli.count}</span>
                         </div>
                         <div className="w-16 ml-4">
                            <div className="bg-red-600 h-2 rounded-sm" style={{ width: `${Math.min(100, cli.count * 20)}%` }}></div>
                         </div>
                       </div>
                     ))}
                     {analysis.clichesList.length === 0 && (
                       <div className="text-sm text-gray-400 italic">No cliches found!</div>
                     )}
                   </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'Redundancies' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="text-center">
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGenre.name)}&background=random`} /></div> {selectedGenre.name} <EditIcon /></span>
                      <div className="bg-blue-800 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">4</div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div> Your Count</span>
                      <div className="bg-red-600 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">{analysis.redundancies}</div>
                    </div>
                 </div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="redShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="redShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-4">Redundancies</div>
                   <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                     {analysis.redundanciesList.map((red, idx) => (
                       <div key={idx} className="flex items-center justify-between text-xs">
                         <div className="flex items-center gap-3 flex-1">
                           <input type="checkbox" className="rounded text-red-600 border-gray-300 focus:ring-red-500" />
                           <span 
                             className="text-red-400 font-medium cursor-pointer hover:underline flex-1"
                             onClick={() => scrollToText(red.word)}
                           >
                             {red.word}
                           </span>
                           <span className="text-gray-900 font-bold">{red.count}</span>
                         </div>
                         <div className="w-16 ml-4">
                            <div className="bg-red-600 h-2 rounded-sm" style={{ width: `${Math.min(100, red.count * 20)}%` }}></div>
                         </div>
                       </div>
                     ))}
                     {analysis.redundanciesList.length === 0 && (
                       <div className="text-sm text-gray-400 italic">No redundancies found!</div>
                     )}
                   </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'Unnecessary Filler Words' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="text-center">
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGenre.name)}&background=random`} /></div> {selectedGenre.name} <EditIcon /></span>
                      <div className="bg-blue-800 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">378</div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div> Your Count</span>
                      <div className="bg-red-600 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">{analysis.overused}</div>
                    </div>
                 </div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="ufwShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="ufwShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-4">Unnecessary Filler Words</div>
                   <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                     {analysis.overusedList.map((fw, idx) => {
                       let status = 'Good'; let label = 'Nice work'; let color = 'bg-blue-800 text-white';
                       if (fw.count > 20) { status = 'Too many'; label = `Remove about ${fw.count - 10}`; color = 'bg-red-600 text-white'; }
                       else if (fw.count > 15) { status = 'Excess'; label = `Remove about ${fw.count - 15}`; color = 'bg-red-500 text-white'; }
                       else if (fw.count > 5) { status = 'Good'; label = 'Way to go!'; color = 'bg-blue-800 text-white'; }
                       else if (fw.count < 3) { status = 'Great'; label = 'Awesome'; color = 'bg-blue-600 text-white'; }
                       return (
                         <div key={idx} className="flex items-center justify-between text-xs">
                           <div className="flex items-center gap-3">
                             <input type="checkbox" className="rounded text-red-600 border-gray-300 focus:ring-red-500" />
                             <span 
                               className="text-gray-900 font-medium cursor-pointer hover:underline w-16"
                               onClick={() => scrollToText(fw.word)}
                             >
                               {fw.word}
                             </span>
                             <span className="text-gray-900 font-bold w-8">{fw.count}</span>
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{status}</span>
                           </div>
                           <span className="text-gray-600">{label}</span>
                         </div>
                       );
                     })}
                     {analysis.overusedList.length === 0 && (
                       <div className="text-sm text-gray-400 italic">No filler words found!</div>
                     )}
                   </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'Initial Pronoun and Names' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="text-center">
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGenre.name)}&background=random`} /></div> {selectedGenre.name} Initial Pronouns <EditIcon /></span>
                      <div className="bg-blue-800 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">40.2%</div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div> Your Percentage of Initial Pronouns</span>
                      <div className="bg-red-600 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">{analysis.initialPronounsPercentage}%</div>
                    </div>
                    <div className="text-sm font-bold text-gray-800 uppercase mt-4">{analysis.initialPronounsPercentage}% OF YOUR SENTENCES START WITH AN INITIAL PRONOUN</div>
                 </div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="ipShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="ipShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-4">Initial Pronouns</div>
                   <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                     {analysis.initialPronounsList.map((ip, idx) => (
                       <div key={idx} className="flex items-center justify-between text-xs">
                         <div className="flex items-center gap-3 flex-1">
                           <input type="checkbox" className="rounded text-red-600 border-gray-300 focus:ring-red-500" />
                           <span 
                             className="text-red-400 font-medium cursor-pointer hover:underline flex-1"
                             onClick={() => scrollToText(ip.word)}
                           >
                             {ip.word}
                           </span>
                           <span className="text-gray-900 font-bold">{ip.count}</span>
                         </div>
                         <div className="w-32 ml-4">
                            <div className="bg-red-600 h-2 rounded-sm" style={{ width: `${Math.min(100, (ip.count / Math.max(1, analysis.sentencesTotal)) * 500)}%` }}></div>
                         </div>
                       </div>
                     ))}
                   </div>
                   <div className="mt-8">
                     <div className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">Initial Names <Settings className="w-4 h-4 text-red-600 cursor-pointer" /></div>
                     <div className="text-sm text-gray-600">None of your sentences start with a character name.<br/><span className="text-red-600 cursor-pointer hover:underline">Click here</span> to add character names.</div>
                   </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'Sentence Starters' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="text-center">
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGenre.name)}&background=random`} /></div> {selectedGenre.name} <EditIcon /></span>
                      <div className="bg-blue-800 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">11.3%</div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div> Your Percentage</span>
                      <div className="bg-red-600 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">13.5%</div>
                    </div>
                    <div className="text-sm font-bold text-gray-800 uppercase mt-4">14% OF YOUR SENTENCES START WITH AN INITIAL CONJUNCTION</div>
                 </div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="ssShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="ssShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-4">Sentence Starters</div>
                   <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                     {analysis.sentenceStartersFullList.map((ss, idx) => (
                       <div key={idx} className="flex items-center justify-between text-xs">
                         <div className="flex items-center gap-3 flex-1">
                           <input type="checkbox" className="rounded text-red-600 border-gray-300 focus:ring-red-500" />
                           <span 
                             className="text-red-400 font-medium cursor-pointer hover:underline flex-1"
                             onClick={() => scrollToText(ss.word)}
                           >
                             {ss.word}
                           </span>
                           <span className="text-gray-900 font-bold">{ss.count}</span>
                         </div>
                         <div className="w-32 ml-4">
                            <div className="bg-red-600 h-2 rounded-sm" style={{ width: `${Math.min(100, (ss.count / Math.max(1, analysis.sentencesTotal)) * 500)}%` }}></div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'POV Consistency' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="povShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="povShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-6">POV Consistency</div>
                   <div className="space-y-8 overflow-y-auto max-h-[500px] pr-2">
                     
                     <div>
                       <div className="text-xs font-bold text-gray-900 mb-4">First Person Indicators {Math.round((analysis.firstPersonData.total / Math.max(1, analysis.firstPersonData.total + analysis.secondPersonData.total + analysis.thirdPersonData.total)) * 100)}% ({analysis.firstPersonData.total})</div>
                       <div className="space-y-3 pl-2">
                         {analysis.firstPersonData.list.map((item, idx) => (
                           <div key={idx} className="flex items-center justify-between text-xs">
                             <div className="flex items-center gap-3">
                               <input type="checkbox" className="rounded text-green-600 border-gray-300 focus:ring-green-500" />
                               <span className="text-green-500 font-medium cursor-pointer hover:underline w-16" onClick={() => scrollToText(item.word)}>{item.word}</span>
                             </div>
                             <span className="text-green-500 font-bold">{item.count}</span>
                           </div>
                         ))}
                       </div>
                     </div>

                     <div>
                       <div className="text-xs font-bold text-gray-900 mb-4">Second Person Indicators {Math.round((analysis.secondPersonData.total / Math.max(1, analysis.firstPersonData.total + analysis.secondPersonData.total + analysis.thirdPersonData.total)) * 100)}% ({analysis.secondPersonData.total})</div>
                       <div className="space-y-3 pl-2">
                         {analysis.secondPersonData.list.map((item, idx) => (
                           <div key={idx} className="flex items-center justify-between text-xs">
                             <div className="flex items-center gap-3">
                               <input type="checkbox" className="rounded text-yellow-600 border-gray-300 focus:ring-yellow-500" />
                               <span className="text-yellow-600 font-medium cursor-pointer hover:underline w-16" onClick={() => scrollToText(item.word)}>{item.word}</span>
                             </div>
                             <span className="text-yellow-600 font-bold">{item.count}</span>
                           </div>
                         ))}
                       </div>
                     </div>

                     <div>
                       <div className="text-xs font-bold text-gray-900 mb-4">Third Person Indicators {Math.round((analysis.thirdPersonData.total / Math.max(1, analysis.firstPersonData.total + analysis.secondPersonData.total + analysis.thirdPersonData.total)) * 100)}% ({analysis.thirdPersonData.total})</div>
                       <div className="space-y-3 pl-2">
                         {analysis.thirdPersonData.list.map((item, idx) => (
                           <div key={idx} className="flex items-center justify-between text-xs">
                             <div className="flex items-center gap-3">
                               <input type="checkbox" className="rounded text-purple-600 border-gray-300 focus:ring-purple-500" />
                               <span className="text-purple-600 font-medium cursor-pointer hover:underline w-16" onClick={() => scrollToText(item.word)}>{item.word}</span>
                             </div>
                             <span className="text-purple-600 font-bold">{item.count}</span>
                           </div>
                         ))}
                       </div>
                     </div>
                     
                   </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'Generic Descriptions' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="text-center">
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGenre.name)}&background=random`} /></div> {selectedGenre.name} <EditIcon /></span>
                      <div className="bg-blue-800 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">143</div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                      <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div> Your Count</span>
                      <div className="bg-red-600 text-white px-8 py-2 rounded-md flex-1 ml-4 text-left">{analysis.genericDescriptions}</div>
                    </div>
                 </div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gdShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gdShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-4">Generic Descriptions</div>
                   <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                     {analysis.genericDescriptionsList.map((gd, idx) => {
                       let status = 'Good'; let label = 'Nice work'; let color = 'bg-blue-800 text-white';
                       if (gd.count > 5) { status = 'Excess'; label = `Remove about ${gd.count - 3}`; color = 'bg-red-600 text-white'; }
                       else if (gd.count > 3) { status = 'Average'; label = 'Excellent'; color = 'bg-gray-200 text-gray-700'; }
                       else if (gd.count < 2) { status = 'Great'; label = 'Well done'; color = 'bg-blue-600 text-white'; }
                       return (
                         <div key={idx} className="flex items-center justify-between text-xs">
                           <div className="flex items-center gap-3">
                             <input type="checkbox" className="rounded text-red-600 border-gray-300 focus:ring-red-500" />
                             <span 
                               className="text-gray-900 font-medium cursor-pointer hover:underline w-16"
                               onClick={() => scrollToText(gd.word)}
                             >
                               {gd.word}
                             </span>
                             <span className="text-gray-900 font-bold w-8">{gd.count}</span>
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{status}</span>
                           </div>
                           <span className="text-gray-600">{label}</span>
                         </div>
                       );
                     })}
                     {analysis.genericDescriptionsList.length === 0 && (
                       <div className="text-sm text-gray-400 italic">No generic descriptions found!</div>
                     )}
                   </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'Personal Words and Phrases' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="border border-gray-200 rounded-md p-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGenre.name)}&background=random`} /></div>
                     <div>
                       <div className="text-xs text-gray-500 font-bold">Compare To:</div>
                       <div className="text-sm font-bold text-gray-900">Romance</div>
                     </div>
                   </div>
                   <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-600 transition">
                     <EditIcon />
                   </button>
                 </div>
                 
                 <div className="text-sm font-bold text-gray-800">Total: {analysis.personalWordsTotal}</div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="pwpShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="pwpShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                     Personal Words and Phrases
                     <Settings onClick={() => setIsAddingPersonalWord(!isAddingPersonalWord)} className="w-4 h-4 text-red-400 cursor-pointer" />
                   </div>
                   
                   {isAddingPersonalWord && (
                     <div className="flex items-center gap-2 mb-4">
                       <input 
                         type="text" 
                         value={newPersonalWord} 
                         onChange={e => setNewPersonalWord(e.target.value)} 
                         onKeyDown={e => e.key === 'Enter' && addPersonalWord()}
                         className="flex-1 text-sm border-gray-300 rounded focus:border-red-500 focus:ring-red-500" 
                         placeholder="Add a word to track or ignore..." 
                       />
                       <button onClick={addPersonalWord} className="bg-red-600 text-white px-3 py-1.5 rounded text-sm font-bold">Add</button>
                     </div>
                   )}
                   
                   <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                     {personalWords.map((pw, idx) => {
                       const count = analysis.personalWordsList.find(p => p.word === pw)?.count || 0;
                       return (
                         <div key={idx} className="flex items-center justify-between text-xs group">
                           <div className="flex items-center gap-3">
                             <input type="checkbox" className="rounded text-red-600 border-gray-300 focus:ring-red-500" />
                             <span 
                               className="text-red-600 font-medium cursor-pointer hover:underline"
                               onClick={() => scrollToText(pw)}
                             >
                               {pw}
                             </span>
                             <span className="text-gray-900 font-bold ml-2">{count}</span>
                           </div>
                           <button onClick={() => removePersonalWord(pw)} className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition">
                             <X className="w-4 h-4" />
                           </button>
                         </div>
                       );
                     })}
                     {personalWords.length === 0 && (
                       <div className="text-sm text-gray-400 italic">No personal words defined! Click the gear icon to add some.</div>
                     )}
                   </div>
                 </div>
               </div>
             )}

             {activeSubTab === 'Power Words' && analysis && (
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                 <div className="border border-gray-200 rounded-md p-6 grid grid-cols-2 gap-4">
                   {Object.entries({
                     Anger: { color: 'bg-gray-400' },
                     Energetic: { color: 'bg-teal-500' },
                     Forbidden: { color: 'bg-purple-800' },
                     Greed: { color: 'bg-green-500' },
                     Safety: { color: 'bg-blue-300' },
                     Encourage: { color: 'bg-purple-500' },
                     Fear: { color: 'bg-yellow-400' },
                     General: { color: 'bg-gray-500' },
                     Love: { color: 'bg-orange-400' },
                   }).map(([cat, config]) => {
                     const catTotal = analysis.powerCategoriesCount[cat] || 0;
                     const percentage = Math.round((catTotal / Math.max(1, analysis.totalPowerWords)) * 100);
                     return (
                       <div key={cat} className="flex items-center gap-2 text-xs">
                         <input type="checkbox" className="rounded border-gray-300 focus:ring-0 text-gray-300" />
                         <div className={`w-3 h-3 rounded-sm ${config.color}`}></div>
                         <span className="text-gray-900 font-bold w-20">{cat}</span>
                         <span className="text-gray-600">{percentage}% ({catTotal})</span>
                       </div>
                     );
                   })}
                 </div>
                 
                 <div className="border-t pt-4">
                   <div className="flex items-center justify-between mb-4">
                      <button className="border border-red-600 text-red-600 rounded-full px-4 py-1 text-xs font-bold hover:bg-red-50">Re-Run Report</button>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 mb-4">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="pwShow" className="text-red-600" /> Show all</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="pwShow" defaultChecked className="text-red-600" /> Show none</label>
                   </div>
                   <div className="text-sm font-bold text-gray-800 mb-4">Power Words</div>
                   <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                     {analysis.powerWordsList.map((pw, idx) => (
                       <div key={idx} className="flex items-center justify-between text-xs">
                         <div className="flex items-center gap-3">
                           <input type="checkbox" className="rounded text-gray-400 border-gray-300 focus:ring-gray-500" />
                           <span 
                             className="text-gray-900 font-medium cursor-pointer hover:underline w-24"
                             onClick={() => scrollToText(pw.word)}
                           >
                             {pw.word}
                           </span>
                           <span className="text-gray-900 font-bold w-8">{pw.count}</span>
                         </div>
                         <span className="text-gray-900 font-bold flex-1 text-left ml-4">{pw.category}</span>
                       </div>
                     ))}
                     {analysis.powerWordsList.length === 0 && (
                       <div className="text-sm text-gray-400 italic">No power words found!</div>
                     )}
                   </div>
                 </div>
               </div>
             )}

             {(!['Dialogue', 'Dialogue Tags', 'Adverbs In Dialogue', 'Adverbs', 'Passive Indicators', 'Tense Consistency', 'Showing vs Telling', 'Cliches', 'Redundancies', 'Unnecessary Filler Words', 'Initial Pronoun and Names', 'Sentence Starters', 'POV Consistency', 'Generic Descriptions', 'Personal Words and Phrases', 'Power Words', 'Sentence Variation', 'Pacing', 'Paragraph Variation', 'Chapter Variation', 'Repeated Words', 'Readability Statistics', 'Dale Chall Readability', 'Complex Words', 'What Happens Next?', 'Change The Mood', 'Fiction Analyzer', 'Fiction Story Builder', 'Book Details', 'Style / Theme', 'Query Letter'].includes(activeSubTab) && activeSubTab !== 'Combination Report' && activeSubTab !== 'Summary Report') && (
               <div className="text-sm text-gray-500 italic text-center mt-12">
                 Run the report to see {activeSubTab.toLowerCase()} metrics.
               </div>
             )}
          </div>
          )}
        </div>

        {/* Far right vertical toolbar */}
        <div className="w-12 bg-gray-50 border-l border-gray-200 flex flex-col items-center py-4 gap-6 shrink-0 z-20">
           <button title="Story Analyzer" className="text-gray-400 hover:text-red-600 transition"><Zap className="w-5 h-5" /></button>
           <button title="Alpha Read" className="text-gray-400 hover:text-red-600 transition"><MessageSquare className="w-5 h-5" /></button>
           <button title="Beta Read" className="text-gray-400 hover:text-red-600 transition"><Activity className="w-5 h-5" /></button>
           <button title="Market Fuel" className="text-gray-400 hover:text-red-600 transition"><BarChart2 className="w-5 h-5" /></button>
           <div className="w-6 h-px bg-gray-300"></div>
           <button title="Settings" className="text-gray-400 hover:text-red-600 transition"><Settings className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
  );
}
