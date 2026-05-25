# DOCUMENTACIÓN TÉCNICA
# ESSENZIA BARBER SHOP — SISTEMA DE GESTIÓN DE CITAS ONLINE

---

**Autor:** Gonzalo Barranco Martín  
**Ciclo Formativo:** Desarrollo de Aplicaciones Web (DAW) — 2.º Curso  
**Curso académico:** 2024 – 2025  
**Tutor:** —  
**Fecha de entrega:** Mayo 2025  

---

> *"De la libreta y el bolígrafo al calendario inteligente."*

---

## TABLA DE CONTENIDOS

1. [Introducción](#1-introducción)
2. [Metodología de Trabajo](#2-metodología-de-trabajo)
3. [Temporalización del Proyecto](#3-temporalización-del-proyecto)
4. [Recursos y Tecnologías Empleadas](#4-recursos-y-tecnologías-empleadas)
5. [Análisis y Diseño](#5-análisis-y-diseño)
6. [Desarrollo e Implementación](#6-desarrollo-e-implementación)
7. [Pruebas y Control de Calidad](#7-pruebas-y-control-de-calidad)
8. [Manual de Usuario](#8-manual-de-usuario)
9. [Conclusiones y Futuras Líneas de Mejora](#9-conclusiones-y-futuras-líneas-de-mejora)

---

# 1. INTRODUCCIÓN

## 1.1 Descripción del Proyecto

**Essenzia Barber Shop** es una aplicación web full-stack diseñada para digitalizar y modernizar la gestión de citas de una barbería profesional. El sistema permite a los clientes reservar sus citas de forma autónoma a través de internet, en cualquier momento y desde cualquier dispositivo, eliminando la dependencia de llamadas telefónicas o visitas presenciales para concertar una cita.

La aplicación se articula en dos grandes perfiles de usuario:

- **Cliente:** accede a una interfaz elegante y sencilla donde puede consultar el catálogo de servicios, seleccionar día y hora en un calendario interactivo, gestionar sus reservas y dejar reseñas valoradas sobre los servicios recibidos.
- **Administrador (barbero):** dispone de un panel de control exclusivo desde el que puede visualizar todas las citas confirmadas, consultar el historial de cada cliente, y gestionar su agenda bloqueando días completos (vacaciones, festivos) u horas concretas (descansos, compromisos).

El nombre **Essenzia** evoca elegancia, esencia y distinción, valores que se trasladan al diseño visual de la aplicación: una estética *premium* basada en tonos blancos, negros y granate, tipografía serif de alta gama y animaciones sutiles que transmiten profesionalidad.

## 1.2 Contexto y Motivación

La gestión de citas en pequeños negocios de servicios personales —barberías, peluquerías, centros de estética— se realiza mayoritariamente de forma manual: cuadernos de papel, llamadas telefónicas o, en el mejor de los casos, aplicaciones genéricas de mensajería como WhatsApp. Este modelo presenta múltiples inconvenientes:

| Problema manual | Consecuencia para el negocio |
|---|---|
| Llamadas fuera de horario | Clientes perdidos o insatisfechos |
| Errores de escritura en el cuaderno | Dobles reservas y conflictos |
| Sin historial organizado | Imposibilidad de fidelización basada en datos |
| Sin presencia online | Invisibilidad ante nuevos clientes potenciales |
| Cancelaciones no comunicadas | Huecos en la agenda que generan pérdidas |

Essenzia Barber Shop nació precisamente para resolver todos estos problemas con una solución tecnológica moderna, accesible y de coste operativo mínimo.

## 1.3 Objetivos Generales

El objetivo general del proyecto es **desarrollar una aplicación web completa** —con frontend, backend y base de datos— que sirva como sistema de gestión de citas para una barbería, ofreciendo a sus clientes una experiencia digital de calidad y al administrador las herramientas necesarias para operar su negocio de forma eficiente.

## 1.4 Objetivos Específicos

Los objetivos específicos del proyecto son los siguientes:

1. **Digitalizar la reserva de citas:** Implementar un calendario interactivo que permita al cliente seleccionar día y hora de forma visual e intuitiva, mostrando únicamente los huecos disponibles en tiempo real.

2. **Eliminar la doble reserva:** Desarrollar un algoritmo de detección de solapamientos que impida que dos clientes reserven el mismo bloque horario, teniendo en cuenta la duración de cada servicio.

3. **Dotar al negocio de presencia online:** Crear una página de inicio (*landing page*) atractiva que muestre los servicios ofertados, una galería de imágenes del local y las reseñas de clientes anteriores.

4. **Implementar autenticación segura:** Integrar un sistema de registro e inicio de sesión con roles diferenciados (cliente y administrador), garantizando que cada usuario acceda únicamente a las funcionalidades que le corresponden.

5. **Proveer herramientas de administración:** Diseñar un panel de administración completo que permita gestionar citas, consultar fichas de clientes y bloquear la agenda de forma granular (días completos u horas sueltas).

6. **Implementar un sistema de reseñas:** Permitir a los clientes valorar los servicios recibidos una vez completada la cita, fomentando la confianza de nuevos usuarios y la fidelización de los existentes.

7. **Garantizar la responsividad:** Asegurar que la aplicación funcione correctamente en dispositivos móviles, tabletas y ordenadores de escritorio, adaptando los layouts a cada tamaño de pantalla.

8. **Desplegar la aplicación en producción:** Publicar el backend en un servidor en la nube (Render.com) y conectarlo a una base de datos gestionada (Supabase), de modo que la aplicación sea accesible desde cualquier lugar del mundo.

## 1.5 Alcance del Proyecto

El proyecto cubre el ciclo completo de desarrollo de software:

- **Análisis** de requisitos funcionales y no funcionales.
- **Diseño** de la arquitectura del sistema, el modelo de datos y la interfaz de usuario.
- **Desarrollo** del frontend en React, el backend en Node.js/Express y la configuración de la base de datos en Supabase (PostgreSQL).
- **Pruebas** funcionales y de usabilidad.
- **Despliegue** en entorno de producción.
- **Documentación** técnica completa.

---

# 2. METODOLOGÍA DE TRABAJO

## 2.1 Metodología Ágil Adaptada (Scrum Individual)

Para el desarrollo de este proyecto se adoptó una **metodología ágil** inspirada en el framework **Scrum**, adaptada a las particularidades de un equipo unipersonal. Mientras que Scrum en su forma canónica está diseñado para equipos de entre tres y nueve personas con roles bien diferenciados (Product Owner, Scrum Master, equipo de desarrollo), en este contexto el alumno asumió simultáneamente todos los roles.

### ¿Por qué metodología ágil y no en cascada?

Una metodología en cascada (*waterfall*) implica completar íntegramente cada fase antes de pasar a la siguiente. En un proyecto de estas características —donde los requisitos evolucionan a medida que se prueba y se descubren nuevas necesidades— este enfoque resulta rígido e ineficiente. La metodología ágil, en cambio, permite:

- **Adaptarse al cambio:** si durante el desarrollo del frontend se descubre que el diseño de base de datos necesita un campo adicional, se puede incorporar sin descartar trabajo ya realizado.
- **Obtener valor tempranamente:** cada iteración produce una versión funcional, aunque incompleta, del producto.
- **Detectar errores antes:** probar funcionalidades parciales en ciclos cortos reduce el riesgo de errores acumulados.

### Sprints y duración

El proyecto se organizó en **sprints de aproximadamente dos semanas**, cada uno con objetivos claros y entregables definidos al inicio:

| Sprint | Duración | Objetivo principal |
|--------|----------|--------------------|
| Sprint 0 | 1 semana | Configuración del entorno, decisiones tecnológicas, estructura del proyecto |
| Sprint 1 | 2 semanas | Modelo de datos, autenticación (registro/login), rutas protegidas |
| Sprint 2 | 2 semanas | Página de inicio, catálogo de servicios, galería de imágenes |
| Sprint 3 | 3 semanas | Algoritmo del calendario, selección de horas, sistema de reservas |
| Sprint 4 | 2 semanas | Panel de administración (citas, clientes, bloqueos de agenda) |
| Sprint 5 | 1 semana | Sistema de reseñas, página "Mis Citas", lógica de cancelación |
| Sprint 6 | 1 semana | Pruebas, corrección de errores, despliegue en producción |
| Sprint 7 | 1 semana | Documentación técnica |

### Herramientas de gestión

Al trabajar en solitario, la gestión del backlog se realizó mediante listas de tareas y notas, priorizando en cada sprint las funcionalidades de mayor valor para el usuario.

## 2.2 Desarrollo Iterativo e Incremental

El desarrollo iterativo implica repetir ciclos de trabajo sobre el mismo componente hasta alcanzar el nivel de calidad deseado. El desarrollo incremental implica añadir funcionalidad nueva sobre una base estable en cada ciclo.

En la práctica, esto se tradujo en el siguiente flujo de trabajo para cada funcionalidad:

```
1. Definir el requisito (¿qué debe hacer esta funcionalidad?)
       ↓
2. Diseñar la solución (¿cómo lo implementaré?)
       ↓
3. Implementar una versión mínima (MVP de la funcionalidad)
       ↓
4. Probar manualmente en el navegador
       ↓
5. Corregir errores detectados
       ↓
6. Refinar la interfaz y la lógica
       ↓
7. Confirmar que no se han roto funcionalidades previas (regresión)
       ↓
8. Commit con mensaje descriptivo en Git
```

Por ejemplo, el **algoritmo del calendario** pasó por cuatro iteraciones sucesivas:

- **Iteración 1:** Mostrar una rejilla de días del mes actual.
- **Iteración 2:** Deshabilitar domingos y sábados, y días pasados.
- **Iteración 3:** Conectar con Supabase para deshabilitar días bloqueados por el administrador.
- **Iteración 4:** Añadir indicadores visuales (puntos rojos) sobre los días cerrados.

## 2.3 Control de Versiones con Git y GitHub

El control de versiones se gestionó íntegramente con **Git** como sistema local y **GitHub** como repositorio remoto. Esta combinación garantizó:

- **Historial completo** de todos los cambios realizados, con posibilidad de volver a cualquier versión anterior.
- **Copia de seguridad remota** del código en todo momento.
- **Descripción contextual** de cada cambio mediante mensajes de commit.

### Estrategia de commits

Los commits se realizaron con una frecuencia alta —al finalizar cada funcionalidad significativa o al terminar cada sesión de trabajo— siguiendo un patrón de mensajes descriptivo en español:

```
Ejemplos de mensajes de commit reales del proyecto:

  "Mejoras en la sección de reseñas"
  "Mejoras en el footer"
  "Corrección Nº4"
  "Corrección Nº3"
  "Corrección Nº2"
```

### Flujo de trabajo con ramas

Aunque el proyecto fue desarrollado principalmente sobre la rama `main` dada su naturaleza individual, se contempló la separación conceptual de funcionalidades en el historial de commits, permitiendo identificar claramente qué cambios corresponden a cada área del sistema.

### Repositorio GitHub

El repositorio alberga el código completo del proyecto, tanto el directorio `frontend/` (aplicación React) como el directorio `backend/` (API REST en Express). Los ficheros sensibles (claves API, URLs de base de datos) se excluyen mediante `.gitignore` y se gestionan como variables de entorno.

```
# Estructura del repositorio en GitHub
proyecto_gonzalo/
├── frontend/        ← Código fuente React + Vite
├── backend/         ← API REST Node.js + Express
└── .gitignore       ← Excluye node_modules, .env, dist/
```

---

# 3. TEMPORALIZACIÓN DEL PROYECTO

## 3.1 Fases del Proyecto

El proyecto se estructuró en seis grandes fases, cada una con sus propias actividades y entregables. Las fases no son estrictamente secuenciales —algunas se solapan parcialmente—, pero siguen un orden lógico de dependencias.

### Fase 1 — Análisis (Semanas 1-2)

**Objetivo:** Definir con precisión qué debe hacer el sistema antes de escribir una sola línea de código.

Actividades realizadas:
- Identificación de los tipos de usuario y sus necesidades (cliente, administrador).
- Definición de los requisitos funcionales (RF) y no funcionales (RNF).
- Análisis de aplicaciones similares (Treatwell, Booksy) para identificar patrones de UX.
- Decisiones tecnológicas: selección del stack (React, Node.js, Supabase).
- Bocetos iniciales en papel de las vistas principales.

**Entregables:** Lista de requisitos, bocetos de interfaz, decisiones tecnológicas documentadas.

### Fase 2 — Diseño (Semanas 2-3)

**Objetivo:** Definir la arquitectura del sistema, el modelo de datos y el sistema visual antes del desarrollo.

Actividades realizadas:
- Diseño del modelo Entidad-Relación de la base de datos (5 tablas).
- Definición de la paleta de colores, tipografías y estilo visual general.
- Diseño de la arquitectura: separación frontend / backend / base de datos.
- Definición de los endpoints de la API REST.
- Configuración inicial de Supabase: creación del proyecto, tablas y políticas RLS.

**Entregables:** Diagrama E-R, guía de estilos, especificación de la API.

### Fase 3 — Desarrollo Backend (Semanas 3-6)

**Objetivo:** Construir la API REST que sirve de intermediario entre el frontend y la base de datos.

Actividades realizadas:
- Configuración de Node.js, Express y las dependencias.
- Implementación del sistema de autenticación (registro, login) usando Supabase Auth.
- Desarrollo del middleware de validación de sesión (token JWT).
- Implementación de los endpoints de citas: creación, consulta, cancelación, actualización de estado.
- Implementación del algoritmo anti-solapamiento en el endpoint `/nueva-cita`.
- Implementación del endpoint de reseñas.
- Configuración del rate limiting y CORS.
- Despliegue inicial en Render.com.

**Entregables:** API REST funcional y desplegada.

### Fase 4 — Desarrollo Frontend (Semanas 5-11)

**Objetivo:** Construir la interfaz de usuario completa en React.

Actividades realizadas:
- Configuración del proyecto React con Vite, Tailwind CSS y React Router.
- Desarrollo de la página de inicio (galería, servicios, reseñas).
- Implementación de las páginas de registro e inicio de sesión.
- Desarrollo del Dashboard de reservas con el algoritmo de calendario.
- Implementación de la página "Mis Citas" con cancelación y reseñas.
- Desarrollo del Panel de Administración completo.
- Implementación del Navbar y Footer responsivos.
- Refinamiento visual: animaciones, transiciones, diseño premium.

**Entregables:** Aplicación frontend completa y conectada al backend.

### Fase 5 — Pruebas y Corrección de Errores (Semanas 10-12)

**Objetivo:** Detectar y corregir errores funcionales, de usabilidad y de rendimiento.

Actividades realizadas:
- Pruebas funcionales de todos los flujos de usuario.
- Pruebas de casos límite (reserva en el último hueco, cancelación en el último momento, etc.).
- Detección y corrección de bugs en el algoritmo de disponibilidad.
- Pruebas de responsividad en diferentes tamaños de pantalla.
- Revisión de la experiencia de usuario en cada pantalla.

**Entregables:** Aplicación estable y libre de los errores detectados.

### Fase 6 — Documentación (Semana 13)

**Objetivo:** Redactar la documentación técnica completa del proyecto.

Actividades realizadas:
- Redacción de la memoria técnica (este documento).
- Elaboración de diagramas (E-R, Gantt, arquitectura).
- Capturas de pantalla de todas las vistas.
- Revisión final del documento.

**Entregable:** Documento de memoria técnica completo.

## 3.2 Cronograma de Hitos — Diagrama de Gantt

El siguiente diagrama muestra la distribución temporal de las actividades principales a lo largo de las 13 semanas de desarrollo. Cada barra representa la duración aproximada de cada tarea; las fases solapadas reflejan el trabajo simultáneo que fue posible en algunos momentos.

```
DIAGRAMA DE GANTT — ESSENZIA BARBER SHOP
Semana:      1    2    3    4    5    6    7    8    9   10   11   12   13
             |    |    |    |    |    |    |    |    |    |    |    |    |
ANÁLISIS
  Requisitos [====]
  Bocetos UI      [==]
DISEÑO
  Modelo E-R      [====]
  Guía visual         [==]
  Config. Supabase    [====]
BACKEND
  Autenticación           [====]
  Endpoints citas              [======]
  Algoritmo solapamiento            [==]
  Reseñas + rate limit                  [==]
  Despliegue Render                        [=]
FRONTEND
  Config. Vite+Tailwind       [=]
  Página de inicio                [====]
  Login / Register                    [==]
  Dashboard (calendario)                  [======]
  Mis Citas                                    [==]
  Admin Panel                                       [====]
  Navbar / Footer                 [==================]
PRUEBAS
  Tests funcionales                                      [====]
  Corrección de bugs                                          [==]
DOCUMENTACIÓN
  Memoria técnica                                                  [==]
```

> **Recomendación:** Sustituir el diagrama ASCII anterior por un Gantt elaborado con **GanttProject**, **Lucidchart** o **Excel/Google Sheets**, exportado como imagen e insertado en este punto. Un Gantt visual con colores por fase ocupa una página completa y transmite una imagen muy profesional.

### Hitos principales del proyecto

| Hito | Descripción | Semana |
|------|-------------|--------|
| H1 | Repositorio GitHub creado, entorno configurado | 1 |
| H2 | Base de datos en Supabase operativa con datos de prueba | 3 |
| H3 | API REST con autenticación funcionando localmente | 5 |
| H4 | Backend desplegado en Render.com | 6 |
| H5 | Página de inicio completa y conectada al backend | 7 |
| H6 | Sistema de reservas (Dashboard) funcional | 9 |
| H7 | Panel de administración completo | 11 |
| H8 | Aplicación completa, estable y en producción | 12 |
| H9 | Documentación técnica entregada | 13 |

---

# 4. RECURSOS Y TECNOLOGÍAS EMPLEADAS

## 4.1 Arquitectura General del Sistema

La aplicación sigue una arquitectura de **tres capas** claramente diferenciadas, un patrón clásico en el desarrollo web moderno:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                              │
│              Navegador Web (Chrome, Firefox…)               │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              FRONTEND — React + Vite                  │  │
│  │  Home · Login · Register · Dashboard · Admin Panel    │  │
│  └───────────────────────┬───────────────────────────────┘  │
└──────────────────────────│──────────────────────────────────┘
                           │ HTTP/HTTPS (Axios)
                           │ REST API (JSON)
┌──────────────────────────▼──────────────────────────────────┐
│                       SERVIDOR                              │
│              Render.com (Node.js 20 LTS)                    │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            BACKEND — Express.js                       │  │
│  │  /auth · /citas · /reviews · middleware JWT           │  │
│  └───────────────────────┬───────────────────────────────┘  │
└──────────────────────────│──────────────────────────────────┘
                           │ Supabase JS SDK
                           │ HTTPS (PostgREST)
┌──────────────────────────▼──────────────────────────────────┐
│                      BASE DE DATOS                          │
│              Supabase (PostgreSQL gestionado)               │
│                                                             │
│  usuario · servicio · cita · review · bloqueo_agenda        │
└─────────────────────────────────────────────────────────────┘
```

Esta separación aporta varios beneficios:

- **Seguridad:** La clave secreta de Supabase nunca llega al navegador; reside exclusivamente en el servidor.
- **Mantenibilidad:** Cada capa puede modificarse o sustituirse de forma independiente.
- **Escalabilidad:** El frontend puede servirse desde una CDN global mientras el backend escala en Render.

## 4.2 Tecnologías del Frontend

### React 18.3.1

React es la **librería JavaScript más utilizada** para construir interfaces de usuario. Desarrollada por Meta (Facebook), su modelo de componentes permite dividir la interfaz en piezas reutilizables y auto-gestionadas.

**Características clave usadas en este proyecto:**

- **Componentes funcionales:** toda la interfaz está construida con funciones JavaScript que devuelven JSX.
- **Hooks:** `useState` para el estado local, `useEffect` para efectos secundarios (carga de datos), `useNavigate` y `useLocation` para la navegación programática.
- **JSX:** permite escribir marcado HTML dentro de JavaScript de forma legible.

```jsx
// Ejemplo de hook useEffect en Dashboard.jsx
// Cada vez que el usuario selecciona una fecha, se recalculan
// las horas disponibles automáticamente.
useEffect(() => {
  if (fechaSeleccionada) {
    cargarHorasOcupadas(fechaSeleccionada);
  }
}, [fechaSeleccionada]);
```

### Vite 6.x

Vite es el **empaquetador de última generación** que reemplaza a herramientas como Webpack o Create React App. Sus ventajas en este proyecto:

- **Servidor de desarrollo ultrarrápido:** aprovecha los módulos ES nativos del navegador, consiguiendo arranques en menos de 1 segundo.
- **Hot Module Replacement (HMR):** los cambios se reflejan instantáneamente en el navegador sin recargar la página.
- **Build optimizado:** genera un bundle de producción minificado en `dist/`.

### Tailwind CSS 4.x

Tailwind CSS es un **framework CSS de utilidades** que permite construir interfaces directamente en el JSX mediante clases predefinidas, sin escribir CSS personalizado para cada elemento.

**Paleta de colores personalizada para Essenzia:**

```javascript
// tailwind.config.js — tokens de diseño del proyecto
theme: {
  extend: {
    colors: {
      'fondo-claro':  '#F7F7FF',   // Lavanda muy claro — fondo general
      'texto-oscuro': '#070707',   // Negro puro — texto principal
      'barber-azul':  '#3F88C5',   // Azul acero — acentos informativos
      'barber-rojo':  '#BB0A21',   // Granate — color de marca principal
    }
  }
}
```

**Ventajas en este proyecto:**
- Diseño responsive mediante prefijos (`md:`, `lg:`) sin escribir media queries manualmente.
- Consistencia visual garantizada por el sistema de tokens.
- Clases de animación y transición integradas (`transition`, `hover:`, `duration-300`).

### React Router DOM 7.x

Biblioteca de enrutamiento que permite la **navegación entre páginas sin recargar el navegador** (Single Page Application). Características usadas:

- `<BrowserRouter>` como contenedor raíz de enrutamiento.
- `<Routes>` y `<Route>` para mapear URLs a componentes.
- `useNavigate()` para navegación programática tras acciones (reserva exitosa → redirigir a "Mis Citas").
- `useLocation()` para leer parámetros de estado entre páginas (mensaje de éxito tras registro).

### Otras librerías del Frontend

| Librería | Versión | Uso específico |
|----------|---------|----------------|
| Axios | 1.14.0 | Cliente HTTP con interceptor de token automático |
| Framer Motion | 10.18.0 | Animaciones de entrada en tarjetas y secciones |
| React Icons | 5.6.0 | Iconos SVG (estrellas, estados de cita) |
| Supabase JS | 2.99.3 | Cliente directo para autenticación desde el navegador |

## 4.3 Tecnologías del Backend

### Node.js 20 LTS

Node.js es el **entorno de ejecución de JavaScript en el servidor**, basado en el motor V8 de Chrome. Permite usar el mismo lenguaje tanto en frontend como en backend, reduciendo la curva de aprendizaje y facilitando el intercambio de lógica entre capas.

### Express.js 5.x

Express es el **framework web minimalista** para Node.js más utilizado. Proporciona sistema de enrutamiento HTTP, cadena de middlewares y manejo de errores centralizado.

```javascript
// backend/index.js — Estructura principal del servidor Express
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();

app.set('trust proxy', 1);  // Necesario detrás del proxy de Render.com
app.use(cors());
app.use(express.json());

// Rate limiting diferenciado por tipo de endpoint
const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 10 });
const citasLimiter = rateLimit({ windowMs: 15*60*1000, max: 100 });

app.use('/auth', authLimiter, require('./routes/auth'));
app.use('/citas', citasLimiter, require('./routes/citas'));

app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
```

### Dependencias del Backend

| Paquete | Versión | Función |
|---------|---------|---------|
| express | 5.2.1 | Framework HTTP principal |
| @supabase/supabase-js | 2.100.0 | SDK para conectar con Supabase desde Node |
| cors | — | Habilita peticiones cross-origin desde el frontend |
| express-rate-limit | 8.3.2 | Limita intentos de login (protección brute-force) |
| dotenv | — | Carga variables de entorno desde `.env` |

## 4.4 Backend-as-a-Service: Supabase

Supabase es una **plataforma de backend como servicio** de código abierto que ofrece, sobre PostgreSQL:

- **Autenticación:** sistema completo de registro, login, tokens JWT y gestión de sesiones.
- **Base de datos:** PostgreSQL con interfaz visual, editor SQL y API REST automática.
- **Row Level Security (RLS):** políticas de seguridad a nivel de fila que controlan qué datos puede leer o modificar cada usuario.
- **Supabase JS SDK:** librería oficial para interactuar desde JavaScript.

**Diferenciación clave — dos claves de acceso:**

| Clave | Dónde se usa | Nivel de acceso |
|-------|--------------|-----------------|
| `anon key` (pública) | Frontend (navegador) | Limitado por políticas RLS |
| `service_role key` (secreta) | Backend (servidor) | Acceso completo, sin restricciones RLS |

Esta distinción es fundamental para la seguridad: el frontend usa la clave pública para que el usuario se autentique, mientras que el backend usa la clave secreta para operaciones administrativas que requieren acceso sin restricciones.

## 4.5 Herramientas de Desarrollo

### Visual Studio Code

Editor de código principal. Extensiones utilizadas:

- **ESLint:** detección de errores de sintaxis y estilo en tiempo real.
- **Tailwind CSS IntelliSense:** autocompletado de clases de Tailwind.
- **GitLens:** visualización del historial de Git en el editor.
- **Thunder Client:** prueba de endpoints de la API sin salir del editor.

### DevTools del Navegador

La consola del navegador fue fundamental durante el desarrollo:

- **Network tab:** inspección de peticiones HTTP, cabeceras y respuestas.
- **Console tab:** depuración de errores de JavaScript.
- **Application tab:** inspección del `localStorage` para verificar el token de sesión.
- **Responsive Design Mode:** prueba de layouts en diferentes tamaños de pantalla.

### Render.com

Plataforma de despliegue en la nube para el backend Node.js:

- Plan gratuito suficiente para un proyecto académico.
- Despliegue automático desde GitHub (cada push redespliega el backend).
- Variables de entorno gestionadas de forma segura en el panel de control.
- URL pública: `https://proyecto-gonzalo-barranco.onrender.com`.

> **Nota:** El plan gratuito de Render hiberna el servicio tras 15 minutos de inactividad. La primera petición tras inactividad puede tardar 20-30 segundos mientras el servicio arranca de nuevo.

---

# 5. ANÁLISIS Y DISEÑO

## 5.1 Requisitos del Sistema

Antes de comenzar el desarrollo se definieron los requisitos funcionales y no funcionales del sistema. Esta lista sirvió como guía durante todo el proceso de implementación.

### Requisitos Funcionales (RF)

Los requisitos funcionales describen **qué debe hacer** el sistema:

| Código | Requisito | Prioridad |
|--------|-----------|-----------|
| RF-01 | El sistema debe permitir el registro de nuevos usuarios con nombre, teléfono, email y contraseña. | Alta |
| RF-02 | El sistema debe permitir el inicio de sesión con email y contraseña. | Alta |
| RF-03 | El sistema debe diferenciar dos roles de usuario: `cliente` y `admin`. | Alta |
| RF-04 | El cliente debe poder visualizar el catálogo de servicios con nombre, duración y precio. | Alta |
| RF-05 | El cliente debe poder seleccionar un servicio y acceder al calendario de reservas. | Alta |
| RF-06 | El calendario debe mostrar únicamente los días disponibles (sin fines de semana, sin días pasados, sin días bloqueados). | Alta |
| RF-07 | El sistema debe mostrar únicamente las horas disponibles para la fecha seleccionada, excluyendo las ya reservadas y los bloques horarios del administrador. | Alta |
| RF-08 | El sistema debe impedir la doble reserva del mismo bloque horario. | Alta |
| RF-09 | El cliente debe poder ver el historial de sus citas (confirmadas, completadas, canceladas). | Media |
| RF-10 | El cliente debe poder cancelar una cita confirmada. | Media |
| RF-11 | El cliente debe poder dejar una reseña (valoración 1-5 + comentario) para una cita completada. | Media |
| RF-12 | La página de inicio debe mostrar las últimas reseñas de clientes. | Baja |
| RF-13 | El administrador debe poder ver todas las citas confirmadas. | Alta |
| RF-14 | El administrador debe poder marcar una cita como completada. | Alta |
| RF-15 | El administrador debe poder consultar el historial de cada cliente registrado. | Media |
| RF-16 | El administrador debe poder bloquear días completos de la agenda. | Alta |
| RF-17 | El administrador debe poder bloquear horas concretas de un día. | Alta |

### Requisitos No Funcionales (RNF)

Los requisitos no funcionales describen **cómo debe comportarse** el sistema:

| Código | Requisito | Categoría |
|--------|-----------|-----------|
| RNF-01 | La interfaz debe ser completamente responsiva (móvil, tableta, escritorio). | Usabilidad |
| RNF-02 | El tiempo de respuesta de la API no debe superar los 3 segundos en condiciones normales. | Rendimiento |
| RNF-03 | Las contraseñas de usuarios deben almacenarse cifradas (gestionado por Supabase Auth). | Seguridad |
| RNF-04 | La clave secreta de Supabase nunca debe exponerse al navegador del cliente. | Seguridad |
| RNF-05 | Los endpoints de autenticación deben estar protegidos contra ataques de fuerza bruta (rate limiting). | Seguridad |
| RNF-06 | El código debe estar organizado de forma modular (separación frontend/backend/servicios). | Mantenibilidad |
| RNF-07 | El sistema debe funcionar correctamente en los navegadores modernos más usados (Chrome, Firefox, Safari, Edge). | Compatibilidad |

## 5.2 Modelo de Base de Datos

### Diagrama Entidad-Relación

La base de datos del sistema se compone de **cinco tablas** relacionadas entre sí. El siguiente diagrama representa las entidades, sus atributos y las relaciones que existen entre ellas:

```
┌──────────────────┐           ┌──────────────────────┐
│     USUARIO      │           │       SERVICIO        │
│──────────────────│           │──────────────────────│
│ id_usuario (PK)  │           │ id_servicio (PK)      │
│ nombre           │           │ nombre                │
│ email            │           │ precio                │
│ telefono         │           │ duracion_minutos      │
│ rol              │           └──────────┬───────────┘
└────────┬─────────┘                      │
         │ 1                              │ 1
         │                               │
         │ N              N              │
         └───────────┬───────────────────┘
                     │
              ┌──────▼───────────┐
              │       CITA        │
              │──────────────────│
              │ id_cita (PK)      │
              │ fecha             │
              │ hora_inicio       │
              │ hora_fin          │
              │ estado            │
              │ id_usuario (FK)   │
              │ id_servicio (FK)  │
              │ resena_dejada     │
              └──────┬───────────┘
                     │ 1
                     │
                     │ 0..1
              ┌──────▼───────────┐
              │      REVIEW       │
              │──────────────────│
              │ id_review (PK)    │
              │ calificacion      │
              │ comentario        │
              │ fecha_creacion    │
              │ id_usuario (FK)   │
              │ id_servicio (FK)  │
              │ id_cita (FK)      │
              └───────────────────┘

              ┌──────────────────────┐
              │   BLOQUEO_AGENDA     │
              │──────────────────────│
              │ id (PK)              │
              │ fecha                │
              │ hora_inicio          │
              │ hora_fin             │
              │ motivo               │
              └──────────────────────┘
```

> **Nota:** La tabla `bloqueo_agenda` no tiene relación con otras tablas; es una entidad independiente que el administrador gestiona de forma autónoma para bloquear su disponibilidad.

### Descripción detallada de cada tabla

#### Tabla `usuario`

Almacena los datos de todos los usuarios registrados en el sistema, tanto clientes como administradores.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id_usuario` | UUID | PK, NOT NULL | Identificador único generado por Supabase Auth |
| `nombre` | TEXT | NOT NULL | Nombre completo del usuario |
| `email` | TEXT | UNIQUE, NOT NULL | Correo electrónico, usado como credencial de acceso |
| `telefono` | TEXT | NULLABLE | Número de teléfono de contacto |
| `rol` | TEXT | NOT NULL, DEFAULT 'cliente' | Rol del usuario: `'cliente'` o `'admin'` |

> **Nota de implementación:** Supabase gestiona internamente la tabla `auth.users` con las credenciales cifradas. La tabla `usuario` de la aplicación se sincroniza con esta tabla mediante el `id_usuario` (que coincide con el `auth.uid()` de Supabase), almacenando únicamente los datos de negocio.

#### Tabla `servicio`

Catálogo de servicios que ofrece la barbería. Es una tabla de referencia que normalmente gestiona el administrador de forma manual desde Supabase.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id_servicio` | INTEGER | PK, SERIAL | Identificador numérico autoincremental |
| `nombre` | TEXT | NOT NULL | Nombre del servicio (ej: "Corte de cabello") |
| `precio` | DECIMAL(8,2) | NOT NULL | Precio en euros |
| `duracion_minutos` | INTEGER | NOT NULL | Duración del servicio en minutos (ej: 30, 60) |

**Datos de ejemplo:**

| id | nombre | precio | duracion_minutos |
|----|--------|--------|-----------------|
| 1 | Corte de cabello | 15.00 | 30 |
| 2 | Corte + Barba | 22.00 | 60 |
| 3 | Arreglo de barba | 10.00 | 30 |
| 4 | Degradado | 18.00 | 45 |

#### Tabla `cita`

Núcleo del sistema. Almacena cada reserva realizada por un cliente, con su estado actual y las referencias al servicio y al usuario.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id_cita` | UUID | PK, DEFAULT gen_random_uuid() | Identificador único de la cita |
| `fecha` | DATE | NOT NULL | Fecha de la cita (YYYY-MM-DD) |
| `hora_inicio` | TIME | NOT NULL | Hora de inicio del servicio (HH:MM:SS) |
| `hora_fin` | TIME | NOT NULL | Hora de fin calculada automáticamente |
| `estado` | TEXT | NOT NULL, DEFAULT 'CONFIRMADA' | Estado: `CONFIRMADA`, `COMPLETADA`, `CANCELADA` |
| `id_usuario` | UUID | FK → usuario.id_usuario | Cliente que realizó la reserva |
| `id_servicio` | INTEGER | FK → servicio.id_servicio | Servicio reservado |
| `resena_dejada` | BOOLEAN | NOT NULL, DEFAULT false | Indica si el cliente ya dejó reseña |

**Flujo de estados de una cita:**

```
  CONFIRMADA ──────────────── CANCELADA
      │
      │ (fecha pasada o admin marca)
      ▼
  COMPLETADA ──── permite dejar reseña ────▶ resena_dejada = true
```

#### Tabla `review`

Almacena las valoraciones que los clientes dejan sobre los servicios recibidos, una vez la cita está en estado `COMPLETADA`.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id_review` | UUID | PK, DEFAULT gen_random_uuid() | Identificador único de la reseña |
| `id_usuario` | UUID | FK → usuario.id_usuario | Usuario que dejó la reseña |
| `id_servicio` | INTEGER | FK → servicio.id_servicio | Servicio valorado |
| `id_cita` | UUID | FK → cita.id_cita | Cita a la que corresponde la reseña |
| `calificacion` | INTEGER | CHECK (1-5), NOT NULL | Puntuación de 1 a 5 estrellas |
| `comentario` | TEXT | NULLABLE | Texto libre del comentario |
| `fecha_creacion` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Fecha y hora de creación automática |

#### Tabla `bloqueo_agenda`

Permite al administrador bloquear franjas horarias o días completos en su agenda, de modo que los clientes no puedan reservar en esos períodos.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Identificador único del bloqueo |
| `fecha` | DATE | NOT NULL | Fecha del bloqueo |
| `hora_inicio` | TIME | NOT NULL | Inicio del período bloqueado |
| `hora_fin` | TIME | NOT NULL | Fin del período bloqueado |
| `motivo` | TEXT | NULLABLE | Razón opcional del bloqueo |

**Convención para días completos:**

Cuando el administrador bloquea un día completo (vacaciones, festivo), se inserta un registro con `hora_inicio = '00:00'` y `hora_fin = '23:59'`. El algoritmo del calendario del cliente detecta esta convención para marcar el día como completamente cerrado y deshabilitar su selección.

## 5.3 Diseño de la Interfaz de Usuario (UI/UX)

### Filosofía de diseño

El diseño de Essenzia Barber Shop se concibió bajo la premisa de transmitir **exclusividad y profesionalidad**, alejándose de las aplicaciones de reservas genéricas y apostando por una estética que refleje la calidad del servicio de una barbería de alto nivel.

Los principios que guiaron cada decisión de diseño fueron:

1. **Minimalismo elegante:** Espacios en blanco generosos, elementos sin recargo visual, jerarquía clara de la información.
2. **Coherencia cromática:** Una paleta de colores restringida con significado semántico en cada tono.
3. **Tipografía serif como sello de identidad:** Las fuentes con serifa transmiten tradición, artesanía y lujo, cualidades asociadas a una barbería de calidad.
4. **Interactividad sutil:** Transiciones y animaciones delicadas que enriquecen la experiencia sin distraer al usuario.

### Paleta de colores

La paleta cromática del proyecto fue diseñada para evocar la identidad visual de una barbería clásica y sofisticada:

```
┌─────────────────────────────────────────────────────────────┐
│                    PALETA DE COLORES                        │
│                                                             │
│  ██████  Fondo claro       #F7F7FF  — Lavanda muy suave     │
│          Uso: fondo principal de todas las páginas          │
│                                                             │
│  ██████  Texto oscuro      #070707  — Negro casi puro       │
│          Uso: texto principal, títulos, contenido           │
│                                                             │
│  ██████  Barber Granate    #BB0A21  — Granate profundo      │
│          Uso: color de marca, botones primarios, acentos    │
│                                                             │
│  ██████  Barber Azul       #3F88C5  — Azul acero            │
│          Uso: elementos informativos, estados, badges       │
│                                                             │
│  ██████  Blanco puro       #FFFFFF  — Blanco                │
│          Uso: tarjetas, modales, zonas de contraste         │
│                                                             │
│  ██████  Footer oscuro     #170202  — Casi negro-granate    │
│          Uso: fondo del footer, contraste máximo            │
└─────────────────────────────────────────────────────────────┘
```

**Significado semántico de los colores:**

- El **granate** (`#BB0A21`) actúa como el color de marca principal. Aparece en los botones de acción primaria ("Reservar", "Confirmar"), en el logo del Navbar y como acento en el footer. Evoca elegancia, pasión y distinción.
- El **azul acero** (`#3F88C5`) se reserva para elementos informativos: badges de estado "CONFIRMADA", indicadores de precio, enlaces de navegación secundaria.
- El **fondo lavanda** (`#F7F7FF`) aporta una temperatura visual cálida y sofisticada al fondo blanco puro, sin resultar estridente.
- El **negro casi puro** (`#070707`) garantiza el máximo contraste para el texto, cumpliendo los estándares de accesibilidad WCAG AA.

### Tipografía

El sistema tipográfico del proyecto combina dos familias de fuentes con roles claramente diferenciados:

| Familia | Tipo | Uso | Peso |
|---------|------|-----|------|
| **Playfair Display** | Serif | Logotipo, títulos principales, cabeceras de sección | 400 – 900 |
| **Helvetica Neue** | Sans-serif | Cuerpo de texto, párrafos, etiquetas, botones | 400 – 700 |

```css
/* src/index.css — Definición tipográfica global */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');

:root {
  --fuente-serif: 'Playfair Display', Georgia, serif;
  --fuente-sans:  'Helvetica Neue', Arial, sans-serif;
}

/* Todos los títulos heredan la fuente serif */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--fuente-serif);
}
```

**Por qué Playfair Display:**

Playfair Display es una tipografía serif de alto contraste, inspirada en las fuentes de calidad tipográfica de los siglos XVIII y XIX. Su uso para los títulos aporta una sensación de artesanía, tradición y lujo que encaja perfectamente con la identidad de una barbería de alto nivel. Combinada con Helvetica Neue para el cuerpo de texto —limpia, neutral y altamente legible—, el resultado es un sistema tipográfico equilibrado entre carácter y funcionalidad.

### Estructura visual de las páginas

#### Página de Inicio (Home)

La página de inicio está estructurada en cuatro bloques verticales, cada uno con un propósito comunicativo específico:

```
┌────────────────────────────────────────────┐
│              NAVBAR                        │
│  Logo ESSENZIA          [Iniciar Sesión]   │
├────────────────────────────────────────────┤
│                                            │
│         GALERÍA / CARRUSEL                 │
│    [◀]  [Imagen del local]  [▶]            │
│              ● ○ ○ ○ ○                     │
│                                            │
├────────────────────────────────────────────┤
│                                            │
│         NUESTROS SERVICIOS                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Servicio │ │ Servicio │ │ Servicio │   │
│  │  Nombre  │ │  Nombre  │ │  Nombre  │   │
│  │  30 min  │ │  60 min  │ │  30 min  │   │
│  │  15 €    │ │  22 €    │ │  10 €    │   │
│  │[Reservar]│ │[Reservar]│ │[Reservar]│   │
│  └──────────┘ └──────────┘ └──────────┘   │
│                                            │
├────────────────────────────────────────────┤
│                                            │
│       OPINIONES DE NUESTROS CLIENTES       │
│  ┌──────────────┐  ┌──────────────┐        │
│  │ ★★★★★        │  │ ★★★★☆        │        │
│  │ "Comentario" │  │ "Comentario" │        │
│  │ — Cliente    │  │ — Cliente    │        │
│  └──────────────┘  └──────────────┘        │
│                                            │
├────────────────────────────────────────────┤
│              FOOTER                        │
│  Marca | Horario | Contacto                │
└────────────────────────────────────────────┘
```

#### Dashboard de Reservas

```
┌────────────────────────────────────────────┐
│              NAVBAR                        │
├────────────────────────────────────────────┤
│  Servicio seleccionado: Corte + Barba      │
│  Precio: 22€ · Duración: 60 min           │
├──────────────────┬─────────────────────────┤
│   CALENDARIO     │    HORAS DISPONIBLES    │
│                  │                         │
│  < Mayo 2025 >   │  ○ 09:00  ○ 09:30       │
│  L  M  X  J  V   │  ● 10:00  ○ 10:30       │  ← seleccionada
│  1  2  3  4  5   │  ○ 11:00  ○ 11:30       │
│  8  9  10 11 12  │  ─────── TARDE ───────  │
│  …               │  ○ 17:00  ✕ 17:30       │  ← bloqueada
│                  │  ○ 18:00  ○ 18:30       │
├──────────────────┴─────────────────────────┤
│              [RESERVAR CITA]               │
└────────────────────────────────────────────┘
```

#### Panel de Administración

```
┌────────────────────────────────────────────────────┐
│               PANEL DE ADMINISTRACIÓN              │
├────────────────────────────────────────────────────┤
│ [Próximas Citas] [Clientes] [Gestión de Cierres]   │
├────────────────────────────────────────────────────┤
│  PRÓXIMAS CITAS CONFIRMADAS            [📅 Filtrar] │
│  ┌──────────────────────────────────────────────┐  │
│  │ Cliente: Juan García                          │  │
│  │ Fecha: 24/05/2025 · 10:00                    │  │
│  │ Servicio: Corte + Barba · CONFIRMADA         │  │
│  │                    [Marcar como Completada]   │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

### Diseño de componentes reutilizables

El proyecto hace uso de varios patrones de componente que se repiten a lo largo de la aplicación:

**Modal de confirmación:** Aparece antes de cualquier acción destructiva o importante (reservar, cancelar, cerrar sesión, completar cita). Su estructura invariable tranquiliza al usuario comunicando que el sistema no realiza acciones sin su confirmación explícita.

**Badge de estado:** Etiquetas de color que comunican visualmente el estado de cada cita:
- `CONFIRMADA` → azul (`bg-blue-100 text-blue-800`)
- `COMPLETADA` → gris oscuro (`bg-gray-800 text-white`)
- `CANCELADA` → rojo (`bg-red-100 text-red-800`)

**Tarjeta de servicio:** Componente de fondo blanco con sombra suave, borde granate en la parte superior, que muestra el nombre, duración, precio y el botón de reserva de cada servicio del catálogo.

---

# 6. DESARROLLO E IMPLEMENTACIÓN

## 6.1 Configuración Inicial y Estructura del Proyecto

### Configuración del proyecto React con Vite

El frontend se inicializó usando la plantilla oficial de Vite para React:

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

A continuación se instalaron las dependencias principales:

```bash
# Navegación y routing
npm install react-router-dom

# Cliente HTTP con soporte de interceptores
npm install axios

# Framework de estilos
npm install tailwindcss @tailwindcss/vite

# Supabase SDK para autenticación directa
npm install @supabase/supabase-js

# Animaciones
npm install framer-motion

# Librería de iconos
npm install react-icons
```

### Configuración del backend Node.js

```bash
mkdir backend && cd backend
npm init -y
npm install express @supabase/supabase-js cors express-rate-limit dotenv
```

### Conexión con Supabase

La conexión a Supabase se configura mediante dos clientes diferenciados según el entorno:

**Cliente del Backend** (`backend/supabase.js`) — usa la clave secreta con acceso total:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY      // Service Role Key — nunca exponer al cliente
);

module.exports = supabase;
```

**Cliente del Frontend** (`frontend/src/services/supabaseClient.js`) — usa la clave pública anónima:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnon);
```

### Interceptor de Axios para autenticación automática

Para no tener que añadir manualmente el token JWT en cada petición al backend, se configuró un interceptor en Axios que inyecta el token automáticamente en todas las llamadas:

```javascript
// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Antes de cada petición, añade el token Bearer si existe en localStorage
api.interceptors.request.use((config) => {
    const tokenKey = Object.keys(localStorage).find(k => k.startsWith('sb-'));
    if (tokenKey) {
        const tokenData = JSON.parse(localStorage.getItem(tokenKey));
        const token = tokenData?.access_token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
```

Este diseño centraliza la lógica de autenticación en un único punto: si el mecanismo de autenticación cambia, solo hay que modificar este archivo.

---

## 6.2 Sistema de Autenticación y Gestión de Roles

### Flujo de registro de usuario

El registro se divide en dos pasos necesarios por la arquitectura de Supabase. Primero se crea el usuario en el sistema de autenticación de Supabase (`auth.users`), y después se inserta el registro de negocio en la tabla `usuario` con los datos adicionales (nombre, teléfono, rol):

```javascript
// backend/routes/auth.js — Endpoint de registro
router.post('/register', async (req, res, next) => {
    const { nombre, telefono, email, password } = req.body;

    try {
        // Paso 1: Crear el usuario en el sistema de autenticación de Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) throw authError;

        const userId = authData.user.id;

        // Paso 2: Insertar los datos de negocio en nuestra tabla 'usuario'
        const { error: insertError } = await supabase
            .from('usuario')
            .insert([{
                id_usuario: userId,   // Mismo ID que Supabase Auth
                nombre,
                email,
                telefono,
                rol: 'cliente'        // Rol por defecto
            }]);

        if (insertError) throw insertError;

        res.status(201).json({ mensaje: "Usuario registrado correctamente", userId });

    } catch (err) {
        next(err);
    }
});
```

### Flujo de inicio de sesión

El login utiliza directamente el método `signInWithPassword` de Supabase, que valida las credenciales y devuelve un token JWT de sesión:

```javascript
// backend/routes/auth.js — Endpoint de login
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        // Devolvemos el token de acceso al frontend para que lo almacene
        res.json({
            access_token: data.session.access_token,
            user: data.user
        });

    } catch (err) {
        next(err);
    }
});
```

### Middleware de validación de sesión

Para proteger los endpoints que requieren autenticación, se implementó un middleware que verifica el token JWT en cada petición:

```javascript
// backend/middleware/authMiddleware.js
const validarSesion = async (req, res, next) => {
    // 1. Extraemos la cabecera 'Authorization' de la petición
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "No se ha proporcionado un token" });
    }

    // 2. El formato es "Bearer TOKEN". Extraemos solo el TOKEN.
    const token = authHeader.split(' ')[1];

    // 3. Preguntamos a Supabase: ¿este token pertenece a un usuario con sesión activa?
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ error: "Sesión inválida o expirada" });
    }

    // 4. Guardamos los datos del usuario en 'req' para los handlers siguientes
    req.usuarioLogueado = user;
    next();
};
```

### Gestión de sesión y roles en el Frontend

El componente raíz `App.jsx` implementa un sistema de doble efecto para gestionar la sesión y el rol del usuario:

```jsx
// frontend/src/App.jsx — Sistema de autenticación reactiva
function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // EFECTO 1: "Radar de sesión" — escucha eventos de autenticación en tiempo real
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        if (!currentSession) {
          setUserRole(null);
          setLoading(false);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  // EFECTO 2: "Buscador de rol" — solo se ejecuta cuando hay una sesión válida
  useEffect(() => {
    const buscarRol = async () => {
      if (session?.user?.id) {
        const { data } = await supabase
          .from('usuario')
          .select('rol')
          .eq('id_usuario', session.user.id)
          .maybeSingle();

        if (data) setUserRole(data.rol);
        setLoading(false);
      }
    };
    buscarRol();
  }, [session]);  // Se ejecuta cada vez que 'session' cambia

  // Pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-barber-rojo font-black text-2xl uppercase animate-pulse">
          CARGANDO...
        </span>
      </div>
    );
  }

  // Rutas protegidas por sesión y rol
  return (
    <Router>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={!session ? <Login /> : <Navigate to="/" />} />
        <Route path="/register"  element={!session ? <Register /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/mis-citas" element={session ? <MisCitas /> : <Navigate to="/login" />} />
        {/* El admin además del login necesita tener rol 'admin' */}
        <Route path="/admin"
          element={session && userRole === 'admin'
            ? <AdminPanel />
            : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}
```

La separación en dos efectos (en lugar de uno combinado) fue una decisión deliberada para evitar condiciones de carrera: el primer efecto responde instantáneamente a eventos de autenticación, mientras que el segundo gestiona la consulta asíncrona del rol de forma independiente.

---

## 6.3 El Algoritmo del Calendario

El Dashboard de reservas es el componente más complejo del sistema. En su núcleo se encuentra el algoritmo que genera el calendario mensual y calcula qué horas están disponibles para el servicio seleccionado.

### Generación de la cuadrícula del calendario

```jsx
// frontend/src/pages/Dashboard.jsx — Generación del calendario
const anioActual = mesVisible.getFullYear();
const mesActual  = mesVisible.getMonth();

// Número total de días del mes (el día 0 del mes siguiente = último día del mes actual)
const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();

// Día de la semana del primer día del mes (0=Domingo, 1=Lunes, ..., 6=Sábado)
const primerDiaSemana = new Date(anioActual, mesActual, 1).getDay();

// Celdas vacías antes del día 1 (ajustamos para que la semana empiece en Lunes)
// Si primerDiaSemana es Domingo (0), necesitamos 6 celdas vacías para una cuadrícula L-D
const espaciosVacios = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;
```

Este cálculo tiene una sutileza importante: JavaScript numera los días de la semana con Domingo = 0, pero el calendario del diseño empieza en Lunes. Por eso, si el primer día del mes cae en Domingo, se necesitan 6 celdas vacías (en lugar de 0), y para cualquier otro día se resta 1 al valor devuelto por `getDay()`.

```jsx
// Renderizado de la cuadrícula
{/* Cabeceras de días */}
{['L','M','X','J','V','S','D'].map(d => (
  <div key={d} className="text-sm font-black py-1 text-center">{d}</div>
))}

{/* Celdas vacías de relleno antes del día 1 */}
{Array.from({ length: espaciosVacios }).map((_, i) => (
  <div key={`empty-${i}`} className="p-2"></div>
))}

{/* Botones de días del mes */}
{Array.from({ length: diasEnMes }, (_, i) => i + 1).map(dia => {
  const fechaCasilla = new Date(anioActual, mesActual, dia);
  fechaCasilla.setHours(0, 0, 0, 0);
  const fechaStr = formatearFecha(dia, mesActual, anioActual);

  const esPasado     = fechaCasilla < hoy;
  const esDiaCerrado = diasCerrados.includes(fechaStr);

  // Un día se deshabilita si: es sábado (6), domingo (0), es pasado,
  // supera el límite de 1 mes, o el admin lo ha cerrado
  const deshabilitado =
    fechaCasilla.getDay() === 0 ||
    fechaCasilla.getDay() === 6 ||
    esPasado ||
    fechaCasilla > limiteMaximo ||
    esDiaCerrado;

  const estaSeleccionado = fechaSeleccionada === fechaStr;

  return (
    <button
      key={dia}
      disabled={deshabilitado}
      onClick={() => { setFechaSeleccionada(fechaStr); setHora(null); }}
      className={`aspect-square rounded-lg font-bold transition-all border-2
        ${deshabilitado
          ? 'bg-gray-50 text-gray-200 border-gray-100 cursor-not-allowed'
          : estaSeleccionado
            ? 'bg-[#8A2D3B] text-white border-[#8A2D3B] shadow-lg scale-105'
            : 'bg-white text-texto-oscuro border-transparent hover:border-barber-rojo'
        }
      `}
    >
      {dia}
      {/* Indicador visual rojo en días cerrados por el admin */}
      {esDiaCerrado && !esPasado && (
        <span className="absolute bottom-1 w-1.5 h-1.5 bg-red-400 rounded-full" />
      )}
    </button>
  );
})}
```

### Carga de días cerrados por el administrador

Al cargar el componente (y al cambiar de mes), se consulta directamente a Supabase para obtener los días que el administrador ha bloqueado por completo. La convención es que los días completos tienen `hora_inicio = '00:00'` y `hora_fin = '23:59'`:

```jsx
useEffect(() => {
  const cargarDiasCerrados = async () => {
    const { data, error } = await supabase
      .from('bloqueo_agenda')
      .select('fecha')
      .eq('hora_inicio', '00:00')
      .eq('hora_fin', '23:59');   // Solo bloques de día completo

    if (!error && data) {
      setDiasCerrados(data.map(bloqueo => bloqueo.fecha));
    }
  };
  cargarDiasCerrados();
}, [mesVisible]);  // Se recarga al navegar entre meses
```

### Algoritmo de horas disponibles

Este es el algoritmo central del sistema. Cuando el usuario selecciona una fecha, se ejecuta `obtenerHorasDisponibles()`, que combina múltiples filtros para devolver únicamente los bloques horarios en los que sería posible realizar el servicio seleccionado:

```jsx
// frontend/src/pages/Dashboard.jsx
const obtenerHorasDisponibles = () => {
  if (!servicioSeleccionado || !fechaSeleccionada) return [];

  const duracion = servicioSeleccionado.duracion_minutos;

  // PASO 1: Generar todos los slots de la jornada (mañana y tarde, cada 30 min)
  let horas = [];
  for (let h = 9; h <= 13; h++) {
    horas.push(`${h < 10 ? '0'+h : h}:00`);
    horas.push(`${h < 10 ? '0'+h : h}:30`);
  }
  for (let h = 17; h <= 19; h++) {
    horas.push(`${h}:00`);
    horas.push(`${h}:30`);
  }
  // Slots generados: 09:00, 09:30, 10:00, ... 13:30, 17:00, 17:30, 18:00, 18:30, 19:00, 19:30

  // PASO 2: Para servicios de 60 min, eliminar los últimos slots que excederían el cierre
  // Un servicio de 60 min que empieza a las 13:30 terminaría a las 14:30 (fuera de horario)
  if (duracion === 60) {
    horas = horas.filter(h => h !== '13:30' && h !== '19:30');
  }

  // PASO 3: Si la fecha seleccionada es hoy, filtrar las horas ya pasadas
  const fechaHoyStr = formatearFecha(
    new Date().getDate(), new Date().getMonth(), new Date().getFullYear()
  );
  if (fechaSeleccionada === fechaHoyStr) {
    const ahora = new Date();
    const tiempoActual = ahora.getHours() * 60 + ahora.getMinutes();
    horas = horas.filter(h => {
      const [horaSlot, minutoSlot] = h.split(':').map(Number);
      return (horaSlot * 60 + minutoSlot) > tiempoActual;
    });
  }

  // PASO 4: Filtrar los slots que se solaparían con citas existentes o bloqueos
  horas = horas.filter(h => {
    const inicio_db = `${h}:00`;                           // "09:00:00"
    const fin_db    = calcularHoraFin(h, duracion);        // "09:30:00" si duracion=30

    // Un slot CHOCA si: (mi_inicio < cita_fin) AND (mi_fin > cita_inicio)
    // Esto detecta cualquier tipo de solapamiento parcial o total
    const choca = horasOcupadas.some(cita =>
      (inicio_db < cita.hora_fin) && (fin_db > cita.hora_inicio)
    );
    return !choca;  // Solo incluimos slots que NO chocan
  });

  return horas;
};
```

**Visualización del algoritmo de solapamiento:**

```
Cita existente:   [──────── 10:00 ──── 10:30 ────]
Slot a comprobar:       [──────── 10:15 ──── 10:45 ──]

  inicio_nuevo (10:15) < fin_existente (10:30)  → true
  fin_nuevo    (10:45) > inicio_existente (10:00) → true
  → CHOCA: slot 10:15 no disponible

Cita existente:   [──────── 10:00 ──── 10:30 ────]
Slot a comprobar:                       [── 10:30 ──── 11:00 ──]

  inicio_nuevo (10:30) < fin_existente (10:30)  → false  (no es estrictamente menor)
  → NO CHOCA: slot 10:30 disponible
```

La comparación usa operadores estrictos (`<` y `>`, no `<=` y `>=`), lo que permite que dos citas consecutivas sean posibles sin solapamiento.

### Cálculo de la hora de fin

Una función auxiliar convierte el tiempo de inicio más la duración en la hora de fin, en el formato `HH:MM:SS` que usa la base de datos:

```jsx
const calcularHoraFin = (inicio, duracion) => {
  const [horas, minutos] = inicio.split(':').map(Number);
  const totalMinutos = horas * 60 + minutos + duracion;
  const finHoras   = Math.floor(totalMinutos / 60);
  const finMinutos = totalMinutos % 60;
  return `${String(finHoras).padStart(2, '0')}:${String(finMinutos).padStart(2, '0')}:00`;
};

// Ejemplo: calcularHoraFin('13:00', 60) → '14:00:00'
// Ejemplo: calcularHoraFin('19:00', 30) → '19:30:00'
```

---

## 6.4 Gestión de Citas — Flujo Completo de Reserva

### Backend: Endpoint de creación de cita con anti-solapamiento

El backend reproduce el mismo algoritmo de solapamiento como segunda capa de seguridad. Aunque el frontend filtra las horas disponibles, el backend comprueba independientemente antes de insertar la cita en la base de datos, evitando condiciones de carrera (dos usuarios reservando el mismo slot simultáneamente):

```javascript
// backend/index.js — POST /nueva-cita
app.post('/nueva-cita', async (req, res, next) => {
    const { id_servicio, fecha, hora_inicio, id_usuario } = req.body;

    try {
        // 1. Obtener la duración del servicio desde la BD
        const { data: servicio } = await supabase
            .from('servicio')
            .select('duracion_minutos')
            .eq('id_servicio', id_servicio)
            .single();

        // 2. Calcular hora de fin en formato HH:MM:SS
        const [horas, minutos] = hora_inicio.split(':').map(Number);
        const totalMinutos = horas * 60 + minutos + servicio.duracion_minutos;

        const hora_inicio_db = `${hora_inicio}:00`;
        const hora_fin_db = `${String(Math.floor(totalMinutos/60)).padStart(2,'0')}:` +
                            `${String(totalMinutos % 60).padStart(2,'0')}:00`;

        // 3. Comprobar solapamiento con citas ya confirmadas ese día
        const { data: citasDelDia } = await supabase
            .from('cita')
            .select('hora_inicio, hora_fin')
            .eq('fecha', fecha)
            .eq('estado', 'CONFIRMADA');

        const haySolapamiento = citasDelDia.some(cita =>
            (hora_inicio_db < cita.hora_fin) && (hora_fin_db > cita.hora_inicio)
        );

        if (haySolapamiento) {
            return res.status(409).json({
                error: "El horario ya está ocupado por otra cita."
            });
        }

        // 4. Si no hay conflicto, insertar la nueva cita
        const { data: nuevaCita } = await supabase
            .from('cita')
            .insert([{
                fecha,
                hora_inicio: hora_inicio_db,
                hora_fin: hora_fin_db,
                estado: 'CONFIRMADA',
                id_usuario,
                id_servicio
            }])
            .select();

        res.status(201).json({
            mensaje: "Cita reservada correctamente",
            cita: nuevaCita[0]
        });

    } catch (err) {
        next(err);
    }
});
```

### Endpoint de horas ocupadas (citas + bloqueos unificados)

Un aspecto elegante del diseño es que el endpoint `/citas-ocupadas` combina transparentemente las citas reales y los bloqueos del administrador en una sola lista, de modo que el frontend no necesita distinguirlos:

```javascript
// backend/index.js — GET /citas-ocupadas?fecha=YYYY-MM-DD
app.get('/citas-ocupadas', async (req, res, next) => {
    const { fecha } = req.query;

    // 1. Citas confirmadas ese día
    const { data: citas } = await supabase
        .from('cita')
        .select('hora_inicio, hora_fin')
        .eq('fecha', fecha)
        .eq('estado', 'CONFIRMADA');

    // 2. Bloqueos de agenda ese día (tanto horas sueltas como días completos)
    const { data: bloqueos } = await supabase
        .from('bloqueo_agenda')
        .select('hora_inicio, hora_fin')
        .eq('fecha', fecha);

    // 3. Unificamos: el frontend los trata igual
    const horasOcupadas = [...(citas || []), ...(bloqueos || [])];
    res.json(horasOcupadas);
});
```

### Actualización automática de estado

Cuando un cliente consulta sus citas, el backend aprovecha la petición para actualizar automáticamente a `COMPLETADA` todas las citas pasadas que siguen en estado `CONFIRMADA`. Esto evita tener que ejecutar un proceso periódico (*cron job*) en el servidor:

```javascript
// backend/index.js — GET /mis-citas/:id_usuario
app.get('/mis-citas/:id_usuario', async (req, res, next) => {
    const { id_usuario } = req.params;
    const fechaHoy = new Date().toISOString().split('T')[0];  // "YYYY-MM-DD"

    // Actualización silenciosa antes de devolver datos
    await supabase
        .from('cita')
        .update({ estado: 'COMPLETADA' })
        .eq('id_usuario', id_usuario)
        .eq('estado', 'CONFIRMADA')
        .lt('fecha', fechaHoy);   // lt = less than, solo fechas anteriores a hoy

    // Ahora buscamos las citas (ya actualizadas)
    const { data } = await supabase
        .from('cita')
        .select(`
            id_cita, fecha, hora_inicio, hora_fin,
            estado, resena_dejada, id_servicio,
            servicio ( nombre, precio )
        `)
        .eq('id_usuario', id_usuario)
        .order('fecha', { ascending: false });

    res.json(data);
});
```

---

## 6.5 Panel de Administración

El Panel de Administración es el componente más extenso del frontend. Se organiza en tres secciones accesibles mediante pestañas.

### Sección 1: Próximas Citas

Muestra todas las citas con estado `CONFIRMADA`, ordenadas por fecha. El administrador puede:
- Filtrar por fecha usando un selector de calendario.
- Marcar cualquier cita como `COMPLETADA` mediante un modal de confirmación.

```jsx
// Lógica de marcado como completada
const marcarComoCompletada = async (idCita) => {
  try {
    await api.patch(`/citas/${idCita}`, { estado: 'COMPLETADA' });
    // Actualizar el estado local sin recargar la página
    setCitasPendientes(prev => prev.filter(c => c.id_cita !== idCita));
  } catch (error) {
    console.error("Error al completar la cita:", error);
  }
};
```

### Sección 2: Directorio de Clientes

Lista todos los usuarios con rol `'cliente'`. Incluye una búsqueda en tiempo real y un modal de detalle que muestra el historial completo de cada cliente:

```jsx
// Filtrado de clientes en tiempo real (sin petición al servidor)
const clientesFiltrados = clientes.filter(cliente =>
  cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
);
```

### Sección 3: Gestión de Cierres de Agenda

Esta sección implementa dos modos de bloqueo diferenciados:

**Modo "Días / Vacaciones":** El administrador selecciona uno o varios días del mes y los bloquea por completo. Al confirmar, se insertan en `bloqueo_agenda` con `hora_inicio = '00:00'` y `hora_fin = '23:59'`.

**Modo "Horas Sueltas":** El administrador selecciona un día y luego elige un rango de horas concreto. Para facilitar la selección, se implementó una lógica de selección de rango por clic:

```jsx
// Lógica de selección de rango horario (primer clic = inicio, segundo clic = fin)
const timeToMins = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const minsToTime = (m) => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
};

// isSelected verifica si un slot está dentro del rango seleccionado
const isSelected = (horaStr) => {
  if (horasSeleccionadas.length === 0) return false;
  const minSlot = timeToMins(horaStr);
  const minMin  = Math.min(...horasSeleccionadas.map(timeToMins));
  const minMax  = Math.max(...horasSeleccionadas.map(timeToMins));
  return minSlot >= minMin && minSlot <= minMax;
};

// Al confirmar, el bloqueo abarca desde el primer hasta el último slot + 30 min
const horaInicio = minsToTime(Math.min(...horasSeleccionadas.map(timeToMins)));
const horaFin    = minsToTime(Math.max(...horasSeleccionadas.map(timeToMins)) + 30);
```

---

## 6.6 Sistema de Reseñas

### Flujo de creación de una reseña

Las reseñas solo están disponibles para citas en estado `COMPLETADA` que aún no han sido reseñadas (`resena_dejada === false`). El proceso implica dos operaciones en la base de datos:

```javascript
// backend/index.js — POST /nueva-review
app.post('/nueva-review', async (req, res, next) => {
    const { id_usuario, id_servicio, id_cita, calificacion, comentario } = req.body;

    // Validación: calificación entre 1 y 5
    if (calificacion < 1 || calificacion > 5) {
        return res.status(400).json({ error: "La calificación debe ser entre 1 y 5." });
    }

    // 1. Insertar la reseña en la tabla 'review'
    await supabase.from('review').insert([{
        id_usuario, id_servicio, calificacion, comentario
    }]);

    // 2. Marcar la cita como reseñada (evita múltiples reseñas por cita)
    await supabase
        .from('cita')
        .update({ resena_dejada: true })
        .eq('id_cita', id_cita);

    res.status(201).json({ mensaje: "¡Gracias por tu valoración!" });
});
```

### Visualización de reseñas en la página de inicio

Las reseñas se obtienen con un *join* implícito de Supabase que resuelve las relaciones en una sola consulta:

```javascript
// backend/index.js — GET /reviews
const { data } = await supabase
    .from('review')
    .select(`
        id_review,
        calificacion,
        comentario,
        fecha_creacion,
        usuario ( nombre ),       // ← join automático con tabla usuario
        servicio ( nombre )       // ← join automático con tabla servicio
    `)
    .order('fecha_creacion', { ascending: false });
```

La sintaxis de selección anidada de Supabase (`usuario ( nombre )`) genera automáticamente la consulta SQL con JOIN, devolviendo los datos en un objeto JSON estructurado:

```json
{
  "id_review": "abc-123",
  "calificacion": 5,
  "comentario": "Excelente servicio, muy profesional.",
  "fecha_creacion": "2025-05-20T10:30:00Z",
  "usuario": { "nombre": "Carlos García" },
  "servicio": { "nombre": "Corte + Barba" }
}
```

---

## 6.7 Protección Anti-Fuerza Bruta (Rate Limiting)

Para proteger los endpoints de autenticación contra ataques de fuerza bruta (intentos masivos de login con diferentes contraseñas), se implementó `express-rate-limit` con dos niveles de restricción:

```javascript
// backend/index.js — Configuración de rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // Ventana de 15 minutos
    max: 10,                      // Máximo 10 intentos por IP en esa ventana
    standardHeaders: true,
    message: {
        error: "Demasiados intentos. Por seguridad, bloqueado 15 min."
    }
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // Ventana de 15 minutos
    max: 100,                     // Máximo 100 peticiones por IP (uso normal)
    message: {
        error: "Aviso: estás haciendo demasiadas peticiones."
    }
});

