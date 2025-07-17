// app/terms/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Términos y Condiciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                Bienvenido a nuestra aplicación. Al utilizar este sitio, aceptas
                cumplir con los siguientes términos y condiciones. Por favor,
                léelos cuidadosamente.
              </p>

              <h2 className="text-base font-semibold mt-4">1. Uso del sitio</h2>
              <p>
                Este sitio web está destinado únicamente para fines informativos.
                No puedes usarlo para ningún propósito ilegal o no autorizado.
              </p>

              <h2 className="text-base font-semibold mt-4">2. Propiedad intelectual</h2>
              <p>
                Todo el contenido, incluyendo textos, imágenes y logotipos, son
                propiedad de la empresa o de sus respectivos propietarios, y están
                protegidos por las leyes de derechos de autor.
              </p>

              <h2 className="text-base font-semibold mt-4">3. Responsabilidad</h2>
              <p>
                No nos hacemos responsables por ningún daño que pueda surgir del
                uso de este sitio o de la imposibilidad de acceder al mismo.
              </p>

              <h2 className="text-base font-semibold mt-4">4. Cambios en los términos</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier
                momento. Los cambios entrarán en vigor tan pronto como se publiquen
                en el sitio.
              </p>

              <p>
                Si tienes alguna pregunta sobre estos términos, por favor contáctanos.
              </p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </main>
  );
}
