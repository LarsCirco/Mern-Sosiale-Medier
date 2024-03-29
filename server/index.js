import express  from "express";
import bodyParser from "body-parser";
import mongoose  from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path"
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import {register} from "./controllers/auth.js";

/* configuration */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json)
app.use(helmet());
app.use(helmet.crossOriginOpenerPolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname,'public/assets')));

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, file.originalname);
    },
})
const upload = multer({storage})

app.post("/auth/register", upload.single("picture"), register);

/* routes*/
app.use("/auth", authRoutes);

const PORT = process.env.port || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    app.listen(PORT,() => console.log(`server port : ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));