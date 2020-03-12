<template>
  <div class="app-container">
    <el-table
      v-loading="loading"
      border
      :data="tableData"
      fit
      style="margin-top: 20px"
      highlight-current-row
      width="100%"
    >
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面图" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.pic" alt height="50" width="100">
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
      <el-table-column v-if="checkPermission(['admin'])" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="dialogdelfocusVisible" width="30%">
      <span>确定删除该轮播图吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogdelfocusVisible = false">取 消</el-button>
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
      delFocus: {
        _id: '',
        pic: ''
      },
      pagination: {
        total: 0,
        page: 1,
        limit: 10
      },
      dialogdelfocusVisible: false
    }
  },
  created() {
    this.getfocusList()
  },
  methods: {
    checkPermission,
    getfocusList() {
      this.loading = true
      this.$request.focusFindAll({}).then(res => {
        const { list, total } = res.data
        this.tableData = list
        this.pagination.total = total
        this.loading = false
      })
    },
    handleEdit(index, row) {
      this.$router.push({ path: '/focus/edit', query: { id: row._id }})
    },
    handleDelete(index, row) {
      const { _id, pic } = row
      this.delFocus._id = _id
      this.delFocus.pic = pic
      this.dialogdelfocusVisible = true
    },
    doDel() {
      this.$request.delFocus({ ...this.delFocus }).then(res => {
        if (res.data.result.deletedCount > 0 && res.data.msg === 'success') {
          this.tableData = []
          this.getfocusList()
          this.dialogdelfocusVisible = false
          this.$notify({
            title: '成功',
            message: '删除轮播图成功',
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '删除轮播图失败'
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
