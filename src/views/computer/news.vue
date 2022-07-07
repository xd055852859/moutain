<script setup lang="ts">

import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import NewsItem from "@/components/newsItem.vue";
import { News } from "@/interface/Circle";
import cHeader from "@/components/computer/cHeader.vue";
const route = useRoute();
const { domain } = storeToRefs(appStore.authStore);
const { newsTag, newsIndex } = storeToRefs(appStore.tagStore);
const { getTag, setNewsIndex } = appStore.tagStore;
const coverList = computed(() => {
  let arr: string[] = [];
  if (newsList.value.length > 0) {
    newsList.value.slice(0, 6).forEach((item) => {
      if (item.cover) {
        arr.push(item.cover);
      }
    });
    return arr;
  }
});
const newsList = ref<News[]>([]);
const page = ref<number>(1);
const total = ref<number>(0);
const getNewsList = async () => {
  let obj: any = {
    articleType: "News",
    page: page.value,
    limit: 8,
  };
  if (page.value === 1) {
    newsList.value = [];
  }
  if (newsIndex.value === 100) {
    obj.tabType = "recommend";
  } else if (newsIndex.value === 101) {
    obj.tabType = "hot";
  } else {
    obj.tagKey = newsTag.value[newsIndex.value]._key;
  }
  const tagRes = (await api.request.get("/article", { ...obj })) as ResultProps;
  if (tagRes.msg === "OK") {
    newsList.value = [...tagRes.data];
    total.value = tagRes.total as number;
  }
};
const chooseTag = (index) => {
  setNewsIndex(index);
  page.value = 1;
  getNewsList();
};

watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?._key && !oldVal) {
      getTag("News");
      getNewsList();
    }
  },
  { immediate: true }
);
</script>
<template>
  <!-- <el-button type="success" style="width: 100%; height: 40px" @click="postNews"
    >发送新闻</el-button
  > -->
  <cHeader singleHeader :singleNumber="newsTag.length + 4">
    <template v-slot:nav>
      <div @click="chooseTag(100)" :class="{ 'choose-nav': newsIndex === 100 }">
        推荐
      </div>
      <div @click="chooseTag(101)" :class="{ 'choose-nav': newsIndex === 101 }">
        热榜
      </div>
      <div
        v-for="(item, index) in newsTag"
        :key="'tag' + index"
        @click="chooseTag(index)"
        :class="{ 'choose-nav': newsIndex === index }"
      >
        {{ item.name }}
      </div>
    </template>
  </cHeader>
  <div class="computer-news">
    <div class="news-img">
      <el-carousel trigger="click" height="350px" v-if="coverList">
        <el-carousel-item v-for="item in coverList" :key="item">
          <div class="news-img-item"><img :src="item" alt="" /></div>
        </el-carousel-item>
      </el-carousel>
      <div class="empty" v-else><el-empty description="无新闻图片" /></div>
    </div>
    <div class="news-box">
      <div class="item">
        <NewsItem
          :item="item"
          v-for="(item, index) in newsList"
          :key="'news' + index"
        />
      </div>
      <!--         hide-on-single-page -->
      <div class="page">
        <el-pagination
          v-model:currentPage="page"
          background
          layout="prev, pager, next, jumper"
          :total="total"
          @current-change="
            (newPage) => {
              page = newPage;
              getNewsList();
            }
          "
          :page-size="8"
          hide-on-single-page
        />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.computer-news {
  width: 100vw;
  height: 100vh;
  background: #f5f5f5;
  @include scroll();
  .news-img {
    height: 350px;
    // @include flex(center, center, null);
    .news-img-item {
      width: calc(100vw - 30px);
      height: 350px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .empty {
      width: 100%;
      height: 100%;
      @include flex(center, center, null);
    }
  }
  .news-box {
    width: 100%;
    @include flex(center, null, wrap);
    .item {
      width: 85vw;
      min-width: 650px;
    }
    .page {
      width: 100%;
      margin: 15px 0px;
      @include flex(center, center, null);
    }
  }
}
</style>
<style></style>
