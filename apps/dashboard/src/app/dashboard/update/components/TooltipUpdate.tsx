import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/components/tooltip";
import { TbInfoSquare } from "react-icons/tb";

const TooltipUpdate = () => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <TbInfoSquare className='text-primary' />
        </TooltipTrigger>
        <TooltipContent className='w-[350px]'>
          <div className='space-y-3'>
            <p>
              La <b>mise à jour intelligente</b> se base sur la{" "}
              <b>la dernière transaction enregistrée</b> et ajoute toutes les transactions
              effectuées depuis.{" "}
            </p>
            <p>
              Elle met également à jour les{" "}
              <b>transactions déjà enregistrées mais datant de moins d&apos;un mois</b> car leur
              statut a pu évoluer entre temps (par exemple, une transaction Stripe peut voir son
              statut passer de &apos;pending&apos; à &apos;available&apos; une fois son montant
              disponible pour tout transfert vers un compte).
            </p>
            <p>
              La <b>mise à jour brute</b> réécrit intégralement la table des transactions en partant
              de la date la plus éloignée possible.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipUpdate;