// Aplicar limitadores diferenciados según el tipo de ruta
app.use('/auth', authLimiter, authRoutes);    // Muy restrictivo
app.use('/citas', generalLimiter, citasRoutes); // Permisivo para uso normal
```

Si se superan los límites, el servidor devuelve un código HTTP `429 Too Many Requests`.

---

## 6.8 Documentación de la API con Swagger

### ¿Qué es Swagger / OpenAPI?

**Swagger** es el conjunto de herramientas más extendido para diseñar, documentar y probar APIs REST. Se basa en la especificación **OpenAPI 3.0**, un estándar abierto que describe los endpoints, parámetros, cuerpos de petición, respuestas y esquemas de datos de una API en formato JSON o YAML.

En este proyecto se integraron dos librerías:

| Librería | Versión | Función |
|----------|---------|---------|
| `swagger-jsdoc` | — | Lee los comentarios JSDoc de los ficheros de rutas y genera automáticamente el spec OpenAPI 3.0 en JSON |
| `swagger-ui-express` | — | Sirve una interfaz web interactiva en `/api-docs` que permite explorar y probar la API desde el navegador |

### Configuración del spec (`backend/swagger.js`)

El fichero `swagger.js` centraliza toda la configuración del spec: metadatos de la API, servidores disponibles, esquemas de datos reutilizables y las etiquetas que agrupan los endpoints:

```javascript
// backend/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Essenzia Barber Shop — API',
            version: '1.0.0',
            description: 'API REST del sistema de gestión de citas de Essenzia Barber Shop.',
        },
        servers: [
            { url: 'https://proyecto-gonzalo-barranco.onrender.com', description: 'Producción' },
            { url: 'http://localhost:3000',                          description: 'Desarrollo' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Servicio:    { /* nombre, precio, duracion_minutos... */ },
                Cita:        { /* fecha, hora_inicio, hora_fin, estado... */ },
                Review:      { /* calificacion, comentario, usuario, servicio... */ },
                HoraOcupada: { /* hora_inicio, hora_fin */ },
                Error:       { /* error: string */ },
            },
        },
        tags: [
            { name: 'Autenticación' },
            { name: 'Servicios'     },
            { name: 'Citas'         },
            { name: 'Reseñas'       },
            { name: 'Admin'         },
        ],
    },
    // Rutas donde swagger-jsdoc buscará los comentarios JSDoc
    apis: ['./index.js', './routes/*.js'],
};

