import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Длина пароля не должна быть меньше 6 символов').isLength({ min: 6 }),
];