<template>
  <div class="user">
    <div class="toolbar">
      <el-button type="primary" icon="el-icon-plus" @click="openAdd">新增客户</el-button>
      <el-button icon="el-icon-refresh" @click="loadList">刷新</el-button>
    </div>

    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column fixed prop="id" label="序号" width="80"></el-table-column>
      <el-table-column prop="userName" label="客户名称" width="160"></el-table-column>
      <el-table-column prop="phoneNumber" label="电话号码" width="160"></el-table-column>
      <el-table-column prop="courseName" label="课程名称" width="160"></el-table-column>
      <el-table-column prop="type" label="课程类型" width="120"></el-table-column>
      <el-table-column prop="peopleType" label="所属人群" width="120"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" class="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增 / 编辑客户 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="520px"
      :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="客户名称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="课程类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择课程类型">
            <el-option v-for="item in courseTypes" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属人群" prop="peopleType">
          <el-select v-model="form.peopleType" placeholder="请选择所属人群">
            <el-option v-for="item in peopleTypes" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="saving" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectAllUserList, addUser, updateUser, deleteUser } from "@/api/user";

// 与数据库 user.type / user.people_type 的枚举保持一致
const COURSE_TYPES = ["游泳类", "力量类", "格斗类"];
const PEOPLE_TYPES = ["中小学生", "大学生", "小白用户", "牛马族", "健身达人"];

function emptyForm() {
  return { id: null, userName: "", phoneNumber: "", courseName: "", type: "", peopleType: "" };
}

export default {
  data() {
    return {
      tableData: [],
      loading: false,
      saving: false,
      dialogVisible: false,
      isEdit: false,
      courseTypes: COURSE_TYPES,
      peopleTypes: PEOPLE_TYPES,
      form: emptyForm(),
      rules: {
        courseName: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择课程类型", trigger: "change" }],
        peopleType: [{ required: true, message: "请选择所属人群", trigger: "change" }]
      }
    };
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? "编辑客户" : "新增客户";
    }
  },
  created() {
    this.loadList();
  },
  methods: {
    async loadList() {
      this.loading = true;
      try {
        const res = await selectAllUserList();
        this.tableData = res.data || [];
      } catch (err) {
        this.$message.error((err && err.msg) || "加载客户列表失败");
      } finally {
        this.loading = false;
      }
    },
    openAdd() {
      this.isEdit = false;
      this.form = emptyForm();
      this.dialogVisible = true;
      this.clearValidate();
    },
    openEdit(row) {
      this.isEdit = true;
      this.form = Object.assign(emptyForm(), row);
      this.dialogVisible = true;
      this.clearValidate();
    },
    clearValidate() {
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    save() {
      this.$refs.form.validate(async valid => {
        if (!valid) {
          return;
        }
        this.saving = true;
        try {
          const res = this.isEdit ? await updateUser(this.form) : await addUser(this.form);
          this.$message.success(res.msg || "保存成功");
          this.dialogVisible = false;
          this.loadList();
        } catch (err) {
          this.$message.error((err && err.msg) || "保存失败");
        } finally {
          this.saving = false;
        }
      });
    },
    remove(row) {
      this.$confirm(`确定要删除客户 "${row.userName || row.id}" 吗？`, "警告", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            const res = await deleteUser(row.id);
            this.$message.success(res.msg || "删除成功");
            this.loadList();
          } catch (err) {
            this.$message.error((err && err.msg) || "删除失败");
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.toolbar {
  margin-bottom: 15px;
}
.danger {
  color: #f56c6c;
}
</style>