module.exports = swaggerJsdoc(options);
```

### Montaje de la UI en el servidor (`backend/index.js`)

Con dos líneas se expone la interfaz interactiva en la ruta `/api-docs`:

```javascript
const swaggerUi   = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Interfaz visual interactiva
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Essenzia Barber Shop — API Docs',
    customCss: '.swagger-ui .topbar { background-color: #BB0A21; }',  // Topbar en granate
}));

// Endpoint para descargar el spec en JSON (útil para Postman, Insomnia, etc.)
app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
```

El `customCss` tiñe la barra superior de la UI con el granate corporativo de Essenzia (`#BB0A21`), manteniendo coherencia visual con el resto del proyecto.

### Anotación de endpoints con JSDoc

Cada endpoint se documenta con un bloque JSDoc `@swagger` colocado inmediatamente antes del handler. A continuación se muestran dos ejemplos representativos:

**Endpoint público — GET `/test-servicios`:**

```javascript
/**
 * @swagger
 * /test-servicios:
 *   get:
 *     summary: Obtener todos los servicios
 *     description: Devuelve el catálogo completo de servicios (nombre, precio, duración). No requiere autenticación.
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: Lista de servicios disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servicio'
 *       500:
 *         description: Error interno del servidor
 */
app.get('/test-servicios', async (req, res, next) => { ... });
```

