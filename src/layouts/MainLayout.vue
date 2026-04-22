<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="layout-header">
      <q-toolbar class="q-px-lg" style="min-height: 56px">
        <div class="header-logo row items-center q-gutter-sm">
          <q-icon name="travel_explore" size="20px" color="primary" />
          <span class="header-title">Rick and Morty Dashboard</span>
        </div>
        <q-space />
        <span class="header-subtitle text-caption text-grey-6">Data Sync & Explorer</span>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// no logic needed
</script>

<style scoped>
.layout-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.header-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.01em;
}

.header-subtitle {
  font-size: 0.75rem;
}
</style>
