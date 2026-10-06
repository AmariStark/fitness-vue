<template>
  <div>
    <el-pagination 
    background 
    style="text-align: right;" 
    @size-change="handleSizeChange" 
    @current-change="handleCurrentChange"
    :current-page="page" 
    :page-sizes="[10, 20, 30, 40]" 
    :page-size="10"
    layout="total, sizes, prev, pager, next, jumper" 
    :total="total">
    </el-pagination>
  </div>
</template>
<script>
export default {
 props: {
    total: {
        type: Number
    },
    page: {
        type: Number
    }
 },
  methods: {
    handleSizeChange(val) {
        this.$emit("size", val)
      },
      handleCurrentChange(val) {
        this.$emit("current", val)
      }
  },
};
</script>