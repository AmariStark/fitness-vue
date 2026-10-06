<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-label">客户总数</div>
          <div class="stat-value">{{ userCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-label">课程总数</div>
          <div class="stat-value">{{ courseCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-label">课程类型数</div>
          <div class="stat-value">{{ courseTypeCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-label">当前登录</div>
          <div class="stat-value small">{{ userName }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">课程类型分布</div>
          <div ref="typeChart" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">客户人群分布</div>
          <div ref="peopleChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { selectAllUserList } from "@/api/user";
import { selectAllCourseList } from "@/api/course";

export default {
  data() {
    return {
      users: [],
      courses: [],
      typeChart: null,
      peopleChart: null
    };
  },
  computed: {
    userCount() {
      return this.users.length;
    },
    courseCount() {
      return this.courses.length;
    },
    courseTypeCount() {
      return new Set(this.courses.map(item => item.type).filter(Boolean)).size;
    },
    userName() {
      return this.$store.state.user.name || "-";
    }
  },
  created() {
    this.loadData();
  },
  mounted() {
    window.addEventListener("resize", this.resizeCharts);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
    if (this.typeChart) {
      this.typeChart.dispose();
    }
    if (this.peopleChart) {
      this.peopleChart.dispose();
    }
  },
  methods: {
    async loadData() {
      try {
        const [userRes, courseRes] = await Promise.all([
          selectAllUserList(),
          selectAllCourseList()
        ]);
        this.users = userRes.data || [];
        this.courses = courseRes.data || [];
        this.$nextTick(this.renderCharts);
      } catch (err) {
        this.$message.error((err && err.msg) || "加载统计数据失败");
      }
    },
    countBy(list, key) {
      return list.reduce((acc, item) => {
        const name = item[key] || "未分类";
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});
    },
    toSeries(list, key) {
      const counted = this.countBy(list, key);
      return Object.keys(counted).map(name => ({ name, value: counted[name] }));
    },
    renderCharts() {
      this.typeChart = echarts.init(this.$refs.typeChart);
      this.typeChart.setOption({
        tooltip: { trigger: "item" },
        legend: { bottom: 0 },
        series: [
          {
            type: "pie",
            radius: ["40%", "65%"],
            data: this.toSeries(this.courses, "type")
          }
        ]
      });

      this.peopleChart = echarts.init(this.$refs.peopleChart);
      this.peopleChart.setOption({
        tooltip: { trigger: "axis" },
        grid: { left: 40, right: 20, top: 20, bottom: 40 },
        xAxis: { type: "category", data: this.toSeries(this.users, "peopleType").map(i => i.name) },
        yAxis: { type: "value", minInterval: 1 },
        series: [
          {
            type: "bar",
            barMaxWidth: 40,
            itemStyle: { color: "#518cff" },
            data: this.toSeries(this.users, "peopleType").map(i => i.value)
          }
        ]
      });
    },
    resizeCharts() {
      if (this.typeChart) {
        this.typeChart.resize();
      }
      if (this.peopleChart) {
        this.peopleChart.resize();
      }
    }
  }
};
</script>

<style scoped>
.stat-label {
  color: #909399;
  font-size: 14px;
  margin-bottom: 10px;
}
.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}
.stat-value.small {
  font-size: 20px;
  line-height: 34px;
}
.chart-row {
  margin-top: 20px;
}
.chart {
  height: 300px;
}
</style>
