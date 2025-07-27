'use client';

import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { usePendingSurveys } from '@/hooks/usePendingSurveys';

interface SurveyNotificationBadgeProps {
  className?: string;
}

export function SurveyNotificationBadge({ className = '' }: SurveyNotificationBadgeProps) {
  const { totalPendingSurveys } = usePendingSurveys();

  if (totalPendingSurveys === 0) {
    return null;
  }

  return (
    <div className={`relative inline-flex ${className}`}>
      <Badge 
        variant="destructive" 
        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold z-10"
      >
        {totalPendingSurveys > 99 ? '99+' : totalPendingSurveys}
      </Badge>
      <Bell className="w-4 h-4 text-orange-600" />
    </div>
  );
}