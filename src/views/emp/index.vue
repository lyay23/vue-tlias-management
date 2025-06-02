<script setup>

import { ref, watch } from 'vue';

// 搜索表单对象-根据姓名，年龄，日期查询
const searchEmp = ref({ name: '', gender: undefined, date: [], begin: '', end: '' })

// 查询员工列表的函数
const search = () => {

}
// 清空函数
const clear = () => {
  // 将表单值置为空，然后再重新查询一次
  searchEmp.value = { name: '', gender: undefined, date: [], begin: '', end: '' };
  search();
}

// -------------watch监听----------

// 监听data属性
watch(() => searchEmp.value.date, (newVal, oldVal) => {
  if (newVal.length == 2) {
    searchEmp.value.begin = newVal[0];
    searchEmp.value.end = newVal[1];
  } else {
    searchEmp.value.begin = '';
    searchEmp.value.end = '';
  }
})

// 员工列表数据
const empList = ref([
  {
    "id": 0,
    "username": "string",
    "password": "string",
    "name": "string",
    "gender": 0,
    "job": 0,
    "salary": 0,
    "image": "https://bu.dusays.com/2025/02/15/67b092bdaab4d.jpg",
    "entryDate": "2019-08-24",
    "deptId": 0,
    "deptName": "string",
    "createTime": "2019-08-24T14:15:22.123Z",
    "updateTime": "2019-08-24T14:15:22.123Z"
  }
])

// 分页操作相关数据模型
const currentPage = ref(1) // 页码
const pageSize = ref(10) // 默认每页展示的记录数
const background = ref(true) //背景色（是否）
const total =ref(0) // 总记录数-后端传入的
// 每页展示记录数发生变化时会触发
const handleSizeChange = (val) => {
  console.log(`每页展示${val}条记录 `)
}
// 页码发生变化时会触发
const handleCurrentChange = (val) => {
  console.log(`当前页码: ${val}`)
}
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
        <el-select v-model="searchEmp.gender" placeholder="请选择男女">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker v-model="searchEmp.date" type="daterange" range-separator="到" start-placeholder="开始日期"
          end-placeholder="结束日期" :size="size" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 下方新增员工与批量删除员工按钮 -->
  <div class="container">
    <el-button type="primary" @click=" ">+新增员工</el-button>
    <el-button type="danger" @click=" ">-批量删除</el-button>
  </div>

  <!-- 表格区域 -->
  <div class="container">
    <el-table :data="empList" border style="width: 100%">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="name" label="姓名" width="120" align="center"/>
      <el-table-column  label="性别" width="100" align="center">
        <template #default="scope">
          {{ scope.row.gender ==1?'男':'女'}}
        </template>
      </el-table-column>
      <el-table-column  label="头像" width="120" align="center">
        <template #default="scope">
          <img :src="scope.row.image" height="40px">
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="所属部门" width="120" align="center"/>
      <el-table-column prop="job" label="职位" width="120" align="center">
        <template #default="scope">
         <span v-if="scope.row.job==1">班主任</span>
         <span v-else-if="scope.row.job==2">班主任</span>
         <span v-else-if="scope.row.job==3">学工主管</span>
         <span v-else-if="scope.row.job==4">教研主管</span>
         <span v-else-if="scope.row.job==5">咨询师</span>
         <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="entryDate" label="入职日期" width="140" align="center"/>
      <el-table-column prop="updateTime" label="最后操作时间" width="200" align="center"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="">
            <el-icon><Edit /></el-icon>编辑</el-button>
          <el-button type="danger" size="small" @click="">
            <el-icon><Delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

<!-- 下方分页条 -->
 <div class="container">
  <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5,10, 20, 30, 50,75,100]"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange"
    />
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
  margin: 10px 0px;
}
</style>