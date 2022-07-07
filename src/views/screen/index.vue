<script setup lang="ts">
import { ElMessage } from "element-plus";
const router = useRouter();
const toUrl = (url: string) => {
  router.push(`/screen/${url}`);
};
</script>
<template>
  <div class="screen">
    <div class="screen-header">
      <div class="screen-nav">
        <div @click="toUrl('home')">万安两山</div>
        <div @click="toUrl('resource')">项目交易</div>
        <div @click="toUrl('labour')">劳务竞标</div>
        <div @click="toUrl('environment')">环情检测</div>
      </div>
      <div>万安两山大数据</div>
    </div>
    <div class="screen-container"><router-view></router-view></div>
  </div>
</template>
<style scoped lang="scss">
.screen {
  width: 100%;
  height: 100vh;
  @include scroll();
  .screen-header {
    .screen-nav {
      width: 100%;
      height: 60px;
    }
  }
  .screen-container {
  }
}
</style>
<style></style>
