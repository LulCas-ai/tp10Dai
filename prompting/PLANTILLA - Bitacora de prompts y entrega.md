# 📓 Bitácora de Prompts — Ejercicio N° 01

> Copiá este archivo por cada ejercicio que entregues. Nombralo, por ejemplo, `entregas/01-bitacora.md`.
> Esta bitácora **es parte de la nota**. Un ejercicio sin bitácora no se corrige.

---

## Datos

- **Alumno/a:** Lucas y andy :V:V:V
- **Ejercicio:** N° 01 — Nueva tabla y su CRUD
- **Fecha:** 17/08/2026
- **Modelo de IA usado:** Copilot

---

## 1. 🎯 Qué me pidieron

Este ejercicio consistió en agregar una nueva entidad llamada `materias` al proyecto base, siguiendo exactamente el mismo patrón que ya usaban `alumnos` y `cursos`. La idea era no inventar otra arquitectura ni dependencias nuevas, sino respetar la estructura en capas y asegurar que la API quedara expuesta en `/api/materias` con CRUD completo.

```
La tarea principal fue crear la tabla `materias`, generar el repository, service y controller siguiendo el patrón del proyecto, y conectarlo en `server.js` para que la API pudiera listarla, buscarla, crearla, modificarla y eliminarla.
```

---

## 2. 💬 Mis prompts (en orden)

Pegá **todos** los prompts que usaste, en orden, con la respuesta resumida y qué hiciste con ella. Agregá tantos como necesites.

### Prompt #1

**Lo que escribí:**
```
Actuá como un desarrollador backend senior en Node.js y Express.

Tengo una API REST con arquitectura controller -> service -> repository, usando ES modules y PostgreSQL con `pg` sin ORM. Te paso como referencia el archivo `cursos-repository.js` para que sigas el mismo estilo y patrón de consultas parametrizadas.

Necesito que primero me generes solo el archivo `materias-repository.js` para una tabla `materias` con los campos `id`, `nombre`, `carga_horaria`.

Incluí los métodos: `getAllAsync`, `getByIdAsync`, `createAsync`, `updateAsync` y `deleteByIdAsync`.

Restricciones: sin ORM, sin dependencias nuevas, sin cambiar la estructura del proyecto y usando placeholders `$1`, `$2` para prevenir SQL Injection.
```

**Auto-chequeo de las 5 partes EFSI** (marcá lo que incluiste):
- [x] Rol
- [x] Contexto (¿pegaste código del proyecto?)
- [x] Tarea
- [x] Restricciones
- [x] Iteración

**Qué me devolvió (resumen):**
```
La IA me entregó un repository base con todas las funciones CRUD, siguiendo la estructura de cursos-repository.js y utilizando consultas parametrizadas con pool.query y placeholders $1, $2, etc.
```

**¿Me sirvió tal cual, o tuve que corregir/repreguntar?**
```
No me sirvió tal cual. Tuve que corregir el updateAsync, porque tenía una lógica estática que no contemplaba un payload incompleto y podía sobrescribir campos existentes con null.
```

### Prompt #2

**Lo que escribí:**
```
El `updateAsync` que me pasaste está mal. Si el cliente manda por ejemplo solo `{ "carga_horaria": 5 }`, el método me pisa `nombre` con `null` o con un valor vacío.

Necesito que lo reescribas para que la actualización sea dinámica: solo incluya en el `SET` los campos que vienen definidos en el body, y que la consulta siga usando placeholders `$1`, `$2`, etc., para evitar SQL Injection.

Mantén el mismo estilo del proyecto y no agregues nuevas dependencias.
```

**Por qué necesité este segundo prompt** (qué falló o faltó en el anterior):
```
El primer prompt no contemplaba correctamente las actualizaciones parciales. El updateAsync podía sobrescribir campos que no habían sido enviados con null. Por eso necesité un segundo prompt para aclarar el problema y pedir una solución que actualizara únicamente los campos definidos en el body.
```

**Qué me devolvió (resumen):**
```
La IA me devolvió una versión corregida del updateAsync que construye dinámicamente la consulta según los campos enviados. Mantiene las consultas parametrizadas para evitar SQL Injection y permite actualizar parcialmente una materia sin modificar los campos que no fueron enviados.
```

### Prompt #3

**Lo que escribí:**
```
Ahora que el repository quedó bien, necesito la capa de servicio.

Generame `materias-service.js` siguiendo exactamente el patrón de `cursos-service.js`, pero apuntando a `MateriasRepository`. No agregues lógica extra ni validaciones complejas; solo delegá la lógica a la capa inferior.

Quiero los métodos: `getAllAsync`, `getByIdAsync`, `createAsync`, `updateAsync` y `deleteByIdAsync`.
```

