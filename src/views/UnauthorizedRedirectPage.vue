<template>
    <div v-if="hasErrored">Something went wrong during openIdConnect redirect.</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class UnauthorizedRedirectPage extends Vue {
  hasErrored = false

  mounted () {
    this.$store.dispatch('openid/login')
  }
}
</script>