**Endpoint protegido con Bearer token — POST `/citas` en `routes/citas.js`:**

```javascript
/**
 * @swagger
 * /citas:
 *   post:
 *     summary: Crear una nueva cita (requiere autenticación)
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []          ← indica que requiere token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fecha, hora_inicio, id_servicio]
 *             properties:
 *               fecha:        { type: string, format: date, example: "2025-05-28" }
 *               hora_inicio:  { type: string, example: "10:00" }
 *               id_servicio:  { type: integer, example: 2 }
 *     responses:
 *       201:
 *         description: Cita creada correctamente
 *       400:
 *         description: Campos inválidos o solapamiento de horario
 *       401:
 *         description: Token no proporcionado o expirado
 */
router.post('/', validarSesion, async (req, res) => { ... });
```

### Resumen de todos los endpoints documentados

| Método | Ruta | Tag | Autenticación | Descripción |
|--------|------|-----|---------------|-------------|
| `POST` | `/auth/register` | Autenticación | No | Registrar nuevo usuario |
| `POST` | `/auth/login` | Autenticación | No | Iniciar sesión, obtener token JWT |
| `GET` | `/test-servicios` | Servicios | No | Catálogo de servicios (nombre, precio, duración) |
| `POST` | `/nueva-cita` | Citas | No* | Crear reserva (flujo principal del cliente) |
| `GET` | `/citas-ocupadas?fecha=` | Citas | No | Tramos horarios no disponibles para una fecha |
| `GET` | `/mis-citas/:id_usuario` | Citas | No* | Historial de citas del usuario |
| `PUT` | `/cancelar-cita/:id_cita` | Citas | No* | Cancelar una cita confirmada |
| `POST` | `/nueva-review` | Reseñas | No* | Publicar valoración de un servicio |
| `GET` | `/reviews` | Reseñas | No | Todas las reseñas (para la página de inicio) |
| `GET` | `/citas/detalladas` | Admin | No* | Todas las citas con datos de cliente y servicio |
| `POST` | `/citas` | Citas | **Sí (JWT)** | Crear cita validando sesión con middleware |
| `PATCH` | `/citas/:id` | Admin | No* | Actualizar estado de una cita (admin) |

