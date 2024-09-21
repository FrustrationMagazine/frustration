"use client";

// 🔩 Base
import React from "react";

// 🧱 Components
import { Button } from "@/ui/components/button";

// 🪝 Hooks
import { useToast } from "@/ui/components/use-toast";

// 🖼️ Assets
import { ImUpload } from "react-icons/im";
import { TbLoaderQuarter } from "react-icons/tb";

// 💥 Actions
import { redeploy } from "../_actions";

export default function RedeployButton() {
  const [loading, setLoading] = React.useState(false);

  const [requestStatus, setRequestStatus] = React.useState<
    | {
        success: string | null;
        error: string | null;
      }
    | undefined
  >({ success: null, error: null });

  const handleClick = async () => {
    setLoading(true);
    const status = await redeploy();
    console.log("status", status);
    setRequestStatus(status);
    setLoading(false);
  };

  const { toast } = useToast();
  React.useEffect(
    function displayToaster() {
      console.log("requestStatus", requestStatus);
      if (requestStatus?.success) {
        toast({
          title: "✅ Succès",
          description: requestStatus?.success,
        });
      }

      if (requestStatus?.error) {
        toast({
          title: "Une erreur s'est produite",
          description: requestStatus?.error,
          variant: "destructive",
        });
      }
    },
    [requestStatus, toast],
  );

  return (
    <Button
      size="xl"
      disabled={loading}
      className="flex gap-2"
      onClick={handleClick}
    >
      {loading ? <TbLoaderQuarter className="animate-spin" /> : <ImUpload />}
      {loading ? "Demande de redéploiement" : "Mettre à jour le site"}
    </Button>
  );
}