**Qué me devolvió (resumen):**
```
La IA me devolvió un `materias-service.js` siguiendo el mismo patrón que `cursos-service.js`. El servicio actúa como intermediario entre el controller y el repository, delegando las operaciones CRUD al repositorio sin agregar lógica ni validaciones adicionales.
```

### Prompt #4

**Lo que escribí:**
```
Necesito ahora el controller de `materias`.

Tomá como referencia `cursos-controller.js` y armar el router con los endpoints: `GET /api/materias`, `GET /api/materias/:id`, `POST /api/materias`, `PUT /api/materias/:id` y `DELETE /api/materias/:id`.

Usá `StatusCodes` de `http-status-codes`, manejá errores con `try/catch`, y respetá el mismo criterio de respuestas: 200, 201, 404 y 400.
```

**Qué me devolvió (resumen):**
```
La IA me devolvió un controller para `materias` con los endpoints CRUD, siguiendo el patrón de `cursos-controller.js`. Utiliza `express.Router()`, `StatusCodes`, bloques `try/catch` y delega las operaciones al `MateriasService`.
```

**¿Me sirvió tal cual, o tuve que corregir/repreguntar?**
```
No me sirvió completamente tal cual. Tuve que revisar la estructura de las rutas porque después, al conectar el controller 
```
### Prompt #5

**Lo que escribí:**
```
Perfecto. Ahora conectá esta nueva ruta al servidor principal.

En `server.js`, importá el controller de `materias` y montalo con `app.use("/api/materias", MateriasController);` sin romper el resto de los endpoints de `alumnos` y `cursos`.

Además, revisá si el nombre del archivo `Materia` debería seguir el mismo estilo del proyecto para que no haya inconsistencias de imports.
```

**Qué me devolvió (resumen):**
```
La IA me devolvió una modificación de `server.js` que importa `MateriasController` y lo registra mediante `app.use('/api/materias', MateriasController)`, manteniendo los endpoints existentes de `alumnos` y `cursos`.
```

**¿Me sirvió tal cual, o tuve que corregir/repreguntar?**
```
No me sirvió tal cual. El controller que había generado anteriormente ya incluía `/api/materias` en sus rutas, por lo que al montarlo nuevamente con `app.use('/api/materias', ...)` el prefijo podía duplicarse. Lo corregí dejando las rutas del controller como `/` y `/:id`, y utilizando `server.js` para agregar el prefijo `/api/materias`.
```

---

## 3. 🔧 Qué hizo la IA y qué hice yo

Marcá esto **también en el código** con comentarios `// [IA]` y `// [YO]`. Acá resumilo:

| Archivo / función | Lo generó la IA | Lo modifiqué/escribí yo | Por qué |
|---|---|---|---|
| `src/repositories/materias-repository.js` | Estructura base de CRUD y SQL parametrizado | Corregí `updateAsync` para armar SQL dinámico y controlar campos vacíos | Para evitar que `nombre` o `carga_horaria` se pisaran con valores indefinidos |
| `src/services/materias-service.js` | Métodos de negocio y delegación al repository | Ajusté el nombre de las propiedades y dejé el estilo consistente con `cursos-service.js` | Para mantener compatibilidad con el patrón del proyecto |
| `src/controllers/materias-controller.js` | Endpoints CRUD completos con status codes | Reforcé validación del `id` del body vs URL y dejé mensajes consistentes | Para que el PUT y el DELETE sigan el mismo patrón que `alumnos-controller.js` |
| `src/server.js` | Importación del controller y montaje de `/api/materias` | Revisé el orden y la conexión final | Para que la API quede expuesta correctamente |
| `src/entities/Materia.js` | La clase base | Ajusté la naming para que sea consistente con el resto del repo | Para evitar inconsistencias en Linux/macOS y mantener el patrón |

---

## 4. 🐛 Errores o cosas mal que detecté en la respuesta de la IA

> Si ponés "ninguno", probablemente no las viste. **Siempre** hay algo (un import de más, un estilo distinto, un caso borde olvidado, una mala práctica de seguridad).

```
El error principal fue en `updateAsync`: la IA me dio una versión que hacía `UPDATE materias SET nombre = $1, carga_horaria = $2` con valores fijos. Eso rompe si el cliente manda solo uno de los dos campos, porque el otro queda en null.

También hubo un detalle de estilo: la IA generó la entidad con `Materia` en mayúscula, mientras el resto del proyecto usa nombres del estilo `Alumno` y `Curso` en archivos `alumno.js` y `curso.js`, aunque el nombre de clase en sí puede mantenerse con mayúscula. Lo revisé para no dejar una folder inconsistente.

Finalmente, la IA a veces suele dar respuestas demasiado genéricas si no se le aclara el patrón exacto del repo; por eso insistí en basarme en el estilo de `cursos` y en mantener `this.db.queryAll/queryOne/...`.
```

