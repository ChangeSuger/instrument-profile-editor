<template>
  <a-space>
    <a-button @click="handleImport">导入</a-button>
    <a-button @click="handleExport">导出</a-button>
  </a-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import xml2js from 'xml2js'
import { xmlData2ProfileData, profileData2XmlData } from '../utils/adaptor'

const xmlData = ref()

function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xml'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (e) => {
      const xml = e.target?.result as string
      const parser = new xml2js.Parser()
      parser.parseString(xml, (err, result) => {
        if (err) {
          Message.error('配置文件解析失败')
          return
        } else {
          xmlData.value = result
          console.log(result)
          console.log(xmlData2ProfileData(result))
        }
      })
    }
    reader.readAsText(file)
  }
  input.click()
}

function handleExport() {
  const builder = new xml2js.Builder()
  const xml = builder.buildObject(profileData2XmlData(xmlData2ProfileData(xmlData.value)))
  const blob = new Blob([xml], { type: 'text/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'profile.xml'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped lang="scss"></style>
