<script setup lang="ts">
import { ElMessage } from "element-plus";
</script>
<template>

  <div class="computer">
    <router-view></router-view>
  </div>
</template>
<style scoped lang="scss">
.computer {
  width: 100%;
  height: 100vh;
  @include scroll();
}
</style>
<style></style>
