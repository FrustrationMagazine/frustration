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
  tooltip: string;
  alertDialogTitle: string;
  alertDialogAction: string;
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
    tooltip: "Ajouter cette chaîne",
    alertDialogTitle: "Voulez-vous vraiment ajouter cette chaîne ?",
    alertDialogAction: "Ajouter les vidéos de cette chaîne",
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
    tooltip: "Ajouter cette playlist",
    alertDialogTitle: "Voulez-vous vraiment ajouter cette playlist ?",
    alertDialogAction: "Ajouter les vidéos de cette playlist",
  },
  {
    title: "Vidéos",
    type: "video",
    key: "videos",
    subtitle: "Les vidéos seront ajoutées aux vidéos à la une",
    dialogTitle: "Rechercher une vidéo",
    dialogDescription: "Rechercher une vidéo youtube en entrant un nom ou son URL",
    placeholder: "Rechercher une vidéo youtube",
    tooltip: "Ajouter cette vidéo",
    alertDialogTitle: "Voulez-vous vraiment ajouter cette vidéo ?",
    alertDialogAction: "Ajouter cette vidéo",
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
