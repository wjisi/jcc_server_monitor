<template>
  <div>
    当前状态页
    <el-button type="primary" @click="toHistory">点击跳转历史状态页</el-button>
  </div>
</template>

<script>
import { getNodeList } from "@/js/fetch";
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch("updateCurrentPage", "currentStatus");
    });
  },
  mounted() {
    console.log(
      getNodeList({
        // page: 1
        // state: "",
        // server: ""
      })
    );
  },
  data() {
    return {};
  },
  methods: {
    toHistory() {
      this.$router.push({
        name: "historyStatus",
        params: {
          server: "skfjslkfjs"
        }
      });
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
