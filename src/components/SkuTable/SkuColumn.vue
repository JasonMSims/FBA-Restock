<template>
  <div>
    <div class="flex items-center">
      <a
        :class="['cursor-pointer font-normal', isSkuSelected ? 'text-indigo-600 hover:text-indigo-500' : 'text-gray-900 hover:text-gray-700']"
        :href="`https:\/\/sellercentral.amazon.com/skucentral?mSku=${sku}`"
        target="_blank"
      >
        {{ sku }}
      </a>
      <div
        :class="[{ 'hover-show': !skusWithNotes.includes(sku) && !favoriteSkus.includes(sku) }, 'inline-flex items-center transition duration-150']"
      >
        <star-icon
          :class="['h-5 w-5', favoriteSkus.includes(sku) ? ' fill-amber-100 text-amber-400' : 'fill-none text-amber-300']"
          :stroke-width="1.5"
          @click="toggleSkuClassification('favorite', sku)"
        />
        <sku-notes-manager :sku="sku" />
      </div>
    </div>

    <b-taglist style="flex-wrap: nowrap">
      <b-tag rounded type="is-success">
        <a :href="`https:\/\/amazon.com/dp/${asin}`" target="_blank">
          <span>
            <b-icon icon="amazon" pack="fab"></b-icon>
            {{ asin }}
          </span>
        </a>
      </b-tag>
      <b-tag rounded type="is-info" v-if="dropshipSkus.includes(sku)">Dropship Item</b-tag>
      <b-tag rounded type="is-danger" v-if="oversizeSkus.includes(sku)">Oversized Item</b-tag>
      <b-tag rounded type="is-warning" v-if="fbmSkus.includes(sku)">FBM Item</b-tag>
      <b-tag rounded type="is-primary" v-if="marketplaceCode === 'CA' && canadaSkus.includes(sku)">Canada FBA Item</b-tag>
    </b-taglist>
  </div>
</template>
<script setup>
import { SkuNotesManager } from '@/components/SkuTable'
import { useClassificationStore, useNoteStore } from '@/stores'
import { StarIcon } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { toRefs } from 'vue'

defineProps({
  asin: String,
  isSkuSelected: Boolean,
  marketplaceCode: String,
  sku: String,
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
    color: inherit !important;
  }
}
</style>
