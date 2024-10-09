<script setup>
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
import TheContent from './components/TheContent.vue';
import TheSidebar from './components/TheSidebar.vue';
</script>

<template>
  <div class="wrapper">
    <TheHeader />

    <main>
      <TheContent />
      <TheSidebar />
    </main>

    <TheFooter />
  </div>
</template>

<style>
:root {
  --gap: 20px;
}

.wrapper {
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: var(--gap);
}

.wrapper::after {
  content: '';
  display: block;
  height: 100vh;
  width: 100%;
  background-color: blue;
  clip-path: polygon(100% 0%, 100% 100%, 50% 100%);
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}

.box {
  display: grid;
  place-items: center;
  border: 1px solid blue;
  height: 100px;
  background-color: rgb(220, 220, 220);
  color: black;
}

main {
  display: grid;
  gap: var(--gap);
}

@media screen and (min-width: 768px) {
  main {
    grid-template-columns: 2fr 1fr;
  }
}
</style>