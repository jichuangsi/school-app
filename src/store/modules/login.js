import {login} from '../../api/login'

const Login = {
  state: {
    userMobile: '',
    userPassword: ''
  },
  mutations: {
    SET_USER: (state, user) => {
      state.userMobile = user.data.logins.userMobile;
      state.userPassword = user.data.logins.userPassword;
    }
  },
  actions: {
    getLogin({commit}) {
      return new Promise((resolve, reject) => {
        login()
          .then(function (res) {
              console.log(res);
              commit('SET_USER', res);
            resolve()
          })
          .catch(function (error) {
            reject(error);
          })
      })
    }
  }
};

export default Login
