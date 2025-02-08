import dotenv from "dotenv";
import cors from "cors";
import express, { Request, Response } from 'express';
 


dotenv.config();
const app = express();

console.log(process.env.MONGO_URL);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected!"))
  .catch((error) => console.log(error.message));

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
  credentials: true, // Enable cookies and authentication headers
};


app.get('/api/cat', (_req, res) => {
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const now = Date.now();

    if (!cachedCatUrl || (now - lastFetched) > oneDay) {
        fetchCatImage().then(() => {
            res.json({ catUrl: cachedCatUrl });
        });
    } else {
        res.json({ catUrl: cachedCatUrl });
    }
});


app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());