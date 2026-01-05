# TypeScript Migration Guide - SchoolSync

## ✅ TypeScript Ya Instalado

El proyecto ahora soporta TypeScript. Puedes usar archivos `.ts`, `.tsx` junto con `.js`, `.jsx` existentes.

---

## 📁 Archivos Migrados

### ✅ Configuración Base
- `tsconfig.json` - Configuración principal de TypeScript
- `tsconfig.node.json` - Configuración para Vite
- `vite.config.ts` - Config de Vite en TypeScript

### ✅ Constantes Migradas
- `src/constants/ui.ts` - Constantes de UI con tipos exportados
- `src/constants/mockData.ts` - Datos mock con interfaces

---

## 🚀 Cómo Migrar Archivos

### Paso 1: Renombrar el archivo
```bash
# Componente
mv src/components/MyComponent/MyComponent.jsx src/components/MyComponent/MyComponent.tsx

# Servicio
mv src/services/myService.js src/services/myService.ts
```

### Paso 2: Agregar tipos

#### Ejemplo - Componente React:

**Antes (JS)**:
```jsx
const MyComponent = ({ name, age, onSave }) => {
  return <div>{name}</div>
}
```

**Después (TS)**:
```tsx
interface MyComponentProps {
  name: string
  age: number
  onSave: (data: any) => void
}

const MyComponent: React.FC<MyComponentProps> = ({ name, age, onSave }) => {
  return <div>{name}</div>
}
```

#### Ejemplo - Servicio:

**Antes (JS)**:
```javascript
export const fetchUser = async (id) => {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

**Después (TS)**:
```typescript
interface User {
  id: string
  name: string
  email: string
}

export const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

---

## 📘 Tipos Disponibles

Ya hay tipos exportados que puedes usar:

```typescript
import type { UserRole, EventType, StorageKey } from '@constants/ui'
import type { MockUser } from '@constants/mockData'

// Ejemplos de uso:
const role: UserRole = 'teacher'  // ✅ OK
const role2: UserRole = 'admin'   // ❌ Error: no es 'teacher' | 'parent'

const user: MockUser = {
  id: '1',
  email: 'test@test.com',
  role: 'teacher',
  name: 'Test User'
}
```

---

## 🎯 Orden Recomendado de Migración

### Prioridad Alta (empezar aquí):
1. ✅ `src/constants/` - **Ya migrado**
2. `src/utils/helpers.js` → `helpers.ts`
3. `src/utils/logger.js` → `logger.ts`

### Prioridad Media:
4. `src/services/apiClient.js` → `apiClient.ts`
5. `src/services/authService.js` → `authService.ts`
6. `src/services/calendarService.js` → `calendarService.ts`
7. `src/services/messagingService.js` → `messagingService.ts`

### Prioridad Baja (después):
8. Contexts: `src/context/*.jsx` → `*.tsx`
9. Componentes simples primero
10. Componentes complejos al final

---

## 🛠️ Path Aliases Configurados

Puedes usar imports más limpios:

```typescript
// ❌ Antes
import { USER_ROLES } from '../../constants/ui'
import Header from '../../components/Header/Header'

// ✅ Ahora
import { USER_ROLES } from '@constants/ui'
import Header from '@components/Header/Header'
```

**Aliases disponibles**:
- `@/*` → `./src/*`
- `@components/*` → `./src/components/*`
- `@services/*` → `./src/services/*`
- `@utils/*` → `./src/utils/*`
- `@constants/*` → `./src/constants/*`
- `@context/*` → `./src/context/*`

---

## ⚡ Comandos Útiles

```bash
# Verificar errores TypeScript sin compilar
npx tsc --noEmit

# Ver qué archivos TypeScript detecta
npx tsc --listFiles | grep "src/"

# Ejecutar el proyecto (funciona igual)
npm run dev

# Tests (funciona igual)
npm test
```

---

## 💡 Tips

### 1. Migración gradual
No tienes que migrar todo de una vez. JS y TS conviven perfectamente.

### 2. Empezar con `any` está OK
Si no estás seguro del tipo, usa `any` temporalmente:
```typescript
const data: any = complexFunction()
```
Luego vuelve y mejora los tipos.

### 3. Usar `unknown` en lugar de `any` cuando sea posible
```typescript
const data: unknown = await fetchData()
if (typeof data === 'object' && data !== null) {
  // Ahora puedes usar data
}
```

### 4. Interfaces vs Types
```typescript
// Usa interface para objetos (puede extenderse)
interface User {
  id: string
  name: string
}

// Usa type para uniones y primitivos
type Status = 'loading' | 'success' | 'error'
```

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module '@constants/ui'"
```bash
# Reinicia el servidor de Vite
# Ctrl+C y luego:
npm run dev
```

### Error: "Property 'X' does not exist on type 'Y'"
Probablemente necesitas definir una interface:
```typescript
interface Props {
  X: string  // Agrega la propiedad faltante
}
```

### Imports de archivos JS en archivos TS
Funciona sin problemas gracias a `"allowJs": true` en tsconfig.

---

## 📚 Recursos

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Vite + TypeScript](https://vitejs.dev/guide/features.html#typescript)

---

**Estado actual**: ✅ TypeScript instalado y configurado
**Archivos migrados**: 4/~50 archivos
**Siguiente paso**: Migrar `utils/` o empezar con nuevos archivos en TS
