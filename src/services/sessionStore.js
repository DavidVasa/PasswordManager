const { randomUUID } = require('crypto');

const sessions = new Map(); // sid -> { key, createdAt }

function createSession(key) {
  const sid = randomUUID();
  sessions.set(sid, { key, createdAt: Date.now() });
  return sid;
}

function getSession(sid) {
  return sessions.get(sid);
}

function destroySession(sid) {
  sessions.delete(sid);
}

module.exports = {
  createSession,
  getSession,
  destroySession
};
