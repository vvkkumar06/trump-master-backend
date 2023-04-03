const { OAuth2Client } = require('google-auth-library');
const { androidClientId } = require('./../env');
const client = new OAuth2Client([androidClientId]);


const signIn = (token) => {
  return verifyGoogleToken(token).catch(console.error);
}
  
async function verifyGoogleToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: [androidClientId],
    });
    const { email, name, picture } = ticket.getPayload();
    return { id: email, name, picture };
}


module.exports = {
    signIn
}