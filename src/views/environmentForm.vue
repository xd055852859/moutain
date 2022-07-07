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
import CommonMap from "@/components/commonMap.vue";
import { Environment } from "@/interface/Resource";
interface Address {
  province: string;
  city: string;
  district: string;
  township: string;
  village: string;
}
interface Region {
  _key: string;
  name: string;
  areaCode: string;
  level: number;
}
const emits = defineEmits<{
  (e: "addItem", item: Environment): void;
}>();
const { user, uploadToken, domain } = storeToRefs(appStore.authStore);
const { deviceType, lng, lat } = storeToRefs(appStore.commonStore);
const { getUploadToken } = appStore.authStore;
const dayjs: any = inject("dayjs");

const name = ref<string>("");
const tagList = ref<Tag[]>([]);
const tagKey = ref<string>("");
const tagDetailList = ref<Tag[]>([]);
const tagDetailKey = ref<string>("");
const regionCode = ref<string>("");
const imageList = ref<string[]>([]);
const describe = ref<string>("");
const address = ref<Address | null>(null);
const townArray = ref<Region[]>([]);
const townCode = ref<string>("");
const villageArray = ref<any>([]);
const init = () => {
  getUploadToken();
  getTag();
};
const getTag = async () => {
  const tagRes = (await api.request.get("tag", {
    tagType: "Event",
  })) as ResultProps;
  if (tagRes.msg === "OK") {
    tagList.value = [...tagRes.data];
  }
};
const getTagDetail = async () => {
  const tagRes = (await api.request.get("tag/detail", {
    tagKey: tagKey.value,
  })) as ResultProps;
  if (tagRes.msg === "OK") {
    tagDetailList.value = [...tagRes.data];
  }
};
const getRegion = async (type: string, code: string) => {
  const regionRes = (await api.request.get("/regionCode/subByCode", {
    regionCode: code,
  })) as ResultProps;
  if (regionRes.msg === "OK") {
    if (type === "town") {
      townArray.value = [...regionRes.data];
      villageArray.value = [];
      regionCode.value = "";
    } else {
      villageArray.value = [...regionRes.data];
      if (address.value?.village) {
        villageArray.value.forEach((item) => {
          //@ts-ignore
          let villageName = address.value.village.substring(0, 2);
          if (item.name.indexOf(villageName) !== -1) {
            regionCode.value = item.areaCode;
          }
        });
      }
    }
  }
};
const changeAddress = (mapName, mapAddress) => {
  name.value = mapName;
  address.value = {
    province: mapAddress.province,
    city: mapAddress.city,
    district: mapAddress.district,
    township: mapAddress.township,
    village: mapName
      .replace(mapAddress.province, "")
      .replace(mapAddress.city, "")
      .replace(mapAddress.district, "")
      .replace(mapAddress.township, ""),
  };
  villageArray.value = [];
  regionCode.value = "";
  townArray.value.forEach((item) => {
    let townName = mapAddress.township.replace("镇", "").replace("乡", "");
    if (item.name.indexOf(townName) !== -1) {
      townCode.value = item.areaCode;
      getRegion("village", townCode.value);
    }
  });
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

const postenvironment = async () => {
  if (!name.value) {
    ElMessage({
      message: "请选择地址",
      type: "error",
      duration: 1000,
    });
    return;
  }
  const environmentRes = (await api.request.post("/event", {
    title: name.value,
    tagKey: tagKey.value,
    detailKey: tagDetailKey.value,
    describe: describe.value,
    location: [lng.value, lat.value],
    imageList: imageList.value,
    regionCode: regionCode.value ? regionCode.value : townCode.value,
  })) as ResultProps;
  if (environmentRes.msg === "OK") {
    ElMessage({
      message: "问题上报成功",
      type: "success",
      duration: 1000,
    });
    if (deviceType.value === "phone") {
      router.push("/phone/environment");
    }
    emits("addItem", { ...environmentRes.data, regionCode: regionCode });
    name.value = "";
    tagList.value = [];
    tagKey.value = "";
    tagDetailList.value = [];
    tagDetailKey.value = "";
    regionCode.value = "";
    imageList.value = [];
    describe.value = "";
    address.value = null;
    townArray.value = [];
    townCode.value = "";
    villageArray.value = [];
  }
};
watch(
  domain,
  (newDomain) => {
    if (newDomain) {
      init();
      getRegion("town", newDomain.regionCode);
    }
  },
  { immediate: true }
);
watch(townCode, (newVal) => {
  if (newVal) {
    villageArray.value = [];
    regionCode.value = "";
    getRegion("village", newVal);
  }
});
watch(
  tagKey,
  (newTagKey) => {
    if (newTagKey) {
      getTagDetail();
    }
  },
  { immediate: true }
);

defineExpose({
  changeAddress,
});
</script>
<template>
  <pHeader v-if="deviceType === 'phone'">
    <template v-slot:title>环境上报</template>
  </pHeader>

  <div
    class="environmentForm"
    :style="
      deviceType === 'phone'
        ? { width: '100%', height: `calc(100vh - 60px)` }
        : { width: 'calc(35vw - 30px)' }
    "
  >
    <div
      class="form"
      :style="deviceType === 'phone' ? { height: `calc(100vh - 115px)` } : {}"
    >
      <div>您可对村庄环境相关问题随手拍、立即报，助力有关部门知晓。</div>
      <div>
        <span>发生地址</span>
        <div><el-input v-model="name" placeholder="请选择地址" /></div>
      </div>
      <div v-if="deviceType === 'phone'">
        <CommonMap @setName="changeAddress" :width="'100%'" :height="'50vh'" />
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
        <span>上报问题</span>
        <div>
          <el-select v-model="tagKey" placeholder="请选择上报分类">
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
        <span>分类详情</span>
        <div>
          <el-select
            v-model="tagDetailKey"
            placeholder="请选择分类详情"
            :disabled="!tagKey"
          >
            <el-option
              v-for="(item, index) in tagDetailList"
              :key="'village' + index"
              :label="item.name"
              :value="item._key"
            />
          </el-select>
        </div>
      </div>
      <div>
        <div class="form-title">上报照片</div>
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
        <div class="form-title">问题描述</div>
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
        @click="postenvironment"
        >问题上报</el-button
      >
    </div>
  </div>
</template>
<style scoped lang="scss">
.environmentForm {
  width: 100%;
  @include flex(center, null, wrap);
  .form {
    overflow-x: hidden;
    overflow-y: auto;
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
    @include p-number(15px);
    @include flex(center, null, null);
  }
}
</style>
<style></style>
