<script setup lang="ts">
const constraints = { audio: true }

let recorder: MediaRecorder

const audioChunks = ref([])
const isRecording = ref(false)

const saveRecording = () => {
  const audioBlob = new Blob(audioChunks.value, { type: 'audio/ogg' })
  const reader = new FileReader()
  reader.readAsDataURL(audioBlob)
  reader.onloadend = () => {
    const base64String = reader.result
    console.log(base64String)
    audioChunks.value = []
  }
}

const playRecording = () => {
  const audioPlayer = document.getElementById('pronunciation_recorder_audio_player')!
  audioPlayer.play()
}

const stopRecording = () => {
  if (isRecording.value === true) {
    isRecording.value = false
    recorder.stop()
  }
}

const record = () => {
  isRecording.value = true
  // Clear existing audio
  audioChunks.value = []

  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    recorder = new MediaRecorder(stream)

    recorder.addEventListener('dataavailable', (event) => {
      audioChunks.value.push(event.data)
    })

    recorder.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/ogg' })
      const audioUrl = URL.createObjectURL(audioBlob)
      // const audio = new Audio(audioUrl)
      const audioPlayer = document.getElementById('pronunciation_recorder_audio_player')!
      audioPlayer.src = audioUrl

      // Clean up
      const tracks = stream.getTracks()
      tracks.forEach(track => track.stop())
    })

    recorder.start()
    setTimeout(stopRecording, 10000)
  }).catch((error) => {
    console.error(error)
  })
}
</script>

<template>
  <div id="pronunciation_recorder_container">
    <audio id="pronunciation_recorder_audio_player" />
    <div
      flex
      gap-1
      items-center
    >
      <AudioButton
        id="pronunciation_recorder_play"
        hover:bg-green
        @click="playRecording"
      >
        <div i-carbon-voice-activate />
        <div>Play</div>
      </AudioButton>
      <AudioButton
        v-if="!isRecording"
        id="pronunciation_recorder_record"
        hover:bg-red
        @click="record"
      >
        <div i-carbon-recording />
        <div>Record Pronunciation</div>
      </AudioButton>
      <AudioButton
        v-if="isRecording"
        id="pronunciation_recorder_record_stop"
        hover:bg-orange
        @click="stopRecording"
      >
        <div i-carbon-stop />
        <div>Stop Recording</div>
      </AudioButton>
      <AudioButton
        v-if="audioChunks.length > 0"
        @click="saveRecording"
        id="pronunciation_recorder_save"
        bg-yellow
        hover:shadow-xl
        relative
        animate-pulse
      >
        <div i-carbon-save />
        <div>Save</div>
      </AudioButton>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: ps-component
</route>
