<script setup>
import { ref } from 'vue'

const NUM_SPRINKLERS = 4
const API_BASE = 'http://192.168.1.108:12345/sprinkler'

const isOn = Array.from({ length: NUM_SPRINKLERS }, () => ref(false))
const loading = Array.from({ length: NUM_SPRINKLERS }, () => ref(false))
const error = Array.from({ length: NUM_SPRINKLERS }, () => ref(''))
const success = Array.from({ length: NUM_SPRINKLERS }, () => ref(''))
const lastAction = Array.from({ length: NUM_SPRINKLERS }, () => ref(''))

async function setSprinkler(idx, state) {
  loading[idx].value = true
  error[idx].value = ''
  success[idx].value = ''
  try {
    const url = `${API_BASE}/${idx}/${state ? 'on' : 'off'}`;
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    console.log(`[SprinklerControl] Posting to:`, url);
    const res = await fetch(url, fetchOptions);
    if (!res.ok) throw new Error('Failed to update sprinkler')
    isOn[idx].value = state
    lastAction[idx].value = `Sprinkler #${idx + 1} turned ${state ? 'ON' : 'OFF'} at ${new Date().toLocaleTimeString()}`
    success[idx].value = `Sprinkler #${idx + 1} turned ${state ? 'ON' : 'OFF'} successfully!`
  } catch (e) {
    error[idx].value = e.message || 'Error occurred!'
  } finally {
    loading[idx].value = false
  }
}

</script>

<template>
  <div>
    <div
      v-for="idx in NUM_SPRINKLERS"
      :key="idx"
      class="sprinkler-card"
      style="margin-bottom: 2rem;"
    >
      <div class="sprinkler-header">
        <svg class="sprinkler-icon" viewBox="0 0 64 64" width="64" height="64">
          <ellipse cx="32" cy="54" rx="18" ry="6" fill="#b2dfdb" />
          <rect x="26" y="44" width="12" height="10" rx="4" fill="#789262" />
          <rect x="28" y="38" width="8" height="8" rx="2" fill="#a5d6a7" />
          <rect x="30" y="12" width="4" height="26" rx="2" fill="#616161" />
          <ellipse cx="32" cy="12" rx="8" ry="4" fill="#4fc3f7" />
          <g v-if="isOn[idx-1].value">
            <path d="M32 14 Q24 24 16 20" stroke="#4fc3f7" stroke-width="2" fill="none">
              <animate attributeName="d" values="M32 14 Q24 24 16 20;M32 14 Q24 22 16 18;M32 14 Q24 24 16 20" dur="1.2s" repeatCount="indefinite" />
            </path>
            <path d="M32 14 Q40 24 48 20" stroke="#4fc3f7" stroke-width="2" fill="none">
              <animate attributeName="d" values="M32 14 Q40 24 48 20;M32 14 Q40 22 48 18;M32 14 Q40 24 48 20" dur="1.2s" repeatCount="indefinite" />
            </path>
          </g>
        </svg>
        <h2>Sprinkler #{{ idx }}</h2>
        <div class="sprinkler-status">
          <span :class="['dot', isOn[idx-1].value ? 'on' : 'off']"></span>
          <span>{{ isOn[idx-1].value ? 'ON' : 'OFF' }}</span>
        </div>
      </div>
      <div class="sprinkler-actions">
        <button
          :class="['modern-toggle', isOn[idx-1].value ? 'on' : 'off']"
          :disabled="loading[idx-1].value"
          @click="setSprinkler(idx-1, !isOn[idx-1].value)"
        >
          <span v-if="loading[idx-1].value">Working...</span>
          <span v-else>{{ isOn[idx-1].value ? 'Turn Off' : 'Turn On' }}</span>
        </button>
      </div>
      <div class="sprinkler-info">
        <span v-if="lastAction[idx-1].value">{{ lastAction[idx-1].value }}</span>
      </div>
      <div class="sprinkler-feedback">
        <span v-if="success[idx-1].value" class="success">{{ success[idx-1].value }}</span>
        <span v-if="error[idx-1].value" class="error">{{ error[idx-1].value }}</span>
      </div>
      <div class="sprinkler-hint">
        <small>Control Sprinkler #{{ idx }} with a single tap.<br/>Future: add schedules, zones, and more!</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sprinkler-card {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 6px 32px rgba(44,62,80,0.10);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 370px;
  margin: 2.5rem auto;
  text-align: center;
  position: relative;
  color: #23272f;
}
.sprinkler-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.2rem;
}
.sprinkler-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #23272f;
  margin: 0.7rem 0 0.2rem 0;
  letter-spacing: 0.02em;
}
.sprinkler-icon {
  margin-bottom: 0.5rem;
}
.sprinkler-status {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 1.2em;
  margin-top: 0.5em;
  font-weight: 600;
  color: #23272f;
}
.dot {
  display: inline-block;
  width: 0.9em;
  height: 0.9em;
  border-radius: 50%;
  background: #bdbdbd;
  transition: background 0.3s;
}
.dot.on {
  background: #43e97b;
}
.dot.off {
  background: #bdbdbd;
}
.sprinkler-actions {
  margin: 1.5rem 0 1rem 0;
}
.modern-toggle {
  font-size: 1.3rem;
  padding: 0.7rem 2.5rem;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  background: linear-gradient(90deg, #43e97b 0%, #11998e 100%);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 2px 12px rgba(67,233,123,0.10);
  transition: background 0.2s, box-shadow 0.2s;
  letter-spacing: 0.03em;
}
.modern-toggle.off {
  background: linear-gradient(90deg, #ececec 0%, #d3d3d3 100%);
  color: #23272f;
  font-weight: 700;
}
.modern-toggle:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.sprinkler-info {
  font-size: 1em;
  color: #444b54;
  margin-bottom: 0.5em;
  font-weight: 500;
}
.sprinkler-feedback {
  min-height: 1.5em;
  margin-bottom: 0.5em;
}
.success {
  color: #219150;
  font-weight: 600;
  background: #e8f5e9;
  padding: 0.2em 0.8em;
  border-radius: 1em;
  display: inline-block;
}
.error {
  color: #b71c1c;
  font-weight: 600;
  background: #ffebee;
  padding: 0.2em 0.8em;
  border-radius: 1em;
  display: inline-block;
}
.sprinkler-hint {
  font-size: 0.93em;
  color: #6a7582;
  margin-top: 1.2em;
}
@media (max-width: 600px) {
  .sprinkler-card {
    padding: 1.2rem 0.5rem 1rem 0.5rem;
    max-width: 97vw;
  }
}
</style>
