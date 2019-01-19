import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import('@/pages/student/login'), //学生登录页面
            meta: {
                keepAlive: false, //此组件不需要被缓存
                isBack: false     //用于判断上一个页面是哪个
            }
         },
        /*{
            path: '/',
            name: 'login',
            component: () => import('@/pages/teacher/login'), //老师登录页面
            meta: {
                keepAlive: false, //此组件不需要被缓存
                isBack: false     //用于判断上一个页面是哪个
            }
        },*/
        {
            path: '/studentIndex',
            name: 'studentIndex',
            component: () => import('@/pages/student'), //学生端三个首页
            meta: {
                keepAlive: true,
                isBack: false
            }
        }, {
            path: '/classroom',
            name: 'classroom',
            component: () => import('@/pages/student/classroom/show'), //学生端课堂详情
            meta: {
                keepAlive: false,
                isBack: false
            }
        }, {
            path: '/objectiveWork',
            name: 'objectiveWork',
            component: () => import('@/pages/student/homeWork/show-objective'), //学生端作业客观题
            meta: {
                keepAlive: false,
                isBack: false
            }
        }, {
            path: '/subjectiveWork',
            name: 'subjectiveWork',
            component: () => import('@/pages/student/homeWork/show-subjective'), //学生端作业主观题
            meta: {
                keepAlive: false,
                isBack: false
            }
        },
        {
            path: '/myShow',
            name: 'myShow',
            component: () => import('@/pages/student/my/myShow'), //学生端我的详情
            meta: {
                keepAlive: false,
                isBack: false
            }
        },
        {
            path: '/studentenquiry',
            name: 'studentenquiry',
            component: () => import('@/pages/student/statistics/studentenquiry'), //学生端我的成绩详情
            meta: {
                keepAlive: false,
                isBack: false
            }
        }, 
        {
            path: '/studenthomework',
            name: 'studenthomework',
            component: () => import('@/pages/student/statistics/studenthomework'), //学生端作业详情
            meta: {
                keepAlive: false,
                isBack: false
            }
        },
        {
            path: '/studentCollection',
            name: 'studentCollection',
            component: () => import('@/pages/student/statistics/studentCollection'), //学生端我的收藏
            meta: {
                keepAlive: false,
                isBack: false
            }
        },
        {
            path: '/mistakescollection',
            name: 'mistakescollection',
            component: () => import('@/pages/student/statistics/mistakescollection'), //学生端错题集
            meta: {
                keepAlive: false,
                isBack: false
            }
        }, 
        {
            path: '/Wrong',
            name: 'Wrong',
            component: () => import('@/pages/student/statistics/Wrong'), //学生端错题集
            meta: {
                keepAlive: false,
                isBack: false
            }
        }, 
        {
            path: '/raising',
            name: 'raising',
            component: () => import('@/pages/student/statistics/raising'), //学生端错题集
            meta: {
                keepAlive: false,
                isBack: false
            }
        },  {
            path: '/teacherIndex',
            name: 'teacherIndex',
            component: () => import('@/pages/teacher'), // 老师端三个首页
            meta: {
                keepAlive: true,
                isBack: false
            }
        }, {
            path: '/TClassroom',
            name: 'TClassroom',
            component: () => import('@/pages/teacher/classroom/show'), //老师端课堂详情
            meta: {
                keepAlive: false,
                isBack: false
            }
        }, {
            path: '/objectiveQuestions',
            name: 'objectiveQuestions',
            component: () => import('@/pages/teacher/classroom/show-objective'), //老师端课堂客观修改
            meta: {
                keepAlive: false,
                isBack: false
            }
        }, {
            path: '/subjectiveDetails',
            name: 'subjectiveDetails',
            component: () => import('@/pages/teacher/classroom/subjective'),  //老师端主观题详情
            meta: {
                keepAlive: false,
                isBack: false
            }
        }, {
            path: '/subjectiveShow',
            name: 'subjectiveShow',
            component: () => import('@/pages/teacher/classroom/show-subjective'), //老师端主观题批改打分
            meta: {
                keepAlive: false,
                isBack: false
            }
        }, {
            path: '/TStudentList',
            name: 'TStudentList',
            component: () => import('@/pages/teacher/homeWork/student-list'), //老师端作业学生列表
            meta: {
                keepAlive: false,
                isBack: false
            }
        }, {
            path: '/TObjective',
            name: 'TObjective',
            component: () => import('@/pages/teacher/homeWork/show-objective'), //老师端作业客观题批改
            meta: {
                keepAlive: false,
                isBack: false
            }
        }, {
            path: '/TSubjective',
            name: 'TSubjective',
            component: () => import('@/pages/teacher/homeWork/show-subjective'), //老师端主观题批改
            meta: {
                keepAlive: false,
                isBack: false
            }
        }, {
            path: '/teacherInformation',
            name: 'teacherInformation',
            component: () => import('@/pages/teacher/teacherInformation'), //老师端我的详情
            meta: {
                keepAlive: false,
                isBack: false
            }
        }, {
            path: '/teacherenquiry',
            name: 'teacherenquiry',
            component: () => import('@/pages/teacher/statistics/teacherenquiry'), //老师端成绩详情
            meta: {
                keepAlive: false,
                isBack: false
            }
        }, {
            path: '/teacherhomework',
            name: 'teacherhomework',
            component: () => import('@/pages/teacher/statistics/teacherhomework'), //老师端作业详情
            meta: {
                keepAlive: false,
                isBack: false
            }
        },  {
            path: '/assistant',
            name: 'assistant',
            component: () => import('@/pages/teacher/assistant'), //老师端助手
            meta: {
                keepAlive: false,
                isBack: false
            }
        },{
            path: '/principal',
            name: 'principal',
            component: () => import('@/pages/teacher/statistics/principal/principal'), //校长数据
            meta: {
                keepAlive: false,
                isBack: false
            }
        }, {
            path: '/abnormal',
            name: 'abnormal',
            component: () => import('@/components/public/Abnormal'), //app网络异常页面
            meta: {
                keepAlive: false,
                isBack: false
            }
        }, {
            path: '/chart',
            name: 'chart',
            component: () => import('@/components/teacherClassroom/chart'), //饼图测试页面
            meta: {
                keepAlive: false,
                isBack: false
            }
        }
    ]
})
