# Sistema de Encuestas de Desempeño Estudiantil

## Descripción General

Este sistema permite a los coordinadores crear encuestas de evaluación de desempeño estudiantil que las empresas deben completar para evaluar a los estudiantes con los que han trabajado.

## Características Principales

### Para Coordinadores

- **Crear Encuestas**: Crear nuevas encuestas con configuración de tiempo basada en contratación
- **Configurar Timing**: Definir cuántos días después de la contratación estará disponible la encuesta
- **Duración Configurable**: Establecer por cuántos días estará disponible cada encuesta
- **Gestionar Preguntas**: Agregar, editar y eliminar preguntas de las encuestas
- **Activar/Desactivar**: Controlar cuándo las encuestas están disponibles para las empresas
- **Ver Estadísticas**: Analizar las respuestas y generar reportes de desempeño
- **Monitorear Progreso**: Ver qué empresas han completado las evaluaciones

### Para Empresas

- **Encuestas Automáticas**: Las encuestas aparecen automáticamente después del período configurado post-contratación
- **Evaluar Estudiantes Contratados**: Solo evaluar estudiantes que fueron efectivamente contratados
- **Sistema de Calificación**: Escala de 0-5 (Muy Bien, Bien, Regular, Mal, Pésimo, No aplica)
- **Ventana de Tiempo**: Período limitado para completar cada encuesta
- **Comentarios Adicionales**: Opción de agregar comentarios detallados
- **Notificaciones**: Alertas sobre encuestas pendientes

## Estructura de la Base de Datos

### Tablas Principales

1. **Survey**: Información general de las encuestas
2. **SurveyQuestion**: Preguntas individuales de cada encuesta
3. **SurveyResponse**: Respuestas de las empresas por estudiante
4. **SurveyAnswer**: Calificaciones específicas por pregunta

### Relaciones

- Una encuesta puede tener múltiples preguntas
- Una empresa puede tener múltiples respuestas (una por estudiante)
- Cada respuesta contiene múltiples respuestas individuales (una por pregunta)

## Sistema de Calificación

| Valor | Etiqueta  | Descripción                       |
| ----- | --------- | --------------------------------- |
| 5     | Muy Bien  | Desempeño excelente               |
| 4     | Bien      | Buen desempeño                    |
| 3     | Regular   | Desempeño promedio                |
| 2     | Mal       | Desempeño deficiente              |
| 1     | Pésimo    | Desempeño muy deficiente          |
| 0     | No aplica | No aplicable para este estudiante |

## Rutas de la API

### Coordinador

- `GET /api/coordinador/surveys` - Obtener todas las encuestas
- `POST /api/coordinador/surveys` - Crear nueva encuesta
- `GET /api/coordinador/surveys/[id]` - Obtener encuesta específica
- `PUT /api/coordinador/surveys/[id]` - Actualizar encuesta
- `DELETE /api/coordinador/surveys/[id]` - Eliminar encuesta
- `POST /api/coordinador/surveys/[id]/questions` - Agregar pregunta
- `PUT /api/coordinador/surveys/[id]/questions` - Actualizar preguntas
- `DELETE /api/coordinador/surveys/[id]/questions/[questionId]` - Eliminar pregunta

### Empresa

- `GET /api/empresa/surveys?companyId={id}` - Obtener encuestas disponibles
- `POST /api/empresa/surveys/[id]/responses` - Enviar respuesta de encuesta
- `GET /api/empresa/surveys/[id]/responses?companyId={id}` - Obtener respuestas enviadas

## Páginas de la Aplicación

### Coordinador

- `/coordinador/encuestas` - Lista de encuestas
- `/coordinador/encuestas/nueva` - Crear nueva encuesta
- `/coordinador/encuestas/[id]` - Ver detalles y estadísticas
- `/coordinador/encuestas/[id]/editar` - Editar encuesta

### Empresa

- `/empresa/encuestas` - Dashboard de encuestas
- `/empresa/encuestas/[id]` - Completar encuesta específica

## Componentes Principales

### Hooks

- `useSurveys`: Hook para gestionar operaciones de encuestas

### Componentes

- `SurveyNotification`: Notificación flotante de encuestas pendientes

## Configuración y Despliegue

### 1. Actualizar Base de Datos

```bash
npx prisma db push
```

### 2. Generar Cliente Prisma

```bash
npx prisma generate
```

### 3. Verificar Migraciones

Revisar el archivo `prisma/migrations/add_survey_tables.sql` para referencia SQL.

## Sistema de Timing Basado en Contratación

### Configuración de Encuestas

- **Días después de contratación**: Define cuándo se activa la encuesta para cada estudiante contratado
- **Duración de encuesta**: Establece por cuántos días estará disponible la encuesta una vez activada

### Ejemplo de Funcionamiento

1. Estudiante es contratado el 1 de enero
2. Encuesta configurada para activarse 30 días después de contratación
3. Encuesta estará disponible del 31 de enero al 30 de febrero (si duración es 30 días)
4. Empresa puede completar la evaluación solo durante este período

### Ventajas

- **Timing Relevante**: Las evaluaciones se realizan cuando la experiencia está fresca
- **Automatización**: No requiere intervención manual para activar encuestas
- **Flexibilidad**: Diferentes encuestas pueden tener diferentes configuraciones de tiempo

## Flujo de Trabajo

1. **Coordinador crea encuesta** con configuración de timing y preguntas
2. **Estudiante es contratado** por una empresa (se registra fecha de contratación)
3. **Sistema calcula disponibilidad** basado en fecha de contratación + configuración
4. **Encuesta se activa automáticamente** en el período configurado
5. **Empresa recibe notificación** de encuesta pendiente
6. **Empresa completa evaluación** dentro del período disponible
7. **Coordinador revisa estadísticas** y genera reportes

## Consideraciones de Seguridad

- Validación de permisos por rol (coordinador/empresa)
- Prevención de respuestas duplicadas
- Validación de fechas de vigencia de encuestas
- Sanitización de datos de entrada

## Próximas Mejoras

- Exportación de reportes en PDF/Excel
- Notificaciones por email
- Dashboard analítico avanzado
- Plantillas de encuestas predefinidas
- Integración con sistema de prácticas profesionales
