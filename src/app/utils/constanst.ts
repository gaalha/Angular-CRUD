const HOST = 'http://localhost:3000';

export const CONSTANST = {
  permissions: {},
  routes: {
    authorization: {
      login: HOST + '/api/auth/login',
      logout: HOST + '/api/auth/logout'
    },
    client: {
      list: HOST + '/api/client',
      delete: HOST + '/api/client/delete/:id',
      save: HOST + '/api/client/save',
      get: HOST + '/api/client/:id'
    },
    user: {
      list: HOST + '/api/user',
      delete: HOST + '/api/user/delete/:id',
      save: HOST + '/api/user/save',
      get: HOST + '/api/user/:id'
    }
  },
  lang: {},
  session: {},
  parameters: {}
};
