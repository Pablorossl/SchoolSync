# 🚀 Quick Reference - Componentes y Hooks

Esta guía de referencia rápida te ayudará a usar todos los componentes y hooks implementados en SchoolSync.

---

## 📦 Contexts (Hooks)

### useAuth()
```jsx
import { useAuth } from '../context/AuthContext'

const { user, login, logout } = useAuth()

// user: { id, name, email, role }
// login(userData): void
// logout(): void
```

### useTheme()
```jsx
import { useTheme } from '../context/ThemeContext'

const { theme, toggleTheme } = useTheme()

// theme: 'light' | 'dark'
// toggleTheme(): void
```

### useToast()
```jsx
import { useToast } from '../context/ToastContext'

const toast = useToast()

toast.success('Operación exitosa')
toast.error('Error al guardar')
toast.warning('Revisa los datos')
toast.info('Información importante')
```

---

## 🎨 Componentes Reutilizables

### LoadingSpinner

**Props:**
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `message`: string (opcional)
- `fullScreen`: boolean (default: false)

**Uso:**
```jsx
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'

// Inline
<LoadingSpinner size="medium" message="Cargando datos..." />

// Pantalla completa
<LoadingSpinner size="large" message="Procesando..." fullScreen />
```

---

### Tooltip

**Props:**
- `content`: string (texto del tooltip)
- `position`: 'top' | 'bottom' | 'left' | 'right' (default: 'top')
- `children`: ReactNode (elemento que dispara el tooltip)

**Uso:**
```jsx
import Tooltip from '../components/Tooltip/Tooltip'

<Tooltip content="Haz clic para guardar" position="top">
  <button>💾 Guardar</button>
</Tooltip>
```

---

### ConfirmDialog

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `onConfirm`: () => void
- `title`: string (default: '¿Estás seguro?')
- `message`: string
- `confirmText`: string (default: 'Confirmar')
- `cancelText`: string (default: 'Cancelar')
- `type`: 'danger' | 'warning' | 'info' (default: 'danger')

**Uso:**
```jsx
import { useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog'

const [showConfirm, setShowConfirm] = useState(false)

const handleDelete = () => {
  // lógica de eliminación
}

<button onClick={() => setShowConfirm(true)}>Eliminar</button>

<ConfirmDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="¿Eliminar elemento?"
  message="Esta acción no se puede deshacer."
  confirmText="Sí, eliminar"
  cancelText="Cancelar"
  type="danger"
/>
```

---

### Onboarding

**Props:**
- `userRole`: 'teacher' | 'parent'

**Uso:**
```jsx
import Onboarding from '../components/Onboarding/Onboarding'

<Onboarding userRole={user?.role} />
```

**Nota:** Se muestra automáticamente solo la primera vez. Usa localStorage key `schoolsync_tutorial_completed`.

---

## 🎨 Variables CSS

### Uso en Componentes
```css
.mi-componente {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}
```

### Variables Disponibles
```css
/* Fondos */
--bg-primary: Fondo principal de tarjetas
--bg-secondary: Fondo secundario para contraste

/* Textos */
--text-primary: Color principal de texto
--text-secondary: Color secundario (hints, labels)

/* Otros */
--border-color: Bordes y líneas
--shadow: Sombras consistentes
```

---

## 🔧 Servicios API

### calendarService
```jsx
import * as calendarService from '../services/calendarService'

const events = await calendarService.getEvents()
const newEvent = await calendarService.createEvent(eventData)
await calendarService.updateEvent(id, eventData)
await calendarService.deleteEvent(id)
```

### messagingService
```jsx
import * as messagingService from '../services/messagingService'

const conversations = await messagingService.getConversations()
const messages = await messagingService.getMessages(conversationId)
await messagingService.sendMessage({ conversationId, content })
await messagingService.createConversation(data)
await messagingService.markAsRead(conversationId)
```

### authService
```jsx
import * as authService from '../services/authService'

const userData = await authService.login(email, password)
await authService.logout()
const currentUser = authService.getCurrentUser()
```

---

## 🎯 Patrones de Uso Comunes

### 1. Operación Asíncrona con Toast
```jsx
const handleSave = async () => {
  try {
    await saveData()
    toast.success('Datos guardados correctamente')
  } catch (error) {
    console.error(error)
    toast.error('Error al guardar')
  }
}
```

