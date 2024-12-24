import textToSpeech from '@google-cloud/text-to-speech';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const client = new textToSpeech.TextToSpeechClient();
  const request = {
    input: { text: body.text },
    voice: {
      languageCode: body.languageCode,
      name: body.voiceName,
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: body.speed,
      pitch: body.pitch,
      "effectsProfileId": [
        "small-bluetooth-speaker-class-device"
      ],
    },
  };

  try {
    // 调用 Google Cloud Text-to-Speech API
    const [response] = await client.synthesizeSpeech(request);

    // 设置响应头，以便浏览器下载音频文件
    event.res.setHeader('Content-Type', 'audio/mpeg');
    event.res.setHeader('Content-Disposition', 'attachment; filename="speech.mp3"');

    // 直接将音频流发送给浏览器
    event.res.end(response.audioContent);
  } catch (error) {
    console.error('Error calling Text-to-Speech API:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Text-to-Speech API call failed',
    });
  }
});