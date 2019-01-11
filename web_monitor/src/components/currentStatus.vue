<template>
  <div id="currentStatus">
    <div class="title">
      <span>刷新频率</span>
      <el-select v-model="value" placeholder="10s" @change="changeTime">
        <el-option v-for="item in time" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="margin-left:30px;">请选择节点服务器状态</span>
      <el-select v-model="values" placeholder="节点服务状态" @change="findForState">
        <el-option v-for="item in status" :key="item.values" :label="item.label" :value="item.values"></el-option>
      </el-select>
    </div>
    <div>
       <el-table :data="tableData" border style="width: 100%;" :header-row-style="headerRowStyle" :cell-style="cellStyle">
          <el-table-column label="节点/服务器名称" min-width="13px" align="center" header-align="center" :render-header="renderheader">
            <template slot-scope="scope">
              <div>{{setDAta(scope.row.server)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="server_state" label="节点服务状态" min-width="13px" align="center"  header-align="center"></el-table-column>
          <el-table-column label="节点状态/获取时间" min-width="12%" align="center" header-align="center" :render-header="renderheader">
            <template slot-scope="scope">
              <div>{{changeStateDate(scope.row.infosGetTime)}}</div>
              <div>{{changeStateTime(scope.row.infosGetTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="complete_ledgers" label="节点本地账本区间" min-width="15%" align="center" header-align="center">
              <template slot-scope="scope">
              <el-dropdown>
                <div class="complete_ledgers" align="center">{{changeComplete_ledgersData1(scope.row.complete_ledgers)}}</div>
                <div class="complete_ledgers">{{changeComplete_ledgersData2(scope.row.complete_ledgers)}}</div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>{{setDAta(scope.row.complete_ledgers)}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column label="P2P网络/连接节点数量" min-width="12%" align="center" header-align="center" :render-header="renderheader">
            <template slot-scope="scope">
              <div>{{setDAta(scope.row.peers)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="读写/等待时间" min-width="9%" align="center" header-align="center" :render-header="renderheader">
            <template slot-scope="scope">
              <div>{{setDAta(scope.row.io_latency_ms)}}</div>
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
         <li><el-pagination background layout="prev, pager, next"  :total="total"></el-pagination></li>
         <li class="allPage">
          <span>{{total}}</span>页
        </li>
         <li>跳至
            <div class="inputDiv"><input type="text" :placeholder="total"></div>页
         </li>
         <li> <div class="sortButton" >确认</div></li>
      </ul>
  </div>
</template>

<script>
import { getNodeList } from "@/js/fetch";
import { getStyle } from "@/js/utils";
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch("updateCurrentPage", "currentStatus");
    });
  },
  data() {
    return {
      total: 0,
      currentState: "",
      time: [
        {
          value: 5000,
          label: "5s"
        },
        {
          value: 10000,
          label: "10s"
        },
        {
          value: 30000,
          label: "30s"
        },
        {
          value: 600000,
          label: "10min"
        },
        {
          value: -1,
          label: "不刷新"
        }
      ],
      status: [
        {
          values: "",
          label: "节点服务器状态"
        },
        {
          values: "disconnected",
          label: "disconnected"
        },
        {
          values: "connected",
          label: "connected"
        },
        {
          values: "syncing",
          label: "syncing"
        },
        {
          values: "tracking",
          label: "tracking"
        },
        {
          values: "full",
          label: "full"
        },
        {
          values: "validating",
          label: "validating"
        },
        {
          values: "proposing",
          label: "proposing"
        },
        {
          values: "error",
          label: "error"
        }
      ],
      value: "",
      values: "",
      tableData: []
    };
  },
  mounted() {
    this.getNodeLists();
  },
  methods: {
    setDAta(data) {
      return data;
    },
    // 表头换行
    renderheader(h, { column, $index }) {
      return h("span", {}, [
        h("span", {}, column.label.split("/")[0]),
        h("br"),
        h("span", {}, column.label.split("/")[1])
      ]);
    },
    // 节点状态列单元格背景颜色显示
    cellStyle(data) {
      if (data.columnIndex === 1) {
        return getStyle(data.row.server_state);
      }
      return "";
    },
    // 将数据拆换成两行显示
    changeStateDate(data) {
      let changeData = {};
      if (data !== "null") {
        changeData = data.split(/\s/g);
      } else {
        changeData[0] = "null";
      }
      return changeData[0];
    },
    changeStateTime(data) {
      let changeData = {};
      if (data !== "null") {
        changeData = data.split(/\s/g);
      } else {
        changeData[1] = null;
      }
      return changeData[1];
    },
    changeComplete_ledgersData1(data) {
      let changeData = {};
      if (data !== "null" && data.length > 15) {
        changeData = data.split(/,/g);
      } else if (data !== "null" && data.length === 15) {
        changeData[0] = data;
      } else {
        changeData[0] = "null";
      }
      return changeData[0];
    },
    changeComplete_ledgersData2(data) {
      let changeData = {};
      if (data !== "null" && data.length > 15) {
        changeData = data.split(/,/g);
      } else if (data !== "null" && data.length === 15) {
        changeData[1] = null;
      } else {
        changeData[1] = null;
      }
      return changeData[1];
    },
    // 节点服务状态选择
    findForState(state) {
      let data = "";
      if (state === "") {
        data = { state: state };
        this.currentState = state;
      } else {
        data = { state: state };
        this.currentState = state;
      }
      getNodeList(data).then(res => {
        if (res.data.length !== 0) {
          this.tableData = this.formatData(res.data);
        } else {
          this.tableData = "";
        }
      });
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
    // 定时器:刷新pinlv
    changeTime(value) {
      clearInterval(this.myInter);
      if (value > 0) {
        this.myInter = setInterval(this.getNodeLists, value);
      }
    },
    // 表头样式
    headerRowStyle() {
      return "font-size:14px;color:#383a4b;height:40px;";
    },
    // 将处理过的数据绑定到tableData
    getNodeLists() {
      let data = { state: this.currentState };
      getNodeList(data).then(res => {
        this.tableData = this.formatData(res.data);
      });
    },
    // 对从接口中获取的数据处理格式
    formatData(data) {
      let list = [];
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
      let num = list[0].all_results;
      if (num / 10 > 1) {
        this.total = num / 10;
      } else {
        this.total = 1;
      }
      return list;
    }
  },
  created() {
    // this.myInter = setInterval(this.getNodeLists, 10000);
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
    border: 0;
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
    width: 155px;
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
