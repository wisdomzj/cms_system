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
      <el-table-column label="作者" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.uid.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面图" width="150px" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" alt height="50" width="100">
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="200px" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.addTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="热文" width="75px" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.is_hot === 1" src="../../assets/yes.gif" style="cursor: pointer;">
          <img v-else src="../../assets/no.gif" style="cursor: pointer;">
        </template>
      </el-table-column>
      <el-table-column label="新文" width="75px" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.is_new === 1" src="../../assets/yes.gif" style="cursor: pointer;">
          <img v-else src="../../assets/no.gif" style="cursor: pointer;">
        </template>
      </el-table-column>
      <el-table-column label="精文" width="75px" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.is_best === 1" src="../../assets/yes.gif" style="cursor: pointer;">
          <img v-else src="../../assets/no.gif" style="cursor: pointer;">
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="100px" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.status === 1" src="../../assets/yes.gif" style="cursor: pointer;">
          <img v-else src="../../assets/no.gif" style="cursor: pointer;">
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin'])" label="操作" width="150px" align="center">
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
      @pagination="getarticleList"
    />
    <el-dialog title="提示" :visible.sync="dialogdelArtVisible" width="30%">
      <span>确定删除该文章吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogdelArtVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
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
      dialogdelArtVisible: false,
      delArticle: {
        _id: '',
        imgUrl: ''
      },
      pagination: {
        total: 0,
        page: 1,
        limit: 5
      }
    }
  },
  created() {
    this.getarticleList()
  },
  methods: {
    checkPermission,
    getarticleList() {
      this.loading = true
      this.$request
        .articleFindAll({
          page: this.pagination.page,
          size: this.pagination.limit
        })
        .then(res => {
          const { list1, total } = res.data
          this.tableData = list1
          this.pagination.total = total
          this.loading = false
        })
    },
    handleEdit(index, row) {
      this.$router.push({ path: '/article/edit', query: { id: row._id }})
    },
    handleDelete(index, row) {
      const { _id, imgUrl } = row
      this.delArticle._id = _id
      this.delArticle.imgUrl = imgUrl
      this.dialogdelArtVisible = true
    },
    doDel() {
      this.$request.removeArticle({ ...this.delArticle }).then(res => {
        if (res.data.result.deletedCount > 0 && res.data.msg === 'success') {
          this.tableData = []
          this.getarticleList()
          this.dialogdelArtVisible = false
          this.$notify({
            title: '成功',
            message: '删除文章成功',
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '删除文章失败'
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
