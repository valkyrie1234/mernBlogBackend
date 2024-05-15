import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';


import { PostController, UserController } from './controllers/index.js';
import { registerValidation } from './validations/auth.js';
import { loginValidation } from './validations/login.js';
import { postCreateValidation } from './validations/post.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { postCreateComments } from './validations/comments.js';




mongoose.connect('mongodb+srv://Admin:qwerty123@cluster0.lasasmm.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('DB is ok')
    }).catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});


const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login); //login
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);//register
app.get('/auth/me', checkAuth, UserController.getMe); // aito auth

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
});

app.get('/post/popular', PostController.getPopularPosts)

app.post('/post', checkAuth, postCreateValidation, handleValidationErrors, PostController.create); //create post
app.get('/post', PostController.getAll); // get all posts
app.get('/tags', PostController.getLastTags); // get last tags
app.get('/post/:id', PostController.getOne); // get one post
app.delete('/post/:id', checkAuth, PostController.remove); // remove post
app.patch('/post/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update); //update post
app.patch('/comment/post/:id', checkAuth, postCreateComments, PostController.updateComment) // update comment 
app.patch('/profile/user/:id', checkAuth, registerValidation, UserController.updateUserInfo)
app.get('/post/search/:title', PostController.getSearchedPosts) // get Searched posts 

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('server ok')
});