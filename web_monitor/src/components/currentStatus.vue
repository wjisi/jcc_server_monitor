<template>
  <div id="currentStatus">
    <div class="title">
      <span>刷新频率</span>
      <el-select v-model="value" placeholder="时间" @change="changeTime">
        <el-option v-for="item in time" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span>请选择节点服务器状态</span>
      <el-select v-model="values" placeholder="节点服务状态" @change="findForState">
        <el-option v-for="item in status" :key="item.values" :label="item.label" :value="item.values"></el-option>
      </el-select>
    </div>
    <div>
       <el-table :data="tableData" border style="width: 100%" :header-row-style="headerRowStyle" :cell-style="cellStyle">
          <el-table-column prop="server" label="节点服务器名称" min-width="9%" align="center" header-align="center"></el-table-column>
          <el-table-column prop="server_state" label="节点服务状态" min-width="10%" align="center"  header-align="center" @change="changeColor"></el-table-column>
          <el-table-column prop="infosGetTime" label="节点状态获取时间" min-width="14%" align="center" header-align="center"></el-table-column>
          <el-table-column prop="complete_ledgers" label="节点本地账本区间" min-width="15%" align="center" header-align="center"></el-table-column>
          <el-table-column prop="peers" label="P2P网络连接节点数量" min-width="13%" align="center" header-align="center"></el-table-column>
          <el-table-column prop="io_latency_ms" label="读写等待时间" min-width="10%" align="center" header-align="center"></el-table-column>
          <el-table-column prop="startup_time" label="节点启动时间" min-width="14%" align="center" header-align="center"></el-table-column>
          <el-table-column prop="build_version" label="节点版本" min-width="8%" align="center" header-align="center"></el-table-column>
          <el-table-column label="历史状态" min-width="8%" align="center" header-align="center">
             <template slot-scope="scope">
                <button @click="toHistory(scope.row.server)" class="lookBtn">立即查看</button>
            </template>
          </el-table-column>
      </el-table>
    </div>
      <ul class="pagination">
         <li><el-pagination background layout="prev, pager, next"  :total="total"></el-pagination> </li>
         <!-- <li>跳至
            <div class="inputDiv"><input type="text" placeholder="212"></div>页
         </li>
         <li> <div class="sortButton">确认</div></li> -->
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
    // getNodeList(data).then(data => {});
  },
  methods: {
    cellStyle(data) {
      if (data.columnIndex === 1) {
        return getStyle(data.row.server_state);
      }
      return "";
    },
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
        this.tableData = this.formatData(res.data);
        // this.total = res.xx;
      });
    },
    toHistory(server) {
      this.$router.push({
        name: "historyStatus",
        params: {
          server: server
        }
      });
    },
    changeTime(value) {
      clearInterval(this.myInter);
      if (value > 0) {
        this.myInter = setInterval(this.getNodeLists, value);
      }
    },
    changeColor() {},
    headerRowStyle() {
      return "font-size:14px;color:#3b3a4b;height:40px";
    },
    getNodeLists() {
      let data = { state: this.currentState };
      getNodeList(data).then(res => {
        this.tableData = this.formatData(res.data);
      });
    },
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
          all_results: item.all_results
        });
      }
      this.total = list[0].all_results;
      return list;
    }
  },
  computed: {
    select: {
      get: function() {
        return this.labels;
      }
    }
  },

  created() {
    // this.myInter = setInterval(this.getNodeLists, 2000);
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
  margin-left: 30px;
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
  width: 70px;
  height: 26px;
  border: none;
  text-align: center;
  line-height: 26px;
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
  .sortButton {
    border: 1px solid #959595;
    border-radius: 6px;
    height: 36px;
    line-height: 36px;
    width: 50px;
    margin-left: 20px;
    background: #f2f8fc;
    padding: 0 3px;
  }
  li .inputDiv {
    width: 36px;
    height: 36px;
    border: 1px solid #959595;
    // display: inline-currentStatus;
    margin: 0 10px;
    border-radius: 6px;
  }
  li div input {
    border-radius: 6px;
    width: 36px;
    height: 36px;
    border: 0;
  }
}
.has-gutter {
  background-color: red;
}
.full {
  background: red;
}
</style>
<style  lang="scss"  >
#currentStatus .pagination .is-background {
  .el-pager li:not(.disabled).active {
    background: #18c9dd;
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
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
