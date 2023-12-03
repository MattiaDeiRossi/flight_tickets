import { startDB } from "./db";
import { app } from "./app";

const HOST = process.env.HOST
const PORT = process.env.PORT

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
