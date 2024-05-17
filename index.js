require('dotenv').config()
const cors = require('cors')
require('./db/config')
const Todos = require('./db/todolist')
const User = require('./db/users')
const authMiddleware = require('./middleware/auth')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 6060
const app = express()
app.use(express.json())
app.use(cors())

app.post('/sign-up', async (req, resp) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        resp.status(201).json({ token, username: user.username });
    } catch (error) {
        resp.status(401).send(error.message);
    }
});
app.post('/login', async (req, resp) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return resp.status(404).send("User not found");
        }

        const passwordValidity = await bcrypt.compare(password, user.password);
        if (!passwordValidity) {
            return resp.status(401).send("Invalid Password");
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        console.log("Username:", user.username); 

        
        resp.json({ token, username: user.username });
    } catch (error) {
        resp.status(500).send(error.message);
    }
});



app.post('/add-todo', authMiddleware, async(req, resp) =>{
    try{
        const {title, description} = req.body
    let todo = new Todos({title, description, userId: req.userId})
    await todo.save()
    resp.status(201).send("Todo created successfully")
    }
    catch(error){
        resp.status(400).send(error.message)
    }
    
})

app.delete('/remove-todo/:id', authMiddleware, async(req, resp) => {
    try{
        console.log(req.params.id)
        await Todos.findByIdAndDelete(req.params.id)
        resp.status(204).send("Todo deleted successfully")

    }
    catch(error){
        resp.status(400).send(error.message)
    }
})

app.get('/todos', authMiddleware, async(req, resp)=> {
    try{
        const todos = await Todos.find({userId: req.userId})
        resp.json(todos)
    }
    catch(error){
        resp.status(500).send(error.message)
    }
})

app.get('/search-todo/:id', async (req, resp) => {
    try {
        let todo = await Todos.findOne({ _id: req.params.id });
        if (todo) {
            resp.send(todo);
        } else {
            resp.send({ result: "no record found" });
        }
    } catch (error) {
        resp.status(500).send(error.message);
    }
});

app.put('/update-todo/:id', authMiddleware, async (req, res) => {
    try {
        const { title, description, completed } = req.body;
        const updatedTodo = await Todos.findByIdAndUpdate(req.params.id, { title, description, completed }, { new: true });
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(PORT)

