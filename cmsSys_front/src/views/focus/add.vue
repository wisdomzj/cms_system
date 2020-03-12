<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="设置标题">
          <el-input v-model="form.title" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="form.focurl" placeholder="请输入链接" clearable />
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker v-model="displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间" />
        </el-form-item>
        <el-form-item label="轮播图上传">
          <el-upload
            class="upload-demo"
            action="upload"
            :before-upload="beforeCoverImgUpload"
            :http-request="uploadCoverImg"
            :show-file-list="false"
            accept=".jpg,.jpeg,.png"
          >
            <el-button size="small" type="primary">点击上传<i class="el-icon-upload el-icon--right" /></el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model="form.review">
            <el-radio label="审核" border />
            <el-radio label="未审核" border />
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
export default {
  data() {
    return {
      form: {
        title: '',
        addTime: '',
        focurl: '',
        review: '',
        pic: ''
      },
      dialoguploadVisible: false
    }
  },
  computed: {
    displayTime: {
      get() {
        return (+new Date(this.form.addTime))
      },
      set(val) {
        this.form.addTime = new Date(val)
      }
    }
  },
  methods: {
    beforeCoverImgUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传轮播图大小不能超过 2MB!')
      }
      return isLt2M
    },
    uploadCoverImg(params) {
      const that = this
      that.$request
        .uploadFile({ file: params.file }, true, {
          headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8'
          }
        })
        .then(res => {
          if (res.msg === 'success') {
            that.form.pic = res.file.imgUrl
            that.$notify({
              title: '成功',
              message: '上传轮播图成功',
              type: 'success'
            })
          } else {
            that.$notify.error({
              title: '错误',
              message: '上传轮播图失败'
            })
          }
        })
    },
    onSubmit() {
      if (!this.form.title || !this.form.focurl || !this.form.addTime) {
        this.$message.info('标题 | 地址 | 发布时间 是必填项')
        return
      }
      if (!this.form.pic) {
        this.$message.info('上传一张轮播图吧')
        return
      }
      this.$request.addFocus({ ...this.form }).then((res) => {
        if (res.result) {
          MessageBox.confirm('您以添加成功，可以取消停留在此页面上，或者前往轮播图列表查看', '添加成功', {
            confirmButtonText: '前往列表页',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
            this.$router.push({ path: '/focus/list' })
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '添加轮播图失败'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .app-container{
    background: #ffffff;
  }
</style>
