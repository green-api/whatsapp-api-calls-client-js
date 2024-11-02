import React, { useRef, useEffect } from 'react';

const WIDTH = 308;
const HEIGHT = 231;
const SMOOTHING = 0.8;
const FFT_SIZE = 2048;

interface StreamVisualizerProps {
  remoteStream: MediaStream;
}

const StreamVisualizer: React.FC<StreamVisualizerProps> = ({ remoteStream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode>();
  const drawContextRef = useRef<CanvasRenderingContext2D>();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const drawContext = canvas.getContext('2d');
    drawContextRef.current = drawContext || undefined;

    let context: AudioContext;

    if (typeof AudioContext === 'function') {
      context = new AudioContext();
    } else {
      alert('Sorry! Web Audio is not supported by this browser');
      return;
    }

    const source = context.createMediaStreamSource(remoteStream);
    const analyser = context.createAnalyser();
    analyser.minDecibels = -140;
    analyser.maxDecibels = 0;
    analyser.smoothingTimeConstant = SMOOTHING;
    analyser.fftSize = FFT_SIZE;
    analyserRef.current = analyser;

    source.connect(analyser);

    const draw = () => {
      const freqs = new Uint8Array(analyser.frequencyBinCount);
      const times = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(freqs);
      analyser.getByteTimeDomainData(times);

      canvas.width = WIDTH;
      canvas.height = HEIGHT;

      const barWidth = WIDTH / analyser.frequencyBinCount;

      // Draw the frequency domain chart.
      // for (let i = 0; i < analyser.frequencyBinCount; i++) {
      //   const value = freqs[i];
      //   const percent = value / 256;
      //   const height = HEIGHT * percent;
      //   const offset = HEIGHT - height - 1;
      //   const hue = (i / analyser.frequencyBinCount) * 360;
      //   drawContext!.fillStyle = `hsl(${hue}, 100%, 50%)`;
      //   drawContext!.fillRect(i * barWidth, offset, barWidth, height);
      // }

      // Draw the time domain chart.
      for (let i = 0; i < analyser.frequencyBinCount; i++) {
        const value = times[i];
        const percent = value / 256;
        const height = HEIGHT * percent;
        const offset = HEIGHT - height - 1;
        drawContext!.fillStyle = '#4CAE4FFF';
        drawContext!.fillRect(i * barWidth, offset, 1, 2);
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);

    return () => {
      context.close().catch(console.error); // Close the audio context when component unmounts
    };
  }, [remoteStream]);

  return <canvas ref={canvasRef} />;
};

export default StreamVisualizer;
