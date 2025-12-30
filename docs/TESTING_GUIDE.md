# 🧪 Guía de Testing Manual - SchoolSync

## Objetivo
Esta guía proporciona un conjunto estructurado de pruebas manuales para verificar todas las funcionalidades y mejoras de UX/UI implementadas en SchoolSync.

---

## 🚀 Preparación

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión local en `http://localhost:5173`
- Dos pestañas/ventanas del navegador (para probar roles diferentes)

### Resetear Estado (Opcional)
Para empezar desde cero, abre la consola del navegador y ejecuta:
```javascript
localStorage.clear()
location.reload()
```

---

## 1️⃣ Sistema de Autenticación

### Test 1.1: Login como Profesor
1. ✅ Abre la página de login
2. ✅ Haz clic en "Profesor" (botón demo)
3. ✅ Verifica que las credenciales se pre-llenan
4. ✅ Haz clic en "Iniciar Sesión"
5. ✅ Espera el toast de "¡Bienvenido, James Kennedy!"
6. ✅ Verifica redirección al Dashboard

**Resultado esperado:**
- Toast de bienvenida verde
- Dashboard con badge "👨‍🏫 Profesor"
- Botones de edición en calendario

### Test 1.2: Login como Padre
1. ✅ Cierra sesión
2. ✅ Haz clic en "Padre/Madre" (botón demo)
3. ✅ Inicia sesión
4. ✅ Verifica toast de bienvenida
5. ✅ Confirma vista de solo lectura en calendario

**Resultado esperado:**
- Toast de bienvenida verde
- Dashboard con badge "👨‍👩‍👧 Padre/Madre"
- Mensaje "Vista de solo lectura" en calendario

### Test 1.3: Logout con Confirmación
1. ✅ Haz clic en "Cerrar Sesión"
2. ✅ Verifica que aparece el diálogo de confirmación
3. ✅ Observa la animación bounce del icono ⚡
4. ✅ Haz clic en "Cancelar" - verifica que permaneces en la sesión
5. ✅ Haz clic nuevamente en "Cerrar Sesión"
6. ✅ Haz clic en "Sí, cerrar sesión"
7. ✅ Verifica toast informativo azul
8. ✅ Confirma redirección a login

---

## 2️⃣ Sistema de Temas

### Test 2.1: Cambio de Tema
1. ✅ Inicia sesión (cualquier rol)
2. ✅ Localiza el botón 🌙 en el header
3. ✅ Pasa el mouse sobre el botón - verifica tooltip
4. ✅ Haz clic en el botón
5. ✅ Observa la transición suave (0.3s)
6. ✅ Verifica que el botón cambia a ☀️
7. ✅ Verifica colores en:
   - Dashboard background
   - Tarjetas (info-card, calendar-section)
   - Textos (primary y secondary)
   - Bordes y sombras

### Test 2.2: Persistencia de Tema
1. ✅ Cambia al tema oscuro
2. ✅ Recarga la página (F5)
3. ✅ Verifica que permanece en tema oscuro

### Test 2.3: Tema en Todos los Componentes
Navega por la aplicación y verifica el tema en:
- ✅ Login (card, inputs)
- ✅ Dashboard (welcome-section, info-card)
- ✅ Calendario (legend, grid, headers)
- ✅ Modal de eventos (formulario, botones)
- ✅ Mensajería (conversaciones, mensajes)

---

## 3️⃣ Tutorial de Onboarding

### Test 3.1: Tutorial Primera Vez (Profesor)
1. ✅ Limpia localStorage
2. ✅ Inicia sesión como profesor
3. ✅ Verifica que aparece el overlay del tutorial
4. ✅ Lee el paso 1 - Verifica emoji 🎉
5. ✅ Haz clic en "Siguiente"
6. ✅ Verifica progreso (puntos en la parte inferior)
7. ✅ Completa los 4 pasos
8. ✅ Haz clic en "¡Empezar!"
9. ✅ Verifica que desaparece el tutorial

### Test 3.2: Tutorial Primera Vez (Padre)
1. ✅ Limpia localStorage
2. ✅ Inicia sesión como padre
3. ✅ Verifica que aparece tutorial con 3 pasos
4. ✅ Verifica emojis diferentes (🏠, 📅, 💬)
5. ✅ Completa el tutorial

### Test 3.3: Tutorial No se Repite
1. ✅ Completa tutorial
2. ✅ Cierra sesión e inicia de nuevo
3. ✅ Verifica que NO aparece el tutorial

