import axios from '../../utils/axios'

//const apiUrl = 'http://api.jichuangsi.com/COURSESERVICE/student/';
//const host = 'http://api.jichuangsi.com/CLASSINTERACTION/';
// const apiUrl = '/COURSESERVICE/student/';
// const host = '/CLASSINTERACTION/';

const apiurl = '/result/student/'

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