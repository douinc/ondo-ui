import {
  Avatar,
  AvatarBadge as AvatarBadgeComponent,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export default function AvatarBadge() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
      <AvatarBadgeComponent className="bg-green-600 dark:bg-green-800" />
    </Avatar>
  )
}
