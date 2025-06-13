export class ManagementTokenService {
  private static instance: ManagementTokenService;
  private token: string | null = null;
  private tokenExpiry: number = 0;

  private constructor() {}

  public static getInstance(): ManagementTokenService {
    if (!this.instance) {
      this.instance = new ManagementTokenService();
    }
    return this.instance;
  }

  private async fetchNewToken(): Promise<string> {
    const response = await fetch(`${process.env.AUTH0_ISSUER}/oauth/token`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `${process.env.AUTH0_ISSUER}/api/v2/`,
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch management token");
    }

    const data = await response.json();
    return data.access_token;
  }

  public async getToken(): Promise<string> {
    const now = Date.now();
    if (!this.token || now >= this.tokenExpiry) {
      this.token = await this.fetchNewToken();
      this.tokenExpiry = now + 23 * 60 * 60 * 1000;
    }
    return this.token;
  }
}
