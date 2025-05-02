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
  <div class="sprinkler-grid">
    <div
      v-for="idx in NUM_SPRINKLERS"
      :key="idx"
      class="sprinkler-card"
    >
      <div class="sprinkler-header">
        <div class="sprinkler-icon-wrap">
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
  <transition name="spray">
    <div v-if="isOn[idx-1].value" class="spray-anim"></div>
  </transition>
</div>
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
  background: rgba(255,255,255,0.18);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(44,62,80,0.18);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  min-width: 220px;
  max-width: 320px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  color: #23272f;
  backdrop-filter: blur(14px);
  border: 1.5px solid rgba(255,255,255,0.32);
  transition: box-shadow 0.3s, background 0.3s;
  flex: 1 1 240px;
}
.sprinkler-card:hover {
  box-shadow: 0 12px 40px rgba(44,62,80,0.22);
  background: rgba(255,255,255,0.28);
}
.sprinkler-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.2rem;
  gap: 0.35rem;
}
.sprinkler-header h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #23272f;
  margin: 0.4rem 0 0.1rem 0;
  letter-spacing: 0.02em;
}
.sprinkler-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.4rem;
}
.sprinkler-icon {
  z-index: 1;
  filter: drop-shadow(0 2px 10px #4fc3f755);
  width: 58px !important;
  height: 58px !important;
  max-width: 22vw;
  max-height: 22vw;
}
.sprinkler-icon {
  z-index: 1;
  filter: drop-shadow(0 2px 10px #4fc3f755);
}
.spray-anim {
  position: absolute;
  top: 5px;
  left: 50%;
  width: 60px;
  height: 40px;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(circle at 30% 30%, #4fc3f7bb 0 18%, transparent 60%),
              radial-gradient(circle at 70% 40%, #4fc3f7cc 0 13%, transparent 55%),
              radial-gradient(circle at 50% 80%, #4fc3f7aa 0 10%, transparent 40%);
  opacity: 0.7;
  animation: spray-water 1.2s infinite linear;
}
@keyframes spray-water {
  0% { opacity: 0.7; transform: translateX(-50%) scaleY(1) scaleX(1); }
  40% { opacity: 1; transform: translateX(-50%) scaleY(1.08) scaleX(1.04); }
  100% { opacity: 0.7; transform: translateX(-50%) scaleY(1) scaleX(1); }
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
  box-shadow: 0 0 14px 3px #43e97b99, 0 0 0 6px #43e97b22;
  animation: glow-on 1.2s infinite alternate;
}
@keyframes glow-on {
  0% { box-shadow: 0 0 14px 3px #43e97b99, 0 0 0 6px #43e97b22; }
  100% { box-shadow: 0 0 22px 8px #43e97bcc, 0 0 0 12px #43e97b33; }
}
.dot.off {
  background: #bdbdbd;
}
.sprinkler-actions {
  margin: 1.5rem 0 1rem 0;
}
.modern-toggle {
  font-size: 1.1rem;
  padding: 0.7rem 2.2rem;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  background: linear-gradient(90deg, #11998e 0%, #43e97b 100%);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 4px 18px rgba(67,233,123,0.15);
  transition: background 0.22s, box-shadow 0.22s, transform 0.17s;
  letter-spacing: 0.04em;
  outline: none;
  position: relative;
}
.modern-toggle:active {
  transform: scale(0.97);
  box-shadow: 0 2px 8px rgba(67,233,123,0.13);
}
.modern-toggle:hover:not(:disabled) {
  background: linear-gradient(90deg, #43e97b 0%, #11998e 100%);
  box-shadow: 0 6px 24px rgba(67,233,123,0.20);
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
.sprinkler-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  justify-content: center;
  align-items: stretch;
  margin: 2.5rem auto;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
}

</style>
