<script setup lang="ts">
import appStore from "@/store";
import { storeToRefs } from "pinia";
const router = useRouter();
const { token } = storeToRefs(appStore.authStore);
const toUrl = (url: string) => {
  router.push(`/phone/${url}`);
};
</script>
<template>
  <div class="phone-container"><router-view></router-view></div>
  <div class="phone-nav dp--center">
    <div
      :class="{ 'common-color': $route.name === 'phoneNews' }"
      @click="toUrl('news')"
    >
      <div>
        <iconpark-icon
          name="news"
          :color="$route.name === 'phoneNews' ? '#67c23a' : '#555'"
          size="25"
        />
      </div>
      <div>新闻</div>
    </div>
    <div
      :class="{ 'common-color': $route.name === 'phoneCircle' }"
      @click="toUrl('circle')"
    >
      <div>
        <iconpark-icon
          name="circle"
          :color="$route.name === 'phoneCircle' ? '#67c23a' : '#555'"
          size="25"
        />
      </div>
      <div>圈子</div>
    </div>
    <div
      :class="{ 'common-color': $route.name === 'phoneResource' }"
      @click="token ? toUrl('resource') : $router.push('/login')"
    >
      <div>
        <iconpark-icon
          name="mountain"
          :color="$route.name === 'phoneResource' ? '#67c23a' : '#555'"
          size="25"
        />
      </div>
      <div>两山</div>
    </div>
    <div
      :class="{ 'common-color': $route.name === 'phoneEnvironment' }"
      @click="token ? toUrl('environment') : $router.push('/login')"
    >
      <div>
        <iconpark-icon
          name="environment"
          :color="$route.name === 'phoneEnvironment' ? '#67c23a' : '#555'"
          size="25"
        />
      </div>
      <div>治理</div>
    </div>
    <div
      :class="{ 'common-color': $route.name === 'phoneUserCenter' }"
      @click="token ? toUrl('userCenter') : $router.push('/login')"
    >
      <div>
        <iconpark-icon
          name="my"
          :color="$route.name === 'phoneUserCenter' ? '#67c23a' : '#555'"
          size="25"
        />
      </div>
      <div>我的</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.phone-container {
  width: 100vw;
  height: calc(100vh - 50px);
}
.phone-nav {
  width: 100vw;
  height: 50px;
  background-color: #fff;
  // @include p-number(15px);
  > div {
    width: 20%;
    height: 100%;
    @include flex(center, center, wrap);
    cursor: pointer;
    background-color: #fff;
    font-size: 12px;
    > div {
      width: 100%;
      @include flex(center, center, null);
    }
  }
}
</style>
<style></style>
