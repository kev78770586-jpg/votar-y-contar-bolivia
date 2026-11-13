# Votar y Contar – Jurados Electorales (Bolivia) 🇧🇴

Aplicación móvil moderna, intuitiva y segura diseñada para facilitar, agilizar y transparentar las actividades administrativas de los **Jurados Electorales de Mesa** durante los comicios en el Estado Plurinacional de Bolivia.

---

## 🏛️ Consideración Fundamental y Marco Legal
Esta aplicación funciona como una **herramienta de apoyo administrativo y control auxiliar interno** para los jurados de mesa. Conforme a la **Ley Nº 026 del Régimen Electoral de Bolivia**, la validez jurídica plena corresponde al Acta física original custodiada en el **Sobre de Seguridad "A"** con destino al Tribunal Electoral Departamental (TED) y Tribunal Supremo Electoral (TSE).

---

## 📱 Las 10 Pantallas Implementadas

1. **Inicio de Sesión del Jurado Electoral (`LoginScreen`):**
   - Acceso con Cédula de Identidad (CI), Departamento de expedición y Complemento.
   - Número de Mesa y PIN de seguridad de 4 dígitos.
   - Selección de rol acreditado (Presidente, Secretario, Vocal 1, Vocal 2, Vocal 3).
   - Escaneo simulado de Credencial oficial OEP con código QR.
   - Indicador de conectividad con **Modo Fuera de Línea (Offline-First)**.

2. **Panel Principal / Dashboard (`DashboardScreen`):**
   - Resumen del recinto, mesa, circunscripción y jurado en sesión.
   - Stepper interactivo de etapas de la jornada electoral (Apertura → Escrutinio → Cuadre → Firmas → Custodia).
   - Métricas en vivo: Total votos en ánfora vs padrón habilitado (% participación), estado del cuadre, firmas completadas y paquetes empacados.

3. **Información de la Mesa Electoral (`MesaInfoScreen`):**
   - Datos geoelectorales: Departamento (selector de los 9 departamentos), Provincia, Municipio, Asiento y Recinto.
   - Padrón electoral de habilitados y rango de series de papeletas recibidas en maleta.
   - Horarios oficiales de apertura (08:00) y cierre (16:00 / 16:15).
   - Nómina completa de jurados acreditados con teléfonos de contacto y estado de asistencia.

4. **Registro y Conteo Asistido de Votos (`VoteCountingScreen`):**
   - Lista táctil de organizaciones políticas y candidatos presidenciales/uninominales.
   - Botonera ergonómica grande: `+1`, `-1`, `+5`, con retroalimentación sonora/háptica (beep).
   - Modo dual:
     - **Modo Lista / Rápido**: visualización completa con porcentajes en vivo.
     - **Modo Cantado 🎤**: interfaz a pantalla completa diseñada para pulsar con un solo toque la tarjeta del partido conforme se extrae cada papeleta del ánfora.
   - Registro de votos especiales: **Blancos** y **Nulos**.

5. **Suma Automática de Resultados y Cuadre (`ResultsSummaryScreen`):**
   - Suma en tiempo real de Votos Válidos + Blancos + Nulos = Total en Ánfora.
   - Conciliación matemática de papeletas:
     $$\text{Papeletas Recibidas} = \text{Papeletas en Ánfora} + \text{Papeletas Sobrantes}$$
   - Diagnóstico automático: alerta inmediata si existe descuadre o discrepancia con el padrón.

6. **Generación Automática de Actas Electorales (`ActaGeneratorScreen`):**
   - Réplica fiel del formato oficial del **Acta de Escrutinio y Cómputo del OEP**.
   - Generación automática de resultados en **CIFRAS** y en **LITERALES** en mayúsculas (ej. `68` → `SESENTA Y OCHO`), requisito indispensable por normativa para evitar adulteraciones.
   - Código QR criptográfico y hash SHA-256 de autenticidad.
   - **Exportación directa en PDF oficial** descargable e imprimible (`generateActaPDF` con jsPDF).
   - Compartir resumen vía portapapeles o redes a los delegados políticos presentes.

