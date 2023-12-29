const express = require("express");
const fileUpload = require('express-fileupload');
const path = require("path");

const app = express();


app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")));
app.use(fileUpload());

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});
const port = process.env.PORT || 3003; 
app.listen(port, () => console.log(`Server running...${port}`));