import {getHomeworkList} from '@/api/student/homework';
import {gettestList} from '@/api/student/test';

const homeWork = {
  state: {
      homeworkId: '',
      homeworkList: [],
      historyData: [],
      homeworkObjectiveQs: [],
      homeworkSubjectiveQs: [],
      homeworkName: '',
      homeworkCompleted: false,
      // 考试
      testId: '',
      testList: [],
      historyTestData: [],
      testObjectiveQs: [],
      testSubjectiveQs: [],
      testName: '',
      testCompleted: false
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
        if(state.homeworkList) state.homeworkList = state.homeworkList.concat(state.historyData);
    },
      SET_HOMEWORKHISTORY: (state, historyData) => {
        state.historyData = historyData;
        if(state.homeworkList) state.homeworkList = state.homeworkList.concat(historyData)
    },
    // 考试
    SET_TESTOBJECTIVEQS: (state, testObjectiveQs) => {
        state.testObjectiveQs = testObjectiveQs;
    },
    SET_TESTSUBJECTIVEQS: (state, testSubjectiveQs) => {
       state.testSubjectiveQs = testSubjectiveQs;
    },
    SET_TESTNAME: (state, testName) => {
        state.testName = testName;
    },
    SET_TESTID: (state, testId) => {
        state.testId = testId;
    },
    SET_TESTCOMPLETED: (state, testCompleted) => {
        state.testCompleted = testCompleted;
    },
    SET_TEST: (state, testList) => {
        state.testList = testList;
        if(state.testList) state.testList = state.testList.concat(state.historyTestData);
    },
    SET_TESTHISTORY: (state, historyTestData) => {
        state.historyTestData = historyTestData;
        if(state.testList) state.testList = state.testList.concat(historyTestData)
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
    },
    getTestList({commit}) {
        return new Promise((resolve, reject) => {
            gettestList()
            .then(function (res) {
              commit('SET_TEST', res.data.data)
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
