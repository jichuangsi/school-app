import axios from '../../utils/axios'

//const apiUrl = 'http://api.jichuangsi.com/COURSESERVICE/student/';
//const host = 'http://api.jichuangsi.com/CLASSINTERACTION/';
const apiUrl = '/COURSESERVICE/student/';
const host = '/CLASSINTERACTION/';
const service='/USERSERVICE/';

//课程列表
export function getList() {
    return axios({
        method: 'get',
        url: `${apiUrl}getList`,
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}
//修改密码
export function updatePwd(userId,oldPwd,newPwd) {
    return axios({
        method: 'POST',
        url: `${service}updateOtherPwd/${userId}`,
        data: {
            oldPwd,
            newPwd
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}
//修改头像
export function updateImg(content) {
    let contentType = 'image/jpeg';
    let name = 'test.jpg';
    return axios({
        method: 'POST',
        url: `${service}portrait/sendByString`,
        data: {
            content,
            name,
            contentType
        },
        // headers: {'accessToken': localStorage.getItem('token')}
    });
}
//获取头像
export async function getImg(portrait) {
    let res = await axios({
        method: 'post',
        url: `${service}portrait/getByString`,
        data: {
            sub: portrait
        },
        // headers: {'accessToken': localStorage.getItem('token')}
    });
    if (res.data.code === '0010') {
        var imgString = res.data.data.content;
        localStorage.setItem("HeadPortrait", imgString);
        return imgString ? imgString : "";
    } else {
        throw res.data.msg;
    }

}
//历史课程列表
export function getHistory(pageNum) {
    return axios({
        method: 'POST',
        url: `${apiUrl}getHistory`,
        data: {
            pageNum
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//进入课堂
export function goCLassroom(courseId) {
    return axios({
        method: 'post',
        url: `${host}addToCourse/${courseId}`,
        //headers: {'accessToken': localStorage.getItem('token')}
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
        //headers: {'accessToken': localStorage.getItem('token')}
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
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂题目图片
export function getQuestionPic(stubForSubjective) {
    return axios({
        method: 'POST',
        url: `${apiUrl}getQuestionPic`,
        data: {
            stubForSubjective
        },
        //headers: {'accessToken': localStorage.getItem('token')}
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
        //headers: {'accessToken': localStorage.getItem('token')}
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
        //headers: {'accessToken': localStorage.getItem('token')}
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
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//根据问题id添加收藏
export function addFavorQuestion(questionId) {
    return axios({
        method: 'put',
        url: `${apiUrl}addFavorQuestion/${questionId}`,
        data: {
            questionId
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//根据问题id删除收藏
export function removeFavorQuestion(questionId) {
    return axios({
        method: 'DELETE',
        url: `${apiUrl}removeFavorQuestion/${questionId}`,
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//获取收藏列表
export function listFavorQuestions() {
    return axios({
        method: 'get',
        url: `${apiUrl}listFavorQuestions`,
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//根据科目获取错题集
export function listIncorrectQuestions(subjectId, knowledgeId) {
    return axios({
        method: 'post',
        url: `${apiUrl}collectIncorrectQuestions`,
        //url: `http://127.0.0.1:8888/COURSESERVICE/student/collectIncorrectQuestions`,
        data: {
            subjectId,
            knowledgeId
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//根据知识点，题型，难度推送题目
export function aiPushQuestions(knowledgeId, qtypeId, diff) {
    return axios({
        method: 'post',
        url: `${apiUrl}aiPushQuestions`,
        //url: `http://127.0.0.1:8888/COURSESERVICE/student/aiPushQuestions`,
        data: {
            knowledgeId,
            qtypeId,
            diff
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}
//进入课堂
export function raceAnswer(courseId,raceId) {
    return axios({
        method: 'post',
        url: `${host}raceAnswer/${courseId}/${raceId}`,
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}
