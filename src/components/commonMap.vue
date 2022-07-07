<script setup lang="ts">
import { ElMessage } from "element-plus";
import AMapLoader from "@amap/amap-jsapi-loader";
import appStore from "@/store";
import { storeToRefs } from "pinia";
const { setLocation } = appStore.commonStore;
const { deviceType } = storeToRefs(appStore.commonStore);
const { domain } = storeToRefs(appStore.authStore);
const props = defineProps<{
  width: string;
  height: string;
  pointArray?: any;
  type?: string;
}>();
const emits = defineEmits<{
  (e: "setName", name: string, address: any): void;
}>();
const map = shallowRef<any>(null);
const AmapData = shallowRef<any>(null);
const marker = shallowRef<any>(null);
const polygon = shallowRef<any>(null);
const cluster = shallowRef<any>(null);
onMounted(() => {
  initMap();
});
const initPath = () => {
  //   if (window.navigator.geolocation) {
  //     var options = {
  //       enableHighAccuracy: true, //是否选择高精度
  //     };
  //     window.navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         console.log(position);
  //         setLocation(position.coords.latitude, position.coords.longitude);
  //       },
  //       (error) => {
  //         alert("Failed to get location");
  //       },
  //       options
  //     );
  //   } else {
  //     alert("Your browser does not support getting location");
  //   }
  if (polygon.value) {
    map.value.remove(polygon.value);
  }
  let adCode = domain.value?.regionCode.substring(0, 6);
  map.value.plugin("AMap.DistrictSearch", function () {
    new AmapData.value.DistrictSearch({
      extensions: "all",
      subdistrict: 0,
    }).search(adCode, function (status, result) {
      // 外多边形坐标数组和内多边形坐标数组
      var outer = [
        new AmapData.value.LngLat(-360, 90, true),
        new AmapData.value.LngLat(-360, -90, true),
        new AmapData.value.LngLat(360, -90, true),
        new AmapData.value.LngLat(360, 90, true),
      ];
      var holes = result.districtList[0].boundaries;
      var pathArray = [outer];
      pathArray.push.apply(pathArray, holes);
      polygon.value = new AmapData.value.Polygon({
        pathL: pathArray,
        strokeColor: "red", //城市边界颜色
        strokeWeight: 2,
        fillColor: "#a0cfff", // 遮罩背景色黑色
        fillOpacity: 1,
      });
      polygon.value.setPath(pathArray);
      map.value.add(polygon.value);
    });
  });
};
const initMap = () => {
  AMapLoader.load({
    key: "70beeffb8fc9537f6d450fd3747b70c9", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Geocoder", "AMap.DistrictSearch", "AMap.MarkerClusterer"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      map.value = new AMap.Map("container", {
        //设置地图容器id
        viewMode: "3D", //是否为3D地图模式
        zoom: 5, //初始化地图级别
        center: [0, 0], //初始化地图中心点位置
      });
      AmapData.value = AMap;
      map.value.on("click", clickMap);
      let adCode = domain.value?.regionCode.substring(0, 6);
      map.value.setCity(adCode, () => {
        map.value.setZoom(deviceType.value === "phone" ? 9 : 10);
      });
      initPath();
      // map.value.setZoom(6);
      if (props.pointArray) {
        setCluster(props.pointArray);
      }
    })
    .catch((e) => {
      console.log(e);
    });
};


const setPointer = (lng, lat) => {
  setLocation(lng, lat);
  if (marker.value) {
    map.value.remove(marker.value);
  }
  marker.value = new AmapData.value.Marker({
    position: new AmapData.value.LngLat(lng, lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
    label: "当前",
  });
  map.value.add(marker.value);
  let adCode = domain.value?.regionCode.substring(0, 6);
  map.value.plugin("AMap.Geocoder", function () {
    var geocoder = new AmapData.value.Geocoder({
      // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
      city: adCode,
    });

    geocoder.getAddress([lng, lat], function (status, result) {
      console.log(result);
      if (status === "complete" && result.info === "OK") {
        // result为对应的地理位置详细信息
        console.log(result);
        emits(
          "setName",
          result.regeocode.formattedAddress,
          result.regeocode.addressComponent
        );
        // marker.value.set(result.regeocode.formattedAddress);
      }
    });
  });
};
const setCluster = (pointArray) => {
  if (cluster.value) {
    cluster.value.setMap(null);
  }
  map.value.plugin("AMap.MarkerClusterer", function () {
    console.log(AmapData.value);
    cluster.value = new AmapData.value.MarkerCluster(map.value, pointArray);
    cluster.value.on("click", clickCluster);
  });
};
const clickMap = (e) => {
  setPointer(e.lnglat.lng, e.lnglat.lat);
};
const clickCluster = (e) => {
  // e.stopPropagation();
  console.log(e.clusterData);
};
const clearMap = (e) => {
  map.value.remove(marker.value);
};
// watch(
//   () => props.pointArray,
//   (newVal, oldVal) => {
//     if (newVal && map.value && !oldVal) {
//       setCluster(newVal);
//     }
//   },
//   { immediate: true }
// );
defineExpose({
  clearMap,
  setCluster,
});
</script>
<template>
  <div id="container" :style="{ width: width, height: height }"></div>
</template>
<style scoped lang="scss"></style>
<style></style>
