const express = require("express");
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const Article = require("./models/Article");
const cors = require("cors");



dotenv.config();
const app = express();
app.use(cors())
app.use(express.json());

const databaseUrl = process.env.MONGODB_URL;

mongoose.connect(databaseUrl).then(() => {
    console.log("Connected to the database successfully");
}).catch((error) => {
    console.log("Error connecting to the database", error);
})


app.get("/hello-world", (req, res) => {
    res.send("Hello World")
});

app.get("/projects", (req, res) => {
    res.send({message: "You Visited Projects"})
})
app.get("/users", (req, res) => {
    res.send({message: "You Visited users"})
})
app.post("/posts", (req, res) => {
    res.send({
        users: [
            {name: "Eslam Hafez", age: 21},
            {name: "Nour Hafez", age: 20},
        ]
    })
})


app.get("/numbers", (req, res) => {
    let nums = "";
    for (let i = 1; i <= 100; i++) {
        nums += i + '\n'
    }
    if(nums) {
        res.send(`numbers: ${nums}`)
    }
})

app.get("/summation/:num1/:num2", (req, res) => {
    const { num1, num2 } = req.params
    res.send(`sum params: ${+num1 + +num2}`);
})


app.get("/sayHello", (req, res) => {
    const { name, age } = req.body
    res.send(`Your name is ${name} and your age is ${age} and your faculty is ${req.query.faculty}`)
})



app.get("/file", (req, res) => {
    res.render("hello.ejs", {
        name: "eslam"
    })
})

// articles endpoints

app.post("/articles", async (req, res) => {
    const newArticle = new Article(req.body)
    await newArticle.save()
    res.send(newArticle)
})

app.get("/articles", async (req, res) => {
    const newArticle = await Article.find()
    res.json(newArticle);
})

app.get("/articles/:id", async (req, res) => {
    const id = req.params.id;
    const article = await Article.findById(id)
    res.json(article)
})

app.get("/custom-articles", async (req, res) => {
    const articles = await Article.find({likes: {$lte: 10}})
    res.json(articles);
})
// $lte: 10:  is part of MongoDB query syntax means that this will look for documents are less than or equal to 10

app.delete("/articles/:id", async (req, res) => {
    try {
        const id = req.params.id
        const article = await Article.findByIdAndDelete(id)
        res.json(article)
        return;
    } catch (error) {
        console.error("Error while deleteing the document")
        return res.json(error)
    }
})
app.put("/articles/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const articleNewData = req.body;
        const updatedArticle = await Article.findByIdAndUpdate(id, articleNewData, { new: true })
        if(!updatedArticle) {
            return res.status(404).json({message: "Article not found !"})
        }
        res.json(updatedArticle)
    } catch (error) {
        console.error("Error while updateing the document", error)
        res.status(500).json({message: "Internal server error"})
    }
});



app.listen(8000, () => {
    console.log("server is running on localhost:8000")
})
