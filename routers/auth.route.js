const { Router } = require('express')
const User = require('../models/User')
const jwt = require("jsonwebtoken")
const config = require('config')
const router = Router()
const bcrypt = require("bcryptjs")
const { check, validationResult } = require("express-validator")

router.post('/registration',
    [
        check('email', "Указан некорректный email").isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Некорректные данные при регистрации", errors })
            }

            const { email, password } = req.body;

            console.log(req.body)

            const candidate = await User.findOne({ email })

            if (candidate) {
                return res.status(400).json({ message: `Пользователь с таким email уже существует!` })
            }

            const hashPassword = await bcrypt.hash(password, 12)
            const user = new User({ email, password: hashPassword })
            await user.save()

            res.status(201).json({ message: "Пользователь успешно создан" })

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
        }
    })


router.post('/login',
    async (req, res) => {
        try {

            const { email, password } = req.body;

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ message: `Пользователь не найден` })
            }

            const isMatch = await bcrypt.compare(password, user.password)
            
            if(!isMatch){
                return res.status(400).json({ message: `Введены некорректные данные` })
            }

            const token = jwt.sign(
                {id: user.id},
                config.get('secretKey'),
                {expiresIn: "1h"}  
                )

            res.json({
                token, 
                userId: user.id
            })
        } 
        catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
        }
    })






module.exports = router


