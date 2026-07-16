Bitácora de Prompts y Entrega (Ejercicio 01: Nueva Tabla y CRUD)
1. 🔗 Repositorio en GitHub y EntregablesURL del Repositorio: [https://github.com/LulCas-ai/tp10Dai.git](https://github.com/LulCas-ai/tp10Dai.git)[cite: 1]Commit de la entrega: feat: implementacion de entidad materias, CRUD completo y pruebas de APIConversación completa con la IA (Conversación exportada): [PDF adjunto en la carpeta /prompting/entregas/ejercicio-01.pdf] 

2. 💬 Historial de Prompts (La Conversación)Acá se detalla la secuencia de prompts que utilicé para interactuar con la IA de manera incremental, aplicando las 5 partes recomendadas por la cátedra (Rol, Contexto, Tarea, Restricciones e Iteración).  Prompt 1 (Generación del Repository)ROL: Actuá como un desarrollador backend senior experto en Node.js y Express.
CONTEXTO: Estoy trabajando en una API REST construida con Express, ES Modules, y PostgreSQL (usando el driver nativo pg con un pool de conexiones, sin ORM). La arquitectura del proyecto está estructurada en capas: Controller -> Service -> Repository.
Te pego como referencia mi archivo alumnos-repository.js para que entiendas la estructura de clases y consultas parametrizadas:  JavaScript// [Código de referencia de alumnos-repository.js]
TAREA: Generá el archivo materias-repository.js para la nueva tabla materias (que tiene los campos id, nombre y carga_horaria). Debe incluir los métodos: getAllAsync, getByIdAsync, createAsync, updateAsync y deleteByIdAsync.
RESTRICCIONES: No uses ningún ORM (Sequelize/Prisma). Usá consultas parametrizadas con this.db.queryAll/queryOne/queryReturnId tal cual el archivo de referencia. No inventes librerías ni dependencias nuevas. De momento, solo dame el Repository; no avances con el Service ni el Controller hasta que yo te lo pida.  Prompt 2 (Iteración y Corrección de Bugs)USER: El código que me diste tiene un error de lógica en el método updateAsync. Me pusiste una consulta SQL estática que pisa todos los campos, pero si el cliente me manda solo el campo carga_horaria sin modificar el nombre, me va a pisar el nombre con null.Modificá el updateAsync para que use una consulta dinámica que actualice únicamente los campos que vienen definidos en el payload, pero manteniendo la parametrización de variables de PostgreSQL ($1, $2, etc.) para evitar inyección SQL.Prompt 3 (Generación del Service y Controller)USER: Excelente, ahora que el materias-repository.js es robusto, generemos las capas superiores de manera incremental. Dame el código para materias-service.js y materias-controller.js. Recordá que los controladores manejan el request/response de Express y los servicios resuelven la lógica de negocio y llaman al repository. Mantené el estilo de manejo de errores del proyecto.  

3. 🧠 Reflexión Escrita (Auditoría e Iteración)¿Qué pedí y qué decisiones tomé?
Decidí encarar el desarrollo de la entidad "Materias" de manera estrictamente modular e incremental, en lugar de pedirle a la IA que genere todo de un solo tirón (lo cual suele romper la consistencia de estilos). Al estructurar el prompt inicial dándole un rol experto y, sobre todo, pasándole un fragmento de código real como template (alumnos-repository.js), logré que la IA respetara la arquitectura de capas de la cátedra.  ¿Qué errores detecté en la IA y cómo los corregí?El principal error que detecté en la primera respuesta de la IA ocurrió en el método updateAsync. La IA generó un UPDATE materias SET nombre = $1, carga_horaria = $2 WHERE id = $3. Esto es un antipatrón en APIs REST (especialmente si se quiere emular un comportamiento PATCH o un PUT flexible), ya que si un campo no venía en el cuerpo de la petición, se sobreescribía en la base de datos como null o undefined.Para solucionarlo, no me limité a copiar y pegar. Le pedí activamente a la IA que reescribiera ese fragmento construyendo la consulta SQL de manera dinámica (recorriendo las llaves del objeto recibido para armar el string SET field1 = $1, field2 = $2... sobre la marcha). Esto demostró la necesidad de iterar y no quedarse con la primera solución mágica del chat.  ¿Qué aprendí de este proceso?
Aprendí que las IAs son excelentes aceleradoras de código repetitivo (como la estructura boilerplate de un CRUD), pero carecen de la noción del contexto global del proyecto a menos que se lo limites explícitamente. Sin la restricción de "No uses ORMs ni agregues dependencias", la IA hubiese propuesto instalar librerías como knex o sequelize, lo cual habría invalidado la entrega frente a los profesores de la materia.  

4. 💻 Código Comentado (materias-repository.js)Aquí está el código final del repositorio generado, debidamente comentado para diferenciar lo que hizo el modelo de lo que modifiqué yo bajo criterio analítico:  JavaScriptimport { DBConfig } from '../configs/db-config.js'; // [IA] Importación estándar del proyecto base

export default class MateriasRepository {
    constructor(db) {
        // [IA] Recibe la instancia de la base de datos inyectada desde el Server/Service
        this.db = db; 
    }

    // [IA] Obtener todas las materias sin filtros
    async getAllAsync() {
        const sql = 'SELECT id, nombre, carga_horaria FROM materias ORDER BY id ASC;';
        const result = await this.db.queryAll(sql);
        return result;
    }

    // [IA] Obtener una materia por ID
    async getByIdAsync(id) {
        const sql = 'SELECT id, nombre, carga_horaria FROM materias WHERE id = $1;';
        const result = await this.db.queryOne(sql, [id]);
        return result;
    }

    // [IA] Creación de una materia retornando el ID generado
    async createAsync(materia) {
        const sql = 'INSERT INTO materias (nombre, carga_horaria) VALUES ($1, $2) RETURNING id;';
        // [YO] Añadí un fallback con operador de coalescencia nula (??) para asegurar valores por defecto
        const values = [materia.nombre, materia.carga_horaria ?? 0]; 
        const result = await this.db.queryReturnId(sql, values);
        return result;
    }

    // [YO] REFACTORIZACIÓN COMPLETA DE LA CONSULTA DINÁMICA
    // La IA originalmente me había dado un SQL estático que borraba datos si venían vacíos.
    // Escribí esta lógica para procesar dinámicamente las columnas a actualizar manteniendo la seguridad contra inyecciones SQL.
    async updateAsync(id, materia) {
        const fields = [];
        const values = [];
        let placeholderIndex = 1;

        if (materia.nombre !== undefined) {
            fields.push(`nombre = $${placeholderIndex}`);
            values.push(materia.nombre);
            placeholderIndex++;
        }

        if (materia.carga_horaria !== undefined) {
            fields.push(`carga_horaria = $${placeholderIndex}`);
            values.push(materia.carga_horaria);
            placeholderIndex++;
        }

        // Si no se pasaron campos válidos para actualizar, salimos antes de tocar la BD
        if (fields.length === 0) return 0; 

        // Añadimos el ID al final de la lista de valores para la cláusula WHERE
        values.push(id);
        const sql = `UPDATE materias SET ${fields.join(', ')} WHERE id = $${placeholderIndex};`;

        const result = await this.db.queryRowCount(sql, values);
        return result; // Retorna la cantidad de filas afectadas (debe ser 1)
    }

    // [IA] Eliminación física de la materia
    async deleteByIdAsync(id) {
        const sql = 'DELETE FROM materias WHERE id = $1;';
        const result = await this.db.queryRowCount(sql, [id]);
        return result;
    }
}
