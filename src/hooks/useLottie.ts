import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

interface UseLottieProps {
  animationData?: any;
  path?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export const useLottie = ({
  animationData,
  path,
  loop = true,
  autoplay = true
}: UseLottieProps) => {
  const animationContainer = useRef<HTMLDivElement>(null);
  const animationInstance = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (animationContainer.current) {
      animationInstance.current = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop,
        autoplay,
        animationData,
        path
      });

      return () => {
        if (animationInstance.current) {
          animationInstance.current.destroy();
        }
      };
    }
  }, [animationData, path, loop, autoplay]);

  const play = () => {
    if (animationInstance.current) {
      animationInstance.current.play();
    }
  };

  const pause = () => {
    if (animationInstance.current) {
      animationInstance.current.pause();
    }
  };

  const stop = () => {
    if (animationInstance.current) {
      animationInstance.current.stop();
    }
  };

  return {
    animationContainer,
    play,
    pause,
    stop
  };
};