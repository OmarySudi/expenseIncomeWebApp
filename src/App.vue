<template>
   <v-app id="inspire">
    <v-app-bar app>
      <v-toolbar-title>ExpenseBook</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
   
  },

  data: () => ({
    drawer: null
  }),
};
</script>
