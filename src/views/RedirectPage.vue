<template>
    <div>HELLOOOOO</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class RedirectPage extends Vue {
  mounted () {
    console.log('HELLOOOOO')
    console.log(this.$router)
    const accessCode = this.$route.query.code
    this.$store.dispatch('openid/fetchTokens', accessCode).then((redirectPath) => {
      this.$router.push(redirectPath)
    })
  }
}
</script>
