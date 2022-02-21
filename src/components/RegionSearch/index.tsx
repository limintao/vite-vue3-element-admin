import { defineComponent, reactive, ref, nextTick, toRef } from "vue";
import "./index.scss";
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
// @ts-expect-error
import BmView from "vue-baidu-map/components/map/MapView";
// @ts-expect-error
import BmLocalSearch from "vue-baidu-map/components/search/LocalSearch";
// @ts-expect-error
import BmMarker from "vue-baidu-map/components/overlays/Marker";
// @ts-expect-error
import BmLabel from "vue-baidu-map/components/overlays/Label";
import { LocalResultPoi } from "vue-baidu-map/types/base/common";

type RegionSearch = {
  loading: boolean;
  keywords: string;
  lists: LocalResultPoi[];
  location?: LocalResultPoi;
  first: boolean;
};

export default defineComponent({
  name: "RegionSearch",
  props: {
    // 表示是否将搜索范围约束在当前城市
    forceLocal: {
      type: Boolean,
      default: false,
    },
    // 搜索关键字。当value为数组时将同时执行多关键字的查询，最多支持10个关键字。
    value: {
      type: String || Array,
      default: '',
    },
    // 缩放等级
    zoom: {
      type: Number,
      default: 17,
    },
    // 默认显示的经纬度
    point: Object,
    // 地图的高
    height: {
      type: String,
      default: '120px'
    },
    // 横向显示还是竖向显示
    vertical: {
      type: Boolean,
      default: true
    }
  },
  setup(props, context) {
    const state = reactive<RegionSearch>({
      loading: false,
      keywords: '',
      lists: [],
      location: undefined,
      first: false,
    });
    const vertical = toRef(props, "vertical");

    // 查询区域列表
    const queryRegionList = (keywords: string) => {
      state.loading = true;
      state.keywords = keywords;
    };
    // 地图组件搜索🔍完成事件；
    const searchComplete = (result: LocalResultPoi[]) => {
      if (result) state.lists = result;
      nextTick(() => {
        if (state.first) {
          state.lists.forEach(e => {
            const address: string = e.title + '(' + e.address + ')';
            if (address == props.value && e.point.lat == props.point?.lat && e.point.lng == props.point?.lng) {
              state.location = e;
              state.keywords = '';
            }
          })
          state.first = false;
        }
      })
      state.loading = false;
    };
    // 下拉框选择事件，返回一个对象, address: 详细地址，province： 所在省，title： 地点名称， point：经纬度
    const regionChange = (value: LocalResultPoi) => {
      state.keywords = '';
      context.emit('change', value)
    };

    return () => (
      <div class={["region-search",  vertical.value && "vertical" ]}>
        <div class="region-search-select">
          <el-select
            v-model={state.location}
            value-key="uid"
            placeholder="请选择地址"
            loading={state.loading}
            loading-text="正在加载中···"
            filterable
            remote
            remote-method={queryRegionList}
            onChange={regionChange}
          >
            <el-option
              v-for="item in lists"
              key="item.uid"
              label="item.title + '（' + item.address + '）'"
              value="item"
            ></el-option>
          </el-select>
        </div>

        <BaiduMap
          class="baidu-map"
          zoom="zoom"
          style={{'height': props.height}}
          scroll-wheel-zoom
          center={ props.point || { lng: 125.332284, lat: 43.90266 } }
          ak="DLSboi8y5LTk3ju9qPaVdNgFufgEvMn4"
        >
          <BmView class="map"/>
          <BmMarker position={state.location!.point} v-if="location">
            <BmLabel
              content={state.location!.title}
              labelStyle={{ color: "rgb(232, 38, 37)" }}
              offset={{ width: 20 }}
            />
          </BmMarker>
          <BmLocalSearch
            class="map-result"
            keyword={state.keywords}
            pageCapacity="50"
            panel={false}
            forceLocal={props.forceLocal}
            onMarkersset={searchComplete}
            auto-viewport
          />
        </BaiduMap>
      </div>
    );
  },
});
