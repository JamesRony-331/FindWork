<script setup>
import UserLayout from '../../../layouts/UserLayout.vue';
import AnalysisPage from '../../../components/charts/AnalysisPage.vue';
import * as config from '../../../data/user/major';
const state = config.createPageState();
</script>
<template>
  <UserLayout><AnalysisPage :config="config" :state="state" /></UserLayout>
</template>
