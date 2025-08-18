class SchoolController {
    constructor(schoolModel) {
        this.schoolModel = schoolModel;
    }

    async addSchool(req, res) {
        const { name, address, latitude, longitude } = req.body;

        if (!name || !address || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (typeof name !== 'string' || typeof address !== 'string' || 
            isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ message: 'Invalid data types.' });
        }

        try {
            const result = await this.schoolModel.createSchool(name, address, parseFloat(latitude), parseFloat(longitude));
            return res.status(201).json({ message: 'School added successfully.', id: result.insertId });
        } catch (error) {
            return res.status(500).json({ message: 'Error adding school.', error: error.message });
        }
    }

    async listSchools(req, res) {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'User latitude and longitude are required.' });
        }

        try {
            const schools = await this.schoolModel.getAllSchools();
            const userLat = parseFloat(latitude);
            const userLon = parseFloat(longitude);
            
            const schoolsWithDistance = schools.map(school => ({
                ...school,
                distance: this.calculateDistance(userLat, userLon, school.latitude, school.longitude)
            }));
            
            schoolsWithDistance.sort((a, b) => a.distance - b.distance);
            return res.status(200).json(schoolsWithDistance);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving schools.', error: error.message });
        }
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.degreesToRadians(lat2 - lat1);
        const dLon = this.degreesToRadians(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
}

module.exports = SchoolController;