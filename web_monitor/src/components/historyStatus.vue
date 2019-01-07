<template>
  <div>
    历史状态页
    <el-button type="success" @click="toHome">点击返回当前状态页</el-button>
  </div>
</template>

<script>
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch("updateCurrentPage", "historyStatus");
    });
  },
  data() {
    return {};
  },
  methods: {
    toHome() {
      this.$router.push("/");
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
