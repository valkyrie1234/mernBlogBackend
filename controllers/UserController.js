import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



import UserModel from '../models/User.js'


export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(8)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        });

        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id,
        },
            'secretQwe',
            {
                expiresIn: '2d'
            },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        })
    }
} //registration


export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({
                message: 'Пользователя не найден'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин/пароль'
            })
        }


        const token = jwt.sign({
            _id: user._id,
        },
            'secretQwe',
            {
                expiresIn: '2d'
            },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        })
    }
} //login

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const { passwordHash, ...userData } = user._doc;

        res.json(userData);

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            message: 'Нет доступа'
        })
    }
}


export const updateUserInfo = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findOneAndUpdate({
            _id: userId,
        },{
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            email: req.body.email,
        },{
            returnDocument: 'after'
        })

        res.json(user)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось обновить информацию"
        })
    }
}