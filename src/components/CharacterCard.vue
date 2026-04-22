<template>
  <div class="char-card" @click="emit('click', character)">
    <div class="card-image-wrap">
      <img :src="character.image" :alt="character.name" class="card-image" />
      <span class="status-badge" :class="`status-${statusKey}`">
        {{ getCharacterStatusLabel(character.status) }}
      </span>
    </div>

    <div class="card-body">
      <div class="card-name" :title="character.name">{{ character.name }}</div>

      <div class="card-meta">
        <span class="meta-species">{{ character.species || 'Unknown' }}</span>
        <span class="meta-sep">·</span>
        <span class="meta-gender">{{ getCharacterGenderLabel(character.gender) }}</span>
      </div>

      <div class="card-detail-row">
        <q-icon name="explore" size="12px" class="detail-icon" />
        <span class="detail-text" :title="character.originName">{{
          character.originName || '—'
        }}</span>
      </div>
      <div class="card-detail-row">
        <q-icon name="location_on" size="12px" class="detail-icon" />
        <span class="detail-text" :title="character.locationName">{{
          character.locationName || '—'
        }}</span>
      </div>

      <div class="card-footer">
        <span class="ep-badge">
          <q-icon name="play_circle" size="11px" />
          {{ character.episodeCount }} ep.
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Character } from 'src/interfaces/character.interface';
import { getCharacterGenderLabel, getCharacterStatusLabel } from 'src/utils/characterLabels.util';
import { CharacterStatus } from 'src/enums/characters.enum';

const props = defineProps<{ character: Character }>();
const emit = defineEmits<{ (e: 'click', character: Character): void }>();

const statusKey = computed(() => {
  switch (props.character.status) {
    case CharacterStatus.ALIVE:
      return 'alive';
    case CharacterStatus.DEAD:
      return 'dead';
    default:
      return 'unknown';
  }
});
</script>

<style scoped>
.char-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition:
    box-shadow 0.15s ease,
    border-color 0.15s ease;
  display: flex;
  flex-direction: column;
}

.char-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
}

/* Image */
.card-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #f3f4f6;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.char-card:hover .card-image {
  transform: scale(1.03);
}

/* Status badge */
.status-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 8px;
  border-radius: 4px;
}
.status-alive {
  background: #dcfce7;
  color: #15803d;
}
.status-dead {
  background: #fee2e2;
  color: #b91c1c;
}
.status-unknown {
  background: #f3f4f6;
  color: #6b7280;
}

/* Body */
.card-body {
  padding: 12px 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.card-meta {
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.meta-species {
  font-weight: 500;
  color: #374151;
}

.meta-sep {
  color: #d1d5db;
}

.card-detail-row {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  font-size: 0.73rem;
  color: #6b7280;
  line-height: 1.4;
}
.detail-icon {
  color: #9ca3af;
  flex-shrink: 0;
  margin-top: 1px;
}
.detail-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Footer */
.card-footer {
  margin-top: auto;
  padding-top: 8px;
}
.ep-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 500;
  color: #6b7280;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 2px 8px;
}
</style>
