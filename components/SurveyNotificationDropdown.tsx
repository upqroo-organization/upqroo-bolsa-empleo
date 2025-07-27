'use client';

import { Bell, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePendingSurveys } from '@/hooks/usePendingSurveys';
import Link from 'next/link';

export function SurveyNotificationDropdown() {
  const { totalPendingSurveys, surveysWithPending, loading } = usePendingSurveys();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="w-5 h-5 text-gray-600" />
          {totalPendingSurveys > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold"
            >
              {totalPendingSurveys > 99 ? '99+' : totalPendingSurveys}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-600" />
          Notificaciones de Encuestas
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {loading ? (
          <DropdownMenuItem disabled>
            Cargando notificaciones...
          </DropdownMenuItem>
        ) : totalPendingSurveys === 0 ? (
          <DropdownMenuItem disabled>
            No hay encuestas pendientes
          </DropdownMenuItem>
        ) : (
          <>
            {surveysWithPending.map((survey) => (
              <DropdownMenuItem key={survey.id} asChild>
                <Link 
                  href={`/empresa/encuestas/${survey.id}`}
                  className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                >
                  <div className="font-medium text-sm">{survey.title}</div>
                  <div className="text-xs text-gray-500">
                    {survey.pendingCount} evaluación{survey.pendingCount !== 1 ? 'es' : ''} pendiente{survey.pendingCount !== 1 ? 's' : ''}
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/empresa/encuestas" className="w-full text-center font-medium">
                Ver todas las encuestas
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}