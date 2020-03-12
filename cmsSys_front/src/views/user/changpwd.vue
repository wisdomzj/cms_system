<template>
  <div class="app-container">
    <el-card class="box-card" style="width: 80%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="name" :disabled="true" clearable />
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="form.new_password" show-password placeholder="请输入密码" maxlength="32" minlength="5" />
        </el-form-item>
        <el-form-item label="确认密码" label-width="120px">
          <el-input v-model="form.repeat_password" show-password placeholder="请输入密码" maxlength="32" minlength="5" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { MessageBox } from 'element-ui'
import store from '@/store'
export default {
  data() {
    return {
      form: {
        new_password: '',
        repeat_password: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    onSubmit() {
      if (!this.form.new_password) {
        this.$message.info('请输入密码')
        return
      } else {
        if (this.form.new_password === this.form.repeat_password) {
          if (this.form.new_password.length < 5 || this.form.repeat_password.length < 5) {
            this.$message.info('密码 最小长度是5位')
            return
          }
          this.$request.changPwd({ ...this.form }).then((res) => {
            if (res.data.error_code === 0) {
              MessageBox.confirm('密码已修改成功,可以取消停留在此页面上,或者再次登录', '确认登出', {
                confirmButtonText: '去往登录',
                cancelButtonText: '取消',
                type: 'success'
              }).then(() => {
                store.dispatch('user/resetToken').then(() => {
                  location.reload()
                })
              })
            } else {
              this.$message.error('修改失败')
            }
          })
        } else {
          this.$message.info('两次密码不一致,请检查')
          return
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container{
    background: #ffffff;
    display: flex;
    justify-content: center;
  }
</style>
