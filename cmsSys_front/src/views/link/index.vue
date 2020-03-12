<template>
  <div class="app-container">
    <el-button
      v-if="checkPermission(['admin'])"
      type="primary"
      @click="dialogaddVisible = true"
    >添加友情链接</el-button>
    <el-table border width="100%" :data="tableData" style="width: 100%;margin-top:30px;">
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.linkName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.addTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.status === 1" src="../../assets/yes.gif" style="cursor: pointer;">
          <img v-else src="../../assets/no.gif" style="cursor: pointer;">
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加友情链接" :visible.sync="dialogaddVisible">
      <el-form ref="form" :model="addfocusInfo" label-width="120px">
        <el-form-item label="设置标题">
          <el-input v-model="addfocusInfo.linkName" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="addfocusInfo.linkurl" placeholder="请输入链接地址" clearable />
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="displayTime1"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model="addfocusInfo.review">
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
    <el-dialog title="编辑友情链接" :visible.sync="dialogeditVisible">
      <el-form ref="form" :model="editfocusInfo" label-width="120px">
        <el-form-item label="设置标题">
          <el-input v-model="editfocusInfo.linkName" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="editfocusInfo.linkurl" placeholder="请输入链接地址" clearable />
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="displayTime2"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model="editfocusInfo.review">
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
      <span>确定删除该友情链接吗?</span>
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
      linkId: '',
      pagination: {
        total: 0,
        page: 1,
        limit: 10
      },
      dialogaddVisible: false,
      dialogdelVisible: false,
      dialogeditVisible: false,
      addfocusInfo: {
        linkName: '',
        linkurl: '',
        addTime: '',
        review: ''
      },
      editfocusInfo: {
        _id: '',
        linkName: '',
        linkurl: '',
        addTime: '',
        review: ''
      }
    }
  },
  computed: {
    displayTime1: {
      get() {
        return +new Date(this.addfocusInfo.addTime)
      },
      set(val) {
        this.addfocusInfo.addTime = new Date(val)
      }
    },
    displayTime2: {
      get() {
        return +new Date(this.editfocusInfo.addTime)
      },
      set(val) {
        this.editfocusInfo.addTime = new Date(val)
      }
    }
  },
  created() {
    this.getlinkList()
  },
  methods: {
    checkPermission,
    getlinkList() {
      this.loading = true
      this.$request.linkFindAll({}).then(res => {
        const { list } = res.data
        this.tableData = list
      })
    },
    handleEdit(index, row) {
      this.dialogeditVisible = true
      this.editfocusInfo._id = row._id
      this.$request.showLink({ id: row._id }).then(res => {
        const { status, linkName, url, addTime } = res.result
        this.editfocusInfo.review = status === 1 ? '审核' : '未审核'
        this.editfocusInfo.linkName = linkName
        this.editfocusInfo.linkurl = url
        this.editfocusInfo.addTime = addTime
      })
    },
    handleDelete(index, row) {
      this.linkId = row._id
      this.dialogdelVisible = true
    },
    doDel() {
      this.$request.delLink({ id: this.linkId }).then(res => {
        if (res.result.deletedCount > 0) {
          this.tableData = []
          this.getlinkList()
          this.dialogdelVisible = false
          this.$notify({
            title: '成功',
            message: '删除友情链接成功',
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '删除友情链接失败'
          })
        }
      })
    },
    doAdd() {
      if (
        !this.addfocusInfo.linkName ||
        !this.addfocusInfo.linkurl ||
        !this.addfocusInfo.addTime ||
        !this.addfocusInfo.review
      ) {
        this.$message.info('标题 | 链接地址 | 发布时间 | 审核状态 是必填项')
        return
      }
      this.$request.addLink({ ...this.addfocusInfo }).then(res => {
        if (res.result) {
          this.dialogaddVisible = false
          this.tableData = []
          this.getlinkList()
          this.$notify({
            title: '成功',
            message: '添加友情链接成功',
            type: 'success'
          })
          this.addfocusInfo.linkName = ''
          this.addfocusInfo.linkurl = ''
          this.addfocusInfo.addTime = ''
          this.addfocusInfo.review = ''
        } else {
          this.$notify.error({
            title: '错误',
            message: '添加友情链接失败'
          })
        }
      })
    },
    doEdit() {
      this.$request.editLink({ ...this.editfocusInfo }).then(res => {
        if (res.result.nModified > 0) {
          this.tableData = []
          this.getlinkList()
          this.dialogeditVisible = false
          this.$notify({
            title: '成功',
            message: '编辑友情链接成功',
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
            message: '编辑友情链接失败'
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
