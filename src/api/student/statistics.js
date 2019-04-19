import axios from '../../utils/axios'

//const apiUrl = 'http://api.jichuangsi.com/COURSESERVICE/student/';
//const host = 'http://api.jichuangsi.com/CLASSINTERACTION/';
// const apiUrl = '/COURSESERVICE/student/';
// const host = '/CLASSINTERACTION/';

const apiurl = '/COURSESTATISTICS/result/student/'

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

//课程表
export function getStudentTimeTable(studentId) {
    return axios({
        method: 'GET',
        url: `/PARENTSERVICE/studentInfo/getStudentTimeTable/${studentId}`,
        headers: {'accessToken': localStorage.getItem('token')}
    });
}