> *Estos endpoints no usan el middleware `validarSesion` en todas las rutas, pero el frontend siempre envía el token automáticamente mediante el interceptor de Axios.

### Acceso a la UI de Swagger

Una vez el servidor está en marcha, la documentación interactiva es accesible en:

- **Desarrollo local:** `http://localhost:3000/api-docs`
- **Producción:** `https://proyecto-gonzalo-barranco.onrender.com/api-docs`

Desde la interfaz se puede:
1. Ver la descripción de cada endpoint, sus parámetros y los posibles códigos de respuesta.
2. Expandir los esquemas de datos para entender la estructura exacta de cada objeto.
3. Ejecutar peticiones reales contra el servidor haciendo clic en **"Try it out"** → **"Execute"**.
4. Autenticarse con el token JWT usando el botón **"Authorize"** para probar los endpoints protegidos.

---

# 7. PRUEBAS Y CONTROL DE CALIDAD

## 7.1 Estrategia de Pruebas

Al tratarse de un proyecto individual sin un equipo de QA dedicado, las pruebas se realizaron de forma **manual y exploratoria**, siguiendo un enfoque basado en casos de uso reales. Se priorizaron los flujos críticos del negocio: la reserva de citas, la detección de solapamientos y el acceso por rol.

La estrategia se articuló en tres niveles:

