import express from "express";

import {loadBackendBRBv1} from "./backend/backend-v1.js";

var app = express();

app.use("/", express.static("./public"));
app.use(express.json());

var port = process.env.PORT || 12345;



app.listen(port, () => {
    console.log(`Server ready in port ${port}`);
  });


loadBackendBRBv1(app);