"use client";

import styles from "./ArtisanStories.module.css";

export interface ArtisanStory {
  id: string;
  videoUrl: string;
}

const STORIES: ArtisanStory[] = [
  {
    id: "as-1",
    videoUrl:
      "https://fufjeihntairffrizntr.supabase.co/storage/v1/object/public/crafts_media/karigars_process_videos/a5d59e4e-8077-494f-92b9-d1c40fb2b316/720p.mp4",
  },
  {
    id: "as-2",
    videoUrl:
      "https://fufjeihntairffrizntr.supabase.co/storage/v1/object/public/crafts_media/karigars_process_videos/dc337eab-0c4c-45b5-9192-99fa5e9c3415/720p.mp4",
  },
  {
    id: "as-3",
    videoUrl:
      "https://fufjeihntairffrizntr.supabase.co/storage/v1/object/public/crafts_media/karigars_process_videos/56dc1d8d-3c8d-4a32-8485-f9ec2ae20c08/720p.mp4",
  },
  {
    id: "as-4",
    videoUrl:
      "https://fufjeihntairffrizntr.supabase.co/storage/v1/object/public/crafts_media/karigars_process_videos/8eef3ec5-e6d8-473a-97b1-5505a414e919/720p.mp4",
  },
];

interface ArtisanStoriesProps {
  stories?: ArtisanStory[];
}

export function ArtisanStories({ stories = STORIES }: ArtisanStoriesProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.label}>Behind the piece</div>
        <h2 className={styles.heading}>
          Artisan <em>Stories</em>
        </h2>
      </div>

      <div className={styles.track}>
        {stories.map((s) => (
          <div key={s.id} className={styles.mediaWrap}>
            <video
              className={styles.video}
              src={s.videoUrl}
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        ))}
      </div>
    </section>
  );
}
