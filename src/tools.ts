import {BookOpen, Clapperboard, ClipboardList, FileText, Music, Palette, Presentation} from 'lucide-react';

export const TOOLS = [
  {key: 'lesson', label: 'Lesson Plans', hint: 'Structured & classroom-ready', Icon: BookOpen, color: '#8B74F2'},
  {key: 'papers', label: 'Question Papers', hint: 'Any class, any chapter', Icon: ClipboardList, color: '#F5A524'},
  {key: 'images', label: 'Images', hint: 'Diagrams & visuals', Icon: Palette, color: '#EC4899'},
  {key: 'slides', label: 'Presentations', hint: 'Slides from a topic', Icon: Presentation, color: '#38BDF8'},
  {key: 'videos', label: 'Videos', hint: 'Explainers & stories', Icon: Clapperboard, color: '#F43F5E'},
  {key: 'pdfs', label: 'PDFs', hint: 'Print-ready notes', Icon: FileText, color: '#2DD4BF'},
  {key: 'songs', label: 'Songs & Poems', hint: 'Rhymes for the class', Icon: Music, color: '#A78BFA'},
] as const;

export type Tool = (typeof TOOLS)[number];
