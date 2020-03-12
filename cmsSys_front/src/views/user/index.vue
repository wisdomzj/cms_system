<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input placeholder="测试" style="width: 200px;" class="filter-item" />
      <el-select v-model="importance" placeholder="测试" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search">
        搜索
      </el-button>-->
      <el-button
        v-if="checkPermission(['admin'])"
        class="filter-item"
        style="margin-left:0"
        type="primary"
        icon="el-icon-edit"
        @click="dialogaddUserVisible = true"
      >添加</el-button>
    </div>
    <el-table
      border
      :data="tableData"
      fit
      style="margin-top: 20px"
      highlight-current-row
      width="100%"
    >
      <el-table-column label="用户ID" align="center" width="220px">
        <template slot-scope="scope">
          <span>{{ scope.row._id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户头像" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt height="60" width="60" style="border-radius:50%">
        </template>
      </el-table-column>
      <el-table-column label="注册日期" align="center" width="200px">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.addTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次登录日期" align="center" width="200px">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.loginTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin'])" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="pagination.total>0"
      :total="pagination.total"
      :page.sync="pagination.page"
      :limit.sync="pagination.limit"
      @pagination="getuserList"
    />
    <el-dialog title="添加用户" :visible.sync="dialogaddUserVisible">
      <el-form :model="addUser">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="addUser.name" placeholder="请输入用户名" maxlength="10" clearable />
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth">
          <el-input v-model="addUser.password" placeholder="请输入密码" maxlength="6" show-password />
        </el-form-item>
        <el-form-item label="用户头像" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="upload"
            :http-request="addAvatar"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
            accept=".jpg,.jpeg,.png"
          >
            <img v-if="addUser.avatar" :src="addUser.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaddUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAdd">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="dialogeditUserVisible">
      <el-form :model="editUser">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="editUser.name" placeholder="请输入用户名" maxlength="10" clearable />
        </el-form-item>
        <el-form-item label="重置密码" :label-width="formLabelWidth">
          <el-input
            v-model="editUser.password"
            placeholder="请输入密码"
            maxlength="6"
            show-password
            @blur="checkBlur($event)"
          />
        </el-form-item>
        <el-form-item label="更换头像" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action="upload"
            :http-request="editAvatar"
            :before-upload="beforeAvatarUpload"
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
              @click.stop="innerVisible = true"
            >查看原头像</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-dialog width="30%" title="查看原头像" :visible.sync="innerVisible" append-to-body>
        <img :src="editUser.oldavatar" width="100%">
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogeditUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="doEdit">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogdelUserVisible" width="30%">
      <span>确定删除该用户吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogdelUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import checkPermission from '@/utils/permission'
export default {
  components: { Pagination },
  data() {
    return {
      tableData: [],
      showUser: {},
      addUser: {
        name: '',
        password: '',
        avatar: '',
        loginTime: new Date(),
        addTime: new Date()
      },
      editUser: {
        _id: '',
        name: '',
        password: '',
        avatar: '',
        oldpassword: '',
        oldavatar: ''
      },
      delUser: {
        _id: '',
        avatar: ''
      },
      pagination: {
        total: 0,
        page: 1,
        limit: 5
      },
      loading: false,
      dialogaddUserVisible: false,
      dialogeditUserVisible: false,
      dialogdelUserVisible: false,
      innerVisible: false,
      formLabelWidth: '100px'
    }
  },
  created() {
    this.getuserList()
  },
  methods: {
    checkPermission,
    getuserList() {
      this.$request
        .userList({
          page: this.pagination.page,
          size: this.pagination.limit
        })
        .then(res => {
          const { list, total } = res.data
          this.tableData = list
          this.pagination.total = total
        })
    },
    handleFilter() {
      console.log('搜索')
    },
    handleEdit(index, row) {
      this.editUser._id = row._id
      this.$request.showUser({ id: row._id }).then(res => {
        const { avatar, name, password } = res.data.result
        this.editUser.oldavatar = avatar
        this.editUser.name = name
        this.editUser.oldpassword = password
        this.dialogeditUserVisible = true
      })
    },
    handleDelete(index, row) {
      const { _id, avatar } = row
      this.delUser._id = _id
      this.delUser.avatar = avatar
      this.dialogdelUserVisible = true
    },
    checkBlur(e) {
      if (e.target.value === this.editUser.oldpassword) {
        this.$notify({
          title: '警告',
          message: '尽可能不与原密码一致',
          type: 'warning'
        })
      }
    },
    async _isUpload(params) {
      const res = await this.$request.uploadFile({ file: params.file }, true, {
        headers: {
          'Content-Type': 'multipart/form-data;charset=UTF-8'
        }
      })
      return res
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    async addAvatar(params) {
      const res = await this._isUpload(params)
      if (res.msg === 'success') {
        this.addUser.avatar = res.file.imgUrl
        this.$notify({
          title: '成功',
          message: '上传头像成功',
          type: 'success'
        })
      } else {
        this.$notify.error({
          title: '错误',
          message: '上传头像失败'
        })
      }
    },
    async editAvatar(params) {
      const res = await this._isUpload(params)
      if (res.msg === 'success') {
        this.editUser.avatar = res.file.imgUrl
        this.$notify({
          title: '成功',
          message: '编辑头像成功',
          type: 'success'
        })
      } else {
        this.$notify.error({
          title: '错误',
          message: '编辑头像失败'
        })
      }
    },
    doAdd() {
      if (!this.addUser.name || !this.addUser.password) {
        this.$message({
          message: '用户信息填写不完整',
          type: 'warning'
        })
        return
      }
      if (!this.addUser.avatar) {
        this.$message({
          message: '上传一张头像吧!',
          type: 'warning'
        })
        return
      }
      this.$request
        .addUser({ ...this.addUser })
        .then(res => {
          if (res.data.result) {
            this.getuserList()
            this.dialogaddUserVisible = false
            this.addUser.name = ''
            this.addUser.password = ''
            this.addUser.avatar = ''
            this.$notify({
              title: '成功',
              message: '添加用户成功',
              type: 'success'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '添加用户失败'
            })
          }
        })
    },
    doDel() {
      this.$request.delUser({ ...this.delUser }).then(res => {
        if (res.data.result.deletedCount > 0 && res.data.msg === 'success') {
          this.tableData = []
          this.getuserList()
          this.dialogdelUserVisible = false
          this.$notify({
            title: '成功',
            message: '删除用户成功',
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '删除用户失败'
          })
        }
      })
    },
    doEdit() {
      this.$request.editUser({ ...this.editUser }).then(res => {
        if (res.data.result.nModified > 0) {
          this.tableData = []
          this.getuserList()
          this.dialogeditUserVisible = false
          this.editUser.avatar = ''
          this.editUser.password = ''
          this.$notify({
            title: '成功',
            message: '编辑用户成功',
            type: 'success'
          })
        } else if (res.data.result.nModified === 0) {
          this.$notify({
            title: '警告',
            message: '你好像没进行修改数据的操作,淘气~',
            type: 'warning'
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '编辑用户失败'
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 135px;
  height: 135px;
  line-height: 135px;
  text-align: center;
}
.avatar {
  width: 135px;
  height: 135px;
  display: block;
}
</style>
