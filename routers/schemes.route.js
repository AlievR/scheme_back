const { Router } = require('express')
const fs = require('fs')
const schems_lists = require('../models/system_schema')
const upload = require('../midleware/uploads')
const convert = require('../midleware/convert')
const router = Router()


//Добавление одного файла
router.post('/:id', upload.single('file'), async (req, res) => {
    try {

        let filedata = req.file;
        if (!filedata) {
            return res.status(500).json({ message: 'Данный формат файла не поддерживается!' })
        }

        const size = convert(req.file.size)
        const name = req.file.originalname

        const candidat_name = await schems_lists.findOne(
            { name: name, id_group: req.params.id },
            (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Возникла непредвиденная ошибка при получении файлов' })
                }
            })
        if (candidat_name) {
            return res.status(400).json({ message: 'Файл с таким именем уже существует!' })
        }

        const system = new schems_lists({
            name: req.file.originalname,
            fileSrc: req.file.path,
            id_group: req.params.id,
            size: size
        })

        system.save().then(() => {
            return res.status(201).json({ message: 'Файл успешно добавлен!' })
        }
        )
    }
    catch {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
    }
});


// Список всех файлов по id_group в json
router.get('/:id', async (req, res) => {
    try {
        const schemes_lists = await schems_lists.find(
            { id_group: req.params.id },
            (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Возникла непредвиденная ошибка при получении файлов' })
                }
            })
        res.status(201).json(schemes_lists)
    }
    catch {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
    }
});


// Скачивание файла
router.get('/schema/:id', async (req, res) => {
    try {
        const system_schema = await schems_lists.findById(req.params.id, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Возникла непредвиденная ошибка при получении объекта!' })
            }
        })
        const { fileSrc } = system_schema
        res.download(fileSrc)
    }
    catch {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
    }
});


//удаление файла
router.delete('/schema/:id', async (req, res) => {
    try {

        const { fileSrc } = req.body

        const system = await schems_lists.deleteOne({
            _id: req.params.id
        }, (err) => {
            if (err) {
                return res.status(500).json({ message: 'При удалении данных возникла ошибка!' })
            }
            res.status(201).json({ message: 'Данный файл успешно удален' })
        })

        fs.unlink(fileSrc, (err) => {
            if (err) {
                return console.log(err)
            }
        })

    }
    catch {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
    }
});


// Редактирование имени файла
router.put('/schema/:id', async (req, res) => {
    try {

        const system = await schems_lists.updateOne({ _id: req.params.id }, { $set: req.body }, (err) => {
            if (err) {
                return res.status(500).json({ message: 'При обновлении данных возникла ошибка!' })
            }
            res.status(201).json({ message: 'Данный файл успешно изменен' })
        })
    }
    catch {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
    }
});



module.exports = router