### Test 3.4: Saltar Tutorial
1. ✅ Limpia localStorage
2. ✅ Inicia sesión
3. ✅ Haz clic en "Saltar tutorial"
4. ✅ Verifica que se cierra inmediatamente

---

## 4️⃣ Calendario y Eventos

### Test 4.1: Crear Evento (Profesor)
1. ✅ Inicia sesión como profesor
2. ✅ Haz clic en cualquier fecha del calendario
3. ✅ Verifica que abre el modal "Nuevo Evento"
4. ✅ Completa el formulario:
   - Título: "Examen de Matemáticas"
   - Tipo: Examen
   - Descripción: "Unidades 1-5"
5. ✅ Haz clic en "Crear"
6. ✅ Verifica toast verde "Evento creado correctamente"
7. ✅ Verifica que aparece en el calendario con color naranja

### Test 4.2: Editar Evento
1. ✅ Haz clic en el evento creado
2. ✅ Cambia el título a "Examen Final"
3. ✅ Haz clic en "Actualizar"
4. ✅ Verifica toast verde "Evento actualizado correctamente"
5. ✅ Verifica que el título cambió en el calendario

### Test 4.3: Eliminar Evento con Confirmación
1. ✅ Haz clic en un evento
2. ✅ Haz clic en el botón "Eliminar" (rojo)
3. ✅ Verifica que aparece diálogo de confirmación
4. ✅ Observa icono ⚠️ con animación bounce
5. ✅ Lee el mensaje "¿Estás seguro de que quieres eliminar...?"
6. ✅ Haz clic en "Cancelar" - verifica que permanece
7. ✅ Haz clic nuevamente en "Eliminar"
8. ✅ Haz clic en "Sí, eliminar"
9. ✅ Verifica toast verde "Evento eliminado correctamente"
10. ✅ Verifica que desaparece del calendario

### Test 4.4: Ver Evento (Padre - Solo Lectura)
1. ✅ Cierra sesión e inicia como padre
2. ✅ Haz clic en cualquier evento
3. ✅ Verifica modal en modo "Vista de solo lectura"
4. ✅ Verifica que NO hay botón "Eliminar"
5. ✅ Verifica que solo hay botón "Cerrar"

### Test 4.5: Loading del Calendario
1. ✅ Recarga la página
2. ✅ Observa el LoadingSpinner mientras carga
3. ✅ Verifica 4 anillos de colores girando
4. ✅ Lee el mensaje "Cargando calendario..."

---

## 5️⃣ Sistema de Mensajería

### Test 5.1: Nueva Conversación
1. ✅ Inicia sesión como profesor
2. ✅ Desplázate a la sección de Mensajería
3. ✅ Pasa mouse sobre "✉️ Nueva conversación" - verifica tooltip
4. ✅ Haz clic en el botón
5. ✅ Verifica que abre modal con formulario
6. ✅ Selecciona un destinatario
7. ✅ Escribe asunto: "Reunión trimestral"
8. ✅ Haz clic en "Crear conversación"
9. ✅ Verifica toast verde "Conversación creada correctamente"

### Test 5.2: Enviar Mensaje
1. ✅ Selecciona una conversación
2. ✅ Verifica que se abre el panel de mensajes
3. ✅ Escribe un mensaje en el input
4. ✅ Pasa mouse sobre botón ➤ - verifica tooltip "Enviar mensaje"
5. ✅ Haz clic en enviar
6. ✅ Observa emoji ⌛ mientras envía
7. ✅ Verifica toast verde "Mensaje enviado"
8. ✅ Verifica que el mensaje aparece en la conversación

### Test 5.3: Contador de No Leídos
1. ✅ Inicia segunda pestaña como padre
2. ✅ Observa badge rojo con número de mensajes no leídos
3. ✅ Haz clic en la conversación
4. ✅ Verifica que el badge desaparece

### Test 5.4: Vista Mobile
1. ✅ Abre DevTools (F12)
2. ✅ Activa vista responsive
3. ✅ Selecciona iPhone o dispositivo móvil
4. ✅ Verifica lista de conversaciones en pantalla completa
5. ✅ Haz clic en una conversación
6. ✅ Verifica que muestra panel de mensajes
7. ✅ Haz clic en "← Volver"
8. ✅ Verifica que vuelve a lista de conversaciones

