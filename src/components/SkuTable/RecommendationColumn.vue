<template>
  <b-field grouped>
    <div class="control">
      <b-taglist attached group-multiline>
        <b-tag :class="[runRateDuration === '7d' ? 'is-info' : '']" rounded>&nbsp;7 Day</b-tag>
        <b-tag :class="['has-text-weight-bold w-12', 'is-light', runRateDuration === '7d' ? 'is-info' : '']" rounded>{{
          useFormatter.number(recommendation7d)
        }}</b-tag>
      </b-taglist>
    </div>
    <div class="control">
      <b-taglist attached>
        <b-tag :class="[runRateDuration === '30d' ? 'is-info' : '']" rounded>30 Day</b-tag>
        <b-tag :class="['has-text-weight-bold w-12', 'is-light', runRateDuration === '30d' ? 'is-info' : '']" rounded>{{
          useFormatter.number(recommendation30d)
        }}</b-tag>
      </b-taglist>
    </div>
  </b-field>
</template>

<script setup>
import { useFormatter } from '@/composables'

defineProps({
  recommendation7d: Number,
  recommendation30d: Number,
  runRateDuration: String,
})
</script>