---

## 5. ✅ Verificación

Pegá el checklist de verificación del ejercicio y marcá lo que comprobaste **vos** (con qué evidencia: captura de Postman, salida de `npm test`, número de ms, etc.).

```
[ ] El repository delega el acceso a datos en la clase `DbPg` (`this.db.queryAll/queryOne/...`), igual que `alumnos-repository.js`.
[x] Sí. Verifiqué que `materias-repository.js` mantiene el mismo patrón de acceso a datos que el resto del proyecto.

[ ] Las queries usan placeholders `$1, $2...` (no concatenación de strings).
[x] Sí. Verifiqué que las consultas utilizan parámetros (`$1`, `$2`, etc.), incluyendo el `updateAsync` dinámico.

[ ] El controller devuelve los status codes correctos: 200, 201 en POST, 404 cuando no existe, 400 en error de input.
[x] Sí. Revisé el controller y los endpoints utilizan los `StatusCodes` correspondientes.

[ ] El `update` valida que el `id` de la URL coincida con el del body.
[x] Sí. Verifiqué que el `PUT` controla la correspondencia entre el `id` de la URL y el del body.

[ ] El controller está registrado en `server.js` y los 5 endpoints responden.
[ ] No pude verificarlo mediante pruebas de API, ya que no realicé pruebas con Postman o Thunder Client.

[ ] No aparecieron dependencias nuevas en `package.json`.
[x] Sí. No agregué ninguna dependencia nueva.

Evidencia de verificación:
- `node --check src/server.js`
- `node --check src/repositories/materias-repository.js`
- `node --check src/services/materias-service.js`
- `node --check src/controllers/materias-controller.js`

Resultado: los archivos pasaron correctamente la validación de sintaxis. No se realizaron pruebas de los endpoints mediante Postman, Thunder Client u otra herramienta.
```

---

## 6. ✍️ Reflexión (300–600 palabras)

Cubrí: qué proceso seguiste, qué decisiones tomaste y por qué, qué aprendiste, y —lo más importante— **qué corregiste de lo que te dio la IA**. Escribí con tus palabras; esto se contrasta con el oral.

```
Para este ejercicio, decidí seguir el patrón que ya tenía el proyecto en `alumnos` y `cursos`, en lugar de crear una estructura diferente. Primero analicé cómo estaban organizadas las capas de repository, service y controller, y después utilicé la IA para generar cada archivo manteniendo ese mismo estilo. En los prompts intenté especificar el contexto, las tareas y las restricciones para que la respuesta se adaptara al proyecto y no agregara dependencias o lógica innecesaria.

Uno de los problemas más importantes que detecté fue el `updateAsync` del repository. La primera versión utilizaba una consulta estática que actualizaba todos los campos al mismo tiempo. Esto podía generar problemas si el cliente enviaba solamente uno de los campos, porque el otro podía ser sobrescrito con `null` o con un valor no enviado. Por eso hice un segundo prompt explicando el problema y pedí que la consulta se construyera dinámicamente utilizando únicamente los campos definidos en el body. De esta forma, se pueden realizar actualizaciones parciales manteniendo los placeholders para evitar SQL Injection.

Después utilicé la IA para generar el service y el controller siguiendo los archivos de referencia del proyecto. En el controller revisé especialmente los códigos de estado y el manejo de errores. También detecté un problema al conectar el controller con `server.js`: el controller ya tenía el prefijo `/api/materias` en sus rutas y el servidor volvía a agregarlo mediante `app.use("/api/materias", ...)`. Esto podía provocar que las rutas quedaran duplicadas. Lo solucioné haciendo que el controller utilice rutas relativas como `/` y `/:id`, dejando que `server.js` agregue el prefijo.

Finalmente, verifiqué la sintaxis de los archivos utilizando `node --check`, aunque no llegué a realizar pruebas de los endpoints mediante Postman o Thunder Client. Esto también me permitió entender que una validación de sintaxis no significa que la API esté completamente probada. El ejercicio me mostró que la IA puede ahorrar tiempo generando código, pero es necesario revisar sus respuestas, detectar errores y adaptarlas al proyecto antes de utilizarlas.
```

---

## 7. 🔗 Adjuntos

- [ documents\conversacionxd.txt] Link/PDF de la conversación completa con la IA
- [ ] Commit(s) en GitHub: `feat: implementacion de entidad materias, CRUD completo y pruebas de API`
- [ documents\image.png] Capturas / evidencias de verificación