### Test 5.5: Navegación por Teclado
1. ✅ Haz clic en lista de conversaciones
2. ✅ Presiona Tab hasta llegar a una conversación
3. ✅ Presiona Enter o Espacio
4. ✅ Verifica que se abre la conversación
5. ✅ Tab hasta el input de mensaje
6. ✅ Escribe y presiona Enter
7. ✅ Verifica que envía el mensaje

---

## 6️⃣ Tooltips Contextuales

### Test 6.1: Tooltips en Header
1. ✅ Pasa mouse sobre botón de tema 🌙/☀️
2. ✅ Espera 300ms - verifica tooltip aparece
3. ✅ Lee el texto "Cambiar a tema claro/oscuro"
4. ✅ Retira el mouse - verifica que desaparece

### Test 6.2: Tooltips en Mensajería
1. ✅ Pasa mouse sobre "Nueva conversación"
2. ✅ Verifica tooltip "Iniciar una nueva conversación"
3. ✅ Pasa mouse sobre botón enviar ➤
4. ✅ Verifica tooltip "Enviar mensaje"

### Test 6.3: Posiciones de Tooltip
Verifica que los tooltips se muestran en la posición correcta:
- ✅ `position="top"` - Aparece arriba del elemento
- ✅ `position="bottom"` - Aparece abajo (Header)
- ✅ `position="left"` - Aparece a la izquierda (botón enviar)
- ✅ `position="right"` - No implementado aún

---

## 7️⃣ Notificaciones Toast

### Test 7.1: Toast Success (Verde)
1. ✅ Crea un evento en el calendario
2. ✅ Verifica toast verde en esquina superior derecha
3. ✅ Observa icono ✓
4. ✅ Lee "Evento creado correctamente"
5. ✅ Espera 3 segundos - verifica auto-dismiss

### Test 7.2: Toast Error (Rojo)
1. ✅ Intenta login con credenciales incorrectas
2. ✅ Verifica toast rojo
3. ✅ Observa icono ✕
4. ✅ Lee mensaje de error

### Test 7.3: Toast Warning (Amarillo)
1. ✅ Intenta crear conversación sin completar campos
2. ✅ Verifica toast amarillo
3. ✅ Observa icono ⚠
4. ✅ Lee "Por favor completa todos los campos"

### Test 7.4: Toast Info (Azul)
1. ✅ Cierra sesión
2. ✅ Verifica toast azul
3. ✅ Observa icono ℹ
4. ✅ Lee "Sesión cerrada correctamente"

### Test 7.5: Múltiples Toasts
1. ✅ Realiza varias acciones rápidamente
2. ✅ Verifica que se apilan verticalmente
3. ✅ Observa que desaparecen en orden (FIFO)

---

## 8️⃣ Diálogos de Confirmación

### Test 8.1: Confirmación de Eliminación (Danger)
1. ✅ Intenta eliminar un evento
2. ✅ Verifica modal con fondo blur
3. ✅ Observa icono ⚠️ con animación bounce
4. ✅ Lee título "¿Eliminar evento?"
5. ✅ Verifica botones:
   - Gris "Cancelar" (izquierda)
   - Rojo "Sí, eliminar" (derecha)
6. ✅ Presiona Escape - verifica que se cierra
7. ✅ Haz clic fuera del modal - verifica que se cierra

### Test 8.2: Confirmación de Logout (Warning)
1. ✅ Intenta cerrar sesión
2. ✅ Verifica modal con icono ⚡
3. ✅ Observa color amarillo/naranja en botón confirmar
4. ✅ Presiona Tab - verifica enfoque en botón "Sí, cerrar sesión"

### Test 8.3: Animaciones del Diálogo
1. ✅ Abre cualquier confirmación
2. ✅ Observa:
   - Fade-in del overlay
   - Scale-in del modal (0.9 → 1)
   - Bounce del icono
3. ✅ Cierra el modal
4. ✅ Observa transición de salida

---

## 9️⃣ Animaciones y Transiciones

### Test 9.1: Animaciones Dashboard
1. ✅ Recarga la página del Dashboard
2. ✅ Observa animación slideInDown del welcome-section
3. ✅ Observa fadeInUp escalonado:
   - info-card (delay 0.2s)
   - calendar-section (delay 0.4s)
   - messaging-section (delay 0.6s)

### Test 9.2: Hover Effects
1. ✅ Pasa mouse sobre items de feature-list
2. ✅ Verifica translateX(5px)
3. ✅ Observa sombra sutil
4. ✅ Pasa mouse sobre botones
5. ✅ Verifica translateY(-2px) y sombra

