const Model = require('../../models/role')

module.exports = async (req, res) => {
    try {
        const role = await Model.findById(req.params.id);
        if (!role) return res.status(404).json({ error: 'Role not found' });

        await role.remove();
        res.json({ message: 'Role removed' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}