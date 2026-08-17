import Db from './db-pg.js';

export default class MateriasRepository {
    constructor() {
        this.db = new Db();
    }

    getAllAsync = async () => {
        const sql = `SELECT * FROM materias ORDER BY id ASC`;
        return await this.db.queryAll(sql);
    }

    getByIdAsync = async (id) => {
        const sql = `SELECT * FROM materias WHERE id=$1`;
        return await this.db.queryOne(sql, [id]);
    }

    createAsync = async (entity) => {
        const sql = `INSERT INTO materias (nombre, carga_horaria) VALUES ($1, $2) RETURNING id`;
        const values = [
            entity?.nombre ?? '',
            entity?.carga_horaria ?? 0
        ];
        return await this.db.queryReturnId(sql, values);
    }

    updateAsync = async (id, materia) => {
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

        if (fields.length === 0) return 0;

        values.push(id);
        const sql = `UPDATE materias SET ${fields.join(', ')} WHERE id = $${placeholderIndex};`;

        return await this.db.queryRowCount(sql, values);
    }

    deleteByIdAsync = async (id) => {
        const sql = `DELETE FROM materias WHERE id=$1`;
        return await this.db.queryRowCount(sql, [id]);
    }
}