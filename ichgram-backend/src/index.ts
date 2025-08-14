import "dotenv/config";
import connectDatabase from "./db/connectDatabase";
import startServer from "./server";
import { startSocketServer } from "./socketServer"; 

const bootstrap = async () => {
  await connectDatabase();
  startServer();        
  startSocketServer();   
};

bootstrap();
