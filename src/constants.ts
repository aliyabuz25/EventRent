import { LeadStatus } from './types';

export const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-blue-50 text-blue-600 border-blue-100',
  contacted: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  quoted: 'bg-purple-50 text-purple-600 border-purple-100',
  won: 'bg-green-50 text-green-600 border-green-100',
  lost: 'bg-red-50 text-red-600 border-red-100'
};

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Yeni',
  contacted: 'Əlaqə saxlanılıb',
  quoted: 'Qiymət təklifi verilib',
  won: 'Təsdiqlənib',
  lost: 'Ləğv edilib'
};
