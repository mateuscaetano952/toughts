const user = require('../models/User');
const Tought = require('../models/Tought');

module.exports.showToughts = (req, res) => {
    res.render('toughts/home')
};