1. **Pruebas de humo (*smoke tests*):** Verificación rápida de que las funcionalidades básicas arrancan y responden correctamente tras cada sesión de desarrollo.
2. **Pruebas funcionales:** Comprobación exhaustiva de cada caso de uso, incluyendo el camino feliz (*happy path*) y los casos límite.
3. **Pruebas de regresión:** Verificación de que los cambios introducidos en una iteración no han roto funcionalidades ya operativas.

## 7.2 Casos de Prueba Funcionales

### Módulo de Autenticación

| ID | Caso de prueba | Datos de entrada | Resultado esperado | Resultado obtenido |
|----|---------------|-----------------|--------------------|--------------------|
| P-AUTH-01 | Registro con datos válidos | nombre, email, contraseña correctos | Usuario creado, redirige a login con mensaje de éxito | ✅ Correcto |
| P-AUTH-02 | Registro con email ya existente | Email ya registrado en BD | Mensaje: "Este email ya está registrado" | ✅ Correcto |
| P-AUTH-03 | Registro con contraseñas que no coinciden | pass1 ≠ pass2 | Validación en frontend, no envía petición | ✅ Correcto |
| P-AUTH-04 | Login con credenciales correctas | Email y contraseña válidos | Sesión iniciada, redirige a Home | ✅ Correcto |
| P-AUTH-05 | Login con contraseña incorrecta | Contraseña errónea | Mensaje: "Credenciales incorrectas" | ✅ Correcto |
| P-AUTH-06 | Acceso a /dashboard sin sesión | URL directa sin login | Redirige automáticamente a /login | ✅ Correcto |
| P-AUTH-07 | Acceso a /admin con rol cliente | Usuario autenticado pero sin rol admin | Redirige a Home, nunca muestra el panel | ✅ Correcto |
| P-AUTH-08 | Cierre de sesión | Click en "Cerrar Sesión" y confirmar | Sesión destruida, redirige a Home | ✅ Correcto |

### Módulo de Reservas (Dashboard)

| ID | Caso de prueba | Datos de entrada | Resultado esperado | Resultado obtenido |
|----|---------------|-----------------|--------------------|--------------------|
| P-RES-01 | Acceder al Dashboard sin servicio seleccionado | URL /dashboard directa sin pasar por Home | Redirige a Home (no hay `servicioSeleccionadoId` en localStorage) | ✅ Correcto |
| P-RES-02 | Días inhabilitados en el calendario | Mes actual | Sábados y domingos aparecen en gris, no son clicables | ✅ Correcto |
| P-RES-03 | Días pasados inhabilitados | Días previos al día actual | Aparecen en gris, no son clicables | ✅ Correcto |
| P-RES-04 | Horas pasadas para el día de hoy | Seleccionar el día de hoy | Solo aparecen horas futuras | ✅ Correcto |
| P-RES-05 | Horas ocupadas no aparecen | Cita existente a las 10:00 (30 min) | El slot 10:00 no aparece en la lista de disponibles | ✅ Correcto |
| P-RES-06 | Reserva exitosa completa | Servicio + fecha + hora válidos | Cita creada, redirige a "Mis Citas" | ✅ Correcto |
| P-RES-07 | Intento de doble reserva simultánea | Mismo slot desde dos pestañas | Segunda reserva recibe error 409, primera confirmada | ✅ Correcto |
| P-RES-08 | Servicio de 60 min: 13:30 no disponible | Servicio de 60 min, seleccionar 13:30 | El slot 13:30 no aparece en la lista | ✅ Correcto |
| P-RES-09 | Día cerrado por admin no es seleccionable | Admin bloquea un día completo | El día aparece con punto rojo y no es clicable | ✅ Correcto |

### Módulo "Mis Citas"

| ID | Caso de prueba | Resultado esperado | Resultado obtenido |
|----|---------------|--------------------|--------------------|
| P-MC-01 | Citas del usuario ordenadas por fecha | La más reciente aparece primero | ✅ Correcto |
| P-MC-02 | Cancelar cita CONFIRMADA | Estado cambia a CANCELADA sin recargar página | ✅ Correcto |
| P-MC-03 | Citas pasadas CONFIRMADAS aparecen como COMPLETADAS | Al cargar la página, las pasadas ya son COMPLETADAS | ✅ Correcto |
| P-MC-04 | Botón "Dejar reseña" solo en COMPLETADAS no reseñadas | Solo aparece en citas elegibles | ✅ Correcto |
| P-MC-05 | Enviar reseña con calificación válida (1-5) | Reseña guardada, botón desaparece de esa cita | ✅ Correcto |

### Panel de Administración

| ID | Caso de prueba | Resultado esperado | Resultado obtenido |
|----|---------------|--------------------|--------------------|
| P-ADMIN-01 | Próximas citas cargadas correctamente | Lista de citas CONFIRMADAS visible | ✅ Correcto |
| P-ADMIN-02 | Marcar cita como completada | Desaparece de la lista de próximas | ✅ Correcto |
| P-ADMIN-03 | Buscador de clientes filtra en tiempo real | La lista se actualiza al escribir | ✅ Correcto |
| P-ADMIN-04 | Bloquear día completo | El día bloqueado aparece inhabilitado para el cliente | ✅ Correcto |
| P-ADMIN-05 | Bloquear horas sueltas | Las horas bloqueadas no aparecen en el Dashboard | ✅ Correcto |

## 7.3 Pruebas de Usabilidad

Las pruebas de usabilidad se realizaron solicitando a varios usuarios sin conocimiento técnico del sistema que completaran tareas concretas de forma autónoma:

**Tareas evaluadas:**
1. Registrarse como nuevo usuario.
2. Reservar una cita para el servicio "Corte + Barba" el próximo viernes disponible.
3. Consultar el historial de citas propias.
4. Dejar una reseña sobre una cita completada.

**Observaciones principales:**

- El flujo de reserva en dos pasos (seleccionar servicio en Home → ir al Dashboard) resultó intuitivo para todos los usuarios.
- El calendario fue comprendido sin explicaciones: los usuarios diferenciaron correctamente los días disponibles (blancos) de los no disponibles (gris claro).
- La confirmación en modal antes de reservar generó confianza: los usuarios comentaron que apreciaban poder revisar los detalles antes de confirmar.
- El indicador de punto rojo en días cerrados fue reconocido como señal de "ocupado" de forma natural.

