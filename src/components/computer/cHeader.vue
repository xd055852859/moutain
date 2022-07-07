<script setup lang="ts">
import { ElMessage } from "element-plus";
import Avatar from "@/components/avatar.vue";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import { is_mobile } from "@/services/util";
import { ArrowLeft, ArrowRight, ArrowDown } from "@element-plus/icons-vue";

const props = defineProps<{
  singleHeader?: boolean;
  singleNumber?: number;
}>();
const { user, domain } = storeToRefs(appStore.authStore);
const { deviceType } = storeToRefs(appStore.commonStore);
const navRef = ref<any>(null);
const scrollState = ref<boolean>(false);
const login = () => {
  let redirect = encodeURIComponent(
    `${window.location.protocol}//${window.location.host}/#/${deviceType.value}/`
  );
  console.log(redirect);
  localStorage.clear();
  // `https://account.qingtime.cn?apphigh=50&redirect=&logo=https://workfly.qingtime.cn/1650849409262_workingVip.png`;
  let href: string = `https://account.qingtime.cn/?app=10&apphigh=55&logo=https://workfly.qingtime.cn/1652428088606_workingVip.png&redirect=${redirect}`;
  if (is_mobile()) {
    window.open(href);
  } else {
    window.open(href, "_self");
  }
};
const moveNavLeft = (e) => {
  //@ts-ignore
  navRef.value.scrollLeft -= 70;
  if (navRef.value.scrollLeft === 0) {
    scrollState.value = false;
  }
};
const moveNavRight = (e) => {
  console.log(navRef.value.scrollLeft);
  //@ts-ignore
  navRef.value.scrollLeft += 70;
  scrollState.value = true;
};
</script>
<template>
  <div class="computer-header">
    <div class="computer-header-container">
      <div class="left">
        <img :src="domain.logo" alt="" v-if="domain" /> {{domain?.name}}
      </div>
      <div class="right">
        <div
          v-if="scrollState"
          @click="moveNavLeft"
          class="header-nav-leftIcon"
        >
          <el-icon color="#fff"><ArrowLeft /></el-icon>
        </div>
        <div
          class="header-nav-box"
          :style="{
            marginRight: singleNumber && singleNumber > 6 ? '0px' : '40px',
          }"
          ref="navRef"
        >
          <div class="header-nav" v-if="!singleHeader">
            <div
              @click="$router.push('/computer/home')"
              :class="{ 'choose-nav': $route.name === 'computerHome' }"
            >
              首页
            </div>
            <div
              @click="$router.push('/computer/resourceList/1')"
              :class="{ 'choose-nav': $route.name === 'computerResourceList' }"
            >
              资源
            </div>
            <div
              @click="$router.push('/computer/news')"
              :class="{ 'choose-nav': $route.name === 'computerNews' }"
            >
              新闻
            </div>
            <div
              @click="$router.push('/computer/circle')"
              :class="{ 'choose-nav': $route.name === 'computerCircle' }"
            >
              圈子
            </div>
            <div
              @click="$router.push('/computer/environment')"
              :class="{ 'choose-nav': $route.name === 'computerEnvironment' }"
            >
              治理
            </div>
          </div>
          <div class="header-nav" v-else>
            <el-dropdown>
              <div @click="$router.push('/computer/home')" style="color: #fff">
                首页
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="$router.push('/computer/home')"
                    >首页</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click="$router.push('/computer/resourceList/1')"
                    >资源</el-dropdown-item
                  >
                  <el-dropdown-item @click="$router.push('/computer/news')"
                    >新闻</el-dropdown-item
                  >
                  <el-dropdown-item @click="$router.push('/computer/circle')"
                    >圈子</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click="$router.push('/computer/environment')"
                    >治理</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template></el-dropdown
            >

            <slot name="nav"></slot>
          </div>
        </div>
        <div
          v-if="singleNumber && singleNumber > 6"
          @click="moveNavRight"
          class="header-nav-rightIcon"
        >
          <el-icon color="#fff"><ArrowRight /></el-icon>
        </div>
        <div @click="$router.push('/computer/userCenter')">
          <avatar
            :name="user.userName"
            :avatar="user.userAvatar"
            type="person"
            :index="0"
            :size="40"
            :avatarStyle="{ fontSize: '16px', marginRight: '8px' }"
            v-if="user"
          />
        </div>
        <el-button type="success" @click="login" v-if="!user"
          >登录 / 注册</el-button
        >
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.computer-header {
  width: 100vw;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.2);
  @include flex(center, center, null);
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 1;
  .computer-header-container {
    width: 85vw;
    min-width: 650px;
    max-width: 1600px;
    height: 100%;
    @include flex(space-between, center, null);
    .left {
      font-size: 16px;
      color: #fff;
      @include flex(null, center, null);
      height: 100%;
      > img {
        height: 100%;
        margin-right: 10px;
      }
    }
    .right {
      height: 100%;
      font-size: 14px;
      @include flex(center, center, null);
      .header-nav-leftIcon,
      .header-nav-rightIcon {
        height: 100%;
        cursor: pointer;
        @include flex(center, center, null);
      }
      .header-nav-leftIcon {
        margin-right: 20px;
      }
      .header-nav-rightIcon {
        margin: 0px 20px 0px 15px;
      }
    }
  }
}
</style>
<style lang="scss">
.header-nav-box {
  max-width: 350px;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  @include flex(null, center, null);
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
  .header-nav {
    height: 100%;
    @include flex(null, center, null);
    color: #fff;
    > div {
      width: 70px;
      height: 100%;
      @include flex(center, center, null);
      cursor: pointer;
      flex-shrink: 0;
    }
    .choose-nav {
      @include choose-border(3px);
    }
  }
}
</style>
