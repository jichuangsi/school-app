import axios from '../utils/axios'

const apiUrl = 'http://school.jichuangsi.com:81/api/auth/login';

export async function login(userId, pwd) {
    let res = await axios({
        method: 'POST',
        url: `${apiUrl}`,
        data: {
            userId,
            pwd
        }
    });
    if (res.data.code === '0010') {
        localStorage.setItem("token", res.data.data.accessToken);
        return res.data.data ? res.data.data.userBaseInfo : false;
    } else {
        throw res.data.msg;
    }
}
