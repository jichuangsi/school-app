import axios from '../../utils/axios'

let apiUrl = '/HOMEWORKSERVICE/student/';
let fileUrl = '/HOMEWORKSERVICE/file/';

//作业列表
export function getHomeworkList() {
  return axios({
    method: 'GET',
    url: `${apiUrl}getList`,
  });

}

//历史作业列表
export function getHomeworkHistory(pageIndex, pageSize) {
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
export function getHomework(homeworkId) {
  return axios({
    method: 'get',
    url: `${apiUrl}getHomework/${homeworkId}`,
  });
}

//根据学生id和问题id保存学生的答案 客观题
export function sendObjectiveAnswer(homeworkId, questionId, answerForObjective) {
    return axios({
        method: 'post',
        url: `${apiUrl}sendAnswer/${homeworkId}/${questionId}`,
        data: {
            answerForObjective
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//提交作业
export function submitHomework(homeworkId) {
    return axios({
        method: 'put',
        url: `${apiUrl}submitHomework/${homeworkId}`,
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
export function sendSubjectiveAnswer(homeworkId, questionId, stubForSubjective) {
    return axios({
        method: 'post',
        url: `${apiUrl}sendAnswer/${homeworkId}/${questionId}`,
        data: {
            stubForSubjective
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

