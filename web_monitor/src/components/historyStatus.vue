<template>
  <div id="historystatus" class="blo">
    <div class="previous">
      <i class="iconfont icon-fanhuishangyiyeicon"></i>
      <span @click="goback">返回上一页</span>
    </div>
    <div class="title">
      <span class="titleItem">刷新频率</span>
      <el-select v-model="selectRefreshvalue"  @change="changefreshTime" style="width:100px">
        <el-option v-for="item in time" :key="item.selectRefreshvalue" :label="item.label" :value="item.selectRefreshvalue"></el-option>
      </el-select>
      <span class="titleItem1">请选择节点服务器状态</span>
      <el-select v-model="selectStatusvalues"  @change="selectState" style="width:140px">
        <el-option v-for="item in status" :key="item.selectStatusvalues" :label="item.label" :value="item.selectStatusvalues"></el-option>
      </el-select>
      <span class="selctionData">日期范围
        <el-date-picker v-model="start" type="date" value-format="yyyy-MM-dd" placeholder="开始时间"></el-date-picker>至
        <el-date-picker v-model="end" type="date" value-format="yyyy-MM-dd" placeholder="结束时间"></el-date-picker>
        <span class="sure" @click="selectTimerange">确认</span>
      </span>
    </div>
    <div class="bockList">
      <div class="blockList">
        <el-table :data="blockList" style="width:100%" row-class-name="historystatusrowClass" header-row-class-name="historystatusHeaderRowclass" :cell-style="cellStyle">
          <el-table-column prop="server_state" label="节点服务器状态" id="ellipsis" min-width="10%" align="center" header-align="center">
            <template slot-scope="scope"> <div>{{scope.row.server_state}}</div></template>
          </el-table-column>
          <el-table-column prop="infosGetTime" label="节点状态获取时间" id="ellipsis" min-width="13%" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.infosGetTime.date}}</div>
              <div>{{scope.row.infosGetTime.time}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="complete_ledgers" label="节点本地账本区间" align="center" min-width="15%">
            <template slot-scope="scope">
              <el-popover placement="top-start" width="200" trigger="hover" :content="scope.row.complete_ledgers.all">
                <el-button slot="reference"> <div>{{scope.row.complete_ledgers.data1}}</div> <div>{{scope.row.complete_ledgers.data2}}</div></el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="peers"  label="P2P网络连接节点数量"  id="ellipsis"  align="center"  min-width="14%" >
            <template slot-scope="scope"><div>{{scope.row.peers}}</div></template>
          </el-table-column>
          <el-table-column prop="io_latency_ms" label="读写等待时间" id="ellipsis" align="center" min-width="10%"></el-table-column>
          <el-table-column prop="startup_time" label="节点启动时间" id="ellipsis" align="center" min-width="13%">
            <template slot-scope="scope">
              <div>{{scope.row.startup_time.date}}</div>
              <div>{{scope.row.startup_time.time}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="build_version" label="节点版本" align="center" min-width="9%"></el-table-column>
          <el-table-column prop="hash" label="公钥" align="center" min-width="16%">
            <template slot-scope="scope">
              <div>{{scope.row.nodePublic}}</div>
            </template>
          </el-table-column>
          <el-table-column type="expand" width="35" align="left">
            <template slot-scope="props">
              <el-form label-position="right" inline class="demo-table-expand">
                <el-form-item label="节点公钥"><span>{{ props.row.nodePublic }}</span></el-form-item>
                <el-form-item label="最后验证区块高度"> <span>{{ props.row.last_ledger_heigth }}</span></el-form-item>
                <el-form-item label="最后验证区块HASH值"><span>{{ props.row.hash }}</span></el-form-item>
                <el-form-item label="最后验证区块时间"> <span>{{ props.row.last_ledger_time }}</span></el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <ul class="pagination">
        <li> <el-pagination background layout="prev, pager, next" :total="total" :page-size="10" :current-page="parseInt(currentPage)" @current-change="handleCurrentChange"></el-pagination></li>
        <li class="allPage"><span>{{allpage}}</span>页</li>
        <li>跳至<div class="input"><input type="text"  v-model="gopage" @focus="clearGopage"></div>页</li>
        <li><div class="sortButton" @click="jumpSizeChange">确认</div></li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getNodeHistoryList } from "@/js/fetch";
import { getStyle } from "@/js/utils";
export default {
  name: "historyStatus",
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch("updateCurrentPage", "historyStatus");
      vm.$store.dispatch("updateCurrentNode", vm.$route.params.server);
    });
  },
  beforeRouteLeaver() {
    clearInterval(this.timer);
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      time: [
        { selectRefreshvalue: 5000, label: "5s" },
        { selectRefreshvalue: 10000, label: "10s" },
        { selectRefreshvalue: 30000, label: "30s" },
        { selectRefreshvalue: 600000, label: "10min" },
        { selectRefreshvalue: -1, label: "不刷新" }
      ],
      status: [
        { selectStatusvalues: "所有状态", label: "所有状态" },
        { selectStatusvalues: "disconnected", label: "disconnected" },
        { selectStatusvalues: "connected", label: "connected" },
        { selectStatusvalues: "syncing", label: "syncing" },
        { selectStatusvalues: "tracking", label: "tracking" },
        { selectStatusvalues: "full", label: "full" },
        { selectStatusvalues: "validating", label: "validating" },
        { selectStatusvalues: "proposing", label: "proposing" },
        { selectStatusvalues: "error", label: "error" }
      ],
      blockList: [],
      selectRefreshvalue: 10000,
      selectStatusvalues: "所有状态",
      start: "",
      end: "",
      timer: "",
      total: 0,
      allpage: 1,
      startup_time: {},
      gopage: 100,
      currentPage: 1
    };
  },
  computed: {
    server() {
      return this.$store.getters.currentNode;
    }
  },
  created() {
    this.getData();
    this.changefreshTime();
  },
  methods: {
    clearGopage() {
      this.gopage = "";
    },
    jumpSizeChange() {
      this.currentPage = this.gopage;
      let datas = {
        server: this.server,
        start: this.start,
        end: this.end,
        state: this.selectStatusvalues,
        page: this.gopage || 100
      };
      this.getData(datas);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      let datas = {
        server: this.server,
        start: this.start,
        end: this.end,
        state: this.selectStatusvalues,
        page: val
      };
      this.getData(datas);
    },
    goback() {
      this.$router.go(-1);
    },
    cellStyle(data) {
      if (data.columnIndex === 0) {
        return getStyle(data.row.server_state);
      }
      return "";
    },
    changefreshTime() {
      clearInterval(this.timer);
      if (this.selectRefreshvalue > 0) {
        this.timer = setInterval(() => {
          let datas = {
            server: this.server,
            start: this.start,
            end: this.end,
            state: this.selectStatusvalues,
            page: this.currentPage
          };
          this.getData(datas);
        }, this.selectRefreshvalue);
      }
    },
    selectTimerange() {
      let datas = {
        server: this.server,
        start: this.start,
        end: this.end,
        state: this.selectStatusvalues,
        page: this.currentPage
      };
      this.changefreshTime();
      this.getData(datas);
    },
    selectState() {
      this.currentPage = 1;
      this.total = 0;
      let datas = {
        server: this.server,
        start: this.start,
        end: this.end,
        state: this.selectStatusvalues,
        page: this.currentPage
      };
      this.changefreshTime();
      this.getData(datas);
    },
    async getData(datas = {}) {
      if (datas.state === "所有状态") {
        datas.state = "";
      }
      let data = {
        server: this.server,
        start: datas.start || "",
        end: datas.end || "",
        state: datas.state || "",
        page: datas.page || ""
      };
      let res = await getNodeHistoryList(data);
      this.blockList = this.handleGetData(res.data);
    },
    handleGetData(res) {
      let i = 0;
      let list = [];
      for (; i < res.length; i++) {
        let resData = JSON.parse(res[i]);
        list.push({
          server_state: resData.server_state || "null",
          infosGetTime: this.intervalTime(resData.infosGetTime),
          complete_ledgers: this.intervalString(resData.complete_ledgers),
          peers: resData.peers || "null",
          io_latency_ms: resData.io_latency_ms || "null",
          startup_time: this.intervalTime(resData.startup_time) || "null",
          build_version: resData.build_version || "null",
          nodePublic: resData.public || "null",
          last_ledger_heigth: resData.last_ledger_heigth || "null",
          hash: resData.hash || "null",
          last_ledger_time: resData.last_ledger_time || "null",
          all_results: resData.all_results || "null"
        });
      }
      if (list.length === 0) {
        this.total = 0;
        this.allpage = 0;
        this.gopage = 0;
        return list;
      } else {
        this.total = list[0].all_results;
        this.allpage = Math.ceil(this.total / 10);
        this.gopage = this.allpage;
      }
      return list;
    },
    intervalTime(value) {
      let dateTime = {};
      if (value) {
        dateTime.date = value.split(" ")[0];
        dateTime.time = value.split(" ")[1];
      } else {
        dateTime.date = "null";
        dateTime.time = "";
      }
      return dateTime;
    },
    intervalString(value) {
      let ellipsisString = {};
      if (value) {
        ellipsisString.data1 = value.substring(0, 8);
        ellipsisString.data2 = value.substring(8, 13);
        ellipsisString.all = value;
      } else {
        ellipsisString.data1 = "null";
        ellipsisString.data2 = "";
        ellipsisString.all = "";
      }
      return ellipsisString;
    }
  }
};
</script>
<style lang="scss" scoped>
.bockList {
  border: 1px solid #e0e8ed;
}
.title {
  width: 100%;
  text-align: left;
  margin-top: 20px;
  margin-bottom: 20px;
  .titleItem {
    font-size: 16px;
    color: #383a4b;
  }
  .titleItem1 {
    font-size: 16px;
    color: #383a4b;
    padding-left: 10px;
  }
}
.el-select {
  width: 155px;
  margin-left: 10px;
}
#historystatus {
  min-width: 940px;
  padding: 0 30px;
  padding-bottom: 110px;
  background: #f9faff;
  .previous {
    color: #289ef5;
    font-size: 14px;
    text-align: left;
    padding-top: 20px;
    cursor: pointer;
    span {
      margin-left: 8px;
    }
  }
  .selction {
    padding: 30px 0 20px 0;
    height: 40px;
    line-height: 40px;
    text-align: left;
    font-size: 16px;
    color: #383a4b;
  }
  .interval {
    padding: 0 10px 0;
  }
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  font-size: 14px;
  padding: 20px 0;
  color: #959595;
  .allPage {
    padding-top: 2px;
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
    width: 58px;
    color: #959595;
    margin-left: 20px;
  }
  .sortButton:hover {
    cursor: pointer;
  }
  li .input {
    width: 36px;
    height: 36px;
    border: 1px solid #959595;
    display: inline-block;
    border-radius: 6px;
    margin: 0 10px;
  }
  li div input {
    border-radius: 6px;
    width: 36px;
    height: 36px;
    border: 0;
    text-align: center;
    text-indent: 0;
  }
}
.el-select-dropdown__item {
  font-size: 14px;
  color: #565a65;
}
.el-select-dropdown__item:hover {
  background: #f2fbef;
  opacity: 80%;
}
</style>

