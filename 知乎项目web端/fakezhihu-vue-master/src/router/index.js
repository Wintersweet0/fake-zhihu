import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SignUp from '../views/SignUp.vue'
import Editor from '../views/Editor.vue'
import Main from '../views/Main.vue'
import Recommend from '../views/Recommend.vue'
import Follow from '../views/peoplechildren/Follow.vue'
import Hot from '../views/Hot.vue'
import People from '../views/People.vue'
// import Question from '../views/peoplechildren/Question.vue'
import Article from '../views/peoplechildren/Article.vue'
import FollowPeople from '../views/peoplechildren/FollowPeople.vue'
// import Like from '../views/peoplechildren/Like.vue'
import Collection from '../views/peoplechildren/Collection.vue'
import Answer from '../views/Answer.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/main/recommend',
  },
  {
    path: '/main',
    redirect: '/main/recommend',
  },
  {
    path: '/people',
    redirect: 'people/follow',
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta:{
      tltle: '首页 - 知乎',
    },
    children: [
      {
        path: '/main',
        name: 'Main',
        meta: {
          title: '首页 - 知乎'
        },
        component: Main,
        children: [
          {
            path: 'recommend',
            name: 'Recommend',
            meta: {
              title: '首页 - 知乎'
            },
            component: Recommend
          },
          {
            path: 'hot',
            name: 'Hot',
            meta: {
              title: '首页 - 知乎'
            },
            component: Hot
          },
        ]
      },
      {
        path: '/people',
        name: 'People',
        meta: {
          title: '个人信息'
        },
        component: People,
        children: [
          {
            path: 'follow',
            name: 'Follow',
            meta: {
              title: '首页 - 知乎'
            },
            component: Follow
          },
          {
            path: 'article',
            name: 'Article',
            component: Article,
          },
          {
            path: 'followPeople',
            name: 'FollowPeople',
            component: FollowPeople,
          },
          
          {
            path: 'collection',
            name: 'Collection',
            component: Collection,
          },
        ]
      },
      {
        path: '/answer',
        name: 'Answer',
        redirect: '/answer/recommend',
        component: Answer,
        children: [
          {
            path: 'recommend',
            component: () => import('../components/answer/recommend')
          },
        ]
      }
    ]
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUp,
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor,
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router