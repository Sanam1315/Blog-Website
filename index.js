import express from "express";
import { LocalStorage } from "node-localstorage";
import fs from "fs"; // for using file system manipulation functions
import path from "path"; // joins two paths
import 'dotenv/config'
const app = express();
const PORT = process.env.PORT || 3000;
const localStorage = new LocalStorage("./Data");
const directory = "./Data";

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  const allData = fs.readdirSync(directory).map((file) => {
    const content = fs.readFileSync(path.join(directory, file), "utf8");
    return JSON.parse(content);
  });
  if (allData.length > 0) {
    res.render("index.ejs", { data: allData, key: true });
  } else {
    res.render("index.ejs", { error:"No post yet !!!", key: true });
  }
});

app.post("/edit", (req, res) => {
  const allData = fs.readdirSync(directory).map((file) => {
    const content = fs.readFileSync(path.join(directory, file), "utf8");
    return JSON.parse(content);
  });
  const obj = allData.filter((data) => data.title === req.body.submit);  
  res.render("index.ejs", { data: obj[0], key: false });
});

app.post("/delete", (req, res) => {
  const allData = fs.readdirSync(directory).map((file) => {
    const content = fs.readFileSync(path.join(directory, file), 'utf8');
    return JSON.parse(content);
  })
  allData.forEach((data) => {
    if (data.title = req.body.submit) {
      localStorage.removeItem(req.body.submit)
    }
  })  
  res.redirect('/')
})

app.post('/edited', (req, res) => {
    const allData = fs.readdirSync(directory).map((file) => {
        const content = fs.readFileSync(path.join(directory, file), "utf8");
        return JSON.parse(content);
    });
  const realItem = allData.filter(item => item.title === req.body.title)  
    const obj = {
      title: realItem[0].title,
      content: req.body.content || realItem[0].content,
      image_url: req.body.image_url || realItem[0].image_url,
      author: req.body.author || realItem[0].author,
      date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    };
    
    allData.forEach((item) => {
        
        if (item.title === req.body.submit) {
        localStorage.setItem(req.body.submit, JSON.stringify(obj));
      }
    });
    res.redirect('/')
})

app.get('/post', (req, res) => {
    res.render('post.ejs')
})
app.post("/post", (req, res) => {
  
  const allData = fs.readdirSync(directory).map((file) => {
    const content = fs.readFileSync(path.join(directory, file), "utf8");
    return JSON.parse(content);
  });
  const obj = {
    title: req.body.title,
    content: req.body.content,
    image_url: req.body.image_url || null,
    date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    author: req.body.author,
  };

  allData.forEach((item) => {
    if (item.title === req.body.submit) {
      localStorage.setItem(`${item.title}`, JSON.stringify(item));
      res.render("index.ejs",{data:allData,key:true});
    }
});
localStorage.setItem(`${obj.title}`, JSON.stringify(obj));
res.redirect('/');
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});