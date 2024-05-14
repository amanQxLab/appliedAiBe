const Model = require('../../models/role')

module.exports = async (req, res) => {
    const { name, description, permissions } = req.body;
    try {
        const doc = new Model({ name, description, permissions });
        const role = await doc.save();
        res.json(role);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}