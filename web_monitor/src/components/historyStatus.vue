<template>
  <div id="blockdetail" class="blo">
    <div class="selction">刷新状态
      <el-dropdown @command="handlerefresh">
        <span class="el-dropdown-link">
          {{freshTime}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="5s">5s</el-dropdown-item>
          <el-dropdown-item command="10s">10s</el-dropdown-item>
          <el-dropdown-item command="30s">30s</el-dropdown-item>
          <el-dropdown-item command="10min">10min</el-dropdown-item>
          <el-dropdown-item command="不刷新">不刷新</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span class="interval">请选择节点服务状态</span>
      <el-dropdown @command="handlestatus">
        <span class="el-dropdown-link">
          {{stateTime}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="disconnected">disconnected</el-dropdown-item>
          <el-dropdown-item command="connected">connected</el-dropdown-item>
          <el-dropdown-item command="syncing">syncing</el-dropdown-item>
          <el-dropdown-item command="tracking">tracking</el-dropdown-item>
          <el-dropdown-item command="full">full</el-dropdown-item>
          <el-dropdown-item command="validating">validating</el-dropdown-item>
          <el-dropdown-item command="proposing">proposing</el-dropdown-item>
          <el-dropdown-item command="error">error</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span class="selctionData">日期范围
        <el-date-picker v-model="start" type="date" value-format="yyyy-MM-dd" placeholder="开始时间"></el-date-picker>至
        <el-date-picker v-model="end" type="date" value-format="yyyy-MM-dd" placeholder="结束时间"></el-date-picker>
        <span class="sure" @click="sure">确认</span>
      </span>
    </div>
    <div class="bockList">
      <div class="blockList">
        <el-table
          :data="blockList"
          style="width:100%"
          row-class-name="BlockDetailrowClass"
          header-row-class-name="BlockDetailHeaderRowclass"
        >
          <el-table-column
            prop="server_state"
            label="节点服务器状态"
            id="ellipsis"
            min-width="10%"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <div>{{handleStateData(scope.row.server_state)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="infosGetTime" label="节点状态获取时间" id="ellipsis" min-width="13%"></el-table-column>
          <el-table-column prop="complete_ledgers" label="节点本地账本区间" align="center" min-width="15%"></el-table-column>
          <el-table-column
            prop="peers"
            label="P2P网络连接节点数量"
            id="ellipsis"
            align="center"
            min-width="14%"
          ></el-table-column>
          <el-table-column
            prop="io_latency_ms"
            label="读写等待时间"
            id="ellipsis"
            align="center"
            min-width="10%"
          ></el-table-column>
          <el-table-column
            prop="startup_time"
            label="节点启动时间"
            id="ellipsis"
            align="center"
            min-width="13%"
          ></el-table-column>
          <el-table-column prop="build_version" label="节点版本" align="center" min-width="9%"></el-table-column>
          <el-table-column prop="hash" label="公钥" align="center" min-width="16%">
            <template slot-scope="scope">
              <div>{{handleStateData(scope.row.nodePublic)}}</div>
            </template>
          </el-table-column>
          <el-table-column type="expand" width="35" align="left">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="节点公钥">
                  <span>{{ props.row.nodePublic }}</span>
                </el-form-item>
                <el-form-item label="最后验证区块高度">
                  <span>{{ props.row.last_ledger_heigth }}</span>
                </el-form-item>
                <el-form-item label="最后验证区块HASH值">
                  <span>{{ props.row.hash }}</span>
                </el-form-item>
                <el-form-item label="最后验证区块时间">
                  <span>{{ props.row.last_ledger_time }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <ul class="pagination">
        <li>
          <el-pagination
            background
            layout="prev, pager, next"
            small
            :page-size="20"
            :page-count="212"
          ></el-pagination>
        </li>
        <li class="allPage">
          <span>212</span>页
        </li>
        <li>跳至
          <div class="input">
            <input type="text" placeholder="100">
          </div>页
        </li>
        <li>
          <div class="sortButton">确认</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getNodeHistoryList } from "../js/fetch";
export default {
  name: "blockdetail",
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch("updateCurrentPage", "historyStatus");
    });
  },
  mounted() {
    this.currentNode = this.$route.params.server;
    this.$store.dispatch("updateCurrentNode", this.currentNode);
    console.log(this.currentNode);
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      blockList: [],
      start: "",
      end: "",
      timer: "",
      freshTime: "5s",
      stateTime: "节点服务状态"
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.currentNode = "123"; // this.$route.params.server;
    this.$store.dispatch("updateCurrentNode", this.currentNode);
  },
  methods: {
    async sure() {
      let server = this.$route.params.hash;
      let data = {
        server: server || "wss://c01.jingtum.com:5020",
        state: this.freshTime,
        start: this.stateTime,
        end: this.end
      };
      let res = await getNodeHistoryList(data);
      this.blockList = this.handleGetData(res.data);
    },
    handlerefresh(value) {
      this.freshTime = value;
      clearInterval(this.timer);
      if (value !== "不刷新") {
        this.timer = setInterval(() => {
          this.getData();
        }, this.getTime(value));
      }
    },
    getTime(key) {
      let map = new Map([
        ["5s", 5000],
        ["10s", 10000],
        ["30s", 30000],
        ["10min", 600 * 1000]
      ]);
      return map.get(key);
    },
    async handlestatus(value) {
      this.stateTime = value;
      let server = this.$route.params.hash;
      let data = {
        server: server || "wss://c01.jingtum.com:5020",
        state: value,
        start: "",
        end: ""
      };
      let res = await getNodeHistoryList(data);
      this.blockList = this.handleGetData(res.data);
    },
    async getData() {
      let server = this.$route.params.hash;
      let data = {
        server: server || "wss://c01.jingtum.com:5020",
        state: "",
        start: "",
        end: ""
      };
      let res = await getNodeHistoryList(data);
      this.blockList = this.handleGetData(res.data);
    },
    handleGetData(res) {
      let i = 1;
      let list = [];
      for (; i < res.length; i++) {
        let resData = JSON.parse(res[i]);
        list.push({
          server_state: resData.server_state,
          infosGetTime: resData.infosGetTime,
          complete_ledgers: resData.complete_ledgers,
          peers: resData.peers,
          io_latency_ms: resData.io_latency_ms,
          startup_time: resData.startup_time,
          build_version: resData.build_version,
          nodePublic: resData.public || "null",
          last_ledger_heigth: resData.last_ledger_heigth,
          hash: resData.hash,
          last_ledger_time: resData.last_ledger_time
        });
      }
      console.log(list);
      return list;
    },
    handleStateData(value) {
      return value;
    }
  }
};
</script>
<style lang="scss" scoped>
.bockList {
  border-top: 1px solid #e0e8ed;
  border-left: 1px solid #e0e8ed;
}
#blockdetail {
  min-width: 1000px;
  padding: 0 30px;
  padding-bottom: 110px;
  background: #f9faff;
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
    width: 50px;
    margin-left: 20px;
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
  }
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
.BlockDetailHeaderRowclass {
  color: #383a4b;
  font-size: 14px;
  height: 40px;
  th {
    border-right: 1px solid #e0e8ed;
  }
  th:nth-child(8) {
    border-right: 0px;
  }
}
#blockdetail .BlockDetailrowClass {
  font-size: 12px;
  height: 40px;
  td {
    border-right: 1px solid #e0e8ed;
  }
  td:nth-child(8) {
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
    height: 40px;
    line-height: 40px;
    border: 1px solid #959595;
    background: #f9faff;
    display: inline-block;
    padding: 0 10px;
    border-radius: 6px;
  }
  .ui-datepicker {
    margin-botton: 10px;
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
    width: 140px;
    height: 40px;
    line-height: 40px;
    margin: 0 14px 0 7px;
    text-align: left;
  }
}
.el-input__prefix {
  right: 14px;
  .el-input__icon {
    float: right;
    font-size: 18px;
  }
}
.el-input__inner {
  padding: 0 10px 0 10px !important;
}
#blockdetail .pagination .is-background {
  .el-pager li:not(.disabled).active {
    background: #5769fa;
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
#blockdetail .el-pager .el-icon-more {
  display: none;
}
.el-date-picker__header-label {
  left: 0;
}
.el-dropdown {
  padding-left: 10px;
  width: 100px;
  height: 40px;
  border: 1px solid #e0e8ed;
  border-radius: 6px;
  font-size: 14px;
  color: #565a65;
  display: inline-block;
}
.el-icon--right {
  color: #999;
  float: right;
  position: relative;
  top: 10px;
  right: 10px;
}
.el-dropdown:hover {
  background: #f9faff;
  border: 1px solid #289ef5;
  border-radius: 6px;
  .el-icon--right {
    color: #289ef5;
  }
}
.el-dropdown-menu {
  border-radius: 6px;
  border: 1px solid #c2c3d3;
}
.el-popper:nth-child(2) .el-dropdown-menu__item {
  width: 65px;
  height: 40px;
  border-radius: 6px;
  font-size: 14px;
}
.el-popper:nth-child(1) .el-dropdown-menu__item {
  width: 65px;
  height: 40px;
  border-radius: 6px;
  font-size: 14px;
}
.el-dropdown:nth-child(3) {
  width: 140px;
}
.el-dropdown-menu__item:nth-child(n + 4) {
  width: 118px;
}
</style>