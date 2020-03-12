<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="设置标题">
          <el-input v-model="form.title" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="form.focurl" placeholder="请输入链接地址" clearable />
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="displayTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            class="upload-demo"
            action="upload"
            :before-upload="beforeCoverImgUpload"
            :http-request="uploadCoverImg"
            :show-file-list="false"
            accept=".jpg,.jpeg,.png"
          >
            <el-button size="small" type="primary">
              点击上传
              <i class="el-icon-upload el-icon--right" />
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              @click.stop="dialogshowVisible = true"
            >查看原头像</el-button>
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
    <el-dialog width="40%" title="查看原轮播图" :visible.sync="dialogshowVisible" append-to-body>
      <img :src="form.focusImg" width="100%">
    </el-dialog>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
export default {
  data() {
    return {
      form: {
        title: '',
        focurl: '',
        addTime: '',
        review: '',
        pic: '',
        focusImg: ''
      },
      focusId: null,
      dialoguploadVisible: false,
      dialogshowVisible: false
    }
  },
  computed: {
    displayTime: {
      get() {
        return +new Date(this.form.addTime)
      },
      set(val) {
        this.form.addTime = new Date(val)
      }
    }
  },
  created() {
    this.showfocusInfo()
  },
  methods: {
    showfocusInfo() {
      const { id } = this.$route.query
      this.focusId = id
      this.$request.showFocus({ id }).then(res => {
        const { status, title, url, addTime, pic } = res.result
        this.form.review = status === 1 ? '审核' : '未审核'
        this.form.title = title
        this.form.focurl = url
        this.form.addTime = addTime
        this.form.focusImg = pic
      })
    },
    beforeCoverImgUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传轮播图片大小不能超过 2MB!')
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
      this.$request.editFocus({ _id: this.focusId, ...this.form }).then(res => {
        if (res.result.nModified > 0) {
          MessageBox.confirm(
            '您以编辑成功，可以取消停留在此页面上，或者前往轮播图列表查看',
            '编辑成功',
            {
              confirmButtonText: '前往列表页',
              cancelButtonText: '取消',
              type: 'success'
            }
          ).then(() => {
            this.$router.push({ path: '/focus/list' })
          })
        } else if (res.result.nModified === 0) {
          this.$notify({
            title: '警告',
            message: '你好像没进行修改数据的操作,淘气~',
            type: 'warning'
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '编辑轮播图失败'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.app-container {
  background: #ffffff;
}
</style>

