<template>
  <b-field grouped>
    <div class="control">
      <b-taglist attached group-multiline>
        <b-tag rounded :class="[runRateDuration === '7d' ? 'is-info' : '']">&nbsp;7 Day</b-tag>
        <b-tag rounded :class="['has-text-weight-bold w-12', 'is-light', runRateDuration === '7d' ? 'is-info' : '']">
          {{ unitsSold7d.toFixed(2) }}
        </b-tag>
      </b-taglist>
    </div>
    <div class="control">
      <b-taglist attached>
        <b-tag rounded :class="[runRateDuration === '30d' ? 'is-info' : '']">30 Day</b-tag>
        <b-tag rounded :class="['has-text-weight-bold w-12', 'is-light', runRateDuration === '30d' ? 'is-info' : '']">
          {{ unitsSold30d.toFixed(2) }}
        </b-tag>
      </b-taglist>
    </div>
  </b-field>
</template>

<script setup>
const props = defineProps({
  unitsSold7d: Number,
  unitsSold30d: Number,
  runRateDuration: String,
})
</script>
