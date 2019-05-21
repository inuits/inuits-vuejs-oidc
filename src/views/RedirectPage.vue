<template>
    <div/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class RedirectPage extends Vue {
  mounted () {
    const accessCode = this.$route.query.code
    this.$store.dispatch('openid/fetchTokens', accessCode).then((redirectPath) => {
      this.$router.push(redirectPath)
    })
  }
}
</script>
