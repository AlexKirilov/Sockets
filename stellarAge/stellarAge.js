const express = require('express');
const stellarRouter = express.Router();
const StellarModel = require('./stellarAgeModel');

stellarRouter.get('/', async(req, res) => {
    const by = {};

    StellarModel.find({})
        .exec()
        .then(data => {
            res.status(200).send(data);
        });
});

stellarRouter.post('/', async(req, res) => {
    let data = req.body;
    const isUserExist = await StellarModel.find({ username: data.username });
    if (isUserExist.length === 0) {
        let rallyData = new StellarModel(data);
        rallyData.save().then(() => {
            res.status(200).send(variables.successMsg.update);
        });
    } else {
        StellarModel.findOneAndUpdate({ username: data.username }, data)
            .then(() => {
                res.status(200).send('Send');
            });
    }
});

stellarRouter.post('/remove', (req, res) => {
    let data = req.body;
    StellarModel.deleteOne({ username: data.username }).then(() => {
        res.status(200).send('Delete');
    });
});

stellarRouter.delete('/', (req, res) => {
    StellarModel.deleteMany({})
        .then(() => {
            res.status(200).send('Delete All ');
        });
});

module.exports = stellarRouter;