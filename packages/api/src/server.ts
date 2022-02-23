import { app } from './app';

const port: number = Number(process.env.PORT) || 3030;

app.listen(port);
