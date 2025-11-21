# Button Locations - External Vacantes Feature

## Where to Find "Crear Vacante Externa" Buttons

### 1. Coordinator Dashboard (Main Page) ⭐ RECOMMENDED

**Location:** Header section, top-right area

**Path:** `/coordinador`

**Visual Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Inicio Coordinador                    [Crear Vacante Externa]  │
│  Supervisión y gestión...              [Enviar Correo Masivo]   │
└─────────────────────────────────────────────────────────────────┘
```

**Button Details:**

- **Style:** Primary button (blue background)
- **Icon:** Briefcase icon
- **Text:** "Crear Vacante Externa"
- **Position:** Next to "Enviar Correo Masivo" button

**Why Use This:**

- ✅ Fastest access from main dashboard
- ✅ Always visible when coordinator logs in
- ✅ No need to navigate to other pages

---

### 2. Vacantes Publicadas Page

**Location:** Header section, top-right area

**Path:** `/coordinador/vacantes-publicadas`

**Visual Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  [← Volver]                                                      │
│  📋 Vacantes Publicadas                [Crear Vacante Externa]  │
│  Lista completa de vacantes...                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Button Details:**

- **Style:** Primary button (blue background)
- **Icon:** Briefcase icon
- **Text:** "Crear Vacante Externa"
- **Position:** Right side of header, above stats cards

**Why Use This:**

- ✅ Contextual - you're already viewing vacantes
- ✅ Easy to create and immediately see in list
- ✅ Good for batch creation workflow

---

## Navigation Flow

### Quick Access Flow (Recommended)

```
Login as Coordinator
    ↓
Coordinator Dashboard
    ↓
Click "Crear Vacante Externa" (header)
    ↓
Fill Form & Submit
    ↓
Redirected to Vacantes Publicadas
```

### Traditional Flow

```
Login as Coordinator
    ↓
Coordinator Dashboard
    ↓
Click "Vacantes Publicadas" (stats card or menu)
    ↓
Click "Crear Vacante Externa" (header)
    ↓
Fill Form & Submit
    ↓
Stay on Vacantes Publicadas
```

---

## Button Appearance

### Desktop View

```
┌──────────────────────────────────────┐
│  💼 Crear Vacante Externa            │
└──────────────────────────────────────┘
```

- Full text visible
- Icon + text
- Standard button height

### Mobile View

```
┌──────────────────────────────────────┐
│  💼 Crear Vacante Externa            │
└──────────────────────────────────────┘
```

- Full width on small screens
- Stacks vertically with other buttons
- Touch-friendly size

---

## Related Navigation

### From Dashboard Stats Cards

Click on any of these cards to navigate:

- **"Vacantes Publicadas"** card → Goes to vacantes list (has create button)
- **"Estudiantes Activos"** card → Goes to students list
- **"Empresas Validadas"** card → Goes to companies list
- **"Colocaciones Exitosas"** card → Goes to placements list

### From Sidebar Menu (if available)

- Vacantes Publicadas → Has create button
- Dashboard → Has create button

---

## Visual Hierarchy

### Dashboard Header Buttons Priority

1. **"Crear Vacante Externa"** - Primary action (blue)
2. **"Enviar Correo Masivo"** - Secondary action (outline)

This hierarchy indicates that creating external vacantes is a primary coordinator action.

---

## Accessibility

### Keyboard Navigation

- Tab to focus on button
- Enter or Space to activate
- Follows standard button accessibility

### Screen Readers

- Button announces as: "Crear Vacante Externa, button"
- Icon is decorative (aria-hidden)

---

## Tips for Coordinators

### When to Use Dashboard Button

- ✅ Quick one-off vacante creation
- ✅ Just logged in and need to create vacante
- ✅ Creating vacante from email/phone request

### When to Use Vacantes List Button

- ✅ Creating multiple vacantes in sequence
- ✅ Want to verify vacante appears in list immediately
- ✅ Comparing with existing vacantes while creating

### Pro Tip

Bookmark the creation page directly:
`/coordinador/vacantes-publicadas/crear-externa`

---

## Troubleshooting

### "I don't see the button"

1. Verify you're logged in as coordinator
2. Check you're on the correct page (dashboard or vacantes list)
3. Try refreshing the page
4. Check browser console for errors

### "Button is grayed out"

- This shouldn't happen - button is always enabled for coordinators
- If it is, check your session/authentication

### "Button doesn't do anything"

1. Check browser console for JavaScript errors
2. Verify you have internet connection
3. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## Screenshots Reference

### Dashboard Button Location

```
┌────────────────────────────────────────────────────────────────────┐
│  UPQROO Logo                                    [User Menu ▼]      │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Inicio Coordinador                    [💼 Crear Vacante Externa] │
│  Supervisión y gestión de la          [✉️ Enviar Correo Masivo]   │
│  bolsa de trabajo universitaria                                    │
│                                                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐ │
│  │ Estudiantes  │ │  Empresas    │ │  Vacantes    │ │Colocacio-│ │
│  │   Activos    │ │  Validadas   │ │ Publicadas   │ │   nes    │ │
│  │     150      │ │      45      │ │      89      │ │    32    │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────┘ │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Vacantes List Button Location

```
┌────────────────────────────────────────────────────────────────────┐
│  [← Volver]                                                        │
│                                                                     │
│  📋 Vacantes Publicadas                [💼 Crear Vacante Externa] │
│  Lista completa de vacantes en la plataforma (89 vacantes)        │
│                                                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐ │
│  │    Total     │ │   Activas    │ │Postulaciones │ │Contrata- │ │
│  │   Vacantes   │ │              │ │              │ │  ciones  │ │
│  │     89       │ │      67      │ │     234      │ │    32    │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────┘ │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## Summary

Two convenient locations to create external vacantes:

1. **Dashboard** - Quick access, always visible
2. **Vacantes List** - Contextual access, good for batch work

Both buttons lead to the same creation form and provide the same functionality.
