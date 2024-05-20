import ApiClient from '../clients/ApiClient';

export interface User {
  id: string;
  fid: number;
  balance: number;
}

export interface UserApi {
  getByFid(day: number): Promise<User | null>;
  create(fid: number): Promise<User>;
}

export class HttpUserApi implements UserApi {
  public constructor(private client: ApiClient) {}

  public async getByFid(fid: number) {
    const { user } = await this.client.makeCall<{ user: User | null }>(`/users/getByFid`, 'POST', {
      fid,
    });

    return user;
  }

  public create(fid: number) {
    return this.client.makeCall<User>(`/users/createUser`, 'POST', { fid });
  }
}
