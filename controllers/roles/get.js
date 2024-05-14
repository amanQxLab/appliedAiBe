const Model = require('../../models/role')

module.exports = async (req, res) => {
    try {
        const role = await Model.findById(req.params.id);
        if (!role) return res.status(404).json({ error: 'Role not found' });
        res.json(role);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}