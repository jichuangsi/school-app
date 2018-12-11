import axios from '../utils/axios'

const apiUrl = 'http://school.jichuangsi.com:81/api/auth/login';

export async function login(userAccount, userPwd) {
    let res = await axios({
        method: 'POST',
        url: `${apiUrl}`,
        data: {
            userAccount,
            userPwd
        }
    });
    if (res.data.code === '0010') {
        localStorage.setItem("token", res.data.data.accessToken);
        return res.data.data ? res.data.data.user : false;
    } else {
        throw res.data.msg;
    }
}
