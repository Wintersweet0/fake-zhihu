<template>
  <div>
    <el-card class="signup-content">
      <p style="font-size: 30px; color: #409EFF"
        v-show="nowStatus === 'register'">用户注册</p>
      <img src="@/assets/imgs/Loginlogo.png"
           alt="" 
           v-show="nowStatus === 'login'"/>
      <div class="register"
           v-show="nowStatus === 'register' ">
        <el-form :model="registerForm"
                 status-icon
                 :rules="registerRules"
                 ref="registerForm"
                 label-width="0px">
          <el-form-item prop='username'
                        class="no-label">
            <el-input placeholder="请输入用户名"
                      v-model="registerForm.username" />
          </el-form-item>
          <el-form-item prop='telephone'
                        class="no-label">
            <el-input placeholder="请输入手机"
                      v-model="registerForm.telephone" />
          </el-form-item>
          <el-form-item prop="password"
                        class="no-label">
            <el-input type="password"
                      v-model="registerForm.password"
                      placeholder="请输入密码"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="checkPass"
                        class="no-label">
            <el-input type="password"
                      placeholder="请再次输入密码"
                      v-model="registerForm.checkPass"
                      @keyup.enter.native="submitForm('registerForm')"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="sex">
            <el-select v-model="registerForm.sex" class="no-label" placeholder="请选择性别">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop='introduction'
                        class="no-label">
            <el-input placeholder="简单介绍下自己~"
                      v-model="registerForm.introduction" />
          </el-form-item>
          <el-form-item>
            <el-upload class="avatar-uploader" action="http://116.62.222.212/api/user/login_user" :show-file-list="false"
              :before-upload="beforeChangeAvatarUpload">
              <img v-if="registerForm.imageUrl" :src="registerForm.imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p style="font-size: 10px; color: #606266">上传一个头像</p>
          </el-form-item>
          <el-form-item prop='submit'>
            <el-button class="submit-btn registerBtn"
                       type="primary"
                       @keyup.enter.native="submitForm('registerForm')"
                       @click="submitForm('registerForm')">注册</el-button>
          </el-form-item>
        </el-form>
        <!-- <div class="footer register-footer">
          <span>
            注册即代表同意
            <a href="#">《Fake 协议》</a>
            <a href="#">《隐私保护指引》</a>
          </span>
          <a href="#">注册机构号</a>
        </div> -->
      </div>

      <div class="login"
           v-show="nowStatus === 'login'">
        <el-form :model="loginForm"
                 :rules="loginRules"
                 ref="loginForm"
                 label-width="0px">
          <el-form-item prop='telephone'
                        class="no-label">
            <el-input placeholder="手机号"
                      v-model="loginForm.telephone" />
          </el-form-item>
          <el-form-item prop='password'
                        class="no-label">
            <el-input type="password"
                      placeholder="请输入密码"
                      @keyup.enter.native="submitForm('loginForm')"
                      v-model="loginForm.password" />
          </el-form-item>
          <!-- <div class="others">
            <span>
              手机验证码登录
            </span>
            <span>
              忘记密码？
            </span>
          </div> -->
          <el-form-item prop="submit">
            <el-button class="submit-btn"
                       type="primary"
                       @keyup.enter.native="submitForm('loginForm')"
                       @click="submitForm('loginForm')">登录</el-button>
          </el-form-item>
        </el-form>
        
      </div>

    </el-card>
    <div class="switcher">
      {{tips[nowStatus].base}}
      <span @click="nowStatus = nowStatus === 'register' ? 'login' :'register'">
        {{tips[nowStatus].link}}
      </span>
    </div>
  </div>
</template>

<script>
import { post } from '../../axios/apis';
// import md5 from 'md5';

export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.registerForm.checkPass !== '') {
          this.$refs.registerForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      nowStatus: 'login',  //当前展示表单
      tips: {
        register: {
          base: '已有账号?',
          link: '登录',
        },
        login: {
          base: '没有账号?',
          link: '注册',
        },
      },
      registerForm: { //注册表单数据
        username: '',
        telephone: '',
        password: '',
        checkPass: '',
        sex: '',
        introduction: '',
        imageUrl: '',
      },
      registerRules: { //注册表单规则
        username: [      //email规则
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        telephone: [     //email规则
          { required: true, message: '请输入手机号', trigger: 'blur' },
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
      },
      loginForm: {
        telephone: '',
        password: '',
      },
      loginRules: {
        telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    async register () {
      let formData = new FormData();
      formData.append("username", this.registerForm.username)
      formData.append("telephone", this.registerForm.telephone)
      formData.append("introduction", this.registerForm.introduction)
      formData.append("sex", this.registerForm.sex)
      formData.append("password", this.registerForm.password)
      formData.append("picture", this.registerForm.file)
      let headers = { 'Content-Type': 'multipart/form-data' }
      console.log(formData)
      await post('/user/create_user',formData, headers)
        .then((response) => {
          // console.log(response);
          if (response.data.code === 200) {
            this.$Message.success(response.data.msg);
            this.$router.push({ path: '/main/recommend' });
          } else {
            this.$Message.error(response.data.msg);
          }
        });
    },
    async login () {
      let formData = new FormData();
      formData.append("telephone", this.loginForm.telephone)
      formData.append("password", this.loginForm.password)
      let headers = { 'Content-Type': 'multipart/form-data' }
      await post('/user/login_user', formData, headers).then((res) => {
        if (res.data.code == 200) {
          window.sessionStorage.setItem("token", JSON.stringify(res.data.data));//将后台返回的data.data保存起来
          console.log(JSON.parse(window.sessionStorage.getItem("token")))
          this.$Message.success(res.data.msg)
          this.$router.push({ name: 'Recommend'});
        } else {
          this.$Message.error(res.data.msg)
        }
      });
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.nowStatus === 'register') {
            this.register();
          } else {
            this.login();
          }
        } else {
          this.$Message.error('error submit!!!')
          return false;
        }
        return '';
      });
    },
    //格式校验,阻止图片自动上传,让图片随表单上传
    beforeChangeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (isJPG) {
        if (isLt2M) {
          //图片预览
          this.registerForm.imageUrl = URL.createObjectURL(file)
          //将图片file添加到注册表单
          this.registerForm.file = file
          //表单jason
          console.log(this.registerForm)
        } else {
          this.$Message.error('上传头像图片大小不能超过 2MB!')
        }
      } else {
        this.$Message.error('上传头像图片只能是 JPG 格式!')
      }
      return false
    },
  },
};
</script>


<style>
.signup-content {
  margin: 0 auto;
  width: 400px;
  display: flex;
  justify-content: center;
}
.submit-btn {
  width: 320px;
}
.no-label {
  width: 320px;
  height: 40px;
  margin-top: 10px;
}
.others,
.register-footer {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
.registerBtn {
  margin-top: -10px;
}
.footer {
  font-size: 10px;
}
.footer span a {
  color: rgb(165, 164, 164);
}
.switcher {
  margin: 0 auto;
  margin-top: -2px;
  width: 400px;
  height: 40px;
  line-height: 40px;
  background-color: #f6f6f6;
}
/* 上传图片 */
.avatar-uploader .el-upload {
  width: 60px;
  height: 60px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 10px;
  color: #8c939d;
  width: 60px;
  height: 20px;
  line-height: 60px;
  text-align: center;
}
.avatar {
  width: 60px;
  height: 60px;
  display: block;
}
</style>