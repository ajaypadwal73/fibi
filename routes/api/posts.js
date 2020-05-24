const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
    res.json({
        msg: "Post route works"
    })
})

module.exports = router