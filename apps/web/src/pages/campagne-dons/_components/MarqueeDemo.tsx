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

const fallbackReviews = [
  {
    name: "philippe",
    date: "21 décembre 2024 à 12:03",
    body: `Merci à vous !!`,
    img: "https://api.tipeee.com/img/default_avatar_5.png",
  },
  {
    name: "Valtat Alain",
    date: "20 décembre 2024 à 13:29",
    body: `Bravo, Merci`,
    img: "https://api.tipeee.com/img/default_avatar_5.png",
  },
  {
    name: "lune",
    date: "20 décembre 2024 à 08:12",
    body: `Vous êtes notre résistance concrête et visible et je vous soutiendrai du mieux possible pour qu'il y ait une pluralité d'opinions .Je le fais pour vos opposés aussi , des souverainistes .`,
    img: "https://api.tipeee.com/img/default_avatar_2.png",
  },
  {
    name: "rodrigues milhao",
    date: "19 décembre 2024 à 21:01",
    body: `Merci pour votre super travail <3`,
    img: "https://api.tipeee.com/img/default_avatar_3.png",
  },
  {
    name: "Nabil Mimoun",
    date: "19 décembre 2024 à 20:41",
    body: `Un ENORME Merci pour tout ce que vous faite et qui est aujourd'hui d'une priorité majeure!?? Force à Vous/Nous!?????? Hasta la Victoria siempre!!!???????????❤️`,
    img: "https://api.tipeee.com/img/default_avatar_0.png",
  },
  {
    name: "Simon",
    date: "16 décembre 2024 à 13:35",
    body: "En vous remerciant pour votre travail indispensable.",
    img: "https://api.tipeee.com/img/default_avatar_3.png",
  },
  {
    name: "kacmobil",
    date: "15 décembre 2024 à 10:25",
    body: "Bien joué...Merci à l'équipe de la dernière de vous avoir fait connaitre....",
    img: "https://api.tipeee.com/img/default_avatar_1.png",
  },
  {
    name: "Franzysch",
    date: "12 décembre 2024 à 09:48",
    body: "j'ai aussi fait un petit post sur linkedin (François-Henri Perrin) pour parler de votre campagne !",
    img: "https://api.tipeee.com/cache/20220420200758/media/200/200/zoom/1616544/0bc287bfee045e9f6c360c421e1221d5753f5e95.jpg",
  },
  {
    name: "valerie",
    date: "11 décembre 2024 à 19:41",
    body: "Merci pour votre super boulot",
    img: "https://api.tipeee.com/img/default_avatar_7.png",
  },
  {
    name: "ViveLeCommunisme",
    date: "1 décembre 2024 à 11:41",
    body: "Merci pour votre travail essentiel à la lutte des classes. Vos articles sont très satisfaisants à lire, riche pour comprendre notre société tout en étant très accessible !",
    img: "https://api.tipeee.com/img/default_avatar_7.png",
  },
  {
    name: "manuz34",
    date: "30 novembre 2024 à 15:08",
    body: "On lache rien ! merci pour votre super boulot",
    img: "https://api.tipeee.com/img/default_avatar_0.png",
  },
  {
    name: "Aymeric Dlavo",
    date: "26 novembre 2024 à 16:06",
    body: "Vive la frustrasphère !",
    img: "https://api.tipeee.com/cache/20221207103451/media/200/200/zoom/895875/2022120763905e3bd0380.png",
  },
  {
    name: "mancub",
    date: "26 novembre 2024 à 12:36",
    body: "✊️",
    img: "https://api.tipeee.com/img/default_avatar_5.png",
  },
  {
    name: "Macques",
    date: "22 novembre 2024 à 21:44",
    body: "On en a GROS !",
    img: "https://api.tipeee.com/img/default_avatar_1.png",
  },
  {
    name: "Lunel",
    date: "22 novembre 2024 à 17:42",
    body: "Merci pour votre engagement à éclairer les consciences",
    img: "https://api.tipeee.com/img/default_avatar_3.png",
  },
  {
    name: "Kikoun",
    date: "22 novembre 2024 à 17:38",
    body: "Bonjour à toustes et j’espère que vous allez récolter assez pour continuer. Bravo pour le travail accompli déjà !!!",
    img: "https://api.tipeee.com/img/default_avatar_3.png",
  },
  {
    name: "Ju2luze",
    date: "20 novembre 2024 à 20:54",
    body: "puissiez vous continuer 100 ans",
    img: "https://api.tipeee.com/img/default_avatar_5.png",
  },
  {
    name: "Stephen Sevenair",
    date: "20 novembre 2024 à 11:00",
    body: `Un souffle engagé \n
          la plume contre l'injustice,
          des pages sans prix
          Combat de mots et lumières
          pour briser les chaines froides`,
    img: "https://api.tipeee.com/cache/20220421071033/media/200/200/zoom/1473660/30995fddcf38278913e35cf6e1bdd8fc1fb1b6f7.jpg",
  },
  {
    name: "Robin",
    date: "19 novembre 2024 à 21:39",
    body: "Frustration est indispensable à la démocratie. Vous lire me fait un bien fou ! Merci :)",
    img: "https://api.tipeee.com/img/default_avatar_7.png",
  },
];

interface Review {
  name: string;
  date: string;
  body: string;
  img: string;
}

type Props = Readonly<{
  reviews: Review[];
}>;

export default function MarqueeDemo({ reviews }: Props) {
  const reviewsToDisplay =
    reviews.length > 0 ? reviews : fallbackReviews.slice(0, 8);
  const firstRow = reviewsToDisplay.slice(0, reviewsToDisplay.length / 2);
  const secondRow = reviewsToDisplay.slice(reviewsToDisplay.length / 2);

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
}
