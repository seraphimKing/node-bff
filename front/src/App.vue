<script setup lang="ts">
import { inject, reactive } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'

const axios: any = inject('axios')

const userData: any = reactive({ username: '', phone: '' })

const handleAdd = () => {
  axios.get('/api/createUser?username=test').then((response: any) => {
    console.log(response.data)
  })
}

const handleSearch = () => {
  axios.get('/api/getUserInfo?username=test').then((response: any) => {
    const value = response.data.userInfo.data
    // console.log('userData::', value)
    userData.username = value.username
    userData.phone = value.phone
  })
}
</script>

<template>
  <div>
    <Button @click="handleAdd">新增人员</Button>
    <Button @click="handleSearch">查询人员</Button>
  </div>
  <p>username: {{ userData.username }}</p>
  <p>phone: {{ userData.phone }}</p>
  <!-- <header> -->
    <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->
    
    <!-- <div class="wrapper">
      <HelloWorld msg="Just did it!" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div> -->
  <!-- </header> -->

  <!-- <RouterView /> -->
</template>

<style scoped>

</style>
