import { TrackId } from "@/lib/tracks";

const BADGE_IMAGE: Record<TrackId, string> = {
  research: "/badges/researcher.jpeg",
  science: "/badges/translator.jpeg",
  builder: "/badges/builder.jpeg",
  community: "/badges/founder.jpeg",
};

export function BadgePreview({
  trackId,
  trackName,
}: {
  trackId: TrackId;
  trackName: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={BADGE_IMAGE[trackId]}
      alt={`${trackName} DeSci Contributor Credential`}
      className="w-full max-w-xs"
    />
  );
}
