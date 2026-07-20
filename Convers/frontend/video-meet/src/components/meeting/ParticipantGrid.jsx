import { useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";

import CustomParticipantTile from "./CustomParticipantTile";
import MeetingGrid from "./MeetingGrid";

export default function ParticipantGrid() {
  const trackRefs = useTracks([
    {
      source: Track.Source.Camera,
      withPlaceholder: true,
    },
  ]);

  return (
    <MeetingGrid participantCount={trackRefs.length}>
      {trackRefs.map((trackRef) => (
        <CustomParticipantTile
          key={trackRef.participant.identity}
          trackRef={trackRef}
        />
      ))}
    </MeetingGrid>
  );
}