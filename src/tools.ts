import {BookOpen, Clapperboard, ClipboardList, FileText, Music, Palette, Presentation} from 'lucide-react';

export const TOOLS = [
  {key: 'lesson', label: 'Lesson Plans', Icon: BookOpen, color: '#5B5BF7', tint: '#ECECFE'},
  {key: 'papers', label: 'Question Papers', Icon: ClipboardList, color: '#F08A24', tint: '#FFF1E2'},
  {key: 'images', label: 'Images', Icon: Palette, color: '#E43F8F', tint: '#FDE8F2'},
  {key: 'slides', label: 'Presentations', Icon: Presentation, color: '#0EA5E9', tint: '#E0F4FD'},
  {key: 'videos', label: 'Videos', Icon: Clapperboard, color: '#F43F5E', tint: '#FEE7EA'},
  {key: 'pdfs', label: 'PDFs', Icon: FileText, color: '#0D9488', tint: '#DDF5F2'},
  {key: 'songs', label: 'Songs & Poems', Icon: Music, color: '#8B5CF6', tint: '#F0EAFE'},
] as const;

export type Tool = (typeof TOOLS)[number];
