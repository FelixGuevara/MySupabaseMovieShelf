// components/MovieStatusBadge.tsx
import { Badge } from "./ui/badge";

export function MovieStatusBadge({
  status,
}: {
  status: "completed" | "pending" | "failed" | string;
}) {
  switch (status) {
    case "completed":
      return <Badge className="bg-gray-900 text-white">completed</Badge>;
    case "pending":
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          pending
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          failed
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}