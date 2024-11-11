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
    // マウント時にトークンをチェック
    this.isLoggedIn = !!localStorage.getItem('accessToken');

    // カスタムイベントのリスナーを追加
    window.addEventListener('authChanged', this.updateAuthStatus);
  },
  beforeUnmount() {
    // コンポーネントがアンマウントされる際にイベントリスナーを削除
    window.removeEventListener('authChanged', this.updateAuthStatus);
  },
  methods: {
    logout() {
      localStorage.removeItem('accessToken');
      this.isLoggedIn = false;
      window.dispatchEvent(new Event('authChanged')); // ログアウト後にカスタムイベントを発火
      this.$router.push('/'); // ログアウト後にホームページにリダイレクト
    },
    updateAuthStatus() {
      // トークンの有無に応じてログイン状態を更新
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
