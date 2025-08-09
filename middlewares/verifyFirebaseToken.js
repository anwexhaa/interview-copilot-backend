const admin = require('../utils/firebaseAdmin');

const verifyFirebaseToken = async (req, res, next) => {
  console.log('➡️ verifyFirebaseToken middleware hit');
  console.log('Headers received:', req.headers);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('⚠️ No Authorization header or Bearer token missing');
    return res.status(401).json({ error: 'No Firebase token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  console.log('Extracted ID Token:', idToken ? '[token present]' : '[token missing]');

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    console.log('✅ Firebase token verified:', { uid, email, name });

    req.user = {
      id: uid,
      email: email,
      name: name || 'Anonymous',
    };

    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    return res.status(403).json({ error: 'Invalid or expired Firebase token' });
  }
};

module.exports = verifyFirebaseToken;
