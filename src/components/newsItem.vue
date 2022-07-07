<script setup lang="ts">
import { News } from "@/interface/Circle";
import { ElMessage } from "element-plus";
const dayjs: any = inject("dayjs");
const props = defineProps<{
  item: News;
}>();
</script>
<template>
  <div class="news-item" @click="$router.push(`/newsInfo/${item._key}`)">
    <div class="left">
      <div class="img">
        <img :src="item.cover" alt="" />
      </div>
    </div>
    <div class="right">
      <div class="title">{{ item.title }}</div>
      <div class="summary">{{ item.summary }}</div>
      <div class="button">
        <div>{{ dayjs(item.createTime).fromNow() }}</div>
        <div class="dp--center"><iconpark-icon name="eye" style="margin-right:8px"/>{{ item.viewNum }}</div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.news-item {
  width: 100%;
  margin-top: 15px;
  background-color: #fff;
  @include flex(space-between, center, null);
  @include itemWidth(var(--mountain-item-width));
  .left {
    height: 100%;
    margin-right: 10px;
  }
  .right {
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    flex: 1;
    .title {
    }
    .summary {
      color: #9c9c9c;
      font-size: 14px;
      margin: 10px 0px;
      @include more-toLong(var(--mountain-item-line));
    }
    .button {
      color: #9c9c9c;
      font-size: 14px;
      @include flex(space-between, center, null);
    }
  }
}
</style>
<style lang="scss"></style>
