import TokenDao from '../dao/token.ts';

const TokenService = {
  create(data: any) {
    return TokenDao.create(data);
  },
  getByUser(id: string) {
    return TokenDao.getByUser(id);
  },
  deleteByUser(id: string) {
    return TokenDao.deleteByUser(id);
  },
};

export default TokenService;
