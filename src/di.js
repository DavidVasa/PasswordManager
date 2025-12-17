const { ensureDataDir } = require('./utils/file');
const { DATA_DIR } = require('./config/config');
const VaultStore = require('./services/vaultStore');
const AuthState = require('./services/authState');

ensureDataDir(DATA_DIR);

const vault = new VaultStore();
const authState = new AuthState();

module.exports = {
  vault,
  authState
};
