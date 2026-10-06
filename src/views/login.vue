<template>
  <div>
    <div class="text" id="login"></div>
    <div class="box">
      <h1>登录</h1>
      <!-- element -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" show-password v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Particle } from "jparticles";
import { login } from "@/api/login";
export default {
  mounted() {
    new Particle("#login", {
        color: '#25bfff',
    lineShape: 'cube',
    range: 2000,
    proximity: 100,
    parallax: true,
    });
    //this.getCaptchaImage()
  },
  data() {
    return {
      ruleForm: {
        username: "admin",
        password: "123456",
        code: '',
        uuid: ''
      },
      url: '',
      loading: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      // validate校验
      this.$refs[formName].validate(async(valid) => {
        if (!valid) {
          console.log("error submit!!");
          return false;
        }

        this.loading = true;
        try {
          // 调用后端 /login 校验账号密码，成功后拿到 token
          const res = await login(this.ruleForm);
          if (res.code !== 200) {
            this.$message.error(res.msg || "登录失败");
            return;
          }
          this.$store.commit("user/SET_TOKEN", res.data.token);
          this.$store.commit("user/SET_NAME", res.data.name);
          this.$message.success("登录成功");
          this.$router.push({ path: "/home" });
        } catch (err) {
          this.$message.error((err && err.msg) || "账号或密码错误");
        } finally {
          this.loading = false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped lang="scss">
#login {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 320px;
  box-shadow: 1px 3px 10px 1px rgba(0, 0, 0, 0.8);
  background-color: #fff;
  padding-right: 40px;
  border-radius: 5%;
  z-index: 99;

  h1 {
    padding: 40px 0 30px;
    text-align: center;
  }
}
</style>
