// حسابات تجريبية بتتحفظ جوه المتصفح (localStorage)
// ملاحظة: ده للتجربة والتعلم بس. الحسابات بتفضل على نفس المتصفح ونفس العنوان،
// ومش بتتشارك بين الأجهزة. الحسابات الحقيقية محتاجة سيرفر وقاعدة بيانات.

(function () {
  var USERS_KEY = 'junior-code-users-v1';
  var SESSION_KEY = 'junior-code-session-v1';
  var ITERATIONS = 150000;

  var MESSAGES = {
    exists: 'This email is already registered. Try logging in instead.',
    bad: 'Email or password is incorrect.',
    storage: 'Your browser blocked saving data, so the account could not be saved.',
    crypto: 'Open this site from localhost or https so passwords can be protected.'
  };

  function fail(code) {
    var err = new Error(MESSAGES[code] || 'Something went wrong. Please try again.');
    err.code = code;
    return Promise.reject(err);
  }

  function normEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  // ===== التخزين =====
  function readUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch (e) { return {}; }
  }

  function writeUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function setSession(user) {
    try { localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, name: user.name })); } catch (e) {}
  }

  function currentUser() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
  }

  function logOut() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  // ===== تشفير الباسورد (مش بنخزن الباسورد نفسه أبدًا) =====
  function toB64(buffer) {
    var bytes = new Uint8Array(buffer);
    var s = '';
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }

  function fromB64(b64) {
    var s = atob(b64);
    var bytes = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
    return bytes;
  }

  function hashPassword(password, salt) {
    var subtle = window.crypto && window.crypto.subtle;
    if (!subtle) return fail('crypto');

    return subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
      .then(function (key) {
        return subtle.deriveBits(
          { name: 'PBKDF2', salt: salt, iterations: ITERATIONS, hash: 'SHA-256' },
          key,
          256
        );
      })
      .then(toB64);
  }

  // ===== إنشاء حساب =====
  function signUp(name, email, password) {
    if (!(window.crypto && window.crypto.subtle)) return fail('crypto');

    var key = normEmail(email);
    var users = readUsers();
    if (users[key]) return fail('exists');

    var salt = window.crypto.getRandomValues(new Uint8Array(16));

    return hashPassword(password, salt).then(function (hash) {
      users[key] = {
        name: String(name || '').trim(),
        salt: toB64(salt),
        hash: hash,
        created: new Date().toISOString()
      };
      try {
        writeUsers(users);
      } catch (e) {
        return fail('storage');
      }
    });
  }

  // ===== تسجيل الدخول =====
  function logIn(email, password) {
    var key = normEmail(email);
    var user = readUsers()[key];
    if (!user) return fail('bad');

    return hashPassword(password, fromB64(user.salt)).then(function (hash) {
      if (hash !== user.hash) return fail('bad');
      setSession({ email: key, name: user.name });
    });
  }

  window.JuniorAuth = {
    signUp: signUp,
    logIn: logIn,
    logOut: logOut,
    currentUser: currentUser
  };
})();
