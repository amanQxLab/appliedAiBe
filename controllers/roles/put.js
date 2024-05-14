const Model = require('../../models/role')

module.exports = async (req, res) => {
    const { name, description, permissions } = req.body;
    try {
        const role = await Model.findById(req.params.id);
        if (!role) return res.status(404).json({ error: 'Role not found' });

        role.name = name || role.name;
        role.description = description || role.description;
        role.permissions = permissions || role.permissions;

        const updatedRole = await role.save();
        res.json(updatedRole);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}