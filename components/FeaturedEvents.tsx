'use client'

import { Button } from "@/components/ui/button";
import {
  Loader2,
  CalendarDays
} from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import Link from "next/link";
import FeaturedEventsCarousel from "@/components/FeaturedEventsCarousel";

export default function FeaturedEvents() {
  const { events, loading, error } = useEvents({
    limit: 10, // Increased limit to 10 events for carousel
    upcoming: true
  });

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Próximos Eventos</h2>
            <p className="text-xl text-muted-foreground">
              Descubre eventos, talleres y oportunidades de networking
            </p>
          </div>
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Cargando eventos...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Próximos Eventos</h2>
            <p className="text-xl text-muted-foreground">
              Descubre eventos, talleres y oportunidades de networking
            </p>
          </div>
          <div className="text-center py-16">
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Próximos Eventos</h2>
            <p className="text-xl text-muted-foreground">
              Descubre eventos, talleres y oportunidades de networking
            </p>
          </div>
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <h3 className="text-2xl font-semibold mb-4">No hay eventos próximos</h3>
              <p className="text-muted-foreground mb-8">
                Actualmente no hay eventos programados. Te invitamos a registrarte para recibir
                notificaciones cuando se publiquen nuevos eventos.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Próximos Eventos</h2>
          <p className="text-xl text-muted-foreground">
            Descubre eventos, talleres y oportunidades de networking
          </p>
        </div>
        
        <FeaturedEventsCarousel events={events} />

        <div className="text-center mt-12">
          <Link href="/eventos">
            <Button variant="outline" size="lg">
              Ver Más Eventos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}