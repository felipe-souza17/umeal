"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin } from "lucide-react";
import { apiRequest } from "@/services/api";
import { geocodeAddress } from "@/utils/geocoding";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { toast } from "sonner";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "8px",
};

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [
  "places",
];

interface AddressFormProps {
  onSuccess: () => void;
  initialAddress?: any;
}

export function AddressFormWithMap({
  onSuccess,
  initialAddress,
}: AddressFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const [zipCode, setZipCode] = useState(initialAddress?.zipCode || "");
  const [street, setStreet] = useState(initialAddress?.street || "");
  const [number, setNumber] = useState(initialAddress?.number || "");
  const [neighborhood, setNeighborhood] = useState(
    initialAddress?.neighborhood || ""
  );
  const [city, setCity] = useState(initialAddress?.city || "");
  const [state, setState] = useState(initialAddress?.state || "");

  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: -15.7801,
    lng: -47.9292,
  });
  const [markerPosition, setMarkerPosition] =
    useState<google.maps.LatLngLiteral | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
    language: "pt",
  });

  const handleAddressSearch = async () => {
    const cleanZipCode = zipCode.replace(/\D/g, "");
    if (cleanZipCode.length < 8) return;

    setIsGeocoding(true);

    try {
      const cepData = await apiRequest(`/addresses/cep/${cleanZipCode}`);

      setStreet(cepData.logradouro || "");
      setNeighborhood(cepData.bairro || "");
      setCity(cepData.localidade || "");
      setState(cepData.uf || "");

      const fullAddress = `${cepData.logradouro}, ${cepData.localidade}, ${cepData.uf}, Brasil`;
      const coords = await geocodeAddress(fullAddress);

      if (coords) {
        setCenter(coords);
        setMarkerPosition(coords);
      }
    } catch (error) {
      toast.error("Busca falhou", {
        description: "CEP não encontrado ou erro de conexão.",
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  useEffect(() => {
    if (zipCode.replace(/\D/g, "").length === 8 && !isGeocoding) {
      handleAddressSearch();
    }
  }, [zipCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!markerPosition) {
      toast.warning("Localização Obrigatória", {
        description: "Arraste o pino no mapa para fixar a localização exata.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode: zipCode.replace(/\D/g, ""),
        latitude: markerPosition.lat,
        longitude: markerPosition.lng,
      };

      const endpoint = initialAddress
        ? `/addresses/${initialAddress.id}`
        : "/addresses";
      const method = initialAddress ? "PUT" : "POST";

      await apiRequest(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      toast.success("Endereço salvo!", {
        description: "Localização de entrega atualizada com sucesso.",
      });
      onSuccess();
    } catch (error) {
      toast.error("Falha ao salvar endereço.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMap = () => (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        styles: [
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "poi",
            elementType: "all",
            stylers: [{ visibility: "off" }],
          },
        ],
      }}
      onLoad={(map) => {
        if (markerPosition) map.setCenter(markerPosition);
      }}
    >
      {markerPosition && (
        <MarkerF
          position={markerPosition}
          draggable={true}
          onDragEnd={(e) => {
            if (e.latLng) {
              setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
              toast.info("Localização Fixada!", {
                description: "Latitude e Longitude salvas.",
                duration: 1500,
              });
            }
          }}
          icon={{
            path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
            fillColor: "#FF5722",
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 10,
          }}
        />
      )}
    </GoogleMap>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* MAPA */}
      <div className="space-y-2">
        <Label>Localização no Mapa (Arraste o pino)</Label>
        <div className="relative">
          {!isLoaded && !loadError && (
            <div className="flex items-center justify-center h-[300px] bg-card/50 rounded-lg border border-border">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {loadError && (
            <div className="text-red-500">Erro ao carregar o mapa.</div>
          )}
          {isLoaded && renderMap()}

          {/* Instrução */}
          {isLoaded && markerPosition && (
            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur text-xs p-2 rounded-lg border border-border text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4 text-primary" />
              Arraste o pino vermelho para a entrada exata.
            </div>
          )}
        </div>
      </div>

      {/* ENDEREÇO MANUAL (para buscar e confirmar) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
          Detalhes de Confirmação
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2 col-span-2 md:col-span-1">
            <Label>CEP</Label>
            <Input
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              onBlur={handleAddressSearch}
              placeholder="00000-000"
              disabled={isLoading || isGeocoding}
            />
          </div>

          <div className="space-y-2 col-span-3">
            <Label>Rua</Label>
            <Input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
              disabled={isLoading || isGeocoding}
            />
          </div>

          <div className="space-y-2 col-span-1">
            <Label>Número</Label>
            <Input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              disabled={isLoading || isGeocoding}
            />
          </div>

          <div className="space-y-2 col-span-3">
            <Label>Bairro</Label>
            <Input
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              required
              disabled={isLoading || isGeocoding}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Cidade</Label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={true}
              className="bg-accent/30 text-muted-foreground"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Estado</Label>
            <Input
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              disabled={true}
              className="bg-accent/30 text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-bold"
        disabled={isLoading || isGeocoding || !markerPosition}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Salvar Localização"
        )}
      </Button>
    </form>
  );
}
