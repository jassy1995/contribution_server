import { google } from 'googleapis';

const AuthService = {
  getGoogleUserInfo(accessToken: string) {
    const client = new google.auth.OAuth2();
    client.setCredentials({ access_token: accessToken });
    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    return new Promise<any>((resolve, reject) => {
      oauth2.userinfo.get((err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response?.data);
        }
      });
    });
  },
  isValidGooglePayload(payload: any) {
    return (
      payload?.given_name &&
      payload?.id &&
      payload?.email &&
      typeof payload.verified_email === 'boolean'
    );
  },
  async updateUserLastLogin(user: any) {
    user.lastLogin = new Date();
    await user.save();
  },
};

export default AuthService;
