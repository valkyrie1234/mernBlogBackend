import { body } from 'express-validator';

export const postCreateComments = [
    body('comment', 'Введите комментарий').isLength({min: 3}).isString(),
];