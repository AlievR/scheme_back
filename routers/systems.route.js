const { Router } = require('express')
const System = require('../models/system_lists')
const router = Router()

router.post('/systems', async (req, res) => {
    try {

        const { name, gateway } = req.body

        if (name === "" | gateway === "") {
            return res.status(400).json({ message: 'Поле не может быть пустым' })
        }

        const candidat_name = await System.findOne({ name })
        const candidat_gateway = await System.findOne({ gateway })

        if (candidat_name) {
            return res.status(400).json({ message: 'Система с таким именем уже существует!' })
        }
        if (candidat_gateway) {
            return res.status(400).json({ message: 'Система с таким gateway уже существует!' })
        }
        const system = new System({
            name: name,
            gateway: gateway
        })

        system.save().then(() => {
            return res.status(201).json({ message: 'Система успешно добавлена!' })
        }
        )
    }
    catch {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
    }
});


router.get('/systems', async (req, res) => {
    try {
        const systems = await System.find((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Возникла непредвиденная ошибка при получении объектов!' })
                }
            })
            res.status(201).json(systems)
        
    }
    catch {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
    }
});


router.get('/systems/:id', async (req, res) => {
    try {
        const system = await System.findById(req.params.id, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Возникла непредвиденная ошибка при получении объекта!' })
                }
            })
            res.status(201).json(system)
    }
    catch {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
    }
});

router.delete('/systems/', async (req, res) => {
    try {
        const {_id} = req.body
        const system = await System.deleteOne({
            _id: _id
        }, (err) => {
            if (err) {
                return res.status(500).json({ message: 'При удалении данных возникла ошибка!' })
            }
            res.status(201).json({ message: 'Данный объект успешно удален' })
        })
    }
    catch {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
    }
});

router.put('/systems/:id', async (req, res) => {
    try {
        const system = await System.updateOne({ _id: req.params.id }, { $set: req.body }, (err) => {
            if (err) {
                return res.status(500).json({ message: 'При обновлении данных возникла ошибка!' })
            }
            res.status(201).json({ message: 'Данный объект успешно обновлен' })
        })
    }
    catch {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
    }
});

module.exports = router