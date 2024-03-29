import axios from '../../utils/axios'

const apiUrl = 'http://school.jichuangsi.com:81/COURSESERVICE/student/';
const host = 'http://school.jichuangsi.com:81/CLASSINTERACTION/';
// const apiUrl = 'http://192.168.54.101:8888/COURSESERVICE/student/';
// const host = 'http://192.168.54.101:8888/';
//课程列表
export function getList() {
    return axios({
        method: 'get',
        url: `${apiUrl}getList`,
        headers: {'accessToken': localStorage.getItem('token')}
    });
}

//历史课程列表
export function getHistory(pageNum) {
    return axios({
        method: 'POST',
        url: `${apiUrl}getHistory`,
        data: {
            pageNum
        },
        headers: {'accessToken': localStorage.getItem('token')}
    });
}

//进入课堂
export function goCLassroom(courseId) {
    return axios({
        method: 'post',
        url: `${host}addToCourse/${courseId}`,
        headers: {'accessToken': localStorage.getItem('token')}
    });
}


//课堂基本信息
export function getCourse(courseId) {
    return axios({
        method: 'get',
        url: `${apiUrl}getCourse/${courseId}`,
        data: {
            courseId
        },
        headers: {'accessToken': localStorage.getItem('token')}
    });
}

//历史题目列表
export function getQuestions(courseId) {
    return axios({
        method: 'get',
        url: `${apiUrl}getQuestions`,
        data: {
            courseId
        }
    });
}

//根据学生id和文件名下载指定的文件
export function getSubjectPic(stubForSubjective) {
    return axios({
        method: 'post',
        url: `${apiUrl}getSubjectPic`,
        data: {
            stubForSubjective
        },
        headers: {'accessToken': localStorage.getItem('token')}
    });
}

//根据学生id和文件名删除指定文件
export function remoreSubjectPic() {
    return axios({
        method: 'DELETE',
        url: `${apiUrl}remoreSubjectPic`
    });
}

//根据学生id和问题id保存学生的答案 客观题
export function sendObjectiveAnswer(courseId, questionId, studentId, studentName, answerForObjective) {
    return axios({
        method: 'post',
        url: `${apiUrl}/sendAnswer/${courseId}/${questionId}`,
        data: {
            studentId,
            studentName,
            answerForObjective
        },
        headers: {'accessToken': localStorage.getItem('token')}
    });
}

//根据学生id和问题id保存学生的答案 主观题
export function sendSubjectiveAnswer(courseId, questionId, studentId, studentName, stubForSubjective) {
    return axios({
        method: 'post',
        url: `${apiUrl}/sendAnswer/${courseId}/${questionId}`,
        data: {
            studentId,
            studentName,
            stubForSubjective
        },
        headers: {'accessToken': localStorage.getItem('token')}
    });
}

//根据学生id保存上传的文件
export function sendSubjectPicByString(content) {
    let contentType = 'image/jpeg';
    let name = 'pic.jpg';
    return axios({
        method: 'post',
        url: `${apiUrl}sendSubjectPicByString`,
        data: {
            content,
            contentType,
            name
        },
        headers: {'accessToken': localStorage.getItem('token')}
    });
}
