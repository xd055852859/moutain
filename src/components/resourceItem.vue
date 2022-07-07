<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import appStore from "@/store";
import { Delete } from "@element-plus/icons-vue";
import { StarFilled } from "@element-plus/icons-vue";
import { useThrottleFn } from "@vueuse/shared";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
const { user, token } = storeToRefs(appStore.authStore);
const { deviceWidth } = storeToRefs(appStore.commonStore);

const props = defineProps<{
  item: any;
  tabType: number;
  type?: string;
}>();
const emits = defineEmits<{
  (e: "deleteItem", key: string): void;
}>();

const dayjs: any = inject("dayjs");
const delVisible = ref<boolean>(false);
const showType = ref<string>("oneLine");
const itemRef = ref<any>(null);
onMounted(() => {
  showType.value = itemRef.value.offsetWidth > 400 ? "oneLine" : "twoLine";
});
const deleteResource = async () => {
  const resourceRes = (await api.request.delete("/resource", {
    resourceKey: props.item._key,
  })) as ResultProps;
  if (resourceRes.msg === "OK") {
    ElMessage({
      message: "删除成功",
      type: "success",
      duration: 1000,
    });
    delVisible.value = false;
    emits("deleteItem", props.item._key);
  }
};
watch(
  deviceWidth,
  useThrottleFn(() => {
    if (itemRef.value) {
      showType.value = itemRef.value.offsetWidth > 400 ? "oneLine" : "twoLine";
    }
  }, 1000)
);
</script>
<template>
  <div
    class="resource-item"
    ref="itemRef"
    @click="
      token
        ? $router.push({
            name: 'resourceInfo',
            params: {
              resourceKey: item._key,
              tabType: tabType,
            },
          })
        : $router.push(`/login`)
    "
    :style="
      showType === 'oneLine' ? { height: '170px' } : { minHeight: '180px' }
    "
  >
    <!-- deviceType === 'phone' || type === 'home' -->
    <!-- v-if="
        (item.imageList &&
          item.imageList.length > 0 &&
          deviceType === 'phone') ||
        deviceType === 'computer'
      " -->
    <div
      class="left"
      :style="
        showType === 'oneLine'
          ? { width: '170px', height: '100%' }
          : { width: '100%', height: '200px' }
      "
    >
      <div
        class="img"
        :style="
          showType === 'oneLine'
            ? { width: '170px', height: '170px' }
            : { width: '100%', height: '200px' }
        "
      >
        <img :src="item.imageList[0]" alt="" v-if="item.imageList[0]" />
        <el-empty description="暂无图片" :image-size="100" v-else />
      </div>
    </div>
    <div class="right">
      <div class="name">{{ item.name }}</div>
      <template v-if="tabType !== 3">
        <div class="dp-space-center">
          <div>总面积 {{ item.area }}{{ item.tagInfo.unit }}</div>
          <div>{{ item.regionArr[item.regionArr.length - 1].name }}</div>
        </div>
        <!-- <div v-if="tabType === 3">项目预算: {{ item.offer }}</div> -->

        <div class="dp--center">
          星级
          <el-icon v-for="starItem in item.star" style="margin-left: 10px"
            ><StarFilled color="#F5A623"
          /></el-icon>
        </div>
      </template>
      <div v-else>项目类型: {{ item.tagInfo.name }}</div>
      <div
        v-if="tabType === 1"
        style="color: #e95151; font-size: 18px"
        class="status"
        :style="{
          justifyContent: showType === 'oneLine' ? 'flex-start' : 'flex-end',
        }"
      >
        {{ item.rentOfYear }} 元
        <!-- / {{ item.depositTime }} -->
      </div>
      <template v-if="tabType !== 1">
        <div
          class="status"
          :style="{
            justifyContent: showType === 'oneLine' ? 'flex-start' : 'flex-end',
          }"
        >
          {{ showType === "oneLine" ? "状态 : " : "" }}
          <span style="font-weight: 400; font-size: 18px; color: #333">{{
            dayjs(item.offerEndTime).valueOf() > dayjs().valueOf()
              ? "报价中"
              : "已结束"
          }}</span>
        </div>
        <div>
          {{ dayjs(item.offerEndTime).format("YYYY年M月D日 HH:mm") }} 竞拍结束
        </div>
      </template>
      <div
        class="button"
        v-if="tabType === 3 && type === 'mine' && item.status === 0"
      >
        <el-icon
          @click="
            $event.stopPropagation();
            delVisible = true;
          "
          ><Delete
        /></el-icon>
      </div>
    </div>
  </div>
  <el-dialog v-model="delVisible" title="删除圈子" width="350px">
    <span>是否删除该圈子</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <el-button type="info" @click="delVisible = false" link>取消</el-button>
        <el-button type="success" @click="deleteResource()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.resource-item {
  width: 100%;
  margin-bottom: 10px;
  background-color: #fff;
  @include flex(space-between, center, wrap);

  &:hover {
    box-shadow: 0px 4px 9px 0px rgba(178, 178, 178, 0.5);
  }
  .left {
    height: 100%;
    @include flex(center, center, null);
    .img {
      overflow: hidden;
      @include flex(center, center, null);
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .right {
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    flex: 1;
    @include flex(flex-start, center, wrap);
    > div {
      width: 100%;
      font-size: 14px;
      color: #777;
      height: 26px;
      line-height: 26px;
    }
    .name {
      font-size: 18px;
      color: #333;
      height: 30px;
      line-height: 30px;
      margin-bottom: 10px;
    }
    .status {
      height: 30px;
      line-height: 30px;
      display: flex;
      align-items: center;
    }
    .button {
      @include flex(flex-end, center, null);
    }
  }
}
</style>
<style></style>