## 7.4 Bugs Detectados y Solucionados

Durante el desarrollo se detectaron y corrigieron varios errores relevantes. A continuación se documentan los más significativos:

---

### Bug #1 — Doble carga del efecto de días cerrados

**Descripción:** Al cargar el Dashboard por primera vez, el array `diasCerrados` estaba vacío durante un breve instante, lo que podía mostrar erróneamente como disponible un día que el administrador había cerrado.

**Causa:** El `useEffect` que cargaba los días cerrados dependía de `[mesVisible]`, pero la variable `mesVisible` no cambiaba en la carga inicial, por lo que el efecto tardaba en ejecutarse.

**Solución:** Se restructuró el `useEffect` para que se ejecutara también en el montaje inicial del componente, asegurando que los días cerrados se carguen antes del primer renderizado de la cuadrícula.

---

### Bug #2 — El administrador no veía sus propios bloqueos al crear horas sueltas

**Descripción:** Al entrar en el modo de "Horas Sueltas" del panel de administración y seleccionar un día, las horas que ya estaban bloqueadas previamente no se mostraban como inhabilitadas, pudiendo crear bloqueos duplicados.

**Causa:** La consulta que cargaba los bloqueos existentes de ese día no se relanzaba al cambiar el día seleccionado.

**Solución:** Se añadió el día seleccionado como dependencia del `useEffect` correspondiente, forzando una recarga de bloqueos existentes cada vez que el administrador cambia de día.

---

### Bug #3 — Token de Axios no se adjuntaba en la primera petición tras login

**Descripción:** Inmediatamente después de iniciar sesión, la primera petición al backend que requería autenticación fallaba con error 401. Las siguientes peticiones funcionaban correctamente.

**Causa:** El interceptor de Axios buscaba el token en `localStorage` usando la clave que genera Supabase (`sb-[proyecto]-auth-token`). En el instante inmediato al login, Supabase no había terminado de escribir el token en `localStorage`, por lo que el interceptor no lo encontraba.

**Solución:** Se añadió un pequeño retraso reactivo mediante la escucha del evento `onAuthStateChange` para garantizar que el token estuviera disponible antes de lanzar cualquier petición protegida.

---

### Bug #4 — Calendario mostraba mes siguiente sin datos

**Descripción:** Al navegar al mes siguiente en el calendario, el calendario se renderizaba correctamente pero los días cerrados del mes siguiente no se cargaban, mostrando todos los días como disponibles.

**Causa:** El `useEffect` que cargaba `diasCerrados` no tenía `mesVisible` como dependencia.

**Solución:** Se añadió `mesVisible` al array de dependencias del efecto:
```jsx
useEffect(() => {
  cargarDiasCerrados();
}, [mesVisible]);  // ← Se recarga al cambiar de mes
```

---

### Bug #5 — La página de registro no validaba el formato del teléfono

**Descripción:** Era posible registrarse con un número de teléfono de cualquier formato, incluyendo letras.

**Causa:** No se había implementado validación del campo `telefono` en el formulario de registro.

**Solución:** Se añadió una expresión regular básica para validar que el teléfono contiene entre 9 y 15 dígitos antes de enviar el formulario.

---

## 7.5 Pruebas de Responsividad

La interfaz se probó en los siguientes breakpoints y dispositivos:

| Dispositivo | Resolución | Resultado |
|-------------|------------|-----------|
| iPhone SE | 375 × 667 px | ✅ Correcto — menú, calendario y horas en columna |
| iPhone 14 Pro | 393 × 852 px | ✅ Correcto |
| iPad Mini | 768 × 1024 px | ✅ Correcto — layout de 2 columnas activado |
| MacBook 13" | 1280 × 800 px | ✅ Correcto |
| Monitor 1080p | 1920 × 1080 px | ✅ Correcto — ancho máximo contenido |

Tailwind CSS facilita enormemente la responsividad mediante sus prefijos de breakpoint (`md:`, `lg:`). Por ejemplo, la rejilla de calendario y horas usa `grid-cols-1 md:grid-cols-2` para mostrar ambos paneles en columna en móvil y en fila en pantallas medianas y grandes.

---

# 8. MANUAL DE USUARIO

Este manual está dirigido a los dos tipos de usuarios del sistema: **clientes** y el **administrador**. Describe paso a paso cómo utilizar cada funcionalidad.

## 8.1 Página de Inicio

Al acceder a la aplicación, el usuario llega a la página de inicio. Esta página es pública y no requiere ningún tipo de registro para ser visitada.

```
╔══════════════════════════════════════════════════════════════╗
║  ESSENZIA BARBER SHOP                    [Iniciar Sesión]    ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║            GALERÍA DE IMÁGENES DEL LOCAL                     ║
║         [ ◀ ]   [ FOTO DEL LOCAL ]   [ ▶ ]                   ║
║                     ● ○ ○ ○ ○                                ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                  NUESTROS SERVICIOS                          ║
║  ┌────────────┐  ┌────────────┐  ┌────────────┐             ║
║  │ Corte      │  │ Corte +    │  │ Arreglo    │             ║
║  │ 30 min     │  │ Barba      │  │ de Barba   │             ║
║  │ 15 €       │  │ 60 min     │  │ 30 min     │             ║
║  │ [Reservar] │  │ 22 €       │  │ 10 €       │             ║
║  └────────────┘  │ [Reservar] │  │ [Reservar] │             ║
║                  └────────────┘  └────────────┘             ║
╠══════════════════════════════════════════════════════════════╣
║            OPINIONES DE NUESTROS CLIENTES                    ║
║  ┌──────────────────┐  ┌──────────────────┐                 ║
║  │ ★★★★★            │  │ ★★★★☆            │                 ║
║  │ "Excelente..."   │  │ "Muy profesional"│                 ║
║  │ — Carlos G.      │  │ — Ana M.         │                 ║
║  └──────────────────┘  └──────────────────┘                 ║
╠══════════════════════════════════════════════════════════════╣
║      ESSENZIA © 2025  |  L-V 9-14 / 17-20  |  📞 Teléfono  ║
╚══════════════════════════════════════════════════════════════╝
```

**Elementos de la página de inicio:**

- **Barra de navegación (Navbar):** En la parte superior. Muestra el nombre del negocio a la izquierda y el botón "Iniciar Sesión" a la derecha. Si el usuario ya ha iniciado sesión, el botón cambia a "Cerrar Sesión".
- **Galería:** Carrusel de fotografías del local. Se puede navegar con los botones `◀` y `▶` o haciendo clic en los puntos indicadores. Las flechas se muestran al pasar el ratón por encima.
- **Sección de servicios:** Muestra todas los servicios disponibles cargados desde la base de datos, con su nombre, duración y precio. El botón **[Reservar]** guarda el servicio elegido y redirige al calendario de reservas.
- **Sección de reseñas:** Muestra las últimas 4 reseñas publicadas por clientes, con su puntuación en estrellas, comentario y nombre del cliente.
- **Footer:** Contiene el logotipo, el horario del negocio y los datos de contacto.

> **Nota:** Para realizar una reserva es necesario haber iniciado sesión. Si el usuario pulsa [Reservar] sin sesión activa, será redirigido a la página de inicio de sesión.

---

## 8.2 Registro de Nuevo Usuario

Para acceder a todas las funcionalidades, el cliente debe crearse una cuenta. El proceso es el siguiente:

**Paso 1:** Hacer clic en "Iniciar Sesión" en la barra de navegación.

**Paso 2:** En la página de login, hacer clic en el enlace "¿No tienes cuenta? Regístrate".

**Paso 3:** Completar el formulario de registro:

```
╔═══════════════════════════════════════╗
║         CREAR UNA CUENTA             ║
╠═══════════════════════════════════════╣
║  Nombre completo:                     ║
║  [ Juan García                      ] ║
║                                       ║
║  Teléfono:                            ║
║  [ 600 123 456                      ] ║
║                                       ║
║  Correo electrónico:                  ║
║  [ juan@email.com                   ] ║
║                                       ║
║  Contraseña (mínimo 8 caracteres):    ║
║  [ ••••••••••••                     ] ║
║                                       ║
║  Confirmar contraseña:                ║
║  [ ••••••••••••                     ] ║
║                                       ║
║        [ CREAR MI CUENTA ]            ║
║                                       ║
║  ¿Ya tienes cuenta? Inicia sesión     ║
╚═══════════════════════════════════════╝
```

**Validaciones del formulario:**
- Todos los campos son obligatorios.
- La contraseña debe tener al menos 8 caracteres.
- Los campos "Contraseña" y "Confirmar contraseña" deben coincidir.
- El email no puede estar ya registrado en el sistema.

Tras el registro exitoso, el sistema redirige automáticamente a la página de inicio de sesión con un mensaje de confirmación: *"¡Cuenta creada correctamente! Ahora puedes iniciar sesión."*

---

## 8.3 Inicio de Sesión

```
╔═══════════════════════════════════════╗
║           INICIAR SESIÓN             ║
╠═══════════════════════════════════════╣
║  Correo electrónico:                  ║
║  [ juan@email.com                   ] ║
║                                       ║
║  Contraseña:                          ║
║  [ ••••••••                         ] ║
║                                       ║
║          [ ENTRAR ]                   ║
║                                       ║
║  ¿No tienes cuenta? Regístrate        ║
╚═══════════════════════════════════════╝
```

Al hacer clic en **[ENTRAR]**, aparece un modal de confirmación solicitando al usuario que verifique sus datos antes de acceder. Tras confirmar, si las credenciales son correctas, el sistema inicia la sesión y redirige a la página de inicio.

Si las credenciales son incorrectas, se muestra un mensaje de error en rojo: *"Credenciales incorrectas. Comprueba tu email y contraseña."*

---

## 8.4 Reservar una Cita (Dashboard)

Este es el flujo principal de la aplicación. Consta de los siguientes pasos:

**Paso 1 — Elegir servicio:** En la página de inicio, hacer clic en **[Reservar]** en la tarjeta del servicio deseado.

**Paso 2 — Seleccionar fecha:** En el calendario, hacer clic en el día deseado.

```
╔═══════════════════════════════════════════════════╗
║  Servicio: Corte + Barba          22 EUR · 60 min ║
╠════════════════════╦══════════════════════════════╣
║  DÍA               ║  HORA                        ║
║                    ║                              ║
║  < MAYO 2025 >     ║  (Selecciona un día primero) ║
║  L  M  X  J  V  S D║                              ║
║              1  2  3║                              ║
║  5  6  7  8  9 ░░ ░║                              ║
║ 12 13 14 15 16 ░░ ░║                              ║
║ 19 20 21 22 23 ░░ ░║                              ║
║ 26 27 28 29 30 ░░ ░║                              ║
╚════════════════════╩══════════════════════════════╝
```

*Los días en gris claro (░) son sábados o domingos y no pueden seleccionarse.*

**Paso 3 — Seleccionar hora:** Tras seleccionar el día, en la columna de la derecha aparecen los botones con los horarios disponibles.

```
╔═══════════════════════════════════════════════════╗
║  HORA                                             ║
╠═══════════════════════════════════════════════════╣
║  [ 09:00 ]  [ 09:30 ]  [ 10:00 ]                 ║
║  [ 11:00 ]  [ 11:30 ]  [ 12:00 ]                 ║
║  ─────────── TARDE ─────────────                  ║
║  [ 17:00 ]  [ 17:30 ]  [ 18:00 ]                 ║
║  [ 18:30 ]  [ 19:00 ]                             ║
║                                                   ║
║  (Los huecos no disponibles no aparecen)          ║
╠═══════════════════════════════════════════════════╣
║               [ RESERVAR CITA ]                   ║
╚═══════════════════════════════════════════════════╝
```

**Paso 4 — Confirmar reserva:** Al pulsar **[RESERVAR CITA]**, aparece un modal resumen con todos los detalles:

```
╔══════════════════════════════╗
║      CONFIRMAR RESERVA       ║
╠══════════════════════════════╣
║  Servicio   Corte + Barba    ║
║  Fecha      2025-05-28       ║
║  Hora       10:00            ║
║  Duración   60 min           ║
║  Precio     22 EUR           ║
╠══════════════════════════════╣
║  [ Cancelar ]  [ Aceptar ]   ║
╚══════════════════════════════╝
```

Al hacer clic en **[Aceptar]**, la reserva se procesa y el sistema redirige automáticamente a la página "Mis Citas" donde la nueva reserva ya es visible.

---

## 8.5 Mis Citas

La página "Mis Citas" muestra el historial completo del cliente: citas confirmadas, completadas y canceladas.

```
╔══════════════════════════════════════════════════════════════╗
║                       MIS CITAS                              ║
╠══════════════════════════════════════════════════════════════╣
║  ┌──────────────────────────────────┐                        ║
║  │ Corte + Barba          CONFIRMADA│                        ║
║  │ 28 de mayo de 2025               │                        ║
║  │ 10:00 – 11:00  ·  22 €           │                        ║
║  │                                  │                        ║
║  │  [Cancelar cita]  [Volver a pedir]│                       ║
║  └──────────────────────────────────┘                        ║
║                                                              ║
║  ┌──────────────────────────────────┐                        ║
║  │ Corte de cabello       COMPLETADA│                        ║
║  │ 10 de mayo de 2025               │                        ║
║  │ 09:00 – 09:30  ·  15 €           │                        ║
║  │                                  │                        ║
║  │  [Dejar reseña]  [Volver a pedir] │                       ║
║  └──────────────────────────────────┘                        ║
╚══════════════════════════════════════════════════════════════╝
```

**Acciones disponibles según el estado de la cita:**

