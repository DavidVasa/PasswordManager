const createApp = require('./app');
const { APP_HOST, APP_PORT } = require('./config/config');
const { vault, authState } = require('./di');

const app = createApp({ vault, authState });

app.listen(APP_PORT, APP_HOST, () => {
  console.log(`PasswordManager běží na http://${APP_HOST}:${APP_PORT}`);
});