7. **Revisión y Doble Validación de Datos (`ValidationScreen`):**
   - Checklist de verificación: límite de padrón, ausencia de números negativos y consistencia matemática.
   - Declaración jurada solemne con confirmación de los delegados.
   - Bloqueo y congelamiento del acta (Anti-tampering) para proteger los datos antes de pasar a firmas.
   - Historial de cambios y auditoría de modificaciones.

8. **Gestión de Firmas de Jurados (`SignaturesScreen`):**
   - Padrón de firmas de los 5 jurados de mesa (Presidente, Secretario, Vocales).
   - **Lienzo táctil interactivo (Canvas)** para estampar la firma manuscrita con el dedo o lápiz óptico.
   - Indicador de estado: Firmado (con fecha y hora) / Pendiente.
   - Verificación de Quórum Legal (mínimo 3 jurados conforme a la Ley 026).
   - Celebración interactiva al completar el 100% de firmas requeridas.

9. **Entrega y Custodia de Materiales Electorales (`DeliveryMaterialsScreen`):**
   - Checklist de paquetes y sobres de seguridad:
     - **Sobre A**: Acta original precintada para el Tribunal Electoral Departamental.
     - **Sobre B**: Papeletas sufragadas (válidas, blancas y nulas).
     - **Sobre C**: Papeletas sobrantes inutilizadas y lista índice con firmas y huellas.
     - **Ánfora**: Cartón plegado y vacío.
     - **Maleta Electoral**: Sellos de mesa, tampones, bolígrafos y útiles restantes.
   - Registro del Notario Electoral receptor (Nombre, CI, credencial TED).
   - Firma táctil digital del Notario Electoral en la pantalla del celular.
   - **Generación de Constancia Oficial de Entrega y Custodia en PDF**.

10. **Historial, Auditoría y Reportes (`HistoryReportsScreen`):**
    - Bitácora completa de eventos con marcas de tiempo (apertura, escrutinio, firmas, bloqueos).
    - Reportes estadísticos con gráficos de barras de participación y porcentajes.
    - Exportación de copias de seguridad en formato JSON seguro.
    - Importación y restauración de backups ante cualquier eventualidad con el dispositivo.
    - Botón de reinicio a datos de demostración.

---

## 🎨 Características de Diseño y Ergonomía

- **Colores Institucionales Sobrios:**
  - Verde OEP principal: `#0e5a3e`
  - Verde oscuro institucional: `#083324`
  - Dorado/Ocre electoral: `#d48b19` / `#c27803`
  - Rojo de contraste para nulos: `#b91c1c`
- **Simulador de Smartphone Realista (`MobileFrame`):**
  - Marco de teléfono móvil con Dynamic Island, barra de estado (reloj en tiempo real, 5G, batería), botones exteriores y barra home.
  - Alternador con 1 clic entre **Modo Smartphone** y **Pantalla Completa Responsive**.
- **Accesibilidad y Trabajo en Terreno:**
  - Botones táctiles extragrandes para facilitar el pulsado tras una jornada de más de 8 horas.
  - Clics auditivos configurables para evitar dobles toques accidentales.
  - Almacenamiento local persistente (`localStorage`) que preserva los datos incluso al recargar o cerrar la app.

---

## 🚀 Cómo Ejecutar la Aplicación

### Requisitos
- **Node.js**: v18 o superior
- **npm**: v9 o superior

### Instalación de dependencias
```bash
npm install
```

### Iniciar en modo desarrollo / prueba
```bash
npm run dev
```
La aplicación estará disponible en:
- Local: `http://localhost:3000/`
- En tu red local (para abrir desde tu celular conectado al mismo Wi-Fi): `http://TU_IP:3000/`

### Compilar para producción
```bash
npm run build
```

### Previsualizar la compilación final
```bash
npm run preview
```
