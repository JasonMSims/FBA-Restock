<template>
  <div>
    <div class="flex">
      <a
        :class="['font-normal', isSkuSelected ? 'text-indigo-600' : 'text-gray-900']"
        target="_blank"
        :href="`https:\/\/sellercentral.amazon.com/skucentral?mSku=${sku}`"
      >
        {{ sku }}
      </a>
      <div :class="[{ 'hover-show': !skusWithNotes.includes(sku) && !favoriteSkus.includes(sku) }, 'inline-flex transition duration-150']">
        <!-- <b-icon
        @click.native="toggleSkuClassification('favorite', sku)"
        class="relative cursor-pointer"
        :pack="favoriteSkus.includes(sku) ? 'fas' : 'far'"
        icon="star"
        type="is-warning"
      ></b-icon> -->
        <component
          :is="favoriteSkus.includes(sku) ? StarIconSolid : StarIconOutline"
          :class="['w-5 h-5 text-yellow-300']"
          @click="toggleSkuClassification('favorite', sku)"
        />
        <sku-notes-manager :sku="sku" />
      </div>
    </div>

    <b-taglist style="flex-wrap: nowrap">
      <b-tag rounded type="is-success">
        <a target="_blank" :href="`https:\/\/amazon.com/dp/${asin}`">
          <span>
            <b-icon pack="fab" icon="amazon"></b-icon>
            {{ asin }}
          </span>
        </a>
      </b-tag>
      <b-tag v-if="dropshipSkus.includes(sku)" rounded type="is-info">Dropship Item</b-tag>
      <b-tag v-if="oversizeSkus.includes(sku)" rounded type="is-danger">Oversized Item</b-tag>
      <b-tag v-if="fbmSkus.includes(sku)" rounded type="is-warning">FBM Item</b-tag>
      <b-tag v-if="marketplaceCode === 'CA' && canadaSkus.includes(sku)" rounded type="is-primary">Canada FBA Item</b-tag>
    </b-taglist>
  </div>
</template>
<script setup>
import { toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import { useClassificationStore, useNoteStore } from '@/stores'
import { SkuNotesManager } from '@/components/SkuTable'
import { StarIcon as StarIconOutline } from '@heroicons/vue/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/vue/24/solid'

const props = defineProps({
  sku: String,
  asin: String,
  marketplaceCode: String,
  isSkuSelected: Boolean,
})

const classificationStore = useClassificationStore()
const noteStore = useNoteStore()

const { toggleSkuClassification } = classificationStore
const {
  canada: canadaSkus,
  dropship: dropshipSkus,
  favorite: favoriteSkus,
  fbm: fbmSkus,
  oversize: oversizeSkus,
} = toRefs(classificationStore.classifications)
const { skusWithNotes } = storeToRefs(noteStore)
</script>
<style lang="scss">
.taginput {
  .taginput-container {
    & > .tag,
    & > .tags {
      font-size: 0.75rem !important;
    }
  }
}

.tag {
  a {
    color: inherit;
  }
}
</style>
