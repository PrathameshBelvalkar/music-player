# Music Player in React

This project is a feature-rich, responsive music player built with React and [Howler.js](https://howlerjs.com/). It includes various controls and functionalities commonly found in audio players. The player can be minimized, has playback controls, a progress bar, volume control, playback speed adjustments, and the ability to "like" tracks with a confetti animation. The music player is designed to handle an array of audio tracks, allowing users to skip between them and control playback intuitively.

## sample

![Sample Screen](./src/assets/screenshot/sample-screen.png)

## Features

### 1. **Audio Playback Controls**

- **Play/Pause**: Toggle between playing and pausing the current audio track.
- **Skip Forward/Backward**: Quickly move forward or backward by 15 seconds.
- **Previous/Next Episode**: Skip to the previous or next episode in the provided `audioList`.

### 2. **Playback Speed Adjustment**

- Choose from six different playback speeds: `2x`, `1.75x`, `1.5x`, `1.25x`, `1x` (default), and `0.5x`.

### 3. **Volume Control and Mute**

- Toggle the volume between muted and unmuted states.
- Shows volume icon dynamically based on mute status.

### 4. **Progress Bar with Scrubbing**

- Display a progress bar showing the playback position.
- Users can scrub (click and drag) on the progress bar to move to different parts of the track.

### 5. **Like Feature with Confetti Animation**

- Heart icon to "like" the current track.
- Triggers a confetti animation (controlled by `showConfetti` and `setShowConfetti` props) when a track is liked.

### 6. **Episode Metadata Display**

- Shows the current episode's title and artist, pulled from the `audioList` prop based on the track being played.

### 7. **Minimize and Maximize Player**

- Option to minimize the player into a small control bar at the bottom of the screen, allowing users to maximize it back as needed.

## Props

- **`showConfetti`**: A boolean state that controls the confetti animation. It should be set to `true` when a track is liked.
- **`setShowConfetti`**: A function to update the `showConfetti` state, used to toggle the animation on or off.
- **`audioList`**: An array of audio track objects, where each object has the following properties:
  - **`audio_url`**: The URL for the audio file to be played.
  - **`Episode_name`**: The name/title of the episode or track.
  - **`artist`**: The artist or creator of the track.

## Dependencies

- **React**: The core library for building the user interface.
- **Howler.js**: Library for handling audio playback.
- **React Icons**: For various UI icons (play, pause, heart, etc.).
