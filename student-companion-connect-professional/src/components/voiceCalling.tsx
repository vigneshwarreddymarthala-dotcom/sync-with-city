// components/VoiceCall.tsx
import { useEffect, useRef } from "react";
import DailyIframe from "@daily-co/daily-js";

interface VoiceCallProps {
  url: string;
}

const VoiceCalling = ({ url }: VoiceCallProps) => {
  const callFrameRef = useRef<any>(null);

  useEffect(() => {
    const startCall = async () => {
      callFrameRef.current = DailyIframe.createFrame();
      await callFrameRef.current.join({
        url,
        audioSource: true,
        videoSource: false,
      });

      callFrameRef.current.on("left-meeting", () => {
        callFrameRef.current.destroy();
      });
    };

    startCall();

    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.leave();
      }
    };
  }, [url]);

  return <div id="daily-container" ref={callFrameRef}></div>;
};

export default VoiceCalling;
