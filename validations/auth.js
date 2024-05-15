import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Длина пароля не должна быть меньше 6 символов').isLength({ min: 6 }),
    body('fullName', 'Длина фамилии не должна быть короче 3 символов').isLength({ min: 3 }),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];