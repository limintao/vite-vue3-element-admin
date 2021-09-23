<template>
  <div class="region-search" :class="{'vertical': vertical}">
    <div class="region-search-select">
      <el-select
        v-model="location"
        value-key="uid"
        placeholder="请选择地址"
        :loading="loading"
        loading-text="正在加载中···"
        filterable
        remote
        :remote-method="queryRegionList"
        @change="regionChange"
      >
        <el-option
          v-for="item in lists"
          :key="item.uid"
          :label="item.title + '（' + item.address + '）'"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>

    <baidu-map
      class="baidu-map"
      :zoom="zoom"
      :style="{'height': (typeof height == 'number' ? height + '' : height)}"
      scroll-wheel-zoom
      :center="point || { lng: 125.332284, lat: 43.90266 } "
      ak="DLSboi8y5LTk3ju9qPaVdNgFufgEvMn4"
    >
      <bm-view class="map"></bm-view>
      <bm-marker :position="location.point" v-if="location">
        <bm-label :content="location.title" :labelStyle="{color: 'rgb(232, 38, 37)'}" :offset="{width: 20,}"/>
      </bm-marker>
      <bm-local-search
        class="map-result"
        :keyword="keywords"
        :pageCapacity="50"
        :panel="false"
        :forceLocal="forceLocal"
        @searchcomplete="searchComplete"
        :auto-viewport="true"
      ></bm-local-search>
    </baidu-map>
  </div>
</template>

<script>
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import BmView from "vue-baidu-map/components/map/MapView";
import BmLocalSearch from "vue-baidu-map/components/search/LocalSearch";
import BmMarker from "vue-baidu-map/components/overlays/Marker";
import BmLabel from "vue-baidu-map/components/overlays/Label";

export default {
  name: "RegionSearch",
  components: { BaiduMap, BmLocalSearch, BmView, BmMarker, BmLabel },
  props: {
    // 表示是否将搜索范围约束在当前城市
    forceLocal: {
      type: Boolean,
      default: false,
    },
    // 搜索关键字。当value为数组时将同时执行多关键字的查询，最多支持10个关键字。
    value: {
      type: String | Array,
      default: '',
    },
    // 缩放等级
    zoom: {
      type: Number,
      default: 17,
    },
    // 默认显示的经纬度
    point: [Object, String],
    // 地图的高
    height: {
      type: Number | String,
      default: '120px'
    },
    // 横向显示还是竖向显示
    vertical: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      keywords: '',
      lists: [],
      location: '',
      first: false,
    };
  },
  created() {
    if (this.value) {
      this.keywords = this.value;
      this.first = true;
    }
  },
  methods: {
    // 查询区域列表
    queryRegionList(keywords) {
      this.loading = true;
      this.keywords = keywords;
    },
    // 地图组件搜索🔍完成事件；
    searchComplete(result) {
      if (result) this.lists = result.Hr;
      this.$nextTick(() => {
        if (this.first) {
          this.lists.forEach(e => {
            if (e.point.lat == this.point.lat && e.point.lng == this.point.lng) {
              this.location = e;
              this.keywords = '';
            }
          })
          this.first = false;
        }
      })
      this.loading = false;
    },
    // 下拉框选择事件，返回一个对象, address: 详细地址，province： 所在省，title： 地点名称， point：经纬度
    regionChange(value) {
      this.keywords = '';
      this.$emit('change', value)
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.first = true;
        this.keywords = val;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.region-search {
  width: 100%;
  display: inline-flex;

  .region-search-select {
    width: 50%;
  }

  .baidu-map {
    width: 50%;
    height: 120px;
    margin-left: 10px;
  }

  .map {
    width: 100%;
    height: 100%;
  }

  &.vertical {
    flex-direction: column;

    .region-search-select {
      width: 100%;
    }

    .baidu-map {
      width: 100%;
      margin-left: 0;
    }
  }
}
</style>