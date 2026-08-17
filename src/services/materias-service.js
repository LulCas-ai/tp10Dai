import MateriasRepository from '../repositories/materias-repository.js';

export default class MateriasService {
    constructor() {
        this.MateriasRepository = new MateriasRepository();
    }

    getAllAsync = async () => {
        const returnArray = await this.MateriasRepository.getAllAsync();
        return returnArray;
    }

    getByIdAsync = async (id) => {
        const returnEntity = await this.MateriasRepository.getByIdAsync(id);
        return returnEntity;
    }

    createAsync = async (entity) => {
        const rowsAffected = await this.MateriasRepository.createAsync(entity);
        return rowsAffected;
    }

    updateAsync = async (id, entity) => {
        const rowsAffected = await this.MateriasRepository.updateAsync(id, entity);
        return rowsAffected;
    }

    deleteByIdAsync = async (id) => {
        const rowsAffected = await this.MateriasRepository.deleteByIdAsync(id);
        return rowsAffected;
    }
}