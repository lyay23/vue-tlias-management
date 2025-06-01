<script setup>

import { ref ,watch} from 'vue';

// 搜索表单对象-根据姓名，年龄，日期查询
const searchEmp = ref({ name: '', gender: undefined, date: [],begin:'',end:'' })

// 查询员工列表的函数
const search = () =>{
 
}
// 清空函数
const clear = () =>{
  // 将表单值置为空，然后再重新查询一次
  searchEmp.value={name: '', gender: undefined, date: [],begin:'',end:''};
  search();
}

// -------------watch监听----------

// 监听data属性
watch(()=>searchEmp.value.date,(newVal,oldVal)=>{
  if(newVal.length == 2){
    searchEmp.value.begin=newVal[0];
    searchEmp.value.end=newVal[1];
  }else{
    searchEmp.value.begin='';
    searchEmp.value.end='';
  }
})
</script>

<template>
  <h1>员工管理</h1>

  <!-- 制作搜索表单 -->
  <div class="container">
    <!-- 上栏搜索框 -->
    <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="searchEmp.name" placeholder="请输入员工姓名" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="searchEmp.gender" placeholder="请选择男女" >
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker v-model="searchEmp.date" type="daterange" range-separator="到" start-placeholder="开始日期"
          end-placeholder="结束日期" :size="size" value-format="YYYY-MM-DD"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 180px;
}

.demo-form-inline .el-select {
  --el-select-width: 180px;
}
.container {
  margin: 15px 0px;
}
</style>