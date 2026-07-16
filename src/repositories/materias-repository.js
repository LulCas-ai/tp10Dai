import { DBConfig } from '../configs/db-config.js'; // [IA] Importación estándar del proyecto base

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