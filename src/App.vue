<script lang="ts" setup>
import {onMounted, Ref, ref, toRaw} from 'vue';
import {getOptionsValue, resetOptions, saveOptions} from "./js/storage";
import {defaultOptions, generatePassword, GenerateRandomStringOptions, getExcludeChars} from "./js/generatefun";
import {Delete, DocumentCopy, QuestionFilled} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {generatePasswordSuggestions, Suggestion} from "./js/Suggestion";


const enterAction = ref({})
const localOptions: Ref<GenerateRandomStringOptions> = ref(defaultOptions())
const passwords: Ref<string[]> = ref()
const count: Ref<number> = ref(1)
const suggestions: Ref<Suggestion[]> = ref([])


// 生成密码
function genPassword(count: number = 1) {
  suggestions.value = []
  passwords.value = generatePassword(localOptions.value, count)
  if (count === 1) {
    suggestions.value = generatePasswordSuggestions(passwords.value[0])
  }
  saveOptions(toRaw(localOptions.value))
}


// 恢复默认设置
function resetOptionsCommand() {
  localOptions.value = resetOptions()
  count.value = 1
}

// 复制单条密码
function copyPassword(password: string) {
  utools.copyText(password)
  ElMessage.success("密码已复制到剪贴板")
}

// 复制并隐藏密码
function copyPasswordAndHide(password: string) {
  utools.hideMainWindow()
  utools.copyText(password)
  passwords.value = undefined
  count.value = 1
  utools.outPlugin(true)
}

// 直接获取密码并退出
function copyPasswordAndOut() {
  utools.hideMainWindow()
  let password = generatePassword(localOptions.value, 1)[0]
  utools.copyText(password)
  passwords.value = undefined
  count.value = 1
  utools.outPlugin(true)
}

onMounted(() => {
  utools.onPluginEnter((action) => {
    enterAction.value = action
    localOptions.value = getOptionsValue()
    if (action.code === 'copy') {
      copyPasswordAndOut()
    }
  })
})


</script>

<template>
  <div class="password-generator">
    <!-- 字符设置区域 -->
    <div>
      <h1 style="text-align: center"> 随机密码生成 </h1>
      <!--      <el-button @click="getOptionsValue()">获取数据</el-button>-->
      <el-descriptions :column="1" border style="width: 600px;margin: auto">
        <el-descriptions-item label="所用字符" align="center">
          <el-space :size="20" spacer="|">
            <el-switch active-text="a-z" v-model="localOptions.hasLowerCase"/>
            <el-switch active-text="A-Z" v-model="localOptions.hasUpperCase"/>
            <el-switch active-text="0-9" v-model="localOptions.hasNumbers"/>
          </el-space>
        </el-descriptions-item>
        <el-descriptions-item label="添加字符" align="center">
          <el-input class="code" v-model="localOptions.includeChars" placeholder="输入要添加的字符"
                    input-style="font-family:'Cascadia Mono', Consolas, monospace;"
                    style="width: 200px"/>
        </el-descriptions-item>
        <el-descriptions-item label="排除字符" align="center">
          <el-input class="code" v-model="localOptions.excludeChars" placeholder="输入要排除的字符"
                    input-style="font-family:'Cascadia Mono', Consolas, monospace;"
                    style="width: 200px"/>
        </el-descriptions-item>
      </el-descriptions>
      <br/>
      <el-row justify="center">
        <el-col :span="10">
          <el-space :size="20">
            <el-text>密码长度</el-text>
            <el-input-number v-model="localOptions.length" :min="1" :max="100" style="width: 100px;"/>
          </el-space>
        </el-col>
        <el-col :span="10">
          <el-space :size="20">
            <el-text>
              密码个数
              <el-tooltip
                  content="密码个数并不会保存到设置中，重启插件后会恢复为1个"
                  placement="top">
                <el-icon>
                  <QuestionFilled/>
                </el-icon>
              </el-tooltip>
            </el-text>
            <el-input-number v-model="count"
                             :min="1" :max="20"
                             style="width: 100px;"/>
          </el-space>
        </el-col>
      </el-row>
      <br/>
      <el-row justify="center" style="width: 600px">
        <el-col :span="6">
          <el-tooltip placement="bottom" class="box-item" :content="`密码字符为\n${getExcludeChars(localOptions)}`">
            <el-button type="primary"
                       @click="genPassword(count)"
                       style="margin: 0">
              生成密码
            </el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="6">
          <el-button type="danger" :icon="Delete" @click="resetOptionsCommand"
                     style="margin: 0">
            恢复初始设置
          </el-button>
        </el-col>
      </el-row>
      <br/>
      <el-card v-if="passwords">
        <div style="text-align: center;height: 50px">
          <el-text style="font-size: 20px;">生成的密码</el-text>
        </div>
        <div v-if="passwords.length > 1">
          <el-space>
            <el-button type="info" :icon="DocumentCopy" @click="copyPassword(passwords.join('\n'))">
              复制全部密码
            </el-button>
            <el-button type="warning" :icon="DocumentCopy" @click="copyPasswordAndHide(passwords.join('\n'))">
              复制全部密码并隐藏
            </el-button>
          </el-space>
        </div>
        <div class="password-content" v-for="password in passwords" :key="password" style="margin: 10px auto">
          <el-space>
            <el-input readonly style="width: 300px;" :value="password"
                      input-style="font-family:'Cascadia Mono', Consolas, monospace;"/>
            <el-button type="info" :icon="DocumentCopy" @click="copyPassword(password)">
              复制
            </el-button>
            <el-button type="warning" :icon="DocumentCopy" @click="copyPasswordAndHide(password)">
              复制并隐藏
            </el-button>
          </el-space>
        </div>
        <div v-if="passwords.length === 1">
          <div v-for="suggestion in suggestions" class="suggestions">
            <el-button plain style="width: 519px;justify-content: normal" :type="suggestion.seriousness">
              <div class="suggestContent">
                <el-text tag="b">{{ suggestion.title }}</el-text>
                <br/>
                <br/>
                <el-text>{{ suggestion.content }}</el-text>
              </div>
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>

</template>

<style lang="less" scoped>
.password-generator {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

.suggestions {
  margin-bottom: 5px;
  height: auto;

  :deep(.el-button) {
    width: 519px;
    height: auto;
    justify-content: normal;
    text-align: left;
  }

  .suggestContent {
    display: inline-block;
    //align-items: center;
    justify-content: normal;
    gap: 8px;
    width: 500px
  }
}


</style>