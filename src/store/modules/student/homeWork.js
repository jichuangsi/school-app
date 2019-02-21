import {getHomeworkList} from '@/api/student/homework';

const homeWork = {
  state: {
      homeworkId: '',
      homeworkList: [],
      historyData: [],
      homeworkObjectiveQs: [],
      homeworkSubjectiveQs: [],
      homeworkName: '',
      homeworkCompleted: false
  },
  mutations: {
    SET_HOMEWORKOBJECTIVEQS: (state, homeworkObjectiveQs) => {
        state.homeworkObjectiveQs = homeworkObjectiveQs;
    },
    SET_HOMEWORKSUBJECTIVEQS: (state, homeworkSubjectiveQs) => {
       state.homeworkSubjectiveQs = homeworkSubjectiveQs;
    },
    SET_HOMEWORKNAME: (state, homeworkName) => {
        state.homeworkName = homeworkName;
    },
    SET_HOMEWORKID: (state, homeworkId) => {
        state.homeworkId = homeworkId;
    },
    SET_HOMEWORKCOMPLETED: (state, homeworkCompleted) => {
        state.homeworkCompleted = homeworkCompleted;
    },
    SET_HOMEWORK: (state, homeworkList) => {
        state.homeworkList = homeworkList;
        state.homeworkList = state.homeworkList.concat(state.historyData);
    },
      SET_HOMEWORKHISTORY: (state, historyData) => {
        state.historyData = historyData;
        state.homeworkList = state.homeworkList.concat(historyData)
    }
  },
  actions: {
    getWrokList({commit}) {
      return new Promise((resolve, reject) => {
          getHomeworkList()
          .then(function (res) {
            commit('SET_HOMEWORK', res.data.data)
            resolve()
          })
          .catch(function (error) {
            reject(error);
          })
      })
    }
  }
};

// 暴露出去
export default homeWork
