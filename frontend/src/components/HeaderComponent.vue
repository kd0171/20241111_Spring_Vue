<template>
  <header class="header">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
      <a v-else @click="logout" style="cursor: pointer;">Logout</a>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
  data() {
    return {
      isLoggedIn: false
    };
  },
  mounted() {
    // コンポーネントがマウントされた時にlocalStorageからトークンをチェック
    this.isLoggedIn = !!localStorage.getItem('accessToken');
  },
  methods: {
    logout() {
      // ログアウト処理：トークンを削除してログイン状態を更新
      localStorage.removeItem('accessToken');
      this.isLoggedIn = false;
      this.$router.push('/'); // ログアウト後にホームページにリダイレクト
    }
  },
  watch: {
    // 他のコンポーネントでログイン状態が変更された場合に対応するため
    '$route'() {
      this.isLoggedIn = !!localStorage.getItem('accessToken');
    }
  }
};
</script>

<style scoped>
.header {
  padding: 20px;
  background-color: #42b983;
  color: white;
  text-align: center;
}
nav {
  display: flex;
  gap: 20px;
  justify-content: center;
}
a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}
a:hover {
  text-decoration: underline;
}
</style>
