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

const isProduction = process.env.NODE_ENV === "production";

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
    setRequestStatus(status);
    setLoading(false);
  };

  const { toast } = useToast();
  React.useEffect(
    function displayToaster() {
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

  // ❌ Early return | Not redeploying in development
  if (!isProduction) return null;

  return (
    <Button
      size="xl"
      disabled={loading}
      className="flex gap-2 py-4"
      onClick={handleClick}
    >
      {loading ? <TbLoaderQuarter className="animate-spin" /> : <ImUpload />}
      {loading ? "Demande de redéploiement" : "Mettre à jour le site"}
    </Button>
  );
}