<style  lang="scss" >
.el-icon-arrow-right {
  font-size: 16px;
}
.el-table__expanded-cell {
  padding: 0px 20px !important;
  padding-top: 16px !important;
  background: #f8f8f8;
  width: 80px !important;
  font-size: 12px;
  .el-form-item:nth-child(odd) {
    width: 60%;
    color: #383a4b;
    overflow: hidden;
    white-space: nowrap;
  }
  .el-form-item:nth-child(even) {
    width: 32%;
    color: #383a4b;
  }
}
.historystatusHeaderRowclass {
  color: #383a4b;
  font-size: 14px;
  height: 40px;
  th {
    border-right: 1px solid #e0e8ed;
  }
  th:nth-child(n + 8) {
    border-right: 0px;
  }
}
#historystatus .historystatusrowClass {
  font-size: 12px;
  height: 40px;
  td {
    border-right: 1px solid #e0e8ed;
  }
  td:nth-child(n + 8) {
    border-right: 0px;
  }
}
.el-picker-panel {
  width: 330px;
  height: 348px;
}
.selctionData {
  right: 0;
  color: #383a4b;
  font-size: 16px;
  display: inline-block;
  float: right;
  overflow: hidden;
  .sure {
    width: 38px;
    height: 38px;
    line-height: 40px;
    border: 1px solid #959595;
    background: #f9faff;
    display: inline-block;
    padding: 0 8px;
    padding-right: 5px;
    border-radius: 6px;
  }
  .sure:hover {
    color: #289ef5;
    border: 1px solid #289ef5;
    cursor: pointer;
  }
  input::-webkit-input-placeholder {
    color: #565a65;
    font-size: 14px;
    position: relative;
    left: 0px;
    top: 3px;
  }
  .el-date-editor {
    text-align: center;
    width: 130px;
    height: 40px;
    line-height: 40px;
    margin: 0 6px 0 6px;
    text-align: left;
    bottom: 1.8px;
  }
}
.el-input__prefix {
  right: 7px;
  bottom: 2px;
  .el-input__icon {
    float: right;
    font-size: 18px;
  }
}

.el-input__inner {
  padding: 0 7px 0 7px !important;
  height: 40px;
}
#historystatus .pagination .is-background {
  .el-pager li:not(.disabled).active {
    background: #5769fa;
    border: 0px;
    color: #fff;
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
    border: 1px solid #959595;
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
#historystatus .el-pager .el-icon-more {
  display: none;
}
.selected span {
  color: #565a65;
  font-size: 14px;
  font-weight: normal;
}
.el-table__expand-icon {
  transform: rotate(90deg);
  margin-right: 10px;
  .el-icon {
    margin-left: -8px;
    margin-top: -8px;
  }
}
.el-table__expand-icon--expanded {
  transform: rotate(-90deg);
}
.el-button {
  border: 0;
  background: none;
  font-size: 12px;
}
</style>