<template>
  <div>
    当前状态页
    <el-button type="primary" @click="toHistory">点击跳转历史状态页</el-button>
  </div>
</template>

<script>
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch("updateCurrentPage", "currentStatus");
    });
  },
  data() {
    return {};
  },
  methods: {
    toHistory() {
      this.$router.push("historyStatus");
    }
  }
};
</script>

<style scoped>
div {
  width: 90%;
  height: 200px;
  margin: 0 auto;
  line-height: 200px;
  text-align: center;
}
</style>
