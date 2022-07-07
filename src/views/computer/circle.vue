<script setup lang="ts">
import cHeader from "@/components/computer/cHeader.vue";
import { ResultProps, Tag } from "@/interface/Common";
import { Circle } from "@/interface/Circle";
import api from "@/services/api";
import appStore from "@/store";
import { CirclePlus } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import CircleItem from "../../components/circleItem.vue";
import AddCircle from "../phone/addCircle.vue";

const route = useRoute();
const { token, domain } = storeToRefs(appStore.authStore);
const { circleTag, circleIndex } = storeToRefs(appStore.tagStore);
const { getTag, setCircleIndex } = appStore.tagStore;
const circleList = ref<Circle[]>([]);
const page = ref<number>(1);
const total = ref<number>(0);
const tabRef = ref<any>(null);
const getCircleList = async () => {
  let state = false;
  let obj: any = {
    articleType: "Blog",
    page: page.value,
    limit: 30,
  };
  if (circleIndex.value === 100) {
    obj.tabType = "new";
    state = true;
  } else {
    obj.tagKey = circleTag.value[circleIndex.value]._key;
  }
  const tagRes = (await api.request.get("/article", { ...obj })) as ResultProps;
  if (tagRes.msg === "OK") {
    circleList.value = [...circleList.value, ...tagRes.data];
    total.value = tagRes.total as number;
  }
};
const addCircleList = (item) => {
  if (
    circleIndex.value === 100 ||
    circleTag.value[circleIndex.value]._key === item.tagInfo._key
  ) {
    circleList.value.unshift(item);
  }
};
const chooseTag = (index) => {
  setCircleIndex(index);
  page.value = 1;
  circleList.value = [];
  getCircleList();
};
const scrollCircle = (e: any) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let height = e.target.clientHeight;
  if (
    height + scrollTop >= scrollHeight &&
    circleList.value.length < total.value
  ) {
    page.value++;
    getCircleList();
  }
};
const deleteCircle = (key) => {
  circleList.value = circleList.value.filter(
    (item: Circle) => item._key !== key
  );
};
const changeCircle = (circleItem) => {
  console.log(circleItem);
  let index = circleList.value.findIndex(
    (item: Circle) => item._key === circleItem._key
  );
  console.log(index);
  if (index !== -1) {
    circleList.value[index] = { ...circleList.value[index], ...circleItem };
  }
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?._key && !oldVal) {
      getTag("Blog");
      getCircleList();
    }
  },
  { immediate: true }
);
</script>
<template>
  <cHeader singleHeader :singleNumber="circleTag.length + 2">
    <template v-slot:nav>
      <div
        @click="chooseTag(100)"
        :class="{ 'choose-nav': circleIndex === 100 }"
      >
        最新
      </div>
      <template v-for="(item, index) in circleTag" :key="'tag' + index">
        <div
          @click="chooseTag(index)"
          :class="{ 'choose-nav': circleIndex === index }"
        >
          {{ item.name }}
        </div>
      </template>
    </template>
  </cHeader>
  <div class="circle">
    <div class="circle-box">
      <AddCircle @addCircleList="addCircleList" v-if="token" />
      <el-divider />
      <div class="container" @scroll="scrollCircle">
        <template v-for="(item, index) in circleList" :key="'circle' + index">
          <circle-item
            :item="item"
            @deleteItem="deleteCircle"
            @changeItem="changeCircle"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.circle {
  width: 100%;
  height: 100vh;
  padding-top: 50px;
  box-sizing: border-box;
  background: #f5f5f5;
  @include scroll();
  @include flex(center, null, wrap);
  .circle-box {
    width: 85vw;
    min-width: 650px;
    padding-top: 40px;
    box-sizing: border-box;
    .container {
      width: 100%;
    }
    .button {
      position: fixed;
      right: 20px;
      bottom: 50px;
      z-index: 5;
    }
  }
}
</style>
<style></style>
