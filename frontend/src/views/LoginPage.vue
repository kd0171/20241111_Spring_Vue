<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" placeholder="Email" type="email" />
      <input v-model="password" placeholder="Password" type="password" />
      <button type="submit">Login</button>
    </form>
    
    <!-- トークンの表示 -->
    <div v-if="token">Token: {{ token }}</div>

    <!-- /admin エンドポイントのテストボタン -->
    <button @click="accessAdminEndpoint" :disabled="!token">Access Admin Endpoint</button>

    <!-- /secured エンドポイントのテストボタン -->
    <button @click="accessSecuredEndpoint" :disabled="!token">Access Secured Endpoint</button>

    <!-- エンドポイントからの応答メッセージを表示 -->
    <div v-if="adminData">Admin Data: {{ adminData }}</div>
    <div v-if="securedData">Secured Data: {{ securedData }}</div>
    <div v-if="errorMessage" style="color: red;">Error: {{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      token: '',
      adminData: '',
      securedData: '',
      errorMessage: ''
    };
  },
  methods: {
    // ログインを試み、トークンを取得
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:8080/auth/login', {
          email: this.email,
          password: this.password
        });
        this.token = response.data.accessToken;
        localStorage.setItem('accessToken', this.token); // トークンをlocalStorageに保存
        this.errorMessage = '';
      } catch (error) {
        console.error("Login failed:", error);
        this.errorMessage = "Invalid email or password.";
        this.token = '';
      }
    },

    // 管理者エンドポイントにアクセス
    async accessAdminEndpoint() {
      if (!this.token) return;
      try {
        const response = await axios.get('http://localhost:8080/admin', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.adminData = response.data;
        this.errorMessage = '';
      } catch (error) {
        console.error("Access to admin endpoint failed:", error);
        this.errorMessage = "Access denied or insufficient permissions.";
        this.adminData = "Access denied";
      }
    },

    // /secured エンドポイントにアクセス
    async accessSecuredEndpoint() {
      if (!this.token) return;
      try {
        const response = await axios.get('http://localhost:8080/secured', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.securedData = response.data;
        this.errorMessage = '';
      } catch (error) {
        console.error("Access to secured endpoint failed:", error);
        this.errorMessage = "Access denied or insufficient permissions.";
        this.securedData = "Access denied";
      }
    }
  },
  // コンポーネントがマウントされたときにlocalStorageからトークンを取得
  mounted() {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      this.token = storedToken; // localStorageから取得したトークンをセット
    }
  }
};
</script>