### 2. Operación con Loading State
```jsx
const [loading, setLoading] = useState(false)

const handleLoad = async () => {
  setLoading(true)
  try {
    const data = await fetchData()
    setData(data)
  } catch (error) {
    toast.error('Error al cargar')
  } finally {
    setLoading(false)
  }
}

if (loading) return <LoadingSpinner size="medium" message="Cargando..." />
```

### 3. Acción con Confirmación
```jsx
const [showConfirm, setShowConfirm] = useState(false)

const handleDelete = async () => {
  try {
    await deleteItem()
    toast.success('Eliminado correctamente')
  } catch (error) {
    toast.error('Error al eliminar')
  }
}

<button onClick={() => setShowConfirm(true)}>Eliminar</button>

<ConfirmDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="¿Eliminar?"
  message="Esta acción no se puede deshacer"
  type="danger"
/>
```

### 4. Botón con Tooltip
```jsx
<Tooltip content="Descripción de la acción" position="bottom">
  <button 
    onClick={handleAction}
    aria-label="Descripción para screen reader"
  >
    🔧 Acción
  </button>
</Tooltip>
```

---

## ♿ Accesibilidad - Checklist

Al crear nuevos componentes, asegúrate de:

- [ ] Añadir `aria-label` en botones sin texto
- [ ] Usar `aria-labelledby` y `aria-describedby` en modales
- [ ] Añadir `role="dialog"` + `aria-modal="true"` en modales
- [ ] Usar `role="status"` para loading states
- [ ] Añadir `aria-live="polite"` en actualizaciones dinámicas
- [ ] Usar `role="list"` y `role="listitem"` en listas personalizadas
- [ ] Añadir `aria-required="true"` en campos obligatorios
- [ ] Usar `aria-hidden="true"` en iconos decorativos
- [ ] Asegurar navegación por teclado (Tab, Enter, Escape)
- [ ] Proporcionar focus visible

---

## 🎨 Animaciones CSS - Snippets

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.elemento {
  animation: fadeIn 0.3s ease-out;
}
```

### Slide In
```css
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Scale In
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### Bounce
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

---

## 🔑 LocalStorage Keys

```javascript
// Tema
localStorage.getItem('schoolsync_theme') // 'light' | 'dark'

// Tutorial
localStorage.getItem('schoolsync_tutorial_completed') // 'true' | null

// Mensajería
localStorage.getItem('schoolsync_conversations') // JSON array
localStorage.getItem('schoolsync_messages') // JSON array

// Usuario (AuthContext)
localStorage.getItem('user') // JSON object
```

---

## 🧪 Testing Helpers

### Resetear Todo
```javascript
localStorage.clear()
location.reload()
```

### Cambiar Tema Manualmente
```javascript
document.documentElement.setAttribute('data-theme', 'dark')
```

### Ver Usuario Actual
```javascript
console.log(JSON.parse(localStorage.getItem('user')))
```

### Ver Conversaciones
```javascript
console.log(JSON.parse(localStorage.getItem('schoolsync_conversations')))
```

---

## 📝 Convenciones de Código

### Naming
- Componentes: PascalCase (`LoadingSpinner`)
- Funciones: camelCase (`handleClick`)
- CSS classes: kebab-case (`loading-spinner`)
- Contexts: PascalCase + Context (`ThemeContext`)
- Hooks: use + PascalCase (`useTheme`)

### Estructura de Archivos
```
Component/
├── Component.jsx
└── Component.css
```

### Imports Order
```jsx
// 1. React y hooks
import { useState, useEffect } from 'react'

// 2. Librerías externas
import { useNavigate } from 'react-router-dom'

// 3. Contexts
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

// 4. Componentes
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'

// 5. Servicios
import * as calendarService from '../services/calendarService'

// 6. Estilos
import './Component.css'
```

---

## 🚀 Comandos Útiles

### Desarrollo
```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
```

### Git
```bash
git status           # Ver cambios
git add .            # Añadir todos los cambios
git commit -m "msg"  # Commit con mensaje
git push             # Subir cambios
```

---

## 📚 Recursos Adicionales

- [Documentación completa de UX/UI](./UX_UI_IMPROVEMENTS.md)
- [Guía de testing manual](./TESTING_GUIDE.md)
- [README principal](../README.md)

---

**Última actualización:** Diciembre 2024
