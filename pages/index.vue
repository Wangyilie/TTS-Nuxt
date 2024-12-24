<template>
  <div class="container">
    <h1>Text-to-Speech Configuration</h1>

    <!-- Text Input -->
    <div class="form-group">
      <label for="textToSpeak">Text to speak:</label>
      <textarea
        id="textToSpeak"
        v-model="textToSpeak"
        rows="3"
        placeholder="Enter the text you want to convert to speech"
      ></textarea>
    </div>

    <!-- Language / Locale -->
    <div class="form-group">
      <label for="language">Language / Locale</label>
      <select v-model="languageCode" id="language">
        <option value="en-US">English (United States)</option>
      </select>
    </div>

    <!-- Voice Type -->
    <div class="form-group">
      <label for="voiceType">Voice Type</label>
      <select v-model="voiceType" id="voiceType">
        <option value="Studio">Studio</option>
      </select>
    </div>

    <!-- Voice Name -->
    <div class="form-group">
      <label for="voiceName">Voice Name</label>
      <select v-model="voiceName" id="voiceName">
        <option value="en-US-Studio-O">en-US-Studio-O</option>
        <option value="en-US-Studio-Q">en-US-Studio-Q</option>
      </select>
    </div>

    <!-- Speed and Pitch Sliders -->
    <div class="slider-group">
      <div class="form-group">
        <label for="speed">Speed: {{ speed }}</label>
        <input type="range" id="speed" v-model="speed" min="0.25" max="4.0" step="0.01" />
      </div>

      <div class="form-group">
        <label for="pitch">Pitch: {{ pitch }}</label>
        <input type="range" id="pitch" v-model="pitch" min="-20.0" max="20.0" step="0.1" />
      </div>
    </div>


    <div class="form-group">
      <label for="filename">File Name:</label>
      <input
        type="text"
        id="filename"
        v-model="fileName"
        placeholder="Enter file name (e.g., my-audio)"
        required
      />
    </div>

    <!-- Speak It Button -->
    <button @click="generateSpeech" class="speak-btn">
      
      <span v-if="isLoading">Loading...</span>
      <span v-else>Generate Speech</span>
    </button>


    <!-- Play Preview Button -->
    <button
      @click="playAudio"
      class="preview-btn"
      :disabled="!audioUrl || isLoading"
    >
      Speak It
    </button>

    <!-- Download Button -->
    <button
      @click="downloadAudio"
      class="download-btn"
      :disabled="!audioUrl || isLoading"
    >
      Download
    </button>
    <!-- Audio Player for Preview -->
    <audio v-if="audioUrl" :src="audioUrl" ref="audioPlayer" preload="auto"></audio>
      
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Reactive state
const textToSpeak = ref('');
const languageCode = ref('en-US');
const voiceType = ref('Studio');
const voiceName = ref('en-US-Studio-O');
const audioProfile = ref('small-home-speaker');
const speed = ref(1.0);
const pitch = ref(0.0);
const fileName = ref("output"); // 默认文件名

const audioUrl = ref(null); // 用于存储音频的 URL
const isLoading = ref(false); // 按钮加载状态
const audioPlayer = ref(null); // 引用 audio 元素

const generateSpeech = async () => {
  if (isLoading.value) return
  isLoading.value = true; // 开始加载
  try {
    if (!textToSpeak.value.trim()) {
      alert('Please enter some text to convert to speech!');
      return;
    }

    // API Request to Backend
    const response = await axios.post('/api/textToSpeech', {
      text: textToSpeak.value,
      languageCode: languageCode.value,
      voiceType: voiceType.value,
      voiceName: voiceName.value,
      audioProfile: audioProfile.value,
      speed: speed.value,
      pitch: pitch.value,
    }, { responseType: 'blob' });

    if (response.statusText !== 'OK') {
      throw new Error("Failed to generate speech");
    }

    // 将文件流转换为 Blob
    const blob = response.data;

    // 动态创建下载链接
    audioUrl.value = window.URL.createObjectURL(blob);
    // const link = document.createElement("a");
    // link.href = url;

    // // 使用用户输入的文件名，并加上 .mp3 后缀
    // const sanitizedFileName = fileName.value.trim() || "output"; // 防止用户输入空值
    // link.download = `${sanitizedFileName}.mp3`;
    // link.click();

    // // 释放 URL
    // window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating speech:', error);
    alert('An error occurred while generating the speech. Please try again.');
  } finally {
    isLoading.value = false; // 加载完成
  }
};

// Play the generated audio
const playAudio = () => {
  if (audioPlayer.value) {
    audioPlayer.value.play();
  }
};

// Download the generated audio
const downloadAudio = () => {
  if (audioUrl.value) {
    const link = document.createElement('a');
    link.href = audioUrl.value;
    link.download = `${fileName.value || 'output'}.mp3`;
    link.click();
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

textarea,
select,
input[type="range"] {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

textarea {
  resize: none;
}

.slider-group {
  display: flex;
  justify-content: space-between;
}

.speak-btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.speak-btn:hover {
  background-color: #357ae8;
}
.preview-btn,
.download-btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #34a853;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.preview-btn:hover,
.download-btn:hover {
  background-color: #1c8d3e;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>