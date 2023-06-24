import express from "express";
import cors from "cors";

import {loadBackendBRBv1} from "./backend/backend-v1.js";
import { loadBackendBRBv2 } from "./backend/backend-v2.js";
import { handler } from "./frontend/build/handler.js";

var app = express();

app.use(cors());

app.use("/", express.static("./public"));
app.use(express.json());

var port = process.env.PORT || 12345;

loadBackendBRBv1(app);
loadBackendBRBv2(app);

app.use(handler);


app.listen(port, () => {
  console.log(`Server ready in port ${port}`);
});