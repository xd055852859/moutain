<script setup lang="ts">
import pHeader from "@/components/phone/pHeader.vue";
import cHeader from "@/components/computer/cHeader.vue";
import { ResultProps, Tag } from "@/interface/Common";
import { uploadImage } from "@/services/util";
import { Plus } from "@element-plus/icons-vue";
import api from "@/services/api";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import router from "@/router";
const { user, uploadToken, domain } = storeToRefs(appStore.authStore);
const { deviceType } = storeToRefs(appStore.commonStore);
const { getUploadToken } = appStore.authStore;

interface Region {
  _key: string;
  name: string;
  areaCode: string;
  level: number;
}
const name = ref<string>("");
const tagList = ref<Tag[]>([]);
const tagKey = ref<string>("");
const tagUnit = ref<string>("平米");
const area = ref<number>(0);
const regionCode = ref<string>("");
const imageList = ref<string[]>([]);
const describe = ref<string>("");
const depositTime = ref<string>("");
const sMethod = ref<string>("");
const rentOfYear = ref<number>(0);
const townArray = ref<Region[]>([]);
const townCode = ref<string>("");
const villageArray = ref<any>([]);
const depositArray = ["半年", "1年", "3年", "10年", "30年"];
const init = () => {
  if (domain.value) {
    getUploadToken();
    getRegion("town", domain.value?.regionCode);
    getTag();
  }
};
const getRegion = async (type: string, code: string) => {
  const regionRes = (await api.request.get("/regionCode/subByCode", {
    regionCode: code,
  })) as ResultProps;
  if (regionRes.msg === "OK") {
    if (type === "town") {
      townArray.value = [...regionRes.data];
    } else {
      villageArray.value = [...regionRes.data];
    }
  }
};
const getTag = async () => {
  const tagRes = (await api.request.get("tag", {
    tagType: "Resource",
  })) as ResultProps;
  if (tagRes.msg === "OK") {
    tagList.value = [...tagRes.data];
  }
};

const updateImg = (file) => {
  let mimeType = ["image/png", "image/jpeg", "image/svg+xml"];
  if (file) {
    uploadImage(file, uploadToken.value, mimeType, (url: string) => {
      imageList.value.push(url);
      // editorInfo.value?.chain().focus().deleteRange(range).setImage({ src: url });
    });
  }
};
const delImg = (index) => {
  imageList.value.splice(index, 1);
};

