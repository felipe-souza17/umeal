export function translateUserRole(role: string): "Cliente" | "Parceiro" | null {
  switch (role) {
    case "CLIENT":
      return "Cliente";
    case "RESTAURANT_OWNER":
      return "Parceiro";
    default:
      return null;
  }
}
