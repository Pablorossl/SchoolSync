# Testing - SchoolSync

## Configuración

Este proyecto usa **Vitest** como framework de testing (compatible con Vite) y **jsdom** para simular el entorno del navegador.

### Dependencias instaladas
- `vitest` - Test runner moderno y rápido
- `jsdom` - Simulación de DOM y localStorage
- `@vitest/ui` - Interfaz web para visualizar tests

## Estructura de Tests

```
src/
  tests/
    setup.js                    # Configuración global (mock de localStorage)
    messagingService.test.js    # Tests del servicio de mensajería
```

## Comandos Disponibles

```bash
# Ejecutar tests una vez (CI mode)
npm test

# Ejecutar tests en modo watch (desarrollo)
npm test -- --watch

# Ejecutar tests con interfaz UI web
npm run test:ui

# Ejecutar solo tests específicos
npm test messagingService

# Ver coverage (requiere configuración adicional)
npm test -- --coverage
```

## Tests Implementados

### `messagingService.test.js`

#### ✅ `sendMessage`
- Crea mensaje correctamente en localStorage
- Actualiza `lastMessage` y `lastMessageDate` de la conversación
- Incrementa contador `unreadBy` para el otro participante
- Falla si no hay usuario autenticado

#### ✅ `markAsRead`
- Resetea contador `unreadBy[userId]` a 0
- Maneja conversaciones sin `unreadBy` previo

#### ✅ `createConversation`
- Normaliza IDs a strings (acepta number pero guarda string)

#### ✅ `getConversations`
- Filtra conversaciones por usuario actual
- Maneja IDs normalizados correctamente

## Mejores Prácticas

### Setup de Tests
- `beforeEach` limpia `localStorage` antes de cada test
- `messagingService.clearAllMessagingData()` resetea datos de prueba
- Mock de usuario en `localStorage.setItem('schoolsync_user', JSON.stringify(mockUser))`

### Estructura AAA (Arrange-Act-Assert)
```javascript
it('descripción del test', async () => {
  // Arrange: preparar datos y mocks
  const mockUser = { id: '1', name: 'Test', role: 'teacher' }
  localStorage.setItem('schoolsync_user', JSON.stringify(mockUser))

  // Act: ejecutar la función a testear
  const result = await messagingService.sendMessage({
    conversationId: 'test',
    content: 'Hello'
  })

  // Assert: verificar resultados
  expect(result.content).toBe('Hello')
  expect(result.senderId).toBe('1')
})
```

## Agregar Nuevos Tests

1. Crear archivo `*.test.js` en `src/tests/`
2. Importar Vitest helpers:
   ```javascript
   import { describe, it, expect, beforeEach } from 'vitest'
   ```
3. Escribir tests siguiendo patrón AAA
4. Ejecutar con `npm test`

## Coverage (opcional)

Para habilitar coverage:

```bash
# Instalar dependencia
npm install --save-dev @vitest/coverage-v8

# Ejecutar con coverage
npm test -- --coverage
```

Agrega en `vitest.config.js`:
```javascript
test: {
  coverage: {
    reporter: ['text', 'html', 'json'],
    exclude: ['node_modules/', 'src/tests/'],
  }
}
```

## Testing de Componentes React

Para añadir tests de componentes, instala:
```bash
npm install --save-dev @testing-library/react @testing-library/user-event
```

Ejemplo:
```javascript
import { render, screen } from '@testing-library/react'
import Messaging from '../components/Messaging/Messaging'

it('renders messaging component', () => {
  render(<Messaging userRole="teacher" userId="1" />)
  expect(screen.getByText(/Mensajería Escolar/i)).toBeInTheDocument()
})
```

## Recursos

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [jsdom](https://github.com/jsdom/jsdom)

---

**Última actualización**: Diciembre 30, 2025  
**Tests implementados**: 8  
**Coverage actual**: ~50% del servicio de mensajería
