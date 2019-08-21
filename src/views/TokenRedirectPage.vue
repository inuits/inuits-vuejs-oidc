<template>
    <div v-if="hasErrored">Something went wrong during openIdConnect login.</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class TokenRedirectPage extends Vue {
  hasErrored = false

  mounted () {
    const accessCode = this.$route.query.code
    this.$store.dispatch('openid/fetchTokens', accessCode).then(
      (redirectPath) => {
        this.$router.push({ path: redirectPath })
      },
      (error) => {
        this.hasErrored = true
      })
  }
}
</script>
