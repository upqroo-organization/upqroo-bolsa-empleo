'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Mail, 
  FileText, 
  Calendar,
  Eye,
  EyeOff} from 'lucide-react';
import { toast } from 'sonner';

interface Application {
  id: string;
  status: string;
  appliedAt: string;
  cvViewed: boolean;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    cvUrl: string | null;
  };
}

interface ApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacanteId: string;
  vacanteTitle: string;
}

const statusOptions = [
  { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'interview', label: 'En entrevista', color: 'bg-blue-100 text-blue-800' },
  { value: 'rejected', label: 'Rechazado', color: 'bg-red-100 text-red-800' },
  { value: 'hired', label: 'Contratado', color: 'bg-green-100 text-green-800' },
];

export default function ApplicantsModal({ 
  isOpen, 
  onClose, 
  vacanteId, 
  vacanteTitle 
}: ApplicantsModalProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/empresa/vacantes/${vacanteId}/applications`);
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.data);
      } else {
        toast.error('Error al cargar postulantes');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Error al cargar postulantes');
    } finally {
      setLoading(false);
    }
  }, [vacanteId]);

  useEffect(() => {
    if (isOpen && vacanteId) {
      fetchApplications();
    }
  }, [fetchApplications, isOpen, vacanteId]);


  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/empresa/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { ...app, status: newStatus }
              : app
          )
        );
        toast.success(data.message);
      } else {
        toast.error('Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error al actualizar estado');
    }
  };

  const markCvAsViewed = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/empresa/applications/${applicationId}/mark-cv-viewed`, {
        method: 'PATCH',
      });

      const data = await response.json();
      
      if (data.success) {
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { ...app, cvViewed: true }
              : app
          )
        );
      }
    } catch (error) {
      console.error('Error marking CV as viewed:', error);
    }
  };

  const handleViewCV = async (application: Application) => {
    if (!application.user.cvUrl) {
      toast.error('Este postulante no ha subido su CV');
      return;
    }

    // Mark as viewed if not already viewed
    if (!application.cvViewed) {
      await markCvAsViewed(application.id);
    }

    // Open CV in new tab
    window.open("/api/" + application.user.cvUrl, '_blank');
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Postulantes - {vacanteTitle}</DialogTitle>
          <DialogDescription>
            Gestiona los postulantes para esta vacante
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay postulantes para esta vacante
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => {
              const statusBadge = getStatusBadge(application.status);
              
              return (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {application.user.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {application.user.name || 'Sin nombre'}
                          </CardTitle>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {application.user.email}
                          </div>
                        </div>
                      </div>
                      <Badge className={statusBadge.color}>
                        {statusBadge.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Aplicó el {new Date(application.appliedAt).toLocaleDateString('es-ES')}
                        </div>
                        
                        {application.user.cvUrl && (
                          <div className="flex items-center gap-1">
                            {application.cvViewed ? (
                              <Eye className="h-4 w-4 text-green-600" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            )}
                            <span className={application.cvViewed ? 'text-green-600' : ''}>
                              CV {application.cvViewed ? 'visto' : 'no visto'}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {application.user.cvUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewCV(application)}
                            className="flex items-center gap-1"
                          >
                            <FileText className="h-4 w-4" />
                            Ver CV
                          </Button>
                        )}
                        
                        <Select
                          value={application.status}
                          onValueChange={(value) => updateApplicationStatus(application.id, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}