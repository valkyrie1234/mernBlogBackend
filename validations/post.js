import { body } from 'express-validator';

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'введите текст статьи').isLength({ min: 10 }).isString(),
    body('tags', 'неверный формат тегов (укажите массив)').optional().isArray(), 
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
    body('postImage', 'Неверная ссылка на изображение').optional().isArray(),
];

