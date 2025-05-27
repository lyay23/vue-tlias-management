<script setup>
import { ref ,onMounted} from "vue";
import { queryAllApi} from "@/api/dept";

// 定义钩子函数，当页面加载完毕就会调用这函数，然后这个函数就会调用serch方法，
// 就会调用链接，将获取的值赋给deptList，然后就在页面显示了
onMounted(() => { //生命周期
  search();
});
// 查询部门列表
 const search=async() => { 
// 注释掉旧代码  
//  const result = await axios.get("https://m1.apifoxmock.com/m1/6421010-6118327-default/depts");
//  // 如果code为1就显示数据，否则提示错误信息
//  if(result.data.code == 1) { //布尔类型
//    deptList.value = result.data.data;
//  } else {
//    this.$message.error(result.data.message);
//  }

  const result = await queryAllApi();
    deptList.value = result.data;

};

//定义响应式数据
const deptList = ref([]);


</script>

<template>
  <h1>部门管理</h1>
  <div class="container">
    <el-button type="primary">+新增部门</el-button>
  </div>

  <div class="container">
    <el-table :data="deptList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100" align="center"/>
      <el-table-column prop="name" label="部门名称" width="260" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" width="300"  align="center"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small">
            <el-icon><Edit /></el-icon>编辑
          </el-button>
          <el-button type="danger" size="small">
            <el-icon><Delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.container {
  /* 距离上下10px 左右0px */
  margin: 20px 0px;
}
</style>