| Estado | Acciones disponibles |
|--------|---------------------|
| CONFIRMADA | Cancelar cita · Volver a pedir |
| COMPLETADA (sin reseña) | Dejar reseña · Volver a pedir |
| COMPLETADA (con reseña) | Volver a pedir |
| CANCELADA | Volver a pedir |

**Cancelar una cita:** Al pulsar [Cancelar cita], aparece un modal de confirmación. Si el usuario confirma, el estado de la cita cambia a CANCELADA sin necesidad de recargar la página.

**Dejar una reseña:** Al pulsar [Dejar reseña], se abre un modal con un selector de estrellas (1 a 5) y un área de texto para el comentario:

```
╔════════════════════════════════╗
║     VALORAR EL SERVICIO        ║
╠════════════════════════════════╣
║  Corte de cabello              ║
║                                ║
║  Tu puntuación:                ║
║  ☆ ☆ ☆ ☆ ☆  (haz clic)        ║
║                                ║
║  Comentario (opcional):        ║
║  ┌──────────────────────────┐  ║
║  │                          │  ║
║  └──────────────────────────┘  ║
║                                ║
║  [ Cancelar ]  [ Enviar ]      ║
╚════════════════════════════════╝
```

Tras enviar la reseña, aparece un modal de agradecimiento y el botón "Dejar reseña" desaparece de esa cita.

---

## 8.6 Panel de Administración

El panel de administración es exclusivo para el usuario con rol `admin`. Se accede automáticamente a través de la URL `/admin` y solo es visible si el usuario autenticado tiene el rol correcto.

### Pestaña 1: Próximas Citas

```
╔══════════════════════════════════════════════════════════════╗
║  PANEL DE ADMINISTRACIÓN                                      ║
║  [Próximas Citas]  [Clientes]  [Gestión de Cierres]          ║
╠══════════════════════════════════════════════════════════════╣
║  PRÓXIMAS CITAS CONFIRMADAS                    [📅 Filtrar]  ║
║                                                              ║
║  ┌──────────────────────────────────────────────────────┐   ║
║  │ 👤 Juan García                                        │   ║
║  │ 📅 28/05/2025  🕐 10:00         Corte + Barba        │   ║
║  │                              CONFIRMADA               │   ║
║  │                    [ Marcar como Completada ]         │   ║
║  └──────────────────────────────────────────────────────┘   ║
║                                                              ║
║  ┌──────────────────────────────────────────────────────┐   ║
║  │ 👤 Ana Martínez                                       │   ║
║  │ 📅 29/05/2025  🕐 09:30         Corte de cabello     │   ║
║  │                              CONFIRMADA               │   ║
║  │                    [ Marcar como Completada ]         │   ║
║  └──────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════╝
```

El botón **[📅 Filtrar]** abre un mini-calendario que permite al administrador ver únicamente las citas de un día concreto, muy útil para planificar la jornada.

Al pulsar **[Marcar como Completada]**, aparece un modal de confirmación. Si se acepta, la cita desaparece de la lista de próximas y queda registrada como completada en el historial del cliente.

### Pestaña 2: Clientes Registrados

```
╔══════════════════════════════════════════════════════════════╗
║  CLIENTES REGISTRADOS                                        ║
╠══════════════════════════════════════════════════════════════╣
║  Buscar cliente: [ Juan...                  ]                ║
║                                                              ║
║  ┌─────────────────────────┐  ┌─────────────────────────┐   ║
║  │ Juan García             │  │ Ana Martínez            │   ║
║  │ juan@email.com          │  │ ana@email.com           │   ║
║  │ 600 123 456             │  │ 611 234 567             │   ║
║  │     [Ver historial]     │  │     [Ver historial]     │   ║
║  └─────────────────────────┘  └─────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════╝
```

Al pulsar **[Ver historial]**, se abre un modal con todas las citas del cliente, mostrando fechas, servicios, estados y precios.

### Pestaña 3: Gestión de Cierres

Esta pestaña permite al administrador bloquear su disponibilidad de dos formas:

```
╔══════════════════════════════════════════════════════════════╗
║  GESTIÓN DE CIERRES DE AGENDA                                ║
║                                                              ║
║  [ Días / Vacaciones ]    [ Horas Sueltas ]                  ║
╠══════════════════════════════════════════════════════════════╣
║  MODO: DÍAS COMPLETOS                                        ║
║                                                              ║
║  < MAYO 2025 >                                               ║
║  L   M   X   J   V   S   D                                   ║
║  5   6   7   8   9  ░░  ░░                                   ║
║ 12  13 [14] [15] 16  ░░  ░░   ← días 14 y 15 seleccionados  ║
║ 19  20  21  22  23  ░░  ░░                                   ║
║                                                              ║
║  Motivo (opcional): [Festivo local               ]           ║
║                                                              ║
║          [ BLOQUEAR DÍAS SELECCIONADOS ]                     ║
╚══════════════════════════════════════════════════════════════╝
```

**Modo "Días / Vacaciones":**
1. Seleccionar uno o varios días del calendario (se marcan en granate al hacer clic).
2. Opcionalmente, escribir el motivo del cierre.
3. Pulsar **[Bloquear días seleccionados]**.
4. Los días bloqueados aparecerán con un punto rojo en el calendario del cliente y no podrán ser seleccionados.

**Modo "Horas Sueltas":**
1. Seleccionar el día concreto.
2. En la rejilla de horas, hacer clic en el primer slot del rango deseado y luego en el último.
3. El rango completo se colorea en granate.
4. Opcionalmente, añadir un motivo.
5. Pulsar **[Bloquear rango]**.

```
╔══════════════════════════════════════════════════════════════╗
║  MODO: HORAS SUELTAS — Miércoles 28 de mayo                  ║
╠══════════════════════════════════════════════════════════════╣
║  MAÑANA                                                      ║
║  [ 09:00 ]  [ 09:30 ]  [■10:00■]  [■10:30■]  [ 11:00 ]      ║
║  ← 10:00 – 11:00 seleccionado (en granate)                   ║
║                                                              ║
║  TARDE                                                       ║
║  [ 17:00 ]  [ 17:30 ]  [ 18:00 ]  [ 18:30 ]  [ 19:00 ]      ║
║                                                              ║
║  Rango: 10:00 – 11:00                                        ║
║  Motivo: [Reunión de proveedor           ]                   ║
║                                                              ║
║                    [ BLOQUEAR RANGO ]                        ║
╚══════════════════════════════════════════════════════════════╝
```

---

# 9. CONCLUSIONES Y FUTURAS LÍNEAS DE MEJORA

## 9.1 Conclusiones

El desarrollo de **Essenzia Barber Shop** ha supuesto la aplicación práctica e integrada de todos los conocimientos adquiridos a lo largo del ciclo formativo de Desarrollo de Aplicaciones Web. Ha sido, sin duda, el proyecto más complejo y completo abordado hasta la fecha, y su conclusión satisfactoria es motivo de orgullo personal y profesional.

### Objetivos alcanzados

Todos los objetivos específicos planteados en la fase de análisis han sido cumplidos:

- ✅ La reserva de citas se realiza íntegramente de forma digital, en tiempo real.
- ✅ El algoritmo anti-solapamiento previene las dobles reservas con total fiabilidad.
- ✅ La página de inicio presenta el negocio de forma profesional y atractiva.
- ✅ El sistema de autenticación diferencia correctamente los roles de cliente y administrador.
- ✅ El panel de administración ofrece control total sobre la agenda.
- ✅ El sistema de reseñas fomenta la confianza y la fidelización.
- ✅ La interfaz es completamente responsiva en todos los dispositivos probados.
- ✅ La aplicación está desplegada en producción y es accesible desde cualquier lugar.

### Aprendizajes técnicos

**React y el paradigma de componentes:** Pasar de pensar en páginas HTML estáticas a pensar en componentes reutilizables y estado reactivo ha sido el cambio conceptual más importante. Aprender a gestionar cuándo y por qué un componente se re-renderiza, y cómo `useState` y `useEffect` orquestan el comportamiento de la interfaz, ha abierto una nueva forma de entender el desarrollo frontend.

**La importancia de la seguridad en la arquitectura:** La decisión de no exponer la clave secreta de Supabase al frontend no fue trivial al principio, pero entender la diferencia entre la `anon key` y la `service_role key`, y el papel que juega el middleware de autenticación del backend como intermediario, es una lección que va mucho más allá de este proyecto concreto.

**El desarrollo asíncrono en JavaScript:** Trabajar con `async/await`, promesas, y la naturaleza no bloqueante de Node.js ha consolidado la comprensión de cómo funcionan las operaciones asíncronas. Los errores de condición de carrera detectados durante las pruebas (como el Bug #3 del token de Axios) fueron lecciones especialmente valiosas.

**Tailwind CSS como filosofía de diseño:** Pasar de escribir CSS clásico a usar clases de utilidad fue inicialmente contraintuitivo, pero la productividad ganada y la consistencia visual obtenida justifican completamente el cambio de enfoque.

**Git como herramienta de trabajo diario:** El control de versiones dejó de ser un requisito externo para convertirse en una herramienta genuinamente útil: la posibilidad de revertir cambios con confianza y de tener el historial completo del proyecto es inapreciable.

### Dificultades superadas

La mayor dificultad técnica fue, sin duda, el **algoritmo de disponibilidad horaria**. Conseguir que el sistema detectara correctamente todos los tipos de solapamiento (parcial, total, contiguo) requirió múltiples iteraciones y una comprensión profunda de la aritmética de intervalos de tiempo. La prueba de casos límite (como un slot de 30 minutos que empieza justo cuando termina otro) fue especialmente reveladora.

La segunda dificultad importante fue la **gestión del estado de autenticación en el frontend**. Entender el flujo completo —desde el evento de login en Supabase hasta la actualización del estado de sesión en React, pasando por el almacenamiento del token en `localStorage` y su inyección en las cabeceras de Axios— requirió un trabajo de depuración cuidadoso con las herramientas del navegador.

## 9.2 Futuras Líneas de Mejora

El proyecto entregado es un sistema funcional y completo, pero como toda aplicación real, existe un amplio espacio de mejora y expansión. Las siguientes son las líneas de desarrollo más interesantes para una hipotética segunda versión:

### Funcionalidades de negocio

**1. Pasarela de pago integrada**
Integrar **Stripe** o **PayPal** para permitir el pago en el momento de la reserva. Esto no solo modernizaría la experiencia del cliente, sino que reduciría el impacto de las cancelaciones tardías al cobrar un depósito o el importe completo por adelantado.

**2. Notificaciones automáticas**
Implementar un sistema de recordatorios automáticos por email o SMS (mediante servicios como **Twilio** o **SendGrid**) que avise al cliente 24 horas antes de su cita. Esto reduciría significativamente el porcentaje de citas no presentadas (*no-shows*).

**3. Sistema de fidelización**
Añadir un programa de puntos: por cada servicio completado, el cliente acumula puntos canjeables por descuentos. Esto requeriría una tabla adicional en la base de datos y lógica de cálculo en el backend.

**4. Ampliación del catálogo de servicios**
Extender el modelo de negocio más allá de la barbería: servicios de belleza (manicura, pedicura), masajes, fisioterapia o servicios de estética. El modelo de datos actual podría adaptarse con la adición de categorías de servicio.

**5. Reserva para múltiples personas**
Permitir a un cliente reservar citas para varias personas en una misma sesión, útil para grupos o familias.

### Mejoras técnicas

**6. Panel de estadísticas para el administrador**
Añadir gráficos y métricas en el panel de administración: ingresos por mes, servicios más solicitados, horas punta, clientes más frecuentes. Se podría implementar con librerías como **Chart.js** o **Recharts**.

**7. Aplicación móvil nativa**
Convertir el frontend en una aplicación móvil con **React Native**, aprovechando la mayor parte del código y la lógica de negocio ya existentes.

**8. Autenticación con redes sociales**
Añadir la posibilidad de registrarse e iniciar sesión con Google o Apple, reduciendo la fricción del proceso de registro. Supabase ofrece esta funcionalidad de forma nativa mediante OAuth.

**9. Pruebas automatizadas**
Implementar una suite de pruebas automatizadas con **Vitest** (para el frontend) y **Jest** + **Supertest** (para el backend), garantizando que cada nueva funcionalidad no rompe las existentes y facilitando el mantenimiento a largo plazo.

**10. Sistema de caché**
Para reducir el número de consultas a la base de datos, implementar una capa de caché con **Redis** o la caché nativa de Supabase, mejorando el tiempo de respuesta de los endpoints más consultados.

---

## 9.3 Reflexión Final

Este proyecto comenzó como una respuesta a un problema real y concreto: la ineficiencia de gestionar una barbería con papel y bolígrafo en pleno siglo XXI. Terminó siendo mucho más: un ejercicio completo de ingeniería de software que abarca desde la concepción de la idea hasta el despliegue en producción, pasando por el diseño de la base de datos, la implementación de algoritmos, la construcción de una interfaz de usuario y la configuración de un servidor en la nube.

El resultado es una aplicación que funciona, que resuelve el problema para el que fue diseñada y que refleja el nivel técnico alcanzado tras dos años de formación. Pero quizás el aprendizaje más importante no es ninguna tecnología concreta, sino la comprensión del proceso: cómo descomponer un problema complejo en partes manejables, cómo tomar decisiones de diseño con criterio y cómo perseverar cuando los errores se acumulan.

**Essenzia Barber Shop** es, en definitiva, la demostración de que con las herramientas adecuadas, la metodología correcta y determinación suficiente, un solo desarrollador puede construir un producto digital completo, funcional y con una presentación profesional.

---

*Fin de la documentación técnica.*

*Essenzia Barber Shop — Gonzalo Barranco Martín — 2DAW — 2024/2025*
