<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="100px">
      <el-tabs type="border-card" style="margin-top:15px;">
        <el-tab-pane label="基本设置">
          <el-form-item label="文章标题">
            <el-input v-model="form.title" placeholder="请输入文章标题" clearable />
          </el-form-item>
          <el-form-item label="作者">
            <el-select v-model="form.uid" placeholder="请选择作者">
              <el-option
                v-for="(item,index) in usersData"
                :key="index"
                :label="item.name"
                :value="item._id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="displayTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择时间"
            />
          </el-form-item>
          <el-form-item label="封面图">
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
            </el-upload>
          </el-form-item>
          <el-form-item label="加入推荐">
            <el-checkbox-group v-model="form.type">
              <el-checkbox label="精文" border size="medium" name="type" />
              <el-checkbox label="热文" border size="medium" name="type" />
              <el-checkbox label="新文" border size="medium" name="type" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-radio-group v-model="form.review">
              <el-radio label="审核" border size="medium" />
              <el-radio label="未审核" border size="medium" />
            </el-radio-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="内容设置">
          <Simditor v-model="form.content" :options="options" />
        </el-tab-pane>
        <el-tab-pane label="SEO设置">
          <el-form-item label="关键字">
            <el-input v-model="form.keywords" placeholder="请输入关键字" clearable />
          </el-form-item>
          <el-form-item label="文章描述" prop="desc">
            <el-input
              v-model="form.description"
              type="textarea"
              :autosize="{ minRows: 10, maxRows: 30}"
              placeholder="请输入文章描述"
            />
          </el-form-item>
        </el-tab-pane>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import Simditor from '../../components/Simditor'
import { MessageBox } from 'element-ui'
export default {
  components: {
    Simditor
  },
  data() {
    return {
      usersData: [],
      form: {
        uid: '',
        title: '',
        type: [],
        review: '',
        keywords: '',
        description: '',
        content: '',
        addTime: undefined,
        imgUrl: ''
      },
      options: {
        placeHolder: '请输入内容...',
        toolbarFloat: true,
        toolbar: [
          'title',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'fontScale',
          'color',
          '|',
          'ol',
          'ul',
          'blockquote',
          'code',
          'table',
          '|',
          'image',
          'link',
          'hr',
          '|',
          'indent',
          'outdent',
          'alignment'
        ]
      },
      dialoguploadVisible: false
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
    this.getUsersInfo()
  },
  methods: {
    getUsersInfo() {
      this.$request.usersInfo({}).then(res => {
        const { result } = res.data
        this.usersData = result
      })
    },
    change(val) {
      this.form.content = val
    },
    beforeCoverImgUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
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
            that.form.imgUrl = res.file.imgUrl
            that.$notify({
              title: '成功',
              message: '上传封面图成功',
              type: 'success'
            })
          } else {
            that.$notify.error({
              title: '错误',
              message: '上传封面图失败'
            })
          }
        })
    },
    onSubmit() {
      if (!this.form.uid || !this.form.title || !this.form.addTime) {
        this.$message.info('标题 | 作者 | 发布时间 是必填项')
        return
      }
      if (!this.form.imgUrl) {
        this.$message.info('上传一张封面图吧')
        return
      }
      this.$request.addArticle({ ...this.form }).then(res => {
        if (res.result) {
          MessageBox.confirm(
            '您以添加成功，可以取消停留在此页面上，或者前往文章列表查看',
            '添加成功',
            {
              confirmButtonText: '前往列表页',
              cancelButtonText: '取消',
              type: 'success'
            }
          ).then(() => {
            this.$router.push({ path: '/article/list' })
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '添加文章失败'
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
