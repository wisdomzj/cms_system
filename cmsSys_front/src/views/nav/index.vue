<template>
  <div class="app-container">
    <el-button v-if="checkPermission(['admin'])" type="primary" @click="dialogaddVisible = true">添加导航栏</el-button>
    <el-table
      border
      width="100%"
      :data="tableData"
      style="width: 100%;margin-top:30px;"
    >
      <el-table-column
        label="导航栏"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.navName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="链接地址"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="添加时间"
        align="center"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.addTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="审核状态"
        align="center"
      >
        <template slot-scope="scope">
          <img
            v-if="scope.row.status === 1"
            src="../../assets/yes.gif"
            style="cursor: pointer;"
          >
          <img
            v-else
            src="../../assets/no.gif"
            style="cursor: pointer;"
          >
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin'])" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加导航栏" :visible.sync="dialogaddVisible">
      <el-form ref="form" :model="addnavInfo" label-width="120px">
        <el-form-item label="设置导航栏">
          <el-input v-model="addnavInfo.navName" placeholder="请输入导航栏名称" clearable />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="addnavInfo.navurl" placeholder="请输入链接地址" clearable />
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker v-model="displayTime1" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model="addnavInfo.review">
            <el-radio label="审核" border />
            <el-radio label="未审核" border />
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaddVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAdd">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑导航栏" :visible.sync="dialogeditVisible">
      <el-form ref="form" :model="editnavInfo" label-width="120px">
        <el-form-item label="设置标题">
          <el-input v-model="editnavInfo.navName" placeholder="请输入链接名称" clearable />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="editnavInfo.navurl" placeholder="请输入链接地址" clearable />
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker v-model="displayTime2" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model="editnavInfo.review">
            <el-radio label="审核" border />
            <el-radio label="未审核" border />
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogeditVisible = false">取 消</el-button>
        <el-button type="primary" @click="doEdit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogdelVisible" width="30%">
      <span>确定删除该导航栏吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogdelVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
export default {
  data() {
    return {
      tableData: [],
      navId: '',
      dialogaddVisible: false,
      dialogdelVisible: false,
      dialogeditVisible: false,
      addnavInfo: {
        navName: '',
        navurl: '',
        addTime: '',
        review: ''
      },
      editnavInfo: {
        _id: '',
        navName: '',
        navurl: '',
        addTime: '',
        review: ''
      },
      pagination: {
        total: 0,
        page: 1,
        limit: 10
      }
    }
  },
  computed: {
    displayTime1: {
      get() {
        return (+new Date(this.addnavInfo.addTime))
      },
      set(val) {
        this.addnavInfo.addTime = new Date(val)
      }
    },
    displayTime2: {
      get() {
        return (+new Date(this.editnavInfo.addTime))
      },
      set(val) {
        this.editnavInfo.addTime = new Date(val)
      }
    }
  },
  created() {
    this.getnavList()
  },
  methods: {
    checkPermission,
    getnavList() {
      this.loading = true
      this.$request.navFindAll({}).then((res) => {
        const { list } = res.data
        this.tableData = list
      })
    },
    handleEdit(index, row) {
      this.dialogeditVisible = true
      this.editnavInfo._id = row._id
      this.$request.showNav({ id: row._id }).then((res) => {
        const { status, navName, url, addTime } = res.result
        this.editnavInfo.review = (status === 1) ? '审核' : '未审核'
        this.editnavInfo.navName = navName
        this.editnavInfo.navurl = url
        this.editnavInfo.addTime = addTime
      })
    },
    handleDelete(index, row) {
      this.navId = row._id
      this.dialogdelVisible = true
    },
    doDel() {
      this.$request.delNav({ id: this.navId }).then((res) => {
        if (res.result.deletedCount > 0) {
          this.tableData = []
          this.getnavList()
          this.dialogdelVisible = false
          this.$notify({
            title: '成功',
            message: '删除导航栏成功',
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '删除导航栏失败'
          })
        }
      })
    },
    doAdd() {
      if (!this.addnavInfo.navName || !this.addnavInfo.navurl || !this.addnavInfo.addTime || !this.addnavInfo.review) {
        this.$message.info('标题 | 链接地址 | 发布时间 | 审核状态 是必填项')
        return
      }
      this.$request.addNav({ ...this.addnavInfo }).then((res) => {
        if (res.result) {
          this.dialogaddVisible = false
          this.tableData = []
          this.getnavList()
          this.$notify({
            title: '成功',
            message: '添加导航栏成功',
            type: 'success'
          })
          this.addnavInfo.navName = ''
          this.addnavInfo.navurl = ''
          this.addnavInfo.addTime = ''
          this.addnavInfo.review = ''
        } else {
          this.$notify.error({
            title: '错误',
            message: '添加导航栏失败'
          })
        }
      })
    },
    doEdit() {
      this.$request.editNav({ ...this.editnavInfo }).then((res) => {
        if (res.result.nModified > 0) {
          this.tableData = []
          this.getnavList()
          this.dialogeditVisible = false
          this.$notify({
            title: '成功',
            message: '编辑导航栏成功',
            type: 'success'
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
            message: '编辑导航栏失败'
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
