<script setup>

import { ref, watch, onMounted } from 'vue'
import { queryPageApi,addApi ,queryInfoApi,updateApi,deleteApi} from '@/api/emp'
import { queryAllApi as queryAllDeptApi } from '@/api/dept'
import { ElMessage,ElMessageBox } from 'element-plus';

// --------元数据相关----------
//职位列表数据
const jobs = ref([{ name: '班主任', value: 1 },{ name: '讲师', value: 2 },{ name: '学工主管', value: 3 },{ name: '教研主管', value: 4 },{ name: '咨询师', value: 5 },{ name: '其他', value: 6 }])
//性别列表数据
const genders = ref([{ name: '男', value: 1 }, { name: '女', value: 2 }])
// --------元数据结束--------


// 搜索表单对象-根据姓名，年龄，日期查询
const searchEmp = ref({ name: '', gender: '', date: [], begin: '', end: '' })

// 查询员工列表的函数
const search = async () => {
  const result = await queryPageApi(searchEmp.value.name, searchEmp.value.gender,
    searchEmp.value.begin, searchEmp.value.end, currentPage.value, pageSize.value);
  if (result.code) {
    empList.value = result.data.rows;
    total.value = result.data.total
  }
}
// 清空函数
const clear = () => {
  // 将表单值置为空，然后再重新查询一次
  searchEmp.value = { name: '', gender: '', date: [], begin: '', end: '' };
  search();
}

// 钩子函数
onMounted(() => {
  // 查询员工列表数据
  search();

 // 查询所有部门数据
  queryAllDepts();

  // 获取token
  getToken();
})

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
const empList = ref([])

// 分页操作相关数据模型
const currentPage = ref(1) // 页码
const pageSize = ref(10) // 默认每页展示的记录数
const background = ref(true) //背景色（是否）
const total = ref(0) // 总记录数-后端传入的
// 每页展示记录数发生变化时会触发
const handleSizeChange = (val) => {
  search();
}
// 页码发生变化时会触发
const handleCurrentChange = (val) => {
  // 查询员工列表数据
  search();
}

// ----------对话框相关----------
//新增/修改表单
const employee = ref({
  username: '',
  name: '',
  gender: '',
  phone: '',
  job: '',
  salary: '',
  deptId: '',
  entryDate: '',
  image: '',
  exprList: []
})

// 控制弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增员工')

//文件上传
// 图片上传成功后触发
const handleAvatarSuccess = (response) => {
  employee.value.image=response.data;
}
// 文件上传之前触发
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('只支持上传图片')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('只能上传10M以内图片')
    return false
  }
  return true
}

// 声明添加员工的箭头函数
const addEmp = () => {
  dialogVisible.value = true;
  dialogTitle.value = '新增员工';
  employee.value={
  username: '',
  name: '',
  gender: '',
  phone: '',
  job: '',
  salary: '',
  deptId: '',
  entryDate: '',
  image: '',
  exprList: []
}

// 重置表单校验规则
if(empFromRef.value){
  empFromRef.value.resetFields();
}
}

// 查询所有部门功能
const depts =ref([]);
// 查询所有部门数据
const queryAllDepts = async() =>{
  const result=await queryAllDeptApi();
  if(result.code){
    depts.value=result.data;
  }
}

// -------------添加工作经历相关-----------
const addExprItem =()=>{
  // 为数组添加元素数据
  employee.value.exprList.push({
    company:'',job:'',begin:'',end:'',exprDate:[]
  });
}

// 删除工作经历
const delExprItem = (index) => {
  employee.value.exprList.splice(index,1);
}

// 监听employee员工对象中的工作经历信息将值传给开始与结束时间
watch(() =>employee.value.exprList,(newVal,oldVal) => {
  if(employee.value.exprList && employee.value.exprList.length>0){
   employee.value.exprList.forEach((expr) =>{
    expr.begin=expr.exprDate[0];
    expr.end=expr.exprDate[1];
   })
  }
},{deep:true}) // 深度监听


//-------保存员工相关--------
const save= async() =>{
  // 表单校验-只有通过了才可以执行下面的代码
  if(!empFromRef.value) return;
  empFromRef.value.validate(async (valid) =>{ // valid标识是否通过：true通过/false不通过
   if(valid){ // 通过

    let result;
    if(employee.value.id){
    result = await updateApi(employee.value);
    }else{
    result = await addApi(employee.value);
    }
    if(result.code){
      ElMessage.success("保存成功");
      dialogVisible.value=false;
      search();
    }else{
      ElMessage.error(result.msg);
    }
   }else{ //不通过
    ElMessage.error('表单校验不通过');
   }
  })
}

//-------表单校验相关-------
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度应在2到20个字符之间', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度应在2到10个字符之间', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ]
});

// 表单验证的响应式对象
const empFromRef =ref();

// ------根据id查询员工信息相关-----
const edit =async(id) =>{
 const result = await queryInfoApi(id);
 if(result.code){
  dialogVisible.value=true;
  dialogTitle.value='修改员工';
  employee.value=result.data;

  // 对工作经历进行处理
  let exprList= employee.value.exprList;
  if(exprList && exprList.length>0){
    exprList.forEach((expr) =>{
      expr.exprDate=[expr.begin,expr.end];
    })
  }
 }
}

