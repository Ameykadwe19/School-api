class SchoolModel {
    constructor(database) {
        this.database = database;
    }

    async createSchool(name, address, latitude, longitude) {
        const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
        const values = [name, address, latitude, longitude];
        return new Promise((resolve, reject) => {
            this.database.query(query, values, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    async getAllSchools() {
        const query = 'SELECT * FROM schools';
        return new Promise((resolve, reject) => {
            this.database.query(query, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
}

module.exports = SchoolModel;