const postResource = async () => {
  if (!name.value) {
    ElMessage({
      message: "请输入资源名称",
      type: "error",
      duration: 1000,
    });
    return;
  }
  const resourceRes = (await api.request.post("/resource", {
    name: name.value,
    tagKey: tagKey.value,
    area: area.value,
    regionCode: regionCode.value ? regionCode.value : townCode.value,
    describe: describe.value,
    // location: [],
    // boarder: [[], []],
    depositTime: depositTime.value,
    sMethod: sMethod.value,
    imageList: imageList.value,
    rentOfYear: rentOfYear.value,
    // offer: offer.value,
    // allowOffer: allowOffer.value,
    // offerBegTime: dayjs(offerBegTime.value).valueOf(),
    // offerEndTime: dayjs(offerEndTime.value).valueOf(),
  })) as ResultProps;
  if (resourceRes.msg === "OK") {
    ElMessage({
      message: "上传资源成功",
      type: "success",
      duration: 1000,
    });
    router.push("/phone/resource");
  }
};
watch(
  domain,
  (newDomain) => {
    if (newDomain) {
      init();
    }
  },
  { immediate: true }
);
watch(townCode, (newVal) => {
  villageArray.value = [];
  regionCode.value = "";
  getRegion("village", newVal);
});
watch(tagKey, (newVal) => {
  tagUnit.value = tagList.value[
    tagList.value.findIndex((item) => item._key === newVal)
  ].unit as string;
});
</script>
<template>
  <pHeader v-if="deviceType === 'phone'">
    <template v-slot:title>资源上传</template>
  </pHeader>
  <cHeader v-if="deviceType === 'computer'" />

  <div
    class="resourceForm"
    :style="
      deviceType === 'computer'
        ? { marginTop: '50px', height: `calc(100vh - 50px)` }
        : { height: `calc(100vh - 60px)` }
    "
  >
    <div
      class="form"
      :style="
        deviceType === 'phone'
          ? { width: '100%' }
          : { width: '85vw', minWidth: '650px' }
      "
    >
      <div><span>基础信息</span></div>
      <div>
        <span>姓名</span>
        <div>{{ user?.userName }}</div>
      </div>
      <div>
        <span>手机号</span>
        <div>{{ user?.mobile }}</div>
      </div>
      <div>
        <span>资源名称</span>
        <div><el-input v-model="name" placeholder="请输入资源名称" /></div>
      </div>
      <div>
        <span>资源分类</span>
        <div>
          <el-select v-model="tagKey" placeholder="请选择资源分类">
            <el-option
              v-for="(item, index) in tagList"
              :key="'tag' + index"
              :label="item.name"
              :value="item._key"
            />
          </el-select>
        </div>
      </div>
      <div>
        <span>所在乡镇</span>
        <div>
          <el-select v-model="townCode" placeholder="请选择乡镇">
            <el-option
              v-for="(item, index) in townArray"
              :key="'town' + index"
              :label="item.name"
              :value="item.areaCode"
            />
          </el-select>
        </div>
      </div>
      <div>
        <span>所在村</span>
        <div>
          <el-select
            v-model="regionCode"
            placeholder="请选择村"
            :disabled="!townCode"
          >
            <el-option
              v-for="(item, index) in villageArray"
              :key="'village' + index"
              :label="item.name"
              :value="item.areaCode"
            />
          </el-select>
        </div>
      </div>

      <div>
        <span>资源面积</span>
        <div style="justify-content: space-between">
          <el-input
            v-model="area"
            placeholder="请输入资源面积"
            style="width: calc(100% - 50px)"
            type="number"
          />
          {{ tagUnit }}
        </div>
      </div>
      <div>
        <span>托管时间</span>
        <div>
          <el-select v-model="depositTime" placeholder="请选择托管时间">
            <el-option
              v-for="(item, index) in depositArray"
              :key="'town' + index"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </div>
      <div>
        <span>租赁结算方式</span>
        <div>
          <el-select v-model="sMethod" placeholder="请选择租赁结算方式">
            <el-option
              v-for="(item, index) in depositArray"
              :key="'town' + index"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </div>
      <div>
        <span>年租金</span>
        <div>
          <el-input
            v-model="rentOfYear"
            placeholder="请输入资源面积"
            type="number"
          />
        </div>
      </div>
      <!-- <div>
        <span>是否参与报价</span>
        <div>
          <el-switch v-model="allowOffer" />
        </div>
      </div>
      <div v-if="allowOffer">
        <span>报价信息</span>
        <div>
          <el-input
            v-model="offer"
            placeholder="请输入报价信息"
            type="number"
          />
        </div>
      </div>
      <div>
        <span>开始时间</span>
        <div>
          <el-date-picker
            v-model="offerBegTime"
            type="date"
            placeholder="请选择开始时间"
            size="large"
          />
        </div>
      </div>
      <div>
        <span>结束时间</span>
        <div>
          <el-date-picker
            v-model="offerEndTime"
            type="date"
            placeholder="请选择结束时间"
            size="large"
          />
        </div>
      </div> -->
      <div>
        <div class="form-title">资源照片</div>
        <div class="form-upload">
          <div class="upload dp--center">
            <div
              class="upload-img"
              v-for="(item, index) in imageList"
              :key="'img' + index"
            >
              <el-image
                style="width: 60px; height: 60px"
                :src="item"
                :preview-src-list="imageList"
                :initial-index="index"
                fit="cover"
                :hide-on-click-modal="true"
                :preview-teleported="true"
              />
              <div class="upload-delete">
                <icon-font
                  name="close"
                  :size="22"
                  class="icon-point"
                  @click.stop="delImg(index)"
                />
              </div>
            </div>
            <div class="upload-button dp-center-center icon-point">
              <el-icon><plus /></el-icon>
              <input
                type="file"
                accept="image/*"
                @change="
                  //@ts-ignore
                  updateImg($event.target.files[0])
                "
                class="upload-button-img"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="form-title">资源描述</div>
        <el-input
          v-model="describe"
          :autosize="{ minRows: 8 }"
          type="textarea"
          placeholder="输入描述文字"
          style="width: 100%"
        />
      </div>
    </div>
    <div class="form-button">
      <el-button
        type="success"
        :style="
          deviceType === 'phone'
            ? { width: '100%', height: '40px' }
            : { width: '350px', height: '40px' }
        "
        @click="postResource"
        >资源上传</el-button
      >
    </div>
  </div>
</template>
<style scoped lang="scss">
.resourceForm {
  width: 100%;
  box-sizing: border-box;
  @include flex(center, null, wrap);
  @include scroll();
  .form {
    // height: calc(100% - 75px);
    // overflow-x: hidden;
    // overflow-y: auto;
    margin-top: 20px;
    margin-bottom: 10px;
    @include p-number(15px);

    > div {
      width: 100%;
      min-height: 50px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 10px;
      > span {
        width: 100px;
      }
      > div {
        width: calc(100% - 115px);
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
      .form-title {
        width: 100%;
        justify-content: flex-start;
        margin-bottom: 10px;
      }
      .form-upload {
        width: 100%;
        display: block;
      }
    }
  }
  .form-button {
    width: 100%;
    margin-bottom:20px;
    @include p-number(15px);
    @include flex(center, null, null);
  }
}
</style>
<style></style>
