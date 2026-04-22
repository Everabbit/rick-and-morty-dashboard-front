<template>
  <q-dialog v-model="isOpen" :maximized="$q.screen.lt.sm">
    <q-card class="dialog-card">
      <!-- Header -->
      <div class="dialog-header">
        <div class="dialog-header-main">
          <img :src="character?.image" :alt="character?.name" class="dialog-avatar" />
          <div class="dialog-header-info">
            <h2 class="dialog-name">{{ character?.name }}</h2>
            <div class="dialog-tags">
              <span class="status-tag" :class="`status-${statusKey}`">
                {{ getCharacterStatusLabel(character?.status!) }}
              </span>
              <span class="meta-tag">{{ character?.species || '—' }}</span>
              <span class="meta-tag" v-if="character?.type">{{ character.type }}</span>
            </div>
          </div>
        </div>
        <q-btn flat dense round icon="close" color="grey-6" @click="isOpen = false" />
      </div>

      <q-separator />

      <!-- Body -->
      <q-card-section class="dialog-body">
        <div class="fields-grid">
          <div class="field-group">
            <div class="field-section-label">Informações gerais</div>
            <div class="fields-row">
              <div class="field-item">
                <div class="field-label">ID Externo</div>
                <div class="field-value">#{{ character?.externalId ?? character?.id }}</div>
              </div>
              <div class="field-item">
                <div class="field-label">Gênero</div>
                <div class="field-value">{{ getCharacterGenderLabel(character?.gender!) }}</div>
              </div>
              <div class="field-item">
                <div class="field-label">Espécie</div>
                <div class="field-value">{{ character?.species || '—' }}</div>
              </div>
              <div class="field-item">
                <div class="field-label">Tipo</div>
                <div class="field-value">{{ character?.type || '—' }}</div>
              </div>
            </div>
          </div>

          <div class="field-group">
            <div class="field-section-label">Localização</div>
            <div class="fields-row">
              <div class="field-item field-item--wide">
                <div class="field-label">Origem</div>
                <div class="field-value">{{ character?.originName || '—' }}</div>
              </div>
              <div class="field-item field-item--wide">
                <div class="field-label">Localização atual</div>
                <div class="field-value">{{ character?.locationName || '—' }}</div>
              </div>
            </div>
          </div>

          <div class="field-group">
            <div class="field-section-label">Aparições</div>
            <div class="fields-row">
              <div class="field-item">
                <div class="field-label">Quantidade de episódios</div>
                <div class="field-value field-value--highlight">
                  {{ character?.episodeCount ?? '—' }}
                </div>
              </div>
            </div>
          </div>

          <div class="field-group">
            <div class="field-section-label">Sincronização</div>
            <div class="fields-row">
              <div class="field-item field-item--wide">
                <div class="field-label">Atualizado em</div>
                <div class="field-value">
                  {{ character?.updatedAt ? formatDateTime(character.updatedAt) : '—' }}
                </div>
              </div>
              <div class="field-item field-item--wide" v-if="character?.lastSyncedAt">
                <div class="field-label">Última sincronização</div>
                <div class="field-value">{{ formatDateTime(character.lastSyncedAt) }}</div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import type { Character } from 'src/interfaces/character.interface';
import { getCharacterGenderLabel, getCharacterStatusLabel } from 'src/utils/characterLabels.util';
import { CharacterStatus } from 'src/enums/characters.enum';

const $q = useQuasar();
const isOpen = defineModel<boolean>({ default: false });

const props = defineProps<{
  character: Character | null;
}>();

const statusKey = computed(() => {
  switch (props.character?.status) {
    case CharacterStatus.ALIVE:
      return 'alive';
    case CharacterStatus.DEAD:
      return 'dead';
    default:
      return 'unknown';
  }
});

const formatDateTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data inválida';
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
</script>

<style scoped>
.dialog-card {
  width: 100%;
  max-width: 620px;
  border-radius: 10px !important;
  overflow: hidden;
}

/* Header */
.dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 20px 16px;
  gap: 12px;
}

.dialog-header-main {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.dialog-avatar {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.dialog-header-info {
  min-width: 0;
}

.dialog-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
  line-height: 1.2;
}

.dialog-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.status-tag {
  font-size: 0.68rem;
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

.meta-tag {
  font-size: 0.72rem;
  font-weight: 500;
  color: #374151;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 4px;
}

/* Body */
.dialog-body {
  padding: 20px !important;
  background: #fafafa;
}

.fields-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field-group {
}

.field-section-label {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e5e7eb;
}

.fields-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.field-item {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 10px 14px;
  flex: 1 1 140px;
  min-width: 120px;
}

.field-item--wide {
  flex: 1 1 220px;
}

.field-label {
  font-size: 0.68rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  margin-bottom: 4px;
}

.field-value {
  font-size: 0.85rem;
  font-weight: 500;
  color: #111827;
  word-break: break-word;
}

.field-value--highlight {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2563eb;
}
</style>
