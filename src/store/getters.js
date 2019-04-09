const getters = {
    //学生端课堂数据
    classroomList: state => state.classList.classroomList,
    //学生端习题数据
    homeworkList: state => state.homeWork.homeworkList,
    homeworkId: state => state.homeWork.homeworkId,
    homeworkName: state => state.homeWork.homeworkName,
    homeworkCompleted: state => state.homeWork.homeworkCompleted,
    homeworkObjectiveQs: state => state.homeWork.homeworkObjectiveQs,
    homeworkSubjectiveQs: state => state.homeWork.homeworkSubjectiveQs,
    //学生端考试数据
    testList: state => state.homeWork.testList,
    testId: state => state.homeWork.testId,
    testName: state => state.homeWork.testName,
    testCompleted: state => state.homeWork.testCompleted,
    testObjectiveQs: state => state.homeWork.testObjectiveQs,
    testSubjectiveQs: state => state.homeWork.testSubjectiveQs,
    //老师端课堂courseId
    userMobile: state => state.login.userMobile,
    //老师端课堂数据
    classList: state => state.teacher.classList,
    //老师端课堂名字
    courseName: state => state.teacher.courseName,
    //老师端老师id
    teacherId: state => state.teacher.teacherId,
    //老师端老师名字
    teacherName: state => state.teacher.teacherName,
    //老师端课堂题目id
    topicId: state => state.topic.topicId,
    //老师课堂题目标题
    title: state => state.topic.title,
    studentId: state => state.topic.studentId,
    //错题集相关
    incKnowledgeId: state => state.incorrectQuestions.knowledgeId,
    incKnowledge: state => state.incorrectQuestions.knowledge,
    incQuestions: state => state.incorrectQuestions.questions,
    //错题集相关
    //老师课堂id
    courseId: state => state.teacher.courseId,
    userPassword: state => state.login.userPassword,
    isBlueTooth: state => state.app.isBlueTooth,
    isBoard: state => state.app.isBoard,
    boardImg: state => state.app.boardImg,
    blueToothList: state => state.app.blueToothList,
    isPopupBoard: state => state.app.isPopupBoard,
    boardPoint: state => state.app.boardPoint,
    bluetoothValue: state => state.bluetooth.bluetoothValue,
    isPopupUpgrade: state => state.app.isPopupUpgrade,
    upgradeInfo: state => state.app.upgradeInfo,
    isCNew: state => state.app.isCNew,
    isHNew: state => state.app.isHNew,
    isTNew: state => state.app.isTNew,
};
export default getters
