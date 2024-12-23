<template>
  <div>
    <textarea v-model="text" placeholder="Enter text to convert" rows="4" cols="50"></textarea>

    <div>
      <label for="languageCode">Language</label>
      <select v-model="languageCode" id="languageCode">
        <option value="en-US">English (US)</option>
        <option value="zh-CN">Chinese (Simplified)</option>
      </select>
    </div>

    <div>
      <label for="voiceName">Voice</label>
      <select v-model="voiceName" id="voiceName">
        <option value="en-US-Wavenet-D">English - Wavenet-D</option>
        <option value="zh-CN-Wavenet-A">Chinese - Wavenet-A</option>
      </select>
    </div>

    <div>
      <label for="audioEncoding">Audio Encoding</label>
      <select v-model="audioEncoding" id="audioEncoding">
        <option value="MP3">MP3</option>
        <option value="OGG_OPUS">OGG_OPUS</option>
      </select>
    </div>

    <button @click="generateSpeech">Generate Audio</button>

    <div v-if="audioUrl">
      <audio controls>
        <source :src="audioUrl" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <a :href="audioUrl" download="speech.mp3">Download Audio</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const text = ref('');
const languageCode = ref('en-US');
const voiceName = ref('en-US-Wavenet-D');
const audioEncoding = ref('MP3');
const audioUrl = ref(null);

const generateSpeech = async () => {
  try {
    const response = await axios.post('/api/textToSpeech', {
      text: text.value,
      languageCode: languageCode.value,
      voiceName: voiceName.value,
      audioEncoding: audioEncoding.value,
    });
    audioUrl.value = response.data.audioUrl;
  } catch (error) {
    console.error('Error generating speech:', error);
  }
};
</script>