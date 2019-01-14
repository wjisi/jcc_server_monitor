<template>
  <div class="main" :style="{'min-height':height+'px'}">
    <header id="header">
      <section class="logo">
        <i class="iconfont icon-jingchanglogo" style="margin-right:5px;font-size:26px;"></i>
        <span v-show="isShowSearch" class="logoTitle">井通服务器节点状态</span>
        <span v-show="!isShowSearch" class="logoTitle">{{currentNode}} 节点历史状态</span>
      </section>
      <section v-show="isShowSearch" class="search">
        <input v-model="searchContent" type="text" placeholder="请输入要查看的节点服务器" @focus="searchContent=''">
        <button @click="search"><i class="iconfont icon-chaxunicon" style="color:#fff;font-size:18px;"></i></button>
      </section>
    </header>
    <router-view/>
  </div>
</template>

<script>
import { getClientHeight } from "@/js/utils";
import bus from "@/js/bus";

export default {
  name: "index",
  data() {
    return {
      searchContent: ""
    };
  },
  methods: {
    search() {
      let target = this.searchContent;
      if (target === "") {
        return;
      }
      bus.$emit("search", this.searchContent);
    }
  },
  computed: {
    height() {
      return getClientHeight();
    },
    isShowSearch() {
      return this.$store.getters.currentPage === "currentStatus";
    },
    currentNode() {
      return this.$store.getters.currentNode;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/css/common.scss";
.main {
  background-color: #f9faff;
  #header {
    background-color: #5769fa;
    color: #f4f4fb;
    font-size: 20px;
    font-weight: 500;
  }
  .logoTitle {
    position: relative;
    top: -2px;
  }
  .search {
    display: flex;
    input {
      height: 40px;
      font-size: 14px;
      text-indent: 14px;
      color: #a19fa1;
      border: none;
      border-radius: 4px 0 0 4px;
      float: left;
    }
    button {
      height: 40px;
      width: 42px;
      background-color: #02d6e7;
      outline: none;
      border: none;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      float: left;
    }
  }
}
</style>