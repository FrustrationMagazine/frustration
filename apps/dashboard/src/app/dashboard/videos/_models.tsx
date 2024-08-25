// 🗿 Models
import { type YoutubeResourceType } from "@/data-access/youtube";

// Card resources
interface CardType {
  title: string;
  type: YoutubeResourceType;
  key: string;
  texts: {
    subtitle: string;
    dialogTitle: string;
    dialogDescription: string;
    placeholder: string;
    add: {
      tooltip: string;
      alertDialogTitle: string;
      alertDialogAction: string;
    };
    remove: {
      tooltip: string;
      alertDialogTitle: string;
      alertDialogAction: string;
    };
  };
}

export const CardsDescription: CardType[] = [
  // Channels
  {
    title: "Chaînes",
    type: "channel",
    key: "channels",
    texts: {
      subtitle: "Les vidéos de ces chaînes youtube seront ajoutées aux vidéos à la une",
      dialogTitle: "Rechercher une chaîne",
      dialogDescription: "Rechercher une chaîne youtube en entrant un nom",
      placeholder: "Rechercher une chaîne youtube",
      add: {
        tooltip: "Ajouter cette chaîne",
        alertDialogTitle: "Voulez-vous vraiment ajouter cette chaîne ?",
        alertDialogAction: "Ajouter les vidéos de cette chaîne",
      },
      remove: {
        tooltip: "Supprimer cette chaîne",
        alertDialogTitle:
          "Voulez-vous vraiment supprimer l'affichage des vidéos de cette chaîne de votre page d'accueil ?",
        alertDialogAction: "Supprimer l'affichage des vidéos de cette chaîne",
      },
    },
  },
  // Playlists
  {
    title: "Playlists",
    type: "playlist",
    key: "playlists",
    texts: {
      subtitle: "Les vidéos de ces playlists youtube seront ajoutées aux vidéos à la une",
      dialogTitle: "Rechercher une playlist",
      dialogDescription:
        "Rechercher une playlist youtube en entrant un nom ou l'URL d'une vidéo de cette playlist",
      placeholder: "Rechercher une playlist youtube",
      add: {
        tooltip: "Ajouter cette playlist",
        alertDialogTitle: "Voulez-vous vraiment ajouter cette playlist ?",
        alertDialogAction: "Ajouter les vidéos de cette playlist",
      },
      remove: {
        tooltip: "Supprimer cette playlist",
        alertDialogTitle:
          "Voulez-vous vraiment supprimer l'affichage des vidéos de cette playlist de votre page d'accueil ?",
        alertDialogAction: "Supprimer l'affichage des vidéos de cette playlist",
      },
    },
  },
  // Videos
  {
    title: "Vidéos",
    type: "video",
    key: "videos",
    texts: {
      subtitle: "Ces vidéos seront ajoutées aux vidéos à la une",
      dialogTitle: "Rechercher une vidéo",
      dialogDescription: "Rechercher une vidéo youtube en entrant un nom ou son URL",
      placeholder: "Rechercher une vidéo youtube",
      add: {
        tooltip: "Ajouter cette vidéo",
        alertDialogTitle: "Voulez-vous vraiment ajouter cette vidéo ?",
        alertDialogAction: "Ajouter cette vidéo",
      },
      remove: {
        tooltip: "Supprimer cette vidéo",
        alertDialogTitle:
          "Voulez-vous vraiment supprimer l'affichage de cette vidéo de votre page d'accueil ?",
        alertDialogAction: "Supprimer l'affichage de la vidéo",
      },
    },
  },
];