### Test 9.3: Loading Spinner
1. ✅ Recarga calendario
2. ✅ Observa 4 anillos concéntricos
3. ✅ Verifica colores: azul, púrpura, rosa, naranja
4. ✅ Observa rotación suave (cubic-bezier)

---

## 🔟 Accesibilidad (ARIA)

### Test 10.1: Screen Reader (Opcional)
Si tienes screen reader disponible:
1. ✅ Activa NVDA/JAWS/VoiceOver
2. ✅ Navega por el Dashboard
3. ✅ Verifica que se leen:
   - Roles (dialog, listitem, status)
   - Labels descriptivos
   - Estado de elementos (sin leer, seleccionado)

### Test 10.2: Navegación por Teclado
1. ✅ No uses el mouse
2. ✅ Navega con Tab por toda la aplicación
3. ✅ Verifica que todos los elementos interactivos son accesibles
4. ✅ Presiona Enter/Espacio en botones
5. ✅ Usa flechas en selects

### Test 10.3: Focus Visible
1. ✅ Navega con Tab
2. ✅ Verifica outline visible en:
   - Botones
   - Inputs
   - Conversaciones
   - Eventos del calendario

---

## 1️⃣1️⃣ Responsive Design

### Test 11.1: Desktop (1920px)
1. ✅ Verifica layout en dos columnas
2. ✅ Conversaciones a la izquierda, mensajes a la derecha
3. ✅ Calendario en grid completo

### Test 11.2: Tablet (768px)
1. ✅ Activa vista tablet en DevTools
2. ✅ Verifica que elementos se ajustan
3. ✅ Feature-list en una sola columna
4. ✅ Mensajería sigue en dos paneles

### Test 11.3: Mobile (360px)
1. ✅ Activa vista mobile
2. ✅ Verifica mensajería en vista única
3. ✅ Botón "← Volver" visible
4. ✅ Modal de eventos usa 95% del ancho
5. ✅ Feature-list completamente vertical

---

## 1️⃣2️⃣ Persistencia de Datos

### Test 12.1: LocalStorage
1. ✅ Crea eventos y conversaciones
2. ✅ Recarga la página (F5)
3. ✅ Verifica que todos los datos persisten

### Test 12.2: Cambio de Usuario
1. ✅ Inicia sesión como profesor
2. ✅ Crea un evento
3. ✅ Cierra sesión
4. ✅ Inicia sesión como padre
5. ✅ Verifica que ve el evento creado

---

## 📊 Checklist de Verificación Final

### Funcionalidad
- [ ] Login y logout funcionan correctamente
- [ ] Roles diferenciados (profesor/padre)
- [ ] CRUD de eventos completo
- [ ] Mensajería bidireccional operativa
- [ ] Tutorial de onboarding se muestra solo una vez

### UX/UI
- [ ] Tema claro/oscuro funciona en todos los componentes
- [ ] Todas las transiciones son suaves (0.3s)
- [ ] Tooltips aparecen en elementos clave
- [ ] Toast notifications muestran feedback apropiado
- [ ] Diálogos de confirmación previenen acciones accidentales
- [ ] Animaciones de entrada mejoran la experiencia

### Accesibilidad
- [ ] Navegación completa por teclado
- [ ] ARIA labels en elementos interactivos
- [ ] Focus visible en todos los elementos
- [ ] Mensajes de estado para screen readers

### Performance
- [ ] Loading spinners en operaciones asíncronas
- [ ] Transiciones no causan lag
- [ ] Persistencia de datos correcta
- [ ] No hay errores en consola

---

## 🐛 Reporte de Bugs

Si encuentras algún bug durante las pruebas:

1. **Anota el bug:**
   - Descripción del problema
   - Pasos para reproducir
   - Comportamiento esperado vs. actual
   - Navegador y versión
   - Capturas de pantalla (si aplica)

2. **Revisa la consola:**
   - Abre DevTools (F12)
   - Ve a Console
   - Copia cualquier error en rojo

3. **Reporta:**
   - Crea un issue en el repositorio
   - O contacta al equipo de desarrollo

---

## ✅ Resultado Esperado

Al completar todos estos tests, deberías confirmar que:
- ✅ Todas las funcionalidades core funcionan
- ✅ El tema claro/oscuro es consistente
- ✅ Las notificaciones proveen feedback apropiado
- ✅ La aplicación es accesible y usable por teclado
- ✅ El diseño es responsive en todos los tamaños
- ✅ Las animaciones mejoran la UX sin causar distracciones

---

**Última actualización:** Diciembre 2024
**Versión testeada:** 1.0.0
