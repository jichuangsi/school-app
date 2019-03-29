import axios from '../../utils/axios'

let apiUrl = '/TESTSERVICE/student/';
let fileUrl = '/TESTSERVICE/file/';

//作业列表
export function gettestList() {
  return axios({
    method: 'GET',
    url: `${apiUrl}getList`,
  });

}

//历史作业列表
export function gettestHistory(pageIndex, pageSize) {
  return axios({
      method: 'POST',
      url: `${apiUrl}getHistory`,
      data: {
          pageIndex,
          pageSize
      },
  });
}

//作业详情
export function gettest(testId) {
  return axios({
    method: 'get',
    url: `${apiUrl}getTest/${testId}`,
  });
}

//根据学生id和问题id保存学生的答案 客观题
export function sendObjectiveAnswer(testId, questionId, answerForObjective) {
    return axios({
        method: 'post',
        url: `${apiUrl}sendAnswer/${testId}/${questionId}`,
        data: {
            answerForObjective
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//提交作业
export function submittest(testId) {
    return axios({
        method: 'put',
        url: `${apiUrl}submitTest/${testId}`,
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂主观题图片
export function getPicByString(sub) {
    return axios({
        method: 'POST',
        url: `${fileUrl}getByString`,
        data: {
            sub
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂主观题批改图片存根
export function sendPicByString(content) {
    let contentType = 'image/jpeg';
    let name = 'pic.jpg';
    return axios({
        method: 'post',
        url: `${fileUrl}sendByString`,
        data: {
            content,
            contentType,
            name
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//根据学生id和问题id保存学生的答案 主观题
export function sendSubjectiveAnswer(testId, questionId, stubForSubjective) {
    return axios({
        method: 'post',
        url: `${apiUrl}sendAnswer/${testId}/${questionId}`,
        data: {
            stubForSubjective
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

