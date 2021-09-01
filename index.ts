import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// import  {mongoose}  from "./db/mongoose";
import { UserRoutes } from "./routes/user.routes";
import { addMeetingRoutes } from './routes/addMeeting.routes';

const app = express();
app.use(cors());

app.use(bodyParser.json());
const port = 3000;

//ALL ROUTES GOES HERE

app.use("/api", UserRoutes);
app.use("/api",addMeetingRoutes);

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
