import { toast } from "sonner";

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  if (!MAPS_API_KEY) {
    toast.error("Configuração de Mapa", {
      description: "Chave API do Google não encontrada.",
    });
    return null;
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else if (data.status === "ZERO_RESULTS") {
      toast.warning("Localização não encontrada", {
        description:
          "Não conseguimos mapear este endereço. Tente ser mais específico.",
      });
      return null;
    } else {
      console.error("Erro na API de Geocodificação:", data.status);
      toast.error("Erro na Geolocalização", {
        description: data.error_message || "Falha ao buscar coordenadas.",
      });
      return null;
    }
  } catch (error) {
    console.error("Erro de rede ao geocodificar:", error);
    return null;
  }
}
