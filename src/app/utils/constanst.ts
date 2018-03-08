const HOST ='http://localhost:3000'
export const CONSTANST = {
  permissions:{},
  routes:{
      authorization:{
          login: HOST+ "/api/auth/login"
      },
      person:{
          list:HOST+'/api/person',
          delete:HOST+'/api/person/delete/:id',
          save:HOST+'/api/person/save'
      },
      user: {}
  },
  lang:{},
  session:{},
  parameters:{}
};
