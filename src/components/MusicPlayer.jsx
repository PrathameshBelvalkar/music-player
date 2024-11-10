import React, { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import "./musicplayer.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
    FaChevronDown,
    FaChevronUp,
    FaPlay,
    FaPause,
    FaVolumeUp,
    FaVolumeMute,
    FaRegHeart,
    FaHeart,
} from "react-icons/fa";
export default function MusicPlayer({ showConfetti, setShowConfetti, audioList }) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const soundRef = useRef(null);
    const intervalRef = useRef(null);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const firstLoad = useRef(true);
    const togglePlayerVisibility = () => {
        setIsMinimized(!isMinimized);
    };

    const loadEpisode = (index, autoplay = true) => {
        const episode = audioList[index];
        if (soundRef.current) {
            soundRef.current.unload();
        }

        soundRef.current = new Howl({
            src: [episode.audio_url],
            html5: true,
            onload: () => {
                setDuration(soundRef.current.duration());
                setCurrentTime(0);
                setProgressPercentage(0);
                if (autoplay && !firstLoad.current) {
                    setIsPlaying(true);
                    soundRef.current.play();
                    intervalRef.current = setInterval(() => {
                        setCurrentTime(soundRef.current.seek());
                    }, 1000);
                }
            },
            onend: () => {
                setIsPlaying(false);
                clearInterval(intervalRef.current);
                handleNextEpisode();
            },
            onloaderror: (id, error) => {
                // alert(`Error loading audio: ${error}`);
                console.error("Howl error:", error);
            },
        });

        setCurrentEpisodeIndex(index);
    };

    useEffect(() => {
        loadEpisode(currentEpisodeIndex, false);
        firstLoad.current = false;
        return () => {
            if (soundRef.current) {
                soundRef.current.unload();
            }
            clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (duration) {
            setProgressPercentage((currentTime / duration) * 100);
        }
    }, [currentTime, duration]);

    const togglePlay = () => {
        if (isPlaying) {
            soundRef.current.pause();
            clearInterval(intervalRef.current);
        } else {
            soundRef.current.play();
            intervalRef.current = setInterval(() => {
                setCurrentTime(soundRef.current.seek());
            }, 1000);
        }
        setIsPlaying(!isPlaying);
    };

    const skipBackward = () => {
        const newTime = Math.max(0, soundRef.current.seek() - 15);
        soundRef.current.seek(newTime);
        setCurrentTime(newTime);
    };

    const skipForward = () => {
        const newTime = Math.min(duration, soundRef.current.seek() + 15);
        soundRef.current.seek(newTime);
        setCurrentTime(newTime);
    };

    const changePlaybackRate = (rate) => {
        setPlaybackRate(rate);
        soundRef.current.rate(rate);
    };

    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        soundRef.current.volume(newMutedState ? 0 : 1);
    };

    const handleScrubStart = (e) => {
        setIsScrubbing(true);
        updateScrubPosition(e);
    };

    const handleScrubMove = (e) => {
        if (isScrubbing) updateScrubPosition(e);
    };

    const handleScrubEnd = () => {
        if (isScrubbing) {
            setIsScrubbing(false);
        }
    };

    const updateScrubPosition = (e) => {
        const target = e.target.closest(".music-player-slider, .music-player-mobile-slider");
        const progressBarRect = target.getBoundingClientRect();
        const offsetX = (e.clientX || e.touches[0].clientX) - progressBarRect.left;
        const newScrubPercentage = Math.min(Math.max((offsetX / progressBarRect.width) * 100, 0), 100);
        const newTime = (newScrubPercentage / 100) * duration;
        setCurrentTime(newTime);
        soundRef.current.seek(newTime);
    };

    useEffect(() => {
        const handleMouseUp = () => {
            handleScrubEnd();
        };

        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleScrubMove);
        window.addEventListener("touchend", handleMouseUp);
        window.addEventListener("touchmove", handleScrubMove);

        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleScrubMove);
            window.removeEventListener("touchend", handleMouseUp);
            window.removeEventListener("touchmove", handleScrubMove);
        };
    }, [isScrubbing]);

    const handleLikeClick = () => {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);

        if (newIsLiked) {
            setShowConfetti(true);
            setTimeout(() => {
                setShowConfetti(false);
            }, 4000);
        }
    };

    const handlePreviousEpisode = () => {
        setCurrentEpisodeIndex((prevIndex) => {
            const newIndex = Math.max(prevIndex - 1, 0);
            loadEpisode(newIndex);
            return newIndex;
        });
    };

    const handleNextEpisode = () => {
        setCurrentEpisodeIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % audioList.length;
            loadEpisode(newIndex);
            return newIndex;
        });
    };

    return (
        <>
            <div className={`podcast-player ${isMinimized ? "minimized" : ""}`}>
                <div className={`maximize-minimize ${isMinimized ? "minimized" : ""}`} onClick={togglePlayerVisibility}>
                    {isMinimized ? <FaChevronUp color="#fff" /> : <FaChevronDown color="#fff" />}
                </div>
                {!isMinimized && (
                    <div className="music-player-mobile-slider" onMouseDown={handleScrubStart} onTouchStart={handleScrubStart}>
                        <span
                            className="music-player-progress"
                            style={{
                                width: `${progressPercentage}%`,
                            }}
                        >
                            <span className="progress-scrubber"></span>
                        </span>
                    </div>
                )}
                {!isMinimized && (
                    <div className="musicPlayerParent">
                        <div className="music-player-info">
                            <div className="music-player-nav">
                                <div
                                    className="music-player-nav-right music-player-nav-buttons"
                                    onClick={handlePreviousEpisode}
                                >
                                    <FiChevronLeft color="#fff" strokeWidth={3} />
                                </div>
                                <div
                                    className="music-player-nav-left music-player-nav-buttons"
                                    onClick={handleNextEpisode}
                                >
                                    <FiChevronRight color="#fff" strokeWidth={3} />
                                </div>
                            </div>
                            <div className="music-player-content">
                                <div>
                                    <h4>{audioList[currentEpisodeIndex].Episode_name}</h4>
                                </div>
                                <div className="music-player-category">
                                    <span className="">
                                        {audioList[currentEpisodeIndex].artist}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="music-player-control-section">
                            <div className="music-player-control-section-meta">
                                <div className="player-skip-back-button player-buttons" onClick={skipBackward}>
                                    <span>-15s</span>
                                </div>
                                <div className="player-buttons playButton" onClick={togglePlay}>
                                    {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                                </div>
                                <div className="player-jump-forward-button player-buttons" onClick={skipForward}>
                                    <span>+15s</span>
                                </div>
                            </div>
                            <div
                                className="music-player-time-rail music-player-slider"
                                onMouseDown={handleScrubStart}
                                onTouchStart={handleScrubStart}
                            >
                                <span className="music-player-total music-player-slider">
                                    <span
                                        className="music-player-progress"
                                        style={{
                                            width: `${progressPercentage}%`,
                                        }}
                                    >
                                        <span className="progress-scrubber"></span>
                                    </span>
                                </span>
                            </div>

                            <div className="music-player-time">
                                <span className="music-player-currenttime">{formatTime(currentTime)}</span>
                                <span>&nbsp;/&nbsp;</span>
                                <span className="music-player-duration">{formatTime(duration)}</span>
                            </div>
                            <div className="player-buttons music-player-audio-button" onClick={toggleMute}>
                                <div className="music-slider">
                                    <div className="audio-slider">
                                        <div className="audio-slider-progress">
                                            <span className="audio-scrubber"></span>
                                        </div>
                                    </div>
                                </div>
                                {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                            </div>
                            <div className="player-buttons" onClick={handleLikeClick}>
                                {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
                            </div>
                            <div className="player-buttons music-player-speed-button">
                                <ul className="music-player-speed-change">
                                    {[2, 1.75, 1.5, 1.25, 1, 0.5].map((rate) => (
                                        <li key={rate} onClick={() => changePlaybackRate(rate)}>
                                            {rate}x
                                        </li>
                                    ))}
                                </ul>
                                <span>{playbackRate}x</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};
