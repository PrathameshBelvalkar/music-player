import React, { useState } from 'react'
import MusicPlayer from './components/MusicPlayer'
import Confetti from "react-confetti";
import { thenightwemet, apnabanale, kesariya, taubatauba } from './music';
export default function App() {
  const [showConfetti, setShowConfetti] = useState(false);
  const episodeData = [
    {
      sr_no: "1",
      audio_url: thenightwemet,
      Episode_name: "The Night We Met",
      artist: "Lord Huron",
    },
    {
      sr_no: "2",
      audio_url: apnabanale,
      Episode_name: "Apna Bana Le",
      artist: "Arjit Singh",
    },
    {
      sr_no: "3",
      audio_url: kesariya,
      Episode_name: "Kesariya",
      artist: "Arjit Singh",
    },
    {
      sr_no: "4",
      audio_url: taubatauba,
      Episode_name: "Tauba tauba",
      artist: "Karan Aujla",
    },
  ];
  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ zIndex: 99999, position: "fixed", top: 0 }}
        />
      )}
      <MusicPlayer showConfetti={showConfetti} setShowConfetti={setShowConfetti} audioList={episodeData} />
    </>
  )
}