// ------删除员工相关-----
const deleteById = (id) =>{
  ElMessageBox.confirm('此操作将永久删除该员工, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async() => {
    // 删除
    const result = await deleteApi(id);
    if (result.code) {
      ElMessage.success('删除成功');
      search();
    } else{
      ElMessage.error(result.msg);
    }
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
}

// 记录勾选的员工id
const selectedIds = ref([]);

// 批量删除员工
const handleSelectionChange = (selection) => {// selection代表当前选中的员工数据记录
  selectedIds.value = selection.map(item => item.id)
}

// 批量删除
const deleteByIds  = () =>{ 
ElMessageBox.confirm('此操作将永久删除该员工, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async() => {

    if(selectedIds.value && selectedIds.value.length>0){
      // 删除
    const result = await deleteApi(selectedIds.value);
    if (result.code) {
      ElMessage.success('删除成功');
      search();
    } else{
      ElMessage.error(result.msg);
    }
  }else {
      ElMessage.error("请选择要删除的员工");
    }
    
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
}

// 声明token的响应式数据
const token = ref('');

// 获取token
const getToken = async() =>{
  const loginUser=JSON.parse(localStorage.getItem('loginUser'))
  if(loginUser && loginUser.token){
    token.value = loginUser.token;
  }
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
    <el-button type="primary" @click="addEmp">+新增员工</el-button>
    <el-button type="danger" @click="deleteByIds">-批量删除</el-button>
  </div>

  <!-- 表格区域 -->
  <div class="container">
    <el-table :data="empList" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection"  width="55" align="center" />
      <el-table-column prop="name" label="姓名" width="120" align="center" />
      <el-table-column label="性别" width="100" align="center">
        <template #default="scope">
          {{ scope.row.gender == 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="头像" width="120" align="center">
        <template #default="scope">
          <img :src="scope.row.image" height="40px">
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="所属部门" width="120" align="center" />
      <el-table-column prop="job" label="职位" width="120" align="center">
        <template #default="scope">
          <span v-if="scope.row.job == 1">班主任</span>
          <span v-else-if="scope.row.job == 2">班主任</span>
          <span v-else-if="scope.row.job == 3">学工主管</span>
          <span v-else-if="scope.row.job == 4">教研主管</span>
          <span v-else-if="scope.row.job == 5">咨询师</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="entryDate" label="入职时间" width="140" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" width="200" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="edit(scope.row.id)">
            <el-icon>
              <Edit />
            </el-icon>编辑</el-button>
          <el-button type="danger" size="small" @click="deleteById(scope.row.id)">
            <el-icon>
              <Delete />
            </el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 下方分页条 -->
  <div class="container">
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 30, 50, 75, 100]" :background="background" layout="total, sizes, prev, pager, next, jumper"
      :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>

  <!-- 新增/修改员工的对话框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form :model="employee" label-width="80px" :rules="rules" ref="empFromRef">
      <!-- 基本信息 -->
      <!-- 第一行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="employee.username" placeholder="请输入员工用户名，2-20个字" ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="employee.name" placeholder="请输入员工姓名，2-10个字"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="employee.gender" placeholder="请选择性别" style="width: 100%;">
              <el-option v-for="g in genders" :key="g.value" :label="g.name" :value="g.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="employee.phone" placeholder="请输入员工手机号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="职位">
            <el-select v-model="employee.job" placeholder="请选择职位" style="width: 100%;">
              <el-option v-for="j in jobs" :key="j.value" :label="j.name" :value="j.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="薪资">
            <el-input v-model="employee.salary" placeholder="请输入员工薪资"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属部门">
            <el-select v-model="employee.deptId" placeholder="请选择部门" style="width: 100%;">
              <el-option v-for="d in depts" :key="d.id"  :label="d.name" :value="d.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职日期">
            <el-date-picker v-model="employee.entryDate" type="date" style="width: 100%;" placeholder="选择日期"
              format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="头像">
            <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="{'token':token}">
              <img v-if="employee.image" :src="employee.image" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>


      <!-- 工作经历 -->
      <!-- 第六行 -->
      <el-row :gutter="10" >
        <el-col :span="24">
          <el-form-item label="工作经历">
            <el-button type="success" size="small" @click="addExprItem">+ 添加工作经历</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第七行 ...  工作经历 -->
      <el-row :gutter="3" v-for="(expr,index) in employee.exprList">
        <el-col :span="10">
          <el-form-item size="small" label="时间" label-width="80px">
            <el-date-picker type="daterange" v-model="expr.exprDate" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
              format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="公司" label-width="60px">
            <el-input placeholder="请输入公司名称" v-model="expr.company"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="职位" label-width="60px">
            <el-input placeholder="请输入职位" v-model="expr.job"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <el-form-item size="small" label-width="0px">
            <el-button type="danger" @click="delExprItem(index)">- 删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>
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

.avatar {
  height: 40px;
}

.avatar-uploader .avatar {
  width: 78px;
  height: 78px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  border-radius: 10px;
  /* 添加灰色的虚线边框 */
  border: 1px dashed var(--el-border-color);
}
</style>