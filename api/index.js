const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');
const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = 'stafsahjbsnuyvubisnydbioynsaybqu';

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
// serve all the static files from uploads directry
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://chitranxshi:lNzZHO3ocuBWQCW7@cluster0.h5w2oja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt)
        });
        res.json(userDoc);
    } catch(e) {
        console.log(e);
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    if(!userDoc) {
        return res.status(400).json('User not found.');
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk) {
        // logged in
        // respond with json web token
        jwt.sign({username, id: userDoc._id}, secret, {}, (err, token) => {
            if(err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        });
    } else {
        // not logged in
        res.status(400).json('Wrong credentials.')
    }
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
    // res.json(req.cookies);
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

// to grab the file (image), we'll need the library - multer
app.post('/post', uploadMiddleware.single('postImage'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        // saving everything from the payload to our database
        const {title, originalWriter, content} = req.body;
        try {
            const postDoc = await Post.create({
                title,
                originalWriter,
                content,
                cover: newPath,
                author: info.id,
            });
            res.json(postDoc);
        } catch (error) {
            console.error("Error creating post:", error);
            res.status(500).json({ error: 'Error creating post' });
        }
    });
});

app.put('/post', uploadMiddleware.single('postImage'), async (req, res) => {
    console.log("Received PUT request to /post");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    try {
        let newPath = null;
        if(req.file) {
            // res.json({test: 4, fileIs: req.file});
            console.log("Processing file upload");
            const {originalname, path} = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            newPath = path + '.' + ext;
            fs.renameSync(path, newPath);
            console.log("File renamed to:", newPath);
        }
    
        const {token} = req.cookies;
        console.log("Token from cookies:", token);

        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                console.error("JWT verification error:", err);
                return res.status(401).json({error: 'Unauthorized'});
            };
            console.log("JWT verified successfully. User info:", info);

            const {id, title, originalWriter, content} = req.body;
            console.log("Post details:", {id, title, originalWriter, content});

            try {
                const postDoc = await Post.findById(id);
                if (!postDoc) {
                    console.log("Post not found with id:", id);
                    return res.status(404).json({error: 'Post not found'});
                }
                console.log("Found post:", postDoc);

                const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
                console.log("Is author:", isAuthor);
                // res.json({isAuthor, postDoc, info});
    
                if(!isAuthor) {
                    return res.status(403).json('You are not the author of this post.');
                }
    
                const updateResult = await Post.updateOne({_id: id}, {
                    title,
                    originalWriter,
                    content,
                    cover: newPath ? newPath : postDoc.cover,
                });
                console.log("Update result:", updateResult);
    
                // await postDoc.save();
                res.json({message: 'Post updated successfully', post: postDoc});
            } catch(error) {
                console.error("Error updating post:", error);
                res.status(500).json({error: 'Error updating post'});
            }
        });
    } catch(error) {
        console.error("Error in /post PUT route:", error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/posts', async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({createdAt: -1})    // to sort posts such that most recent is on top
            // .limit(20)                // limit to 20 latest posts
    );
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);  // only send userna,e from author, no password
    res.json(postDoc);
});

app.delete('/post/:id', async (req, res) => {
    const {id} = req.params;
    const {token} = req.cookies;

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        try{
            const postDoc = await Post.findById(id);
            if(!postDoc) {
                return res.status(404).json('Post not found');
            }

            const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
            if(!isAuthor) {
                return res.status(403).json('You are not the author of this post.')
            }

            await Post.findByIdAndDelete(id);
            res.json('Post deleted successfully');
       
        } catch(error) {
            console.log("Error deleting post: ", error);
            res.status(500).json({error: 'Error deleting post'});
        }
    })
});


// global error handler to your Express app to catch any unhandled errors
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});


// app.listen(4000);

app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
