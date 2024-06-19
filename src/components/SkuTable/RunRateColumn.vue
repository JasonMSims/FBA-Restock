<template>
  <b-field grouped>
    <div class="control">
      <b-taglist attached group-multiline>
        <b-tag :class="[runRateDuration === '7d' ? 'is-info' : '']" rounded>&nbsp;7 Day</b-tag>
        <b-tag :class="['has-text-weight-bold w-12', 'is-light', runRateDuration === '7d' ? 'is-info' : '']" rounded>
          {{ (unitsSold7d / 7).toFixed(2) }}
        </b-tag>
      </b-taglist>
    </div>
    <div class="control">
      <b-taglist attached>
        <b-tag :class="[runRateDuration === '30d' ? 'is-info' : '']" rounded>30 Day</b-tag>
        <b-tag :class="['has-text-weight-bold w-12', 'is-light', runRateDuration === '30d' ? 'is-info' : '']" rounded>
          {{ (unitsSold30d / 30).toFixed(2) }}
        </b-tag>
      </b-taglist>
    </div>
  </b-field>
</template>

<script setup>
defineProps({
  runRateDuration: String,
  unitsSold7d: Number,
  unitsSold30d: Number,
})
</script>
