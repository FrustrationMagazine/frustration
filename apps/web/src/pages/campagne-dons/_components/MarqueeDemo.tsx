import { cn } from "@/utils/tailwind";
import { Marquee } from "./Marquee";

const ReviewCard = ({
  img,
  name,
  date,
  body,
}: {
  img: string;
  name: string;
  date: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
      )}>
      <div className="flex flex-row items-center gap-2">
        <img
          className="rounded-full"
          width="32"
          height="32"
          alt=""
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium">{name}</figcaption>
          <p className="text-xs font-medium text-gray-400">{date}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

interface Review {
  name: string;
  date: string;
  body: string;
  img: string;
}

type Props = {
  reviews: Review[];
};

export const MarqueeDemo = ({ reviews }: Props) => {
  const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);

  return (
    <div className="bg-background relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg">
      <Marquee
        pauseOnHover
        className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard
            key={review.name}
            {...review}
          />
        ))}
      </Marquee>
      <Marquee
        reverse
        pauseOnHover
        className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard
            key={review.name}
            {...review}
          />
        ))}
      </Marquee>
      <div className="dark:from-background pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white"></div>
      <div className="dark:from-background pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white"></div>
    </div>
  );
};

export default MarqueeDemo;
