const Model = require('../../models/role')

module.exports = async (req, res) => {
    try {
        const roles = await Model.find();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}