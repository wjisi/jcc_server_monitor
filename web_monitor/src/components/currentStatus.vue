<template>
  <div id="currentStatus">
    <div class="title">
      <span>刷新频率</span>
      <el-select v-model="refreshTime" @change="refreshRrequency">
        <el-option v-for="item in time" :key="item.refreshTime" :label="item.label" :value="item.refreshTime"></el-option>
      </el-select>
      <span style="margin-left:30px;">请选择节点服务器状态</span>
      <el-select v-model="selectStatus" @change="findForState">
        <el-option v-for="item in status" :key="item.selectStatus" :label="item.label" :value="item.selectStatus"></el-option>
      </el-select>
    </div>
    <div>
       <el-table :data="tableData" border style="width: 100%;" :header-row-style="headerRowStyle" :cell-style="ServerStateCellStyle">
          <el-table-column label="节点服务器名称/ID" min-width="13px" align="center" header-align="center">
           <template slot-scope="scope">
              <el-popover placement="top-start" width="150" trigger="hover">
                <div style="width:100%;text-align:center;">ID: {{scope.row.server_ID}}</div>
                <el-col slot="reference">{{(scope.row.server)}}</el-col>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="server_state" label="节点服务状态" min-width="13px" align="center"  header-align="center"></el-table-column>
          <el-table-column label="节点状态/获取时间" min-width="12%" align="center" header-align="center">
            <template slot-scope="scope">
              <div>{{changeStateDate(scope.row.infosGetTime)}}</div>
              <div>{{changeStateTime(scope.row.infosGetTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="complete_ledgers" label="节点本地账本区间" min-width="15%" align="center" header-align="center">
              <template slot-scope="scope">
              <el-dropdown>
                <div class="complete_ledgers" align="center">{{changeCompleteLedgersData1(scope.row.complete_ledgers)}}</div>
                <div class="complete_ledgers">{{changeCompleteLedgersData2(scope.row.complete_ledgers)}}</div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>{{scope.row.complete_ledgers}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column label="P2P网络连接节点数量" min-width="12%" align="center" header-align="center" >
            <template slot-scope="scope">
              <div>{{scope.row.peers}}</div>
            </template>
          </el-table-column>
          <el-table-column label="读写等待时间" min-width="9%" align="center" header-align="center">
            <template slot-scope="scope">
              <div>{{scope.row.io_latency_ms}}</div>
            </template>
          </el-table-column>
          <el-table-column label="节点启动时间" min-width="12%" align="center" header-align="center">
            <template slot-scope="scope">
              <div>{{changeStateDate(scope.row.startup_time)}}</div>
              <div>{{changeStateTime(scope.row.startup_time)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="build_version" label="节点版本" min-width="9%" align="center" header-align="center"></el-table-column>
          <el-table-column label="历史状态" min-width="9%" align="center" header-align="center">
             <template slot-scope="scope">
                <button @click="toHistory(scope.row.server)" class="lookBtn">立即查看</button>
            </template>
          </el-table-column>
      </el-table>
    </div>
      <ul class="pagination">
         <li><el-pagination background layout="prev, pager, next"  :total="total" @current-change="handleCurrentChange" :page-size="10"></el-pagination></li>
         <li class="allPage"><span>{{total}}</span>条</li>
         <li>跳至<div class="inputDiv"><input type="text" v-model="gopage"></div>页</li>
         <li><div class="sortButton" @click="handleSizeChange">确认</div></li>
      </ul>
  </div>
</template>

<script>
import { getNodeList } from "@/js/fetch";
import { getStyle } from "@/js/utils";
import bus from "@/js/bus";
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch("updateCurrentPage", "currentStatus");
    });
  },
  beforeDestory() {
    clearInterval(this.myInter);
    bus.$off("search");
  },
  data() {
    return {
      page: "",
      total: 0,
      refreshTime: 10000,
      selectStatus: "",
      tableData: [],
      server: "",
      gopage: "1",
      time: [
        { refreshTime: 5000, label: "5s" },
        { refreshTime: 10000, label: "10s" },
        { refreshTime: 30000, label: "30s" },
        { refreshTime: 600000, label: "10min" },
        { refreshTime: -1, label: "不刷新" }
      ],
      status: [
        { selectStatus: "", label: "所有状态" },
        { selectStatus: "disconnected", label: "disconnected" },
        { selectStatus: "connected", label: "connected" },
        { selectStatus: "syncing", label: "syncing" },
        { selectStatus: "tracking", label: "tracking" },
        { selectStatus: "full", label: "full" },
        { selectStatus: "validating", label: "validating" },
        { selectStatus: "proposing", label: "proposing" },
        { selectStatus: "error", label: "error" }
      ]
    };
  },
  created() {
    this.getNodeLists();
    this.refreshRrequency();
    bus.$on("search", this.toSearch);
  },
  methods: {
    // 确认按钮
    handleSizeChange() {
      let datas = {
        server: this.server,
        start: this.selectStatus,
        page: this.gopage || this.total
      };
      this.getNodeLists(datas);
    },
    // 分页
    handleCurrentChange(page) {
      let datas = {
        server: this.server,
        start: this.selectStatus,
        page: page
      };
      this.getNodeLists(datas);
    },
    // 查询
    toSearch(id) {
      if (id !== "") {
        this.server = id;
        this.selectStatus = null;
        this.getNodeLists();
      }
    },
    // 节点状态列单元格背景颜色显示
    ServerStateCellStyle(status) {
      if (status.columnIndex === 1) {
        return getStyle(status.row.server_state);
      }
      return "";
    },
    // 将数据拆换成两行显示
    changeStateDate(startupTime) {
      let changeData = {};
      if (startupTime !== "null") {
        changeData = startupTime.split(/\s/g);
      } else {
        changeData[0] = "null";
      }
      return changeData[0];
    },
    changeStateTime(startupTime) {
      let changeData = {};
      if (startupTime !== "null") {
        changeData = startupTime.split(/\s/g);
      } else {
        changeData[1] = null;
      }
      return changeData[1];
    },
    changeCompleteLedgersData1(completeLedger) {
      let changeData = {};
      if (completeLedger !== "null" && completeLedger.length > 15) {
        changeData = completeLedger.split(/,/g);
      } else if (completeLedger !== "null" && completeLedger.length === 15) {
        changeData[0] = completeLedger;
      } else {
        changeData[0] = "null";
      }
      return changeData[0];
    },
    changeCompleteLedgersData2(completeLedger) {
      let changeData = {};
      if (completeLedger !== "null" && completeLedger.length > 15) {
        changeData = completeLedger.split(/,/g);
      } else if (completeLedger !== "null" && completeLedger.length === 15) {
        changeData[1] = null;
      } else {
        changeData[1] = null;
      }
      return changeData[1];
    },
    // 节点服务状态选择
    findForState(state) {
      this.server = "";
      let referdata = "";
      if (state === "") {
        referdata = {
          state: state,
          server: this.server || "",
          page: this.page || 1
        };
        this.selectStatus = state;
      } else {
        referdata = {
          state: state,
          server: this.server || "",
          page: this.page || 1
        };
        this.selectStatus = state;
      }
      getNodeList(referdata).then(res => {
        if (res.data.length !== 0) {
          this.tableData = this.formatData(res.data);
        } else {
          this.tableData = [];
        }
      });
      return state;
    },
    // 页面跳转到历史节点页面
    toHistory(server) {
      this.$router.push({
        name: "historyStatus",
        params: {
          server: server
        }
      });
      clearInterval(this.myInter);
    },
    // 定时器:刷新频率
    refreshRrequency() {
      clearInterval(this.myInter);
      if (this.refreshTime > 0) {
        this.myInter = setInterval(() => {
          console.log("当前刷新" + this.refreshTime);
          this.getNodeLists();
        }, this.refreshTime);
      }
    },
    // 表头样式
    headerRowStyle() {
      return "font-size:14px;color:#383a4b;height:40px;";
    },
    // 将处理过的数据绑定到tableData
    getNodeLists() {
      let resdata = {
        server: this.server || "",
        state: this.selectStatus || "",
        page: this.page || 1
      };
      getNodeList(resdata).then(res => {
        this.tableData = this.formatData(res.data);
      });
    },
    // 对从接口中获取的数据处理格式
    formatData(data) {
      let list = [];
      if (data.length > 0) {
        let i = 0;
        for (; i < data.length; i++) {
          let item = JSON.parse(data[i]);
          list.push({
            index: i + 1,
            server: item.server,
            server_ID: item.server_ID || "null",
            server_state: item.server_state,
            infosGetTime: item.infosGetTime,
            complete_ledgers: item.complete_ledgers || "null",
            build_version: item.build_version || "null",
            io_latency_ms: item.io_latency_ms || "null",
            peers: item.peers || "null",
            startup_time: item.startup_time || "null",
            all_results: item.all_results || "null"
          });
        }
        this.total = list[0].all_results;
      } else {
        this.total = 1;
      }
      return list;
    }
  }
};
</script>

<style lang="scss" scoped>
#currentStatus {
  background-color: #f9faff;
  text-align: center;
  margin: 0 30px;
}
.title {
  width: 90%;
  text-align: left;
  margin-top: 30px;
}
.title > span {
  font-size: 16px;
  color: #383a4b;
}
.el-select {
  width: 155px;
  margin-left: 10px;
}
.el-table {
  margin-top: 20px;
  border-radius: 6px;
  outline: 2px solid #ecedf6;
  outline-offset: -2px;
}
.lookBtn {
  background: #289ef5;
  color: #ffffff;
  font-size: 12px;
  border-radius: 13px;
  min-width: 62px;
  height: 26px;
  border: none;
  text-align: center;
  line-height: 26px;
  outline: none;
  cursor: pointer;
}
li {
  margin-top: 20px;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  margin-top: 20px;
  padding-bottom: 110px;
  .allPage {
    font-size: 14px;
    height: 38px;
    line-height: 38px;
    color: #959595;
    margin-right: 20px;
    span {
      margin-right: 10px;
    }
  }
  .sortButton {
    border: 1px solid #959595;
    border-radius: 6px;
    height: 36px;
    line-height: 36px;
    width: 50px;
    margin-left: 20px;
    background: #f2f8fc;
    padding: 0 3px;
    cursor: pointer;
  }
  .sortButton:hover {
    color: #289ef5;
    border-color: #289ef5;
  }
  li .inputDiv {
    display: inline;
    margin: 0 10px;
    border-radius: 6px;
    input::-webkit-input-placeholder {
      text-align: center;
    }
  }
  li div input {
    border-radius: 6px;
    width: 36px;
    height: 36px;
    border: 1px solid #959595;
  }
}
.complete_ledgers.el-dropdown-selfdefine {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-dropdown-link {
  white-space: nowrap;
  height: 36px;
  line-height: 38px;
  padding: 0 10px;
  color: #fff;
  cursor: pointer;
  margin-right: 4%;
  i {
    font-size: 8px;
    margin-left: 8px;
    position: relative;
    bottom: 1px;
  }
}
.el-dropdown-menu {
  background-color: #fff;
  .el-dropdown-menu__item {
    width: 200px;
    text-align: center;
  }
}
</style>
<style  lang="scss"  >
#currentStatus .pagination .is-background {
  .el-pager li:not(.disabled).active {
    background: #5769fa;
    color: #ffffff;
  }
  .el-pager li {
    background: #ffffff;
    width: 40px;
    height: 40px;
    line-height: 40px;
    margin-right: 10px;
    border-radius: 6px;
    font-size: 14px;
    color: #959595;
  }
  .btn-next,
  .btn-prev {
    background: #ffffff;
    width: 40px;
    height: 40px;
    line-height: 40px;
    margin-right: 10px;
    border-radius: 6px;
    font-size: 14px;
    color: #959595;
    border: 1px solid #959595;
  }
}
#currentStatus .el-pager .el-icon-more {
  display: none;
}
#currentStatus .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #f8f8fb;
  cursor: pointer;
}
.el-table__body tr {
  color: #4d4f57;
  font: 14px;
  max-height: 52px;
}
</style>
