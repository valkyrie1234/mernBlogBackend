import PostModel from '../models/Post.js';


export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.map((tag) => tag.trim()),
            user: req.userId,
            postImage: req.body.postImage,
            postComment: [],
        });

        const post = await doc.save();
        res.json(post)

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать пост',
        })
    }
};

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
            .map((obj) => obj.tags)
            .flat(Infinity)
            .slice();

        const uniqeTags = new Set(tags)

        res.json([...uniqeTags].reverse().slice(0, 5))


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить теги',
        })
    }
}



export const getAllPostsByTag = async (req,res) => {
    try {
        const tag = req.params.tag.trim();
        const postsByTags = await PostModel.find({
            'tags': {
                $all: [tag]
            }
        }).populate('user').exec()

        res.status(200).json(postsByTags)

    } catch (error) {
        console.log(error)
    }
}



export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').populate('postComment.user').exec();

        const lastPosts = posts.reverse()

        res.json(lastPosts)

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось найти пост',
        })
    }
}

export const getPopularPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        const popularPost = posts.filter((post) => post.viewsCount >= 20);

        res.json(popularPost)

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось найти пост',
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findOneAndUpdate({
            _id: postId,
        },
            {
                $inc: { viewsCount: 1 }
            },
            {
                returnDocument: 'after',
            },
        )

        const getOnePost = await PostModel.findById(postId).populate('user').populate({ path: 'postComment.user' }).exec()
        res.json(getOnePost)


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить пост',
        })
    }
}


export const remove = async (req, res) => {

    try {
        const postId = req.params.id

        await PostModel.findOneAndDelete({
            _id: postId,
        })

        res.json({
            message: 'Статья удалена'
        })

    } catch (error) {
        res.status(500).json({
            message: "Не удалось удалить статью"
        })
    }

}


export const update = async (req, res) => {
    try {
        const postId = req.params.id
        const post = await PostModel.findOneAndUpdate({
            _id: postId,
        },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            },
            {
                returnDocument: 'after',
            })

        res.json({
            success: true,
        })


    } catch (error) {
        res.status(500).json({
            message: "Не удалось обновить статью"
        })
    }
}


export const updateComment = async (req, res) => {
    try {
        const postId = req.params.id
        const comments = await PostModel.findById(postId)
        const commentPost = await PostModel.findOneAndUpdate({
            _id: postId,
        },
            {
                postComment: [...comments.postComment, {
                    user: req.userId,
                    comment: req.body.comment,
                }],

            })


        const userComment = await PostModel.findById(postId).populate({ path: 'postComment.user' }).exec()

        res.json(userComment)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось оставить коментарий"
        })
    }
}


export const getSearchedPosts = async (req, res) => {
    try {
        const titleSearch = req.params.title;

        const searchedPosts = await PostModel.find({
            title: {"$regex":`${titleSearch}` , "$options": "i" }
        }).populate('user').exec()

        

        res.json(searchedPosts)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Не удалось найти пост"
        })
    }
}