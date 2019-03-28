import axios from 'axios'

//const apiUrl = 'http://api.jichuangsi.com/COURSESERVICE/student/';
//const host = 'http://api.jichuangsi.com/CLASSINTERACTION/';
// const apiUrl = '/COURSESERVICE/student/';
// const host = '/CLASSINTERACTION/';

const apiurl = 'http://192.168.31.154:8082/result/student/'

//课堂
export function getCourseSubjectResult(subjectname) {
    return axios({
        method: 'get',
        url: `${apiurl}getCourseSubjectResult?subject=`+subjectname,
        headers: {'accessToken': localStorage.getItem('token')}
    });
}
//习题
export function getQuestionSubjectResult(subjectname) {
    return axios({
        method: 'get',
        url: `${apiurl}getQuestionSubjectResult?subject=`+subjectname,
        headers: {'accessToken': localStorage.getItem('token')}
    });
}