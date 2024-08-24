// 🔩 Base
import React from "react";

// 🧱 Components
import Column from "./components/Column";

interface ColumnType {
  title: string;
  type: "channel" | "playlist" | "video";
  key: string;
  subtitle: string;
  dialogTitle: string;
  dialogDescription: string;
  placeholder: string;
  tooltipAdd: string;
  tooltipRemove: string;
  alertDialogTitleAdd: string;
  alertDialogActionAdd: string;
  alertDialogTitleRemove: string;
  alertDialogActionRemove: string;
}

const COLUMNS: ColumnType[] = [
  {
    title: "Chaînes",
    type: "channel",
    key: "channels",
    subtitle: "L'intégralité des vidéos des chaînes seront ajoutées aux vidéos à la une",
    dialogTitle: "Rechercher une chaîne",
    dialogDescription: "Rechercher une chaîne youtube en entrant un nom",
    placeholder: "Rechercher une chaîne youtube",
    tooltipAdd: "Ajouter cette chaîne",
    tooltipRemove: "Supprimer cette chaîne",
    alertDialogTitleAdd: "Voulez-vous vraiment ajouter cette chaîne ?",
    alertDialogActionAdd: "Ajouter les vidéos de cette chaîne",
    alertDialogTitleRemove:
      "Voulez-vous vraiment supprimer l'affichage des vidéos de cette chaîne de votre page d'accueil ?",
    alertDialogActionRemove: "Supprimer l'affichage des vidéos de cette chaîne",
  },
  {
    title: "Playlists",
    type: "playlist",
    key: "playlists",
    subtitle: "L'intégralité des vidéos des playlists youtube seront ajoutées aux vidéos à la une",
    dialogTitle: "Rechercher une playlist",
    dialogDescription:
      "Rechercher une playlist youtube en entrant un nom ou l'URL d'une vidéo de cette playlist",
    placeholder: "Rechercher une playlist youtube",
    tooltipAdd: "Ajouter cette playlist",
    tooltipRemove: "Supprimer cette playlist",
    alertDialogTitleAdd: "Voulez-vous vraiment ajouter cette playlist ?",
    alertDialogActionAdd: "Ajouter les vidéos de cette playlist",
    alertDialogTitleRemove:
      "Voulez-vous vraiment supprimer l'affichage des vidéos de cette playlist de votre page d'accueil ?",
    alertDialogActionRemove: "Supprimer l'affichage des vidéos de cette playlist",
  },
  {
    title: "Vidéos",
    type: "video",
    key: "videos",
    subtitle: "Les vidéos seront ajoutées aux vidéos à la une",
    dialogTitle: "Rechercher une vidéo",
    dialogDescription: "Rechercher une vidéo youtube en entrant un nom ou son URL",
    placeholder: "Rechercher une vidéo youtube",
    tooltipAdd: "Ajouter cette vidéo",
    tooltipRemove: "Supprimer cette vidéo",
    alertDialogTitleAdd: "Voulez-vous vraiment ajouter cette vidéo ?",
    alertDialogActionAdd: "Ajouter cette vidéo",
    alertDialogTitleRemove:
      "Voulez-vous vraiment supprimer l'affichage de cette vidéo de votre page d'accueil ?",
    alertDialogActionRemove: "Supprimer l'affichage de la vidéo",
  },
];

export default function () {
  return (
    <div className='grid w-full grow grid-cols-3 gap-x-4'>
      {COLUMNS.map(({ key, ...props }) => (
        <Column key={key} {...props} />
      ))}
    </div>
  );